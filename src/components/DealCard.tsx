'use client'

import Link from 'next/link'
import { ArrowUp, ArrowDown, MessageCircle, Clock, ExternalLink, Flame } from 'lucide-react'
import { useState } from 'react'

interface DealCardProps {
    id: string
    title: string
    description?: string | null
    price: number
    originalPrice?: number | null
    discount?: number | null
    imageUrl?: string | null
    retailerName: string
    retailerLogo?: string | null
    productSlug: string
    voteScore: number
    isHot: boolean
    commentsCount: number
    createdAt: Date
    url: string
}

export default function DealCard({
    id,
    title,
    description,
    price,
    originalPrice,
    discount,
    imageUrl,
    retailerName,
    retailerLogo,
    productSlug,
    voteScore,
    isHot,
    commentsCount,
    createdAt,
    url,
}: DealCardProps) {
    const [votes, setVotes] = useState(voteScore)
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

    const handleVote = (type: 'up' | 'down') => {
        if (userVote === type) {
            setUserVote(null)
            setVotes(votes + (type === 'up' ? -1 : 1))
        } else {
            const adjustment = userVote ? 2 : 1
            setVotes(votes + (type === 'up' ? adjustment : -adjustment))
            setUserVote(type)
        }
    }

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return 'just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    const productUrl = `/product/${productSlug}`

    return (
        <div className={`deal-card ${isHot ? 'deal-card-hot' : ''}`}>
            <div className="flex">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 border-r border-gray-100">
                    <button
                        onClick={() => handleVote('up')}
                        className={`vote-btn ${userVote === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-600'}`}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </button>
                    <span className={`font-bold text-lg ${votes >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {votes}
                    </span>
                    <button
                        onClick={() => handleVote('down')}
                        className={`vote-btn ${userVote === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <ArrowDown className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4">
                    <div className="flex gap-4">
                        {/* Image */}
                        <Link href={productUrl} className="shrink-0">
                            <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden hover:opacity-80 transition-opacity">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-emerald-50 to-teal-50">
                                        🛒
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                {isHot && (
                                    <span className="badge badge-hot">
                                        <Flame className="w-3 h-3" />
                                        HOT
                                    </span>
                                )}
                                {discount && discount >= 20 && (
                                    <span className="badge badge-discount">
                                        {Math.round(discount)}% OFF
                                    </span>
                                )}
                                <span className="badge badge-category">
                                    {retailerName}
                                </span>
                            </div>

                            {/* Title */}
                            <Link href={productUrl}>
                                <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors mb-1">
                                    {title}
                                </h3>
                            </Link>

                            {/* Description */}
                            {description && (
                                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                    {description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-2xl font-bold text-gray-900">
                                    ${price.toFixed(2)}
                                </span>
                                {originalPrice && (
                                    <>
                                        <span className="text-gray-400 line-through">
                                            ${originalPrice.toFixed(2)}
                                        </span>
                                        <span className="text-emerald-600 font-semibold text-sm">
                                            Save ${(originalPrice - price).toFixed(2)}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {timeAgo(createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        {commentsCount}
                                    </span>
                                </div>

                                <a
                                    href={`/go/${id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary text-sm py-2"
                                >
                                    Go to Deal
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
