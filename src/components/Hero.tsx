import { Search, Sparkles, TrendingUp, Bell } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
            {/* Background decorations */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[var(--accent-hover)]/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                      bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]
                      text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    Australia's #1 Deal Aggregator
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-[var(--text-primary)]">
                    Never Miss a{' '}
                    <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">Bargain</span>
                    <br />
                    Again
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
                    We automatically find and track the best deals from every major Australian retailer.
                    Get price alerts, see price history, and join the community.
                </p>

                {/* Search Bar */}
                <div className="relative flex items-center max-w-2xl mx-auto mb-12">
                    <Search className="absolute left-4 w-6 h-6 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search for products, brands, or retailers..."
                        className="w-full pl-14 pr-32 py-4 text-lg rounded-2xl border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] shadow-xl transition-colors"
                    />
                    <button className="absolute right-2 btn-primary py-3">
                        Search
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">15K+</span>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Active Deals</p>
                    </div>
                    <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">50+</span>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Retailers</p>
                    </div>
                    <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">$2.4M</span>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Saved by Users</p>
                    </div>
                    <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">100K+</span>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Community Members</p>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-sm">Real-time price tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-sm">Instant price alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-sm">AI-powered deal scoring</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
