import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
    params: Promise<{ slug: string }>
}

async function getCategoryWithDeals(slug: string) {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                include: {
                    deals: {
                        where: { isExpired: false },
                        include: {
                            retailer: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            },
        },
    })

    return category
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params
    const category = await getCategoryWithDeals(slug)

    if (!category) {
        notFound()
    }

    // Flatten deals from all products in this category
    const deals = category.products.flatMap((product) =>
        product.deals.map((deal) => ({
            ...deal,
            product,
        }))
    )

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{category.icon || '📦'}</div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                    <p className="text-sm text-gray-500">
                        {deals.length} {deals.length === 1 ? 'deal' : 'deals'} available
                    </p>
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-emerald-600">Home</Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-emerald-600">Categories</Link>
                <span>/</span>
                <span className="text-gray-900">{category.name}</span>
            </nav>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {deals.map((deal) => (
                    <ProductCard
                        key={deal.id}
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
                ))}
            </div>

            {deals.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <div className="text-6xl mb-4">{category.icon || '📦'}</div>
                    <p className="text-xl">No deals in this category yet</p>
                    <p className="mt-2">Check back soon for new deals!</p>
                </div>
            )}
        </div>
    )
}
