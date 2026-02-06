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
}

// Deal type card gradient configurations
const dealTypeCardGradients: Record<string, string> = {
    product: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(234, 179, 8, 0.15))',     // Cyan → Yellow
    store: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))',     // Purple → Pink
    cashback: 'linear-gradient(135deg, rgba(0, 0, 0, 0.15), rgba(239, 68, 68, 0.15))',        // Black → Red
    coupon: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.15))',     // Red → Orange
    travel: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(6, 182, 212, 0.15))',     // Blue → Cyan
}

// Deal type border colors for hover
const dealTypeBorderColors: Record<string, string> = {
    product: '#06b6d4',   // Cyan
    store: '#a855f7',     // Purple
    cashback: '#ef4444',  // Red
    coupon: '#f97316',    // Orange
    travel: '#0ea5e9',    // Sky blue
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
        <div className="group rounded-xl sm:rounded-2xl border border-[var(--border-color)] overflow-hidden transition-all duration-300"
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
            <div className="relative aspect-square overflow-hidden"
                style={{ background: 'var(--bg-tertiary)' }}>
                <Link href={`/product/${productSlug}`}>
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

                {/* Discount Banner */}
                {discount && discount > 0 && (
                    <div className="absolute top-2 sm:top-3 left-0 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-bold rounded-r-lg"
                        style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                        }}>
                        {Math.round(discount)}% OFF
                    </div>
                )}

                {/* Deal Type Badge */}
                {badge && (
                    <div className="absolute top-10 sm:top-12 left-0 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-r-lg"
                        style={{
                            background: badge.bg,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                        {badge.icon} {badge.label}
                    </div>
                )}

                {/* Favorite Button - top right */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <FavoriteButton productId={productId || id} size="sm" />
                </div>

                {retailerLogo && (
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 rounded-lg sm:rounded-xl p-1 sm:p-1.5 border border-[var(--border-color)]"
                        style={{
                            background: 'var(--card-bg)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                        {retailerLogo && (
                            <img src={retailerLogo} alt={retailerName} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-2.5 sm:p-4">
                {/* Retailer Name */}
                <p className="text-[10px] sm:text-xs font-medium text-[var(--accent)] mb-0.5 sm:mb-1">{retailerName}</p>

                {/* Title */}
                <Link href={`/product/${productSlug}`}>
                    <h3 className="text-xs sm:text-base font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors min-h-[32px] sm:min-h-[48px]">
                        {title}
                    </h3>
                </Link>

                {/* Pricing */}
                <div className="mt-2 sm:mt-3 flex items-end justify-between gap-1">
                    <div className="min-w-0">
                        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                            <span className="text-base sm:text-2xl font-bold price-main">${price.toFixed(2)}</span>
                            {originalPrice && originalPrice > price && (
                                <span className="text-[10px] sm:text-sm text-[var(--text-muted)] line-through">${originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                        {originalPrice && originalPrice > price && (
                            <p className="text-[10px] sm:text-sm text-[var(--accent)] font-medium hidden sm:block">
                                Save ${(originalPrice - price).toFixed(2)}
                            </p>
                        )}
                    </div>

                    <a
                        href={`/go/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-white transition-all hover:scale-105 shrink-0"
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
