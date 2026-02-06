import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const hot = searchParams.get('hot') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const retailer = searchParams.get('retailer')
    const search = searchParams.get('search')

    try {
        const where: any = {
            isExpired: false,
        }

        if (hot) {
            where.isHot = true
        }

        if (category) {
            where.product = {
                category: {
                    slug: category,
                },
            }
        }

        if (retailer) {
            where.retailer = {
                slug: retailer,
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
                { product: { name: { contains: search } } },
            ]
        }

        const [deals, total] = await Promise.all([
            prisma.deal.findMany({
                where,
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                    retailer: true,
                    _count: {
                        select: { comments: true },
                    },
                },
                orderBy: hot
                    ? { voteScore: 'desc' }
                    : { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.deal.count({ where }),
        ])

        return NextResponse.json({
            deals: deals.map((deal) => ({
                id: deal.id,
                title: deal.title,
                description: deal.description,
                price: deal.price,
                originalPrice: deal.originalPrice,
                discount: deal.discount,
                imageUrl: deal.imageUrl || deal.product.imageUrl,
                url: deal.affiliateUrl || deal.url,
                voteScore: deal.voteScore,
                isHot: deal.isHot,
                isFeatured: deal.isFeatured,
                createdAt: deal.createdAt,
                expiresAt: deal.expiresAt,
                retailer: {
                    name: deal.retailer.name,
                    slug: deal.retailer.slug,
                    logoUrl: deal.retailer.logoUrl,
                },
                product: {
                    name: deal.product.name,
                    slug: deal.product.slug,
                    category: deal.product.category ? {
                        name: deal.product.category.name,
                        slug: deal.product.category.slug,
                    } : null,
                },
                commentsCount: deal._count.comments,
            })),
            total,
            hasMore: offset + deals.length < total,
        })
    } catch (error) {
        console.error('Error fetching deals:', error)
        return NextResponse.json(
            { error: 'Failed to fetch deals' },
            { status: 500 }
        )
    }
}
