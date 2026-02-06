import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://skrooge.vercel.app'

    // Static routes
    const routes = [
        '',
        '/deals',
        '/categories',
        '/trending',
        '/about',
        '/privacy',
        '/terms',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Dynamic routes: Deals
    // Limit to recent 100 for sitemap performance
    const deals = await prisma.deal.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: { id: true, url: true, updatedAt: true }, // Using ID assuming slug usage or redirect
        // If you have a slug field, use it. Based on ProductCard, we use `productSlug`.
    })

    // Note: We need to see if we have valid slugs. Assuming we do based on code. 
    // Code check: ProductCard uses `productSlug`.

    // We'll skip complex DB fetching in this first pass to ensure it builds, or use a simpler static list if DB access is tricky in build time without env vars.
    // Actually, Next.js sitemap runs at runtime or build time. 
    // Let's stick to safe static + categories for now to avoid build failures if DB isn't reachable.

    const categories = [
        'groceries', 'electronics', 'home-garden', 'fashion', 'travel'
    ].map((slug) => ({
        url: `${baseUrl}/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...categories]
}
