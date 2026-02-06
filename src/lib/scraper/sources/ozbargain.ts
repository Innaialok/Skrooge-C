/**
 * OzBargain RSS Feed Scraper
 * Parses the OzBargain RSS feed to extract deals
 */

import { BaseScraper, RawDeal, ScraperResult, scraperLog, parsePrice, detectDealType } from '../index';

// Base RSS URL - can append ?page=X for pagination
const OZBARGAIN_RSS_BASE = 'https://www.ozbargain.com.au/deals/feed';

interface RSSItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    category?: string;
    metaLink?: string; // extracted from ozb:meta
}

export class OzBargainScraper extends BaseScraper {
    getSourceName(): string {
        return 'ozbargain';
    }

    async scrape(): Promise<ScraperResult> {
        const result: ScraperResult = {
            success: false,
            deals: [],
            errors: [],
            scrapedAt: new Date(),
            source: this.getSourceName(),
        };

        try {
            scraperLog.info(this.getSourceName(), 'Starting RSS feed fetch from multiple pages...');

            // Fetch from multiple pages to get more deals (5 pages = ~150 deals)
            const pagesToFetch = 5;
            const allItems: RSSItem[] = [];
            const seenUrls = new Set<string>();

            for (let page = 0; page < pagesToFetch; page++) {
                try {
                    const url = page === 0 ? OZBARGAIN_RSS_BASE : `${OZBARGAIN_RSS_BASE}?page=${page}`;
                    scraperLog.info(this.getSourceName(), `Fetching page ${page + 1}...`);

                    const response = await this.fetchWithRetry(url);
                    const xmlText = await response.text();
                    const items = this.parseRSS(xmlText);

                    // Deduplicate by URL
                    for (const item of items) {
                        if (!seenUrls.has(item.link)) {
                            seenUrls.add(item.link);
                            allItems.push(item);
                        }
                    }

                    scraperLog.info(this.getSourceName(), `Page ${page + 1}: Found ${items.length} items (total unique: ${allItems.length})`);

                    // Small delay between pages to be nice
                    if (page < pagesToFetch - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } catch (pageError) {
                    scraperLog.error(this.getSourceName(), `Failed to fetch page ${page + 1}`, pageError);
                }
            }

            scraperLog.info(this.getSourceName(), `Total unique items: ${allItems.length}`);

            for (const item of allItems) {
                try {
                    const deal = this.parseItem(item);
                    if (deal) {
                        result.deals.push(deal);
                    }
                } catch (error) {
                    const errorMsg = `Failed to parse item: ${item.title}`;
                    scraperLog.error(this.getSourceName(), errorMsg, error);
                    result.errors.push(errorMsg);
                }
            }

            result.success = true;
            scraperLog.info(this.getSourceName(), `Successfully parsed ${result.deals.length} deals`);

        } catch (error) {
            const errorMsg = `Failed to scrape OzBargain: ${error}`;
            scraperLog.error(this.getSourceName(), errorMsg, error);
            result.errors.push(errorMsg);
        }

        return result;
    }

    /**
     * Parse RSS XML into items
     */
    private parseRSS(xmlText: string): RSSItem[] {
        const items: RSSItem[] = [];

        // Simple regex-based XML parsing (works for RSS feeds)
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xmlText)) !== null) {
            const itemXml = match[1];

            const title = this.extractTag(itemXml, 'title');
            const link = this.extractTag(itemXml, 'link');
            const description = this.extractTag(itemXml, 'description');
            const pubDate = this.extractTag(itemXml, 'pubDate');
            const category = this.extractTag(itemXml, 'category');

            // Extract ozb:meta link attribute
            const metaLinkMatch = itemXml.match(/<ozb:meta[^>]*link=["']([^"']+)["']/i);
            const metaLink = metaLinkMatch ? metaLinkMatch[1] : undefined;

            if (title && link) {
                items.push({
                    title: this.decodeHtmlEntities(title),
                    link,
                    description: this.decodeHtmlEntities(description || ''),
                    pubDate: pubDate || '',
                    category: category || undefined,
                    metaLink,
                });
            }
        }

        return items;
    }

    /**
     * Extract content from an XML tag
     */
    private extractTag(xml: string, tagName: string): string | null {
        // Handle CDATA sections
        const cdataRegex = new RegExp(`<${tagName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tagName}>`, 'i');
        const cdataMatch = xml.match(cdataRegex);
        if (cdataMatch) {
            return cdataMatch[1].trim();
        }

        // Handle regular tags
        const regex = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i');
        const match = xml.match(regex);
        return match ? match[1].trim() : null;
    }

    /**
     * Decode HTML entities
     */
    private decodeHtmlEntities(text: string): string {
        return text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ');
    }

    /**
     * Parse a single RSS item into a RawDeal
     */
    private parseItem(item: RSSItem): RawDeal | null {
        // OzBargain titles often contain price like: "Product Name $99 @ Retailer"
        const priceMatch = item.title.match(/\$(\d+(?:\.\d{2})?)/);
        const price = priceMatch ? parsePrice(priceMatch[1]) : null;

        // Extract retailer from title (usually after "@")
        const retailerMatch = item.title.match(/@\s*(.+?)(?:\s*\(|$)/);
        const retailerName = retailerMatch ? retailerMatch[1].trim() : 'Unknown';

        // Extract image from description if available
        const imageMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
        const imageUrl = imageMatch ? imageMatch[1] : undefined;

        // Extract actual retailer/deal URL
        // Priority 1: ozb:meta link (Most reliable direct link)
        // Priority 2: "Go to Deal" type links in description
        // Priority 3: Any non-OzBargain link
        // Fallback: Default item link (OzBargain discussion page)

        let retailerUrl = item.metaLink;

        if (!retailerUrl) {
            const retailerUrlMatch = item.description.match(/<a[^>]+href=["']([^"']+)["'][^>]*>.*?(?:Go to Deal|View Deal|Buy Now|Shop Now|Get Deal)/i);
            const altUrlMatch = item.description.match(/<a[^>]+href=["'](https?:\/\/(?!www\.ozbargain)[^"']+)["']/i);
            retailerUrl = retailerUrlMatch?.[1] || altUrlMatch?.[1] || item.link;
        }

        // Calculate original price if mentioned
        let originalPrice: number | undefined;
        let discount: number | undefined;

        const wasMatch = item.title.match(/was\s*\$(\d+(?:\.\d{2})?)/i);
        if (wasMatch && price) {
            originalPrice = parsePrice(wasMatch[1]) || undefined;
            if (originalPrice && originalPrice > price) {
                discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            }
        }

        // Clean description - comprehensive cleanup
        const cleanDescription = this.cleanDescription(item.description, item.title);

        // Detect category based on keywords in title
        const category = this.detectCategory(item.title, retailerName);

        return {
            title: item.title,
            description: cleanDescription || undefined,
            price: price || 0,
            originalPrice,
            discount,
            url: retailerUrl,
            imageUrl,
            retailerName,
            source: 'ozbargain',
            externalId: this.extractDealId(item.link),
            dealType: detectDealType(item.title, retailerName),
            category,
        };
    }

    /**
     * Detect product category based on keywords
     */
    private detectCategory(title: string, retailerName: string): string | undefined {
        const lowerTitle = title.toLowerCase();
        const lowerRetailer = retailerName.toLowerCase();

        // Electronics
        if (lowerTitle.match(/phone|iphone|samsung|pixel|earbuds|headphones|speaker|tv|television|monitor|tablet|ipad|watch|smartwatch|camera|gopro|drone/) ||
            lowerRetailer.match(/jb hi-fi|harvey norman|bing lee|officeworks|apple/)) {
            return 'electronics';
        }

        // Computing
        if (lowerTitle.match(/laptop|computer|pc|macbook|keyboard|mouse|ssd|hard drive|ram|cpu|gpu|graphics card|nvidia|amd|intel|router|nas|server/) ||
            lowerRetailer.match(/pccasegear|msy|scorptec|umart/)) {
            return 'computing';
        }

        // Gaming
        if (lowerTitle.match(/game|gaming|xbox|playstation|ps5|nintendo|switch|steam|controller|console/) ||
            lowerRetailer.match(/eb games|gamestop/)) {
            return 'gaming';
        }

        // Fashion
        if (lowerTitle.match(/shirt|pants|jeans|dress|shoes|sneakers|boots|jacket|coat|clothing|fashion|wear|nike|adidas|puma/) ||
            lowerRetailer.match(/uniqlo|asos|the iconic|cotton on|h&m|zara/)) {
            return 'fashion';
        }

        // Home & Garden
        if (lowerTitle.match(/furniture|sofa|bed|mattress|chair|table|desk|lamp|garden|outdoor|bbq|patio|lawn|plant|pot|tool/) ||
            lowerRetailer.match(/ikea|bunnings|fantastic furniture|temple & webster|kmart|big w/)) {
            return 'home-garden';
        }

        // Sports
        if (lowerTitle.match(/sport|fitness|gym|bike|bicycle|running|yoga|exercise|weight|protein|golf|tennis|football|soccer/) ||
            lowerRetailer.match(/rebel sport|decathlon|bcf|anaconda/)) {
            return 'sports';
        }

        return undefined;
    }
    /**
     * Clean and format description - remove OzBargain-specific content
     */
    private cleanDescription(rawDescription: string, title: string): string | undefined {
        if (!rawDescription) return undefined;

        let desc = rawDescription
            // Remove all HTML tags
            .replace(/<[^>]+>/g, ' ')
            // Decode HTML entities
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            // Remove URLs
            .replace(/https?:\/\/[^\s]+/gi, '')
            // Remove "Go to Deal" and similar link text
            .replace(/\b(go to deal|view deal|buy now|shop now|get deal|click here|read more)\b/gi, '')
            // Remove OzBargain referral/affiliate mentions
            .replace(/\b(referral|affiliate|ref link|ref code)\b[^.]*\./gi, '')
            // Remove user attribution like "Posted by username" or "via username"
            .replace(/\b(posted by|submitted by|via|by|from)\s+[@\w]+\b/gi, '')
            // Remove OzBargain-specific phrases
            .replace(/\b(ozbargain|ozb|bargain|deal alert|price error|hot deal|expired|targeted|ymmv)\b:?\s*/gi, '')
            // Remove price mentions (we show price separately)
            .replace(/\$\d+(?:\.\d{2})?(?:\s*[-–]\s*\$\d+(?:\.\d{2})?)?/g, '')
            // Remove "was $X" mentions
            .replace(/was\s*\$?\d+(?:\.\d{2})?/gi, '')
            // Remove percentage off mentions (we show discount separately)
            .replace(/\d+%\s*off\b/gi, '')
            // Remove common coupon code patterns if they're in the title
            .replace(/\b(code|coupon|promo|voucher):\s*\w+\b/gi, '')
            // Remove @ retailer mentions (we show retailer separately)
            .replace(/@\s*[\w\s&]+(?:\(|$)/g, '')
            // Remove "Delivery: " cost mentions
            .replace(/\bdelivery[:\s]+\$?\d+(?:\.\d{2})?\b/gi, '')
            .replace(/\bfree\s+(?:shipping|delivery)\b/gi, '')
            // Remove image alt text remnants
            .replace(/\[image\]/gi, '')
            // Remove empty parentheses and brackets
            .replace(/\(\s*\)/g, '')
            .replace(/\[\s*\]/g, '')
            // Clean up punctuation
            .replace(/\s*[,;]\s*[,;]\s*/g, ', ')
            .replace(/\.{2,}/g, '.')
            .replace(/\s+\./g, '.')
            .replace(/\.\s+\./g, '.')
            // Remove multiple spaces
            .replace(/\s+/g, ' ')
            .trim();

        // Remove leading/trailing punctuation
        desc = desc.replace(/^[,;:\s.]+/, '').replace(/[,;:\s]+$/, '');

        // Capitalize first letter
        if (desc.length > 0) {
            desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        }

        // Ensure it ends with proper punctuation
        if (desc.length > 0 && !desc.match(/[.!?]$/)) {
            desc += '.';
        }

        // If description is too short or mostly the same as title, skip it
        if (desc.length < 20) return undefined;

        // Check if description is mostly redundant with title
        const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const descWords = desc.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const overlap = titleWords.filter(w => descWords.includes(w)).length;
        if (titleWords.length > 0 && overlap / titleWords.length > 0.8) {
            return undefined; // Description is mostly the same as title
        }

        // Limit length
        if (desc.length > 400) {
            desc = desc.substring(0, 397) + '...';
        }

        return desc || undefined;
    }

    /**
     * Extract OzBargain deal ID from URL
     */
    private extractDealId(url: string): string {
        const match = url.match(/\/node\/(\d+)/);
        return match ? `ozbargain-${match[1]}` : `ozbargain-${Date.now()}`;
    }
}

