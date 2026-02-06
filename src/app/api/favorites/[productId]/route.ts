import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET: Check if product is favorited
export async function GET(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    const { productId } = await params
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ isFavorited: false })
    }

    try {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId,
                },
            },
        })

        return NextResponse.json({ isFavorited: !!favorite })
    } catch (error) {
        return NextResponse.json({ isFavorited: false })
    }
}

// DELETE: Remove product from favorites
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    const { productId } = await params
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.favorite.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId,
                },
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        // If not found, that's fine
        return NextResponse.json({ success: true })
    }
}
