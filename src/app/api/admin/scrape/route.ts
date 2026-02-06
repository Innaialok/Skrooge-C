/**
 * Admin Scraping API Endpoint
 * Manually trigger deal scraping (admin only)
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { processDeals } from '@/lib/scraper/processor';
import { scraperLog } from '@/lib/scraper';
import { ScraperManager } from '@/lib/scraper/manager';

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

        const manager = ScraperManager.getInstance();
        const supportedSources = manager.getSupportedSources();

        if (!supportedSources.includes(source)) {
            return NextResponse.json(
                { error: `Unknown source: ${source}. Supported: ${supportedSources.join(', ')}` },
                { status: 400 }
            );
        }

        scraperLog.info('api', `Starting scrape for source: ${source}`);

        let result = await manager.runScraper(source);

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
