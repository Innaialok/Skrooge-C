import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query.trim()) {
        return NextResponse.json({ results: [], query: '', deals: [], products: [] })
    }

    // Require at least 3 characters for search
    if (query.trim().length < 3) {
        return NextResponse.json({ query, deals: [], products: [], totalDeals: 0, totalProducts: 0 })
    }

    try {
        // Search deals - only search title and product name (not descriptions)
        const deals = await prisma.deal.findMany({
            where: {
                isExpired: false,
                OR: [
                    { title: { contains: query } },
                    { product: { name: { contains: query } } },
                    { product: { brand: { contains: query } } },
                    { retailer: { name: { contains: query } } },
                ],
            },
            include: {
                product: true,
                retailer: true,
            },
            orderBy: { voteScore: 'desc' },
            take: limit,
        })

        // Get product IDs from deal results
        const dealProductIds = deals.map(d => d.productId)

        // Search products - only search name and brand (not descriptions)
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { brand: { contains: query } },
                ],
                // Exclude products that already have deals in our results
                id: {
                    notIn: dealProductIds.length > 0 ? dealProductIds : ['none'],
                },
            },
            include: {
                category: true,
            },
            take: Math.max(0, limit - deals.length),
        })

        return NextResponse.json({
            query,
            deals: deals.map((deal) => ({
                type: 'deal',
                id: deal.id,
                title: deal.title,
                price: deal.price,
                originalPrice: deal.originalPrice,
                discount: deal.discount,
                imageUrl: deal.imageUrl || deal.product.imageUrl,
                url: deal.affiliateUrl || deal.url,
                productSlug: deal.product.slug,
                retailerName: deal.retailer.name,
                retailerLogo: deal.retailer.logoUrl,
            })),
            products: products.map((product) => ({
                type: 'product',
                id: product.id,
                name: product.name,
                slug: product.slug,
                brand: product.brand,
                imageUrl: product.imageUrl,
                category: product.category?.name,
            })),
            totalDeals: deals.length,
            totalProducts: products.length,
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Search failed', deals: [], products: [], message: String(error) },
            { status: 500 }
        )
    }
}
