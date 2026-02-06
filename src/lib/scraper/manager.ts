import { BaseScraper, ScraperResult, scraperLog } from './index';
import { OzBargainScraper } from './sources/ozbargain';
import { AmazonScraper } from './sources/amazon';
import { WoolworthsScraper } from './sources/woolworths';

type ScraperFactory = () => BaseScraper;

export class ScraperManager {
    private static instance: ScraperManager;
    private scrapers: Map<string, ScraperFactory> = new Map();

    private constructor() {
        this.registerDefaultScrapers();
    }

    public static getInstance(): ScraperManager {
        if (!ScraperManager.instance) {
            ScraperManager.instance = new ScraperManager();
        }
        return ScraperManager.instance;
    }

    private registerDefaultScrapers() {
        this.register('ozbargain', () => new OzBargainScraper());
        this.register('amazon', () => new AmazonScraper());
        this.register('woolworths', () => new WoolworthsScraper());
    }

    public register(source: string, factory: ScraperFactory) {
        this.scrapers.set(source, factory);
        scraperLog.info('manager', `Registered scraper source: ${source}`);
    }

    public getScraper(source: string): BaseScraper | null {
        const factory = this.scrapers.get(source);
        if (!factory) return null;
        return factory();
    }

    public getSupportedSources(): string[] {
        return Array.from(this.scrapers.keys());
    }

    public async runScraper(source: string): Promise<ScraperResult> {
        const scraper = this.getScraper(source);
        if (!scraper) {
            throw new Error(`Unknown source: ${source}`);
        }
        return await scraper.scrape();
    }

    // Future: Method to run all scrapers in parallel/series
}
