'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Loader2, Package, Tag } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

interface DealResult {
    type: 'deal'
    id: string
    title: string
    price: number
    originalPrice: number | null
    discount: number | null
    imageUrl: string | null
    url: string
    productSlug: string
    retailerName: string
    retailerLogo: string | null
}

interface ProductResult {
    type: 'product'
    id: string
    name: string
    slug: string
    brand: string | null
    imageUrl: string | null
    category: string | null
}

export default function SearchPage() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q') || ''

    const [query, setQuery] = useState(initialQuery)
    const [deals, setDeals] = useState<DealResult[]>([])
    const [products, setProducts] = useState<ProductResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setDeals([])
            setProducts([])
            setHasSearched(false)
            return
        }

        setIsLoading(true)
        setHasSearched(true)

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
            const data = await res.json()
            setDeals(data.deals || [])
            setProducts(data.products || [])
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery)
        }
    }, [initialQuery])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        performSearch(query)
        // Update URL
        window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`)
    }

    const totalResults = deals.length + products.length

    return (
        <div className="min-h-screen p-6">
            {/* Search Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Search</h1>

                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products, brands, or retailers..."
                            className="w-full pl-12 pr-24 py-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-lg"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-6"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
                    <span className="ml-3 text-[var(--text-secondary)]">Searching...</span>
                </div>
            )}

            {/* Results */}
            {!isLoading && hasSearched && (
                <div className="max-w-7xl mx-auto">
                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-[var(--text-secondary)]">
                            {totalResults === 0 ? (
                                'No results found'
                            ) : (
                                <>Found <span className="font-semibold text-[var(--text-primary)]">{totalResults}</span> results for "<span className="font-semibold text-[var(--text-primary)]">{initialQuery || query}</span>"</>
                            )}
                        </p>
                    </div>

                    {/* No Results */}
                    {totalResults === 0 && (
                        <div className="text-center py-16 card p-8">
                            <Search className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No results found</h2>
                            <p className="text-[var(--text-secondary)] mb-6">
                                Try different keywords or check the spelling
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="text-sm text-[var(--text-muted)]">Popular searches:</span>
                                {['iPhone', 'PlayStation', 'TV', 'Laptop', 'Headphones'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => {
                                            setQuery(term)
                                            performSearch(term)
                                            window.history.pushState({}, '', `/search?q=${encodeURIComponent(term)}`)
                                        }}
                                        className="px-3 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm hover:bg-[var(--accent)] hover:text-white transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Deals Section */}
                    {deals.length > 0 && (
                        <section className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="w-5 h-5 text-[var(--accent)]" />
                                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                    Deals ({deals.length})
                                </h2>
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
                                        imageUrl={deal.imageUrl}
                                        retailerName={deal.retailerName}
                                        retailerLogo={deal.retailerLogo}
                                        productSlug={deal.productSlug}
                                        url={deal.url}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Products Section (without active deals) */}
                    {products.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-[var(--accent)]" />
                                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                    Products ({products.length})
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        className="card p-4 hover:border-[var(--accent)] transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center overflow-hidden shrink-0">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-8 h-8 text-[var(--text-muted)]" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {product.brand && (
                                                    <p className="text-xs text-[var(--accent)] font-medium">{product.brand}</p>
                                                )}
                                                <h3 className="font-medium text-[var(--text-primary)] line-clamp-2">{product.name}</h3>
                                                {product.category && (
                                                    <p className="text-xs text-[var(--text-muted)]">{product.category}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Initial State */}
            {!isLoading && !hasSearched && (
                <div className="text-center py-16">
                    <Search className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Find the best deals</h2>
                    <p className="text-[var(--text-secondary)]">
                        Search for products, brands, or retailers
                    </p>
                </div>
            )}
        </div>
    )
}
