/**
 * Deal Processor
 * Handles storing scraped deals in the database
 */

import { prisma } from '../prisma';
import { RawDeal, generateSlug, scraperLog } from './index';

interface ProcessResult {
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
}

/**
 * Process and store raw deals in the database
 */
export async function processDeals(rawDeals: RawDeal[]): Promise<ProcessResult> {
    const result: ProcessResult = {
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
    };

    for (const rawDeal of rawDeals) {
        try {
            await processSingleDeal(rawDeal, result);
        } catch (error) {
            const errorMsg = `Failed to process deal: ${rawDeal.title}`;
            scraperLog.error('processor', errorMsg, error);
            result.errors.push(errorMsg);
        }
    }

    scraperLog.info('processor', `Processing complete: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped`);
    return result;
}

async function processSingleDeal(rawDeal: RawDeal, result: ProcessResult): Promise<void> {
    // Skip deals with no price
    if (!rawDeal.price || rawDeal.price <= 0) {
        result.skipped++;
        return;
    }

    // Find or create retailer
    const retailer = await findOrCreateRetailer(rawDeal.retailerName);
    if (!retailer) {
        result.skipped++;
        return;
    }

    // Find or create product
    const product = await findOrCreateProduct(rawDeal);
    if (!product) {
        result.skipped++;
        return;
    }

    // Check if deal already exists (by URL or external ID)
    const existingDeal = await prisma.deal.findFirst({
        where: {
            OR: [
                { url: rawDeal.url },
                ...(rawDeal.externalId ? [{ id: rawDeal.externalId }] : []),
            ],
        },
    });

    if (existingDeal) {
        // Update existing deal if price changed
        if (existingDeal.price !== rawDeal.price) {
            await prisma.deal.update({
                where: { id: existingDeal.id },
                data: {
                    price: rawDeal.price,
                    originalPrice: rawDeal.originalPrice,
                    discount: rawDeal.discount,
                    updatedAt: new Date(),
                },
            });
            result.updated++;

            // Record price history
            await prisma.priceHistory.create({
                data: {
                    productId: product.id,
                    retailerId: retailer.id,
                    price: rawDeal.price,
                },
            });
        } else {
            result.skipped++;
        }
        return;
    }

    // Create new deal
    await prisma.deal.create({
        data: {
            productId: product.id,
            retailerId: retailer.id,
            title: rawDeal.title.substring(0, 255),
            description: rawDeal.description,
            price: rawDeal.price,
            originalPrice: rawDeal.originalPrice,
            discount: rawDeal.discount,
            url: rawDeal.url,
            imageUrl: rawDeal.imageUrl,
            source: rawDeal.source,
            voteScore: 0,
            isHot: (rawDeal.discount || 0) >= 30, // Mark as hot if 30%+ discount
        },
    });
    result.created++;

    // Record initial price history
    await prisma.priceHistory.create({
        data: {
            productId: product.id,
            retailerId: retailer.id,
            price: rawDeal.price,
        },
    });
}

async function findOrCreateRetailer(name: string): Promise<{ id: string } | null> {
    if (!name || name === 'Unknown') {
        // Use a default "Various" retailer for unknown sources
        name = 'Various';
    }

    const slug = generateSlug(name);

    let retailer = await prisma.retailer.findFirst({
        where: {
            OR: [
                { name: { equals: name } },
                { slug: { equals: slug } },
            ],
        },
        select: { id: true },
    });

    if (!retailer) {
        try {
            retailer = await prisma.retailer.create({
                data: {
                    name,
                    slug,
                    baseUrl: `https://${slug}.com.au`,
                },
                select: { id: true },
            });
            scraperLog.info('processor', `Created new retailer: ${name}`);
        } catch (error) {
            // Handle race condition - retailer might have been created
            retailer = await prisma.retailer.findFirst({
                where: { slug },
                select: { id: true },
            });
        }
    }

    return retailer;
}

async function findOrCreateProduct(rawDeal: RawDeal): Promise<{ id: string } | null> {
    // Clean up title for product name (remove price and retailer info)
    let productName = rawDeal.title
        .replace(/\$[\d,.]+/g, '')
        .replace(/@\s*.+$/, '')
        .replace(/was\s*\$[\d,.]+/gi, '')
        .trim();

    // If name is too short after cleaning, use original
    if (productName.length < 10) {
        productName = rawDeal.title.substring(0, 100);
    }

    const slug = generateSlug(productName) + '-' + Date.now().toString(36);

    // For now, create a new product for each deal
    // TODO: Implement product matching logic to dedupe
    const product = await prisma.product.create({
        data: {
            name: productName.substring(0, 255),
            slug,
            description: rawDeal.description,
            imageUrl: rawDeal.imageUrl,
        },
        select: { id: true },
    });

    return product;
}
