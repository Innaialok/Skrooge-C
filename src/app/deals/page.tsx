// Force dynamic rendering to show fresh data
export const dynamic = 'force-dynamic'

import { Flame, Filter, Search, ShoppingCart, Tag, Ticket, Plane, ArrowLeft } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import prisma from '@/lib/prisma'
import Link from 'next/link'

// Deal type display config
const dealTypeConfig: Record<string, { title: string; icon: string; description: string }> = {
    product: { title: 'Product Deals', icon: '🛒', description: 'Specific products at discounted prices' },
    store: { title: 'Store Sales', icon: '🏷️', description: 'Sitewide or category-wide discounts' },
    cashback: { title: 'Cashback Deals', icon: '💰', description: 'Get money back on purchases' },
    coupon: { title: 'Coupons', icon: '🎟️', description: 'Promo codes and vouchers' },
    travel: { title: 'Travel Deals', icon: '✈️', description: 'Flights, hotels, and more' },
}

// Category config for display
const categoryConfig: Record<string, { title: string; icon: string }> = {
    electronics: { title: 'Electronics', icon: '📱' },
    computing: { title: 'Computing', icon: '💻' },
    'home-garden': { title: 'Home & Garden', icon: '🏠' },
    fashion: { title: 'Fashion', icon: '👕' },
    gaming: { title: 'Gaming', icon: '🎮' },
    sports: { title: 'Sports', icon: '⚽' },
}

interface PageProps {
    searchParams: Promise<{ type?: string; category?: string }>
}

async function getDeals(type?: string, categorySlug?: string) {
    const whereClause: Record<string, unknown> = {
        isExpired: false,
    }

    if (type && type !== 'all') {
        whereClause.dealType = type
    }

    // If filtering by category, we need to filter by product's category
    if (categorySlug) {
        whereClause.product = {
            category: {
                slug: categorySlug
            }
        }
    }

    const deals = await prisma.deal.findMany({
        where: whereClause,
        include: {
            product: {
                include: {
                    category: true
                }
            },
            retailer: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    })

    return deals
}

export default async function DealsPage({ searchParams }: PageProps) {
    const params = await searchParams
    const dealType = params.type || undefined
    const category = params.category || undefined
    const deals = await getDeals(dealType, category)

    const config = dealType ? dealTypeConfig[dealType] : null
    const catConfig = category ? categoryConfig[category] : null

    return (
        <div className="min-h-screen">


            <div className="p-6">
                {/* Header with back button if filtered */}
                <div className="flex items-center gap-3 mb-6">
                    {(config || catConfig) && (
                        <Link
                            href={catConfig ? "/deals?type=product" : "/deals"}
                            className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[var(--text-muted)]" />
                        </Link>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg text-xl">
                        {catConfig ? catConfig.icon : config ? config.icon : <Flame className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            {catConfig ? catConfig.title : config ? config.title : 'All Deals'}
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            {catConfig ? `${deals.length} ${catConfig.title.toLowerCase()} deals` : config ? config.description : `${deals.length} deals available`}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {deals.map((deal) => (
                        <ProductCard
                            key={deal.id}
                            id={deal.id}
                            title={deal.title}
                            price={deal.price}
                            originalPrice={deal.originalPrice}
                            discount={deal.discount}
                            imageUrl={deal.imageUrl || deal.product.imageUrl}
                            retailerName={deal.retailer.name}
                            retailerLogo={deal.retailer.logoUrl}
                            productSlug={deal.product.slug}
                            url={deal.affiliateUrl || deal.url}
                            dealType={deal.dealType}
                        />
                    ))}
                </div>

                {deals.length === 0 && (
                    <div className="text-center py-16 text-[var(--text-muted)]">
                        <div className="text-6xl mb-4">{config?.icon || '🔍'}</div>
                        <p className="text-xl">No {config?.title.toLowerCase() || 'deals'} found</p>
                        <p className="mt-2">Check back soon for new deals!</p>
                        {config && (
                            <Link
                                href="/deals"
                                className="inline-block mt-4 px-4 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                            >
                                View All Deals
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
