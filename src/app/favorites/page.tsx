'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Loader2, ExternalLink, Trash2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

interface Favorite {
    id: string
    productId: string
    createdAt: string
    product: {
        id: string
        name: string
        slug: string
        imageUrl: string | null
        brand: string | null
        lowestDeal: {
            id: string
            price: number
            originalPrice: number | null
            discount: number | null
            retailerName: string
            url: string
        } | null
    }
}

export default function FavoritesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [removingId, setRemovingId] = useState<string | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        if (status === 'authenticated') {
            fetchFavorites()
        }
    }, [status, router])

    const fetchFavorites = async () => {
        try {
            const res = await fetch('/api/favorites')
            const data = await res.json()
            setFavorites(data.favorites || [])
        } catch (error) {
            console.error('Error fetching favorites:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemove = async (productId: string) => {
        setRemovingId(productId)
        try {
            await fetch(`/api/favorites/${productId}`, { method: 'DELETE' })
            setFavorites(favorites.filter(f => f.productId !== productId))
            toast.success("Removed from favorites")
        } catch (error) {
            console.error('Error removing favorite:', error)
            toast.error("Failed to remove favorite")
        } finally {
            setRemovingId(null)
        }
    }

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 lg:top-0 z-30 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Heart className="w-5 h-5 text-white" fill="white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)]">My Favorites</h1>
                        <p className="text-sm text-[var(--text-muted)]">{favorites.length} saved items</p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {favorites.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
                            <Heart className="w-10 h-10 text-[var(--text-muted)]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No favorites yet</h2>
                        <p className="text-[var(--text-muted)] mb-6">Start saving products to track prices and deals!</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
                            style={{ background: 'var(--cta-bg)' }}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Browse Deals
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {favorites.map((fav) => (
                            <div
                                key={fav.id}
                                className="group rounded-2xl border border-[var(--border-color)] overflow-hidden transition-all hover:border-[var(--accent)]"
                                style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-card)' }}
                            >
                                {/* Image */}
                                <div className="relative aspect-square" style={{ background: 'var(--bg-tertiary)' }}>
                                    <Link href={`/product/${fav.product.slug}`}>
                                        {fav.product.imageUrl ? (
                                            <img
                                                src={fav.product.imageUrl}
                                                alt={fav.product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">🛒</div>
                                        )}
                                    </Link>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => handleRemove(fav.productId)}
                                        disabled={removingId === fav.productId}
                                        className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        {removingId === fav.productId ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Discount badge */}
                                    {fav.product.lowestDeal?.discount && fav.product.lowestDeal.discount > 0 && (
                                        <div className="absolute top-3 left-0 text-white px-3 py-1 text-sm font-bold rounded-r-lg"
                                            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                                            {Math.round(fav.product.lowestDeal.discount)}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {fav.product.brand && (
                                        <p className="text-xs font-medium text-[var(--accent)] mb-1">{fav.product.brand}</p>
                                    )}

                                    <Link href={`/product/${fav.product.slug}`}>
                                        <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors min-h-[48px]">
                                            {fav.product.name}
                                        </h3>
                                    </Link>

                                    {fav.product.lowestDeal ? (
                                        <div className="mt-3 flex items-end justify-between">
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold price-main">${fav.product.lowestDeal.price.toFixed(2)}</span>
                                                    {fav.product.lowestDeal.originalPrice && fav.product.lowestDeal.originalPrice > fav.product.lowestDeal.price && (
                                                        <span className="text-sm text-[var(--text-muted)] line-through">
                                                            ${fav.product.lowestDeal.originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[var(--text-muted)]">at {fav.product.lowestDeal.retailerName}</p>
                                            </div>

                                            <a
                                                href={`/go/${fav.product.lowestDeal.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl text-white transition-all hover:scale-105"
                                                style={{ background: 'var(--cta-bg)', boxShadow: '0 4px 14px 0 var(--cta-shadow)' }}
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="mt-3 text-sm text-[var(--text-muted)]">No active deals</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
