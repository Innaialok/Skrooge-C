'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'

interface QuickResult {
    id: string
    title: string
    type: 'deal' | 'product'
    slug: string
    price?: number
    retailer?: string
}

export default function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<QuickResult[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`)
                const data = await res.json()

                const quickResults: QuickResult[] = [
                    ...data.deals?.slice(0, 4).map((d: any) => ({
                        id: d.id,
                        title: d.title,
                        type: 'deal' as const,
                        slug: d.productSlug,
                        price: d.price,
                        retailer: d.retailerName,
                    })) || [],
                    ...data.products?.slice(0, 2).map((p: any) => ({
                        id: p.id,
                        title: p.name,
                        type: 'product' as const,
                        slug: p.slug,
                    })) || [],
                ]
                setResults(quickResults)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
            setIsOpen(false)
        }
    }

    const handleResultClick = (result: QuickResult) => {
        router.push(`/product/${result.slug}`)
        setIsOpen(false)
        setQuery('')
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setIsOpen(true)
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search for products, brands, or retailers..."
                        className="w-full pl-12 pr-12 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-lg"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('')
                                setResults([])
                                inputRef.current?.focus()
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-tertiary)]"
                        >
                            <X className="w-4 h-4 text-[var(--text-muted)]" />
                        </button>
                    )}
                </div>
            </form>

            {/* Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-xl overflow-hidden z-50">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
                            <span className="ml-2 text-sm text-[var(--text-muted)]">Searching...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="py-2">
                                {results.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleResultClick(result)}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
                                            {result.type === 'deal' ? '🏷️' : '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[var(--text-primary)] line-clamp-1">{result.title}</p>
                                            {result.type === 'deal' && result.price && (
                                                <p className="text-sm text-[var(--accent)]">
                                                    ${result.price.toFixed(2)} at {result.retailer}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    router.push(`/search?q=${encodeURIComponent(query)}`)
                                    setIsOpen(false)
                                }}
                                className="w-full px-4 py-3 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] text-[var(--accent)] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
                            >
                                See all results for "{query}"
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-[var(--text-muted)]">No results found for "{query}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
