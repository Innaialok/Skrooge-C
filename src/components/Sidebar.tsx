'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
    Home,
    Flame,
    TrendingUp,
    Grid3X3,
    Heart,
    Bell,
    Settings,
    User,
    DollarSign,
    ChevronDown,
    Sun,
    Moon,
    Menu,
    X,
    LogOut
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/deals', icon: Flame, label: 'All Deals' },
    { href: '/trending', icon: TrendingUp, label: 'Trending' },
]

// Deal type filter items
const dealTypeItems = [
    { href: '/deals?type=product', icon: '🛒', label: 'Product Deals' },
    { href: '/deals?type=store', icon: '🏷️', label: 'Store Sales' },
    { href: '/deals?type=cashback', icon: '💰', label: 'Cashback' },
    { href: '/deals?type=coupon', icon: '🎟️', label: 'Coupons' },
    { href: '/deals?type=travel', icon: '✈️', label: 'Travel' },
]

const userItems = [
    { href: '/favorites', icon: Heart, label: 'Favorites', requiresAuth: true },
    { href: '/alerts', icon: Bell, label: 'Price Alerts', requiresAuth: true },
    { href: '/settings', icon: Settings, label: 'Settings', requiresAuth: false },
]

// Static fallback categories
const defaultCategories = [
    { id: '1', name: 'Electronics', slug: 'electronics', icon: '📱' },
    { id: '2', name: 'Computing', slug: 'computing', icon: '💻' },
    { id: '3', name: 'Home & Garden', slug: 'home-garden', icon: '🏠' },
    { id: '4', name: 'Fashion', slug: 'fashion', icon: '👕' },
    { id: '5', name: 'Gaming', slug: 'gaming', icon: '🎮' },
    { id: '6', name: 'Sports', slug: 'sports', icon: '⚽' },
]

interface Category {
    id: string
    name: string
    slug: string
    icon: string | null
}

export default function Sidebar() {
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const [categoriesOpen, setCategoriesOpen] = useState(false)
    const [productDealsOpen, setProductDealsOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>(defaultCategories)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()

    useEffect(() => {
        // Fetch categories for dropdown
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                const cats = Array.isArray(data) ? data : data.categories
                if (cats && cats.length > 0) {
                    setCategories(cats)
                }
            })
            .catch(() => { })
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileOpen])

    const isCategoryActive = pathname.startsWith('/category') || pathname === '/categories'
    const isLoggedIn = !!session?.user

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
        setMobileOpen(false)
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 
                        flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-[var(--text-primary)]">Skrooge</span>
                </Link>
                {/* Mobile close button */}
                <button
                    className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)]"
                    onClick={() => setMobileOpen(false)}
                >
                    <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                    Menu
                </p>

                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[var(--accent)]' : ''}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}

                {/* Deal Types Section */}
                <div className="pt-4">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                        Deal Types
                    </p>

                    {/* Product Deals - Expandable with categories */}
                    <div className="relative">
                        <button
                            onClick={() => setProductDealsOpen(!productDealsOpen)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${pathname.includes('/deals') && pathname.includes('type=product')
                                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <span className="text-base w-5 text-center shrink-0">🛒</span>
                            <span className="font-medium text-sm flex-1 text-left">Product Deals</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productDealsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {productDealsOpen && (
                            <div className="mt-1 ml-4 pl-4 border-l-2 border-[var(--border-color)] space-y-1">
                                <Link
                                    href="/deals?type=product"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
                                >
                                    <span className="text-sm">📦</span>
                                    <span>All Products</span>
                                </Link>
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/deals?type=product&category=${category.slug}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
                                    >
                                        <span className="text-sm">{category.icon || '📦'}</span>
                                        <span>{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Other deal types - simple links */}
                    {dealTypeItems.filter(item => item.label !== 'Product Deals').map((item) => {
                        const isActive = pathname + (typeof window !== 'undefined' ? window.location.search : '') === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive
                                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>

                {/* Categories Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setCategoriesOpen(!categoriesOpen)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isCategoryActive
                            ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        <Grid3X3 className={`w-5 h-5 shrink-0 ${isCategoryActive ? 'text-[var(--accent)]' : ''}`} />
                        <span className="font-medium flex-1 text-left">Categories</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {categoriesOpen && (
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-[var(--border-color)] space-y-1">
                            <Link
                                href="/categories"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
                            >
                                <span className="text-base">📋</span>
                                <span>All Categories</span>
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${pathname === `/category/${category.slug}`
                                        ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <span className="text-base">{category.icon || '📦'}</span>
                                    <span>{category.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Account Section */}
                <div className="pt-6">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                        Account
                    </p>
                    {userItems.map((item) => {
                        const isActive = pathname === item.href
                        // If requires auth and not logged in, show as disabled or redirect to login
                        if (item.requiresAuth && !isLoggedIn) {
                            return (
                                <Link
                                    key={item.href}
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] opacity-60"
                                >
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        }
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[var(--accent)]' : ''}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Theme Toggle */}
            <div className="p-4 border-t border-[var(--border-color)]">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--accent)]/10 transition-all"
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-yellow-500 shrink-0" />
                    ) : (
                        <Moon className="w-5 h-5 text-indigo-500 shrink-0" />
                    )}
                    <span className="font-medium text-[var(--text-secondary)]">
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-[var(--border-color)]">
                {isLoggedIn ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 px-3 py-2.5">
                            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center shrink-0">
                                {session.user.image ? (
                                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                                ) : (
                                    <User className="w-4 h-4 text-[var(--accent)]" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                    {session.user.name || session.user.email}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] truncate">{session.user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-red-500/10 hover:text-red-500 transition-all text-[var(--text-secondary)]"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--accent)]/10 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--text-primary)]">Sign In</p>
                            <p className="text-xs text-[var(--text-muted)]">Get price alerts</p>
                        </div>
                    </Link>
                )}
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 
                        flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-[var(--text-primary)]">Skrooge</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                    <Menu className="w-6 h-6 text-[var(--text-primary)]" />
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-50"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-[var(--bg-secondary)] border-l border-[var(--border-color)] flex flex-col z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex-col z-40">
                <SidebarContent />
            </aside>
        </>
    )
}
