import { Building, Globe, Users, ShoppingBag } from 'lucide-react'

export const metadata = {
    title: 'About Skrooge - Best Deals in Australia',
    description: 'Learn about Skrooge, your ultimate companion for finding the hottest deals and smartest savings in Australia.'
}

export default function AboutPage() {
    return (
        <div className="min-h-screen p-6 sm:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent inline-block">
                    About Skrooge
                </h1>
                <p className="text-xl text-[var(--text-secondary)]">Australia's smartest deal discovery platform.</p>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <p className="lead text-lg mb-8">
                    Skrooge was born out of a simple frustration: traversing dozens of websites just to find a good price.
                    We believe that saving money shouldn't cost you time. Our mission is to aggregate the best deals
                    from across the Australian web into one clean, fast, and user-friendly interface.
                </p>

                <div className="grid md:grid-cols-3 gap-8 my-12 not-prose">
                    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                        <div className="w-12 h-12 mx-auto bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Deals from Everywhere</h3>
                        <p className="text-sm text-[var(--text-muted)]">We scour retailers, forums, and marketplaces so you don't have to.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                        <div className="w-12 h-12 mx-auto bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Community Driven</h3>
                        <p className="text-sm text-[var(--text-muted)]">Our deals are voted on by real users, ensuring only the best offers rise to the top.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                        <div className="w-12 h-12 mx-auto bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Smart Shopping</h3>
                        <p className="text-sm text-[var(--text-muted)]">With price history and alerts, you'll always know if it's truly a bargain.</p>
                    </div>
                </div>

                <h2>Our Story</h2>
                <p>
                    Founded in 2026, Skrooge started as a small project to track tech prices. It quickly grew into a
                    comprehensive platform covering everything from groceries to travel. We are proudly Australian-made
                    and focused on the local market.
                </p>

                <h2>Contact Us</h2>
                <p>
                    Have a suggestion or found a bug? We'd love to hear from you.
                    Email us at <a href="mailto:hello@skrooge.com.au" className="text-[var(--accent)] hover:underline">hello@skrooge.com.au</a>.
                </p>
            </div>
        </div>
    )
}
