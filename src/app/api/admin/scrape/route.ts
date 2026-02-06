/**
 * Admin Scraping API Endpoint
 * Manually trigger deal scraping (admin only)
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { OzBargainScraper } from '@/lib/scraper/sources/ozbargain';
import { processDeals } from '@/lib/scraper/processor';
import { scraperLog } from '@/lib/scraper';

export async function POST(request: Request) {
    try {
        // Check authentication (for now, just require logged in user)
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get scraper source from request body
        const body = await request.json().catch(() => ({}));
        const source = body.source || 'ozbargain';

        scraperLog.info('api', `Starting scrape for source: ${source}`);

        let result;
        switch (source) {
            case 'ozbargain':
                const scraper = new OzBargainScraper();
                result = await scraper.scrape();
                break;
            default:
                return NextResponse.json(
                    { error: `Unknown source: ${source}` },
                    { status: 400 }
                );
        }

        if (!result.success) {
            return NextResponse.json(
                {
                    error: 'Scraping failed',
                    errors: result.errors
                },
                { status: 500 }
            );
        }

        // Process and store deals
        const processResult = await processDeals(result.deals);

        return NextResponse.json({
            success: true,
            source,
            scrapedAt: result.scrapedAt,
            stats: {
                fetched: result.deals.length,
                created: processResult.created,
                updated: processResult.updated,
                skipped: processResult.skipped,
                errors: processResult.errors.length,
            },
        });

    } catch (error) {
        scraperLog.error('api', 'Scrape endpoint error', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Scraping API',
        sources: ['ozbargain'],
        usage: 'POST with { "source": "ozbargain" }',
    });
}
