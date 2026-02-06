import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET: List user's favorites
export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: {
                        deals: {
                            where: { isExpired: false },
                            orderBy: { price: 'asc' },
                            take: 1,
                            include: { retailer: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({
            favorites: favorites.map((fav) => ({
                id: fav.id,
                productId: fav.productId,
                createdAt: fav.createdAt,
                product: {
                    id: fav.product.id,
                    name: fav.product.name,
                    slug: fav.product.slug,
                    imageUrl: fav.product.imageUrl,
                    brand: fav.product.brand,
                    lowestDeal: fav.product.deals[0] ? {
                        id: fav.product.deals[0].id,
                        price: fav.product.deals[0].price,
                        originalPrice: fav.product.deals[0].originalPrice,
                        discount: fav.product.deals[0].discount,
                        retailerName: fav.product.deals[0].retailer.name,
                        url: fav.product.deals[0].affiliateUrl || fav.product.deals[0].url,
                    } : null,
                },
            })),
        })
    } catch (error) {
        console.error('Error fetching favorites:', error)
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
    }
}

// POST: Add product to favorites
export async function POST(request: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { productId } = await request.json()

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
        }

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        })

        if (existing) {
            return NextResponse.json({ message: 'Already in favorites', favorite: existing })
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                productId,
            },
        })

        return NextResponse.json({ favorite })
    } catch (error) {
        console.error('Error adding favorite:', error)
        return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
    }
}
