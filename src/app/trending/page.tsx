import { TrendingUp } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import prisma from '@/lib/prisma'

async function getTrendingDeals() {
    const deals = await prisma.deal.findMany({
        where: {
            isExpired: false,
        },
        include: {
            product: true,
            retailer: true,
        },
        orderBy: { voteScore: 'desc' },
        take: 20,
    })

    return deals
}

export default async function TrendingPage() {
    const deals = await getTrendingDeals()

    return (
        <div className="min-h-screen p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trending Deals</h1>
                    <p className="text-sm text-gray-500">Most popular deals right now</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {deals.map((deal, index) => (
                    <div key={deal.id} className="relative">
                        {index < 3 && (
                            <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                                }`}>
                                #{index + 1}
                            </div>
                        )}
                        <ProductCard
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
                        />
                    </div>
                ))}
            </div>

            {deals.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No trending deals yet</p>
                    <p className="mt-2">Be the first to vote on deals!</p>
                </div>
            )}
        </div>
    )
}
