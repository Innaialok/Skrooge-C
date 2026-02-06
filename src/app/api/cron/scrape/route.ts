/**
 * Cron Scraping Endpoint
 * Can be triggered by Vercel Cron or external scheduler
 * 
 * To set up Vercel Cron, add to vercel.json:
 * { "crons": [{ "path": "/api/cron/scrape", "schedule": "0 * /2 * * *" }] }
 */

import { NextResponse } from 'next/server';
import { OzBargainScraper } from '@/lib/scraper/sources/ozbargain';
import { processDeals } from '@/lib/scraper/processor';
import { scraperLog } from '@/lib/scraper';

// Vercel Cron secret for authentication
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
    try {
        // Verify cron secret if set
        if (CRON_SECRET) {
            const authHeader = request.headers.get('authorization');
            if (authHeader !== `Bearer ${CRON_SECRET}`) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                );
            }
        }

        scraperLog.info('cron', 'Starting scheduled scrape...');

        // Scrape all sources
        const results = [];

        // OzBargain
        try {
            const ozbargainScraper = new OzBargainScraper();
            const ozbargainResult = await ozbargainScraper.scrape();

            if (ozbargainResult.success) {
                const processResult = await processDeals(ozbargainResult.deals);
                results.push({
                    source: 'ozbargain',
                    success: true,
                    fetched: ozbargainResult.deals.length,
                    created: processResult.created,
                    updated: processResult.updated,
                });
            } else {
                results.push({
                    source: 'ozbargain',
                    success: false,
                    errors: ozbargainResult.errors,
                });
            }
        } catch (error) {
            scraperLog.error('cron', 'OzBargain scrape failed', error);
            results.push({
                source: 'ozbargain',
                success: false,
                error: String(error),
            });
        }

        // Add more scrapers here as they're implemented
        // Example:
        // const amazonScraper = new AmazonScraper();
        // ...

        const successCount = results.filter(r => r.success).length;
        scraperLog.info('cron', `Scheduled scrape complete: ${successCount}/${results.length} sources succeeded`);

        return NextResponse.json({
            success: successCount > 0,
            timestamp: new Date().toISOString(),
            results,
        });

    } catch (error) {
        scraperLog.error('cron', 'Cron endpoint error', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
