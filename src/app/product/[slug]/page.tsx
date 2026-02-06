import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Heart, Bell, Share2, ExternalLink, MessageCircle, ArrowUp } from 'lucide-react'
import prisma from '@/lib/prisma'
import PriceHistoryChart from '@/components/PriceHistoryChart'
import DiscussionBoard from '@/components/DiscussionBoard'

interface ProductPageProps {
    params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            specs: true,
            deals: {
                where: { isExpired: false },
                include: {
                    retailer: true,
                    _count: { select: { comments: true, votes: true } },
                },
                orderBy: { price: 'asc' },
            },
            priceHistory: {
                orderBy: { recordedAt: 'desc' },
                take: 30,
                include: {
                    retailer: true,
                },
            },
            _count: {
                select: { favorites: true },
            },
        },
    })

    return product
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        notFound()
    }

    const priceHistoryData = product.priceHistory.map((ph) => ({
        date: ph.recordedAt.toISOString(),
        price: ph.price,
        retailer: ph.retailer.name,
    })).reverse()

    const prices = priceHistoryData.map((d) => d.price)
    const lowestPrice = Math.min(...prices, ...product.deals.map((d) => d.price))
    const highestPrice = Math.max(...prices)
    const currentPrice = product.deals[0]?.price || prices[prices.length - 1] || 0

    return (
        <div className="min-h-screen pb-20 p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
                <Link href="/" className="hover:text-emerald-500">Home</Link>
                <span>/</span>
                {product.category && (
                    <>
                        <Link href={`/category/${product.category.slug}`} className="hover:text-emerald-500">
                            {product.category.name}
                        </Link>
                        <span>/</span>
                    </>
                )}
                <span className="text-[var(--text-primary)]">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Header */}
                    <div className="card p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="w-full md:w-64 h-64 rounded-xl bg-[var(--bg-tertiary)] overflow-hidden shrink-0">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        📦
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        {product.brand && (
                                            <p className="text-sm text-emerald-500 font-medium mb-1">{product.brand}</p>
                                        )}
                                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                                            {product.name}
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                                            <Heart className="w-5 h-5 text-[var(--text-muted)]" />
                                        </button>
                                        <button className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                                            <Share2 className="w-5 h-5 text-[var(--text-muted)]" />
                                        </button>
                                    </div>
                                </div>

                                {product.description && (
                                    <p className="text-[var(--text-secondary)] mb-4">
                                        {product.description}
                                    </p>
                                )}

                                {/* Current Best Price */}
                                {product.deals[0] && (
                                    <div className="flex items-end gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-[var(--text-muted)]">Best Price</p>
                                            <p className="text-3xl font-bold text-[var(--text-primary)]">
                                                ${product.deals[0].price.toFixed(2)}
                                            </p>
                                        </div>
                                        {product.deals[0].originalPrice && (
                                            <div>
                                                <span className="text-lg text-[var(--text-muted)] line-through">
                                                    ${product.deals[0].originalPrice.toFixed(2)}
                                                </span>
                                                <span className="ml-2 text-emerald-500 font-semibold">
                                                    Save ${(product.deals[0].originalPrice - product.deals[0].price).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    {product.deals[0] && (
                                        <a
                                            href={`/go/${product.deals[0].id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary flex-1 md:flex-none justify-center px-8 py-3 text-base"
                                        >
                                            Go to Best Deal
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                    <button className="btn-secondary flex-1 md:flex-none justify-center px-6 py-3 text-base">
                                        <Bell className="w-5 h-5" />
                                        Set Price Alert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price History Chart */}
                    {priceHistoryData.length > 0 && (
                        <PriceHistoryChart
                            data={priceHistoryData}
                            currentPrice={currentPrice}
                            lowestPrice={lowestPrice}
                            highestPrice={highestPrice}
                        />
                    )}

                    {/* Specifications */}
                    {product.specs.length > 0 && (
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Specifications</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.specs.map((spec) => (
                                    <div key={spec.id} className="flex justify-between py-2 border-b border-[var(--border-color)]">
                                        <dt className="text-[var(--text-muted)]">{spec.key}</dt>
                                        <dd className="font-medium text-[var(--text-primary)]">{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Discussion Board */}
                    <DiscussionBoard productId={product.id} />
                </div>

                {/* Right Column - Deals List */}
                <div className="space-y-6">
                    <div className="card p-6 sticky top-24">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                            All Deals ({product.deals.length})
                        </h3>

                        <div className="space-y-3">
                            {product.deals.map((deal, index) => (
                                <div
                                    key={deal.id}
                                    className={`p-4 rounded-xl border transition-all ${index === 0
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-[var(--border-color)] hover:border-emerald-500'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="retailer-logo">
                                                {deal.retailer.logoUrl ? (
                                                    <img src={deal.retailer.logoUrl} alt={deal.retailer.name} />
                                                ) : (
                                                    <span className="text-xs font-bold">{deal.retailer.name.slice(0, 2)}</span>
                                                )}
                                            </div>
                                            <span className="font-medium text-[var(--text-primary)] text-sm">
                                                {deal.retailer.name}
                                            </span>
                                        </div>
                                        {index === 0 && (
                                            <span className="text-xs font-semibold text-emerald-500">
                                                BEST PRICE
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-[var(--text-primary)]">
                                                ${deal.price.toFixed(2)}
                                            </span>
                                            {deal.originalPrice && (
                                                <span className="ml-2 text-sm text-[var(--text-muted)] line-through">
                                                    ${deal.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={`/go/${deal.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-ghost text-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <ArrowUp className="w-3 h-3" />
                                            {deal.voteScore}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" />
                                            {deal._count.comments}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {product.deals.length === 0 && (
                                <div className="text-center py-8 text-[var(--text-muted)]">
                                    <p>No active deals for this product.</p>
                                    <button className="btn-secondary mt-4">
                                        <Bell className="w-4 h-4" />
                                        Alert Me When Available
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
