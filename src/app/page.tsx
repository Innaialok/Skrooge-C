import { Flame, Clock } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import prisma from '@/lib/prisma'

async function getHotDeals() {
  const deals = await prisma.deal.findMany({
    where: {
      isExpired: false,
      isHot: true,
    },
    include: {
      product: true,
      retailer: true,
    },
    orderBy: { voteScore: 'desc' },
    take: 8,
  })

  return deals
}

async function getRecentDeals() {
  const deals = await prisma.deal.findMany({
    where: {
      isExpired: false,
    },
    include: {
      product: true,
      retailer: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  return deals
}

export default async function Home() {
  const [hotDeals, recentDeals] = await Promise.all([
    getHotDeals(),
    getRecentDeals(),
  ])

  return (
    <div className="min-h-screen">
      {/* Search Header - sticky below mobile header on mobile, at top on desktop */}
      <div className="sticky top-0 lg:top-0 z-30 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] px-4 sm:px-6 py-3 sm:py-4">
        <SearchBar />
      </div>

      <div className="p-4 sm:p-6">
        {/* Hot Deals Section */}
        <section className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">🔥 Hot Deals</h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] hidden sm:block">Top voted deals right now</p>
              </div>
            </div>
            <Link href="/deals?hot=true" className="text-xs sm:text-sm text-[var(--accent)] hover:opacity-80 font-medium">
              View All →
            </Link>
          </div>

          {hotDeals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {hotDeals.map((deal) => (
                <ProductCard
                  key={deal.id}
                  id={deal.id}
                  productId={deal.productId}
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
          ) : (
            <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
              <Flame className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="text-[var(--text-muted)]">No hot deals at the moment. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Recent Deals Section */}
        <section className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Recent Deals</h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] hidden sm:block">Latest deals from across Australia</p>
              </div>
            </div>
            <Link href="/deals" className="text-xs sm:text-sm text-[var(--accent)] hover:opacity-80 font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {recentDeals.map((deal) => (
              <ProductCard
                key={deal.id}
                id={deal.id}
                productId={deal.productId}
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
        </section>
      </div>
    </div>
  )
}
