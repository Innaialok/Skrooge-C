import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return NextResponse.json({
            categories: categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                icon: cat.icon || '📦',
                productCount: cat._count.products,
            })),
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}
