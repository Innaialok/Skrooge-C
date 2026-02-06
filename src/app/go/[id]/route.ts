
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const dealId = params.id;

        if (!dealId) {
            return new NextResponse('Missing deal ID', { status: 400 });
        }

        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
            select: { url: true }
        });

        if (!deal || !deal.url) {
            return new NextResponse('Deal not found', { status: 404 });
        }

        // Redirect to the external URL
        return NextResponse.redirect(deal.url);
    } catch (error) {
        console.error('Redirect error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
