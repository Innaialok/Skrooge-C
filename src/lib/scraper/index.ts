/**
 * Base Scraper Infrastructure
 * Provides common functionality for all deal scrapers
 */

export interface RawDeal {
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    url: string;
    imageUrl?: string;
    retailerName: string;
    source: string;
    externalId?: string;
    dealType?: string; // product, cashback, store, coupon, travel
    category?: string; // electronics, computing, gaming, fashion, home-garden, sports
}

export interface ScraperResult {
    success: boolean;
    deals: RawDeal[];
    errors: string[];
    scrapedAt: Date;
    source: string;
}

export interface ScraperConfig {
    maxRetries: number;
    retryDelayMs: number;
    rateLimitMs: number;
    timeout: number;
}

const DEFAULT_CONFIG: ScraperConfig = {
    maxRetries: 3,
    retryDelayMs: 1000,
    rateLimitMs: 500,
    timeout: 30000,
};

/**
 * Base class for all scrapers
 */
export abstract class BaseScraper {
    protected config: ScraperConfig;
    protected lastRequestTime: number = 0;

    constructor(config: Partial<ScraperConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Wait for rate limiting
     */
    protected async rateLimit(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.config.rateLimitMs) {
            await this.sleep(this.config.rateLimitMs - timeSinceLastRequest);
        }

        this.lastRequestTime = Date.now();
    }

    /**
     * Sleep for specified milliseconds
     */
    protected sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fetch with retry logic
     */
    protected async fetchWithRetry(url: string): Promise<Response> {
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
            try {
                await this.rateLimit();

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'Skrooge Deal Aggregator/1.0',
                    },
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return response;
            } catch (error) {
                lastError = error as Error;
                console.error(`[Scraper] Attempt ${attempt + 1} failed:`, error);

                if (attempt < this.config.maxRetries - 1) {
                    await this.sleep(this.config.retryDelayMs * (attempt + 1));
                }
            }
        }

        throw lastError || new Error('Failed to fetch after retries');
    }

    /**
     * Main scrape method to be implemented by each scraper
     */
    abstract scrape(): Promise<ScraperResult>;

    /**
     * Get the source name for this scraper
     */
    abstract getSourceName(): string;
}

/**
 * Logging utility for scrapers
 */
export const scraperLog = {
    info: (source: string, message: string, data?: unknown) => {
        console.log(`[Scraper:${source}] ${message}`, data || '');
    },
    error: (source: string, message: string, error?: unknown) => {
        console.error(`[Scraper:${source}] ERROR: ${message}`, error || '');
    },
    warn: (source: string, message: string, data?: unknown) => {
        console.warn(`[Scraper:${source}] WARN: ${message}`, data || '');
    },
};

/**
 * Parse price string to number
 */
export function parsePrice(priceStr: string): number | null {
    if (!priceStr) return null;

    // Remove currency symbols and whitespace
    const cleaned = priceStr.replace(/[^0-9.,]/g, '').trim();

    // Handle comma as thousands separator
    const normalized = cleaned.replace(/,/g, '');

    const price = parseFloat(normalized);
    return isNaN(price) ? null : price;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= 0 || currentPrice <= 0) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
}

/**
 * Detect deal type based on title/retailer
 */
export function detectDealType(title: string, retailerName: string): string {
    const lowerTitle = title.toLowerCase();
    const lowerRetailer = retailerName.toLowerCase();

    // Cashback deals
    if (lowerTitle.includes('cashback') ||
        lowerTitle.includes('% back') ||
        lowerRetailer.includes('shopback') ||
        lowerRetailer.includes('cashrewards')) {
        return 'cashback';
    }

    // Coupon/code deals
    if (lowerTitle.includes('coupon') ||
        lowerTitle.includes('promo code') ||
        lowerTitle.includes('discount code') ||
        lowerTitle.includes('voucher')) {
        return 'coupon';
    }

    // Store-wide sales (% off entire store/category)
    if (lowerTitle.match(/\d+%\s*off/i) &&
        (lowerTitle.includes('sale') ||
            lowerTitle.includes('sitewide') ||
            lowerTitle.includes('store') ||
            lowerTitle.includes('everything') ||
            lowerTitle.includes('all '))) {
        return 'store';
    }

    // Travel deals
    if (lowerTitle.includes('flight') ||
        lowerTitle.includes('airline') ||
        lowerTitle.includes('hotel') ||
        lowerTitle.includes('qantas') ||
        lowerTitle.includes('virgin australia') ||
        lowerTitle.includes('jetstar') ||
        lowerRetailer.includes('flightfinder') ||
        lowerRetailer.includes('expedia')) {
        return 'travel';
    }

    return 'product';
}

/**
 * Normalize deal title for cleaner display
 */
export function normalizeTitle(title: string): string {
    let normalized = title
        // Remove price mentions like $99, $99.99
        .replace(/\$\d+(?:\.\d{2})?/g, '')
        // Remove "@ Retailer" suffix
        .replace(/@\s*[^@]+$/g, '')
        // Remove "was $XX" mentions
        .replace(/was\s*\$\d+(?:\.\d{2})?/gi, '')
        // Remove "Delivered" as it's implied
        .replace(/\s+delivered$/i, '')
        // Remove delivery mentions
        .replace(/\+\s*delivery\s*\([^)]*\)/gi, '')
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim();

    // Truncate if too long (max 100 chars)
    if (normalized.length > 100) {
        normalized = normalized.substring(0, 97) + '...';
    }

    return normalized;
}

