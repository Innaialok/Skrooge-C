'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Share2, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react'
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

    const [votes, setVotes] = useState(0)
    const [userVote, setUserVote] = useState<1 | -1 | null>(null)

    const handleVote = (e: React.MouseEvent, value: 1 | -1) => {
        e.preventDefault()
        e.stopPropagation()

        // Mock auth check - assuming true for demo as requested
        const isAuthenticated = true
        if (!isAuthenticated) {
            alert("Please sign in to vote")
            return
        }

        if (userVote === value) {
            // Remove vote
            setUserVote(null)
            setVotes(v => v - value)
        } else {
            // Change/Add vote
            // If changing from -1 to 1 (or vice versa), the difference is 2. If from null to 1, diff is 1.
            const diff = userVote ? 2 * value : value
            setVotes(v => v + diff)
            setUserVote(value)
        }
    }

    return (
        <div className="group flex flex-row md:flex-col rounded-xl sm:rounded-2xl border border-[var(--border-color)] overflow-hidden transition-all duration-300 h-32 md:h-auto"
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

                {/* Discount Badge */}
                {discount && discount > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                        -{Math.round(discount)}%
                    </div>
                )}

                {/* Deal Type Badge */}
                {badge && (
                    <div className="absolute top-8 md:top-12 left-0 text-white px-2 py-0.5 text-[10px] md:text-xs font-semibold rounded-r-lg z-10"
                        style={{
                            background: badge.bg,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                        {badge.icon} {badge.label}
                    </div>
                )}

                {/* Favorite Button - Adjusted positioning */}
                <div className="absolute top-1 md:top-2 right-1 md:right-2 z-10">
                    <FavoriteButton productId={productId || id} size="sm" />
                </div>

                {retailerLogo && (
                    <div className="absolute bottom-1 right-1 md:bottom-3 md:right-3 rounded-lg md:rounded-xl p-1 md:p-1.5 border border-[var(--border-color)] z-10 hidden md:block"
                        style={{
                            background: 'var(--card-bg)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                        <img src={retailerLogo} alt={retailerName} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex-1 p-3 md:p-4 flex flex-col justify-between min-w-0">
                <div>
                    {/* Retailer & Meta */}
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                        <p className="text-[10px] md:text-xs font-medium text-[var(--accent)] truncate pr-2">{retailerName}</p>
                        {retailerLogo && (
                            <div className="md:hidden w-5 h-5 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] p-0.5 shrink-0">
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
                        <button
                            onClick={(e) => handleVote(e, 1)}
                            className={`p-1 rounded transition-colors ${userVote === 1 ? 'text-green-500 bg-green-500/10' : 'hover:text-green-500 hover:bg-green-50/10'}`}
                            title="Good deal"
                        >
                            <span className="sr-only">Upvote</span>
                            <ThumbsUp className={`w-3 h-3 sm:w-4 sm:h-4 ${userVote === 1 ? 'fill-current' : ''}`} />
                        </button>
                        <span className={`text-[10px] sm:text-xs font-medium ${userVote === 1 ? 'text-green-500' : userVote === -1 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                            {votes > 0 ? `+${votes}` : votes}
                        </span>
                        <button
                            onClick={(e) => handleVote(e, -1)}
                            className={`p-1 rounded transition-colors ${userVote === -1 ? 'text-red-500 bg-red-500/10' : 'hover:text-red-500 hover:bg-red-50/10'}`}
                            title="Bad deal"
                        >
                            <span className="sr-only">Downvote</span>
                            <ThumbsDown className={`w-3 h-3 sm:w-4 sm:h-4 ${userVote === -1 ? 'fill-current' : ''}`} />
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
