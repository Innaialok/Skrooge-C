'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
    productId: string
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
}

export default function FavoriteButton({ productId, size = 'md', showText = false }: FavoriteButtonProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isFavorited, setIsFavorited] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Check if product is favorited on mount
    useEffect(() => {
        if (session?.user) {
            fetch(`/api/favorites/${productId}`)
                .then(res => res.json())
                .then(data => setIsFavorited(data.isFavorited))
                .catch(() => { })
        }
    }, [session, productId])

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // If not logged in, redirect to login
        if (!session?.user) {
            router.push('/login')
            return
        }

        setIsLoading(true)
        try {
            if (isFavorited) {
                // Remove from favorites
                await fetch(`/api/favorites/${productId}`, { method: 'DELETE' })
                setIsFavorited(false)
            } else {
                // Add to favorites
                await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                })
                setIsFavorited(true)
            }
        } catch (error) {
            console.error('Favorite error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const sizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5',
    }

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`${sizeClasses[size]} rounded-xl transition-all duration-200 ${isFavorited
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10'
                } ${showText ? 'flex items-center gap-2' : ''}`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            {isLoading ? (
                <Loader2 className={`${iconSizes[size]} animate-spin`} />
            ) : (
                <Heart
                    className={iconSizes[size]}
                    fill={isFavorited ? 'currentColor' : 'none'}
                />
            )}
            {showText && (
                <span className="text-sm font-medium">
                    {isFavorited ? 'Saved' : 'Save'}
                </span>
            )}
        </button>
    )
}
