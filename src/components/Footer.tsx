import Link from 'next/link'
import { DollarSign, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 
                            flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Skrooge
                            </span>
                        </Link>
                        <p className="text-gray-500 max-w-md mb-6">
                            Australia's smartest deal aggregator. We automatically find the best prices
                            across all major retailers so you never miss a bargain.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/deals" className="hover:text-emerald-400 transition-colors">All Deals</Link></li>
                            <li><Link href="/categories" className="hover:text-emerald-400 transition-colors">Categories</Link></li>
                            <li><Link href="/trending" className="hover:text-emerald-400 transition-colors">Trending</Link></li>
                            <li><Link href="/alerts" className="hover:text-emerald-400 transition-colors">Price Alerts</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 Skrooge Australia. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs">
                        Prices and availability are subject to change. We may earn commission from affiliate links.
                    </p>
                </div>
            </div>
        </footer>
    )
}
