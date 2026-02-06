import { Search, Sparkles, TrendingUp, Bell } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-emerald-50 to-white">
            {/* Background decorations */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                      bg-emerald-100 text-emerald-700
                      text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    Australia's #1 Deal Aggregator
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-gray-900">
                    Never Miss a{' '}
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Bargain</span>
                    <br />
                    Again
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                    We automatically find and track the best deals from every major Australian retailer.
                    Get price alerts, see price history, and join the community.
                </p>

                {/* Search Bar */}
                <div className="relative flex items-center max-w-2xl mx-auto mb-12">
                    <Search className="absolute left-4 w-6 h-6 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for products, brands, or retailers..."
                        className="w-full pl-14 pr-32 py-4 text-lg rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 shadow-xl"
                    />
                    <button className="absolute right-2 btn-primary py-3">
                        Search
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">15K+</span>
                        <p className="text-sm text-gray-500 mt-1">Active Deals</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">50+</span>
                        <p className="text-sm text-gray-500 mt-1">Retailers</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">$2.4M</span>
                        <p className="text-sm text-gray-500 mt-1">Saved by Users</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">100K+</span>
                        <p className="text-sm text-gray-500 mt-1">Community Members</p>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-gray-500">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm">Real-time price tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        <span className="text-sm">Instant price alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm">AI-powered deal scoring</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
