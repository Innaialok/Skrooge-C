'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, Flame, Bell, User, Heart, DollarSign } from 'lucide-react'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 
                          flex items-center justify-center shadow-lg shadow-emerald-500/30
                          group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all duration-300">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Skrooge
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/" className="nav-link nav-link-active">Home</Link>
                        <Link href="/deals" className="nav-link">All Deals</Link>
                        <Link href="/categories" className="nav-link">Categories</Link>
                        <Link href="/trending" className="nav-link">Trending</Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search deals..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200
                         bg-gray-50 text-gray-900
                         placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500
                         focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <button className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 
                             transition-colors relative" aria-label="Notifications">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <button className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 
                             transition-colors" aria-label="Favorites">
                            <Heart className="w-5 h-5 text-gray-600" />
                        </button>

                        <Link href="/login" className="btn-primary hidden sm:flex">
                            <User className="w-4 h-4" />
                            Sign In
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-gray-600" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search deals..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                           bg-gray-50 text-gray-900
                           placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <Link href="/" className="px-4 py-3 rounded-xl hover:bg-gray-100 
                                       font-medium text-gray-900">Home</Link>
                            <Link href="/deals" className="px-4 py-3 rounded-xl hover:bg-gray-100 
                                            font-medium text-gray-600">All Deals</Link>
                            <Link href="/categories" className="px-4 py-3 rounded-xl hover:bg-gray-100 
                                                 font-medium text-gray-600">Categories</Link>
                            <Link href="/trending" className="px-4 py-3 rounded-xl hover:bg-gray-100 
                                               font-medium text-gray-600">Trending</Link>
                            <hr className="my-2 border-gray-200" />
                            <Link href="/login" className="btn-primary justify-center">
                                <User className="w-4 h-4" />
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
