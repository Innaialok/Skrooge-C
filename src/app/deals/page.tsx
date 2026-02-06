// Force dynamic rendering to show fresh data
export const dynamic = 'force-dynamic'

import { Flame, Filter, Search } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import prisma from '@/lib/prisma'

async function getDeals() {
    const deals = await prisma.deal.findMany({
        where: {
            isExpired: false,
        },
        include: {
            product: true,
            retailer: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
    })

    return deals
}

export default async function DealsPage() {
    const deals = await getDeals()

    return (
        <div className="min-h-screen">
            {/* Search Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Deals</h1>
                        <p className="text-sm text-gray-500">{deals.length} deals available</p>
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
                    <div className="text-center py-16 text-gray-500">
                        <Flame className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-xl">No deals found</p>
                        <p className="mt-2">Check back soon for new deals!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
