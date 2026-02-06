'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import FavoriteButton from './FavoriteButton'

interface ProductCardProps {
    id: string
    title: string
    price: number
    originalPrice?: number | null
    discount?: number | null
    imageUrl?: string | null
    retailerName: string
    retailerLogo?: string | null
    productSlug: string
    productId?: string  // For favorites - product ID separate from deal ID
    url: string
    dealType?: string  // product, cashback, travel, service
}

// Deal type badge configurations
const dealTypeBadges: Record<string, { label: string; bg: string; icon: string }> = {
    cashback: { label: 'Cashback', bg: 'linear-gradient(135deg, #9333ea, #7c3aed)', icon: '💰' },
    store: { label: 'Sale', bg: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '🏷️' },
    coupon: { label: 'Coupon', bg: 'linear-gradient(135deg, #22c55e, #16a34a)', icon: '🎟️' },
    travel: { label: 'Travel', bg: 'linear-gradient(135deg, #0ea5e9, #0369a1)', icon: '✈️' },
    groceries: { label: 'Groceries', bg: 'linear-gradient(135deg, #22c55e, #84cc16)', icon: '🥑' },
}

// Deal type card gradient configurations
const dealTypeCardGradients: Record<string, string> = {
    product: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(234, 179, 8, 0.15))',     // Cyan → Yellow
    store: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))',     // Purple → Pink
    cashback: 'linear-gradient(135deg, rgba(0, 0, 0, 0.15), rgba(239, 68, 68, 0.15))',        // Black → Red
    coupon: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.15))',     // Red → Orange
    travel: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(6, 182, 212, 0.15))',     // Blue → Cyan
    groceries: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(234, 179, 8, 0.15))',   // Green → Yellow
}

// Deal type border colors for hover
const dealTypeBorderColors: Record<string, string> = {
    product: '#06b6d4',   // Cyan
    store: '#a855f7',     // Purple
    cashback: '#ef4444',  // Red
    coupon: '#f97316',    // Orange
    travel: '#0ea5e9',    // Sky blue
    groceries: '#22c55e', // Green
}

export default function ProductCard({
    id,
    title,
    price,
    originalPrice,
    discount,
    imageUrl,
    retailerName,
    retailerLogo,
    productSlug,
    productId,
    url,
    dealType = 'product',
}: ProductCardProps) {
    const badge = dealTypeBadges[dealType];
    const cardGradient = dealTypeCardGradients[dealType] || dealTypeCardGradients['product'];
    const borderColor = dealTypeBorderColors[dealType] || dealTypeBorderColors['product'];

    return (
        <div className="group flex flex-row sm:flex-col rounded-xl sm:rounded-2xl border border-[var(--border-color)] overflow-hidden transition-all duration-300 h-32 sm:h-auto"
            style={{
                background: cardGradient,
                boxShadow: 'var(--shadow-card)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = borderColor
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--border-color)'
            }}
        >
            {/* Image Container with Discount Badge */}
            <div className="relative w-32 sm:w-full shrink-0 sm:aspect-square overflow-hidden"
                style={{ background: 'var(--bg-tertiary)' }}>
                <Link href={`/product/${productSlug}`} className="block h-full">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl sm:text-6xl">
                            🛒
                        </div>
                    )}
                </Link>

                {/* Discount Banner - Adjusted for mobile */}
                {discount && discount > 0 && (
                    <div className="absolute top-2 left-0 text-white px-2 py-0.5 text-[10px] sm:text-sm font-bold rounded-r-lg z-10"
                        style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                        }}>
                        {Math.round(discount)}% OFF
                    </div>
                )}

                {/* Deal Type Badge */}
                {badge && (
                    <div className="absolute top-8 sm:top-12 left-0 text-white px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-r-lg z-10"
                        style={{
                            background: badge.bg,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                        {badge.icon} {badge.label}
                    </div>
                )}

                {/* Favorite Button - Adjusted positioning */}
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10">
                    <FavoriteButton productId={productId || id} size="sm" />
                </div>

                {retailerLogo && (
                    <div className="absolute bottom-1 right-1 sm:bottom-3 sm:right-3 rounded-lg sm:rounded-xl p-1 sm:p-1.5 border border-[var(--border-color)] z-10 hidden sm:block"
                        style={{
                            background: 'var(--card-bg)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                        <img src={retailerLogo} alt={retailerName} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                <div>
                    {/* Retailer Name & Logo (Mobile Only) */}
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] sm:text-xs font-medium text-[var(--accent)] truncate pr-2">{retailerName}</p>
                        {retailerLogo && (
                            <div className="sm:hidden w-5 h-5 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] p-0.5 shrink-0">
                                <img src={retailerLogo} alt={retailerName} className="w-full h-full object-contain" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <Link href={`/product/${productSlug}`}>
                        <h3 className="text-xs sm:text-base font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors mb-1 sm:min-h-[48px]">
                            {title}
                        </h3>
                    </Link>
                </div>

            </div>

            {/* Footer Actions: Pricing & Voting */}
            <div className="flex items-end justify-between gap-2 mt-auto">
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-2xl font-bold price-main">${price.toFixed(2)}</span>
                        {originalPrice && originalPrice > price && (
                            <span className="text-[10px] sm:text-sm text-[var(--text-muted)] line-through">${originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>

                {/* Voting & Action */}
                <div className="flex items-center gap-2">
                    {/* Voting Buttons */}
                    <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--border-color)]">
                        <button className="p-1 hover:text-green-500 hover:bg-green-50/10 rounded transition-colors" title="Good deal">
                            <span className="sr-only">Upvote</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-4 sm:h-4"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                        </button>
                        <span className="text-[10px] sm:text-xs font-medium text-[var(--text-muted)]">0</span>
                        <button className="p-1 hover:text-red-500 hover:bg-red-50/10 rounded transition-colors" title="Bad deal">
                            <span className="sr-only">Downvote</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-4 sm:h-4"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                        </button>
                    </div>

                    <a
                        href={`/go/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-white transition-all hover:scale-105 shrink-0 bg-[var(--accent)]"
                        style={{
                            background: 'var(--cta-bg)',
                            boxShadow: '0 4px 14px 0 var(--cta-shadow)'
                        }}
                    >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                </div>
            </div>
        </div>
    )
}
