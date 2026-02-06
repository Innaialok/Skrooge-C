import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: Request) {
    try {
        // Verify authorization
        const authHeader = request.headers.get('authorization');
        if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete all deals, products, retailers, and price history
        // Order matters due to foreign keys
        const deletedPriceHistory = await prisma.priceHistory.deleteMany({});
        const deletedDeals = await prisma.deal.deleteMany({});
        const deletedProducts = await prisma.product.deleteMany({});
        const deletedRetailers = await prisma.retailer.deleteMany({});

        return NextResponse.json({
            success: true,
            deleted: {
                priceHistory: deletedPriceHistory.count,
                deals: deletedDeals.count,
                products: deletedProducts.count,
                retailers: deletedRetailers.count,
            },
            message: 'All deals cleared. Ready for fresh scrape.',
        });

    } catch (error) {
        console.error('Clear deals error:', error);
        return NextResponse.json(
            { error: 'Failed to clear deals' },
            { status: 500 }
        );
    }
}
