'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Shield, RefreshCw, Trash2, Database, AlertTriangle, CheckCircle, Activity } from 'lucide-react'

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [stats, setStats] = useState({
        scrapedToday: 0,
        totalDeals: 0,
        cacheStatus: 'Clean'
    })

    // Very basic admin check - in production you'd want role-based auth
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    const handleScrape = async () => {
        setIsLoading(true)
        // const toastId = toast.loading("Scraping started... this may take a while")

        try {
            const res = await fetch('/api/admin/scrape', {
                method: 'POST',
                headers: { 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '' } // Fallback for demo
            })

            if (res.ok) {
                const data = await res.json()
                alert(`Scrape complete! Found ${data.count || 'new'} deals`)
            } else {
                throw new Error('Scrape failed')
            }
        } catch (error) {
            alert("Scraping failed to start")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearDeals = async () => {
        if (!confirm('Are you sure you want to clear EXPIRED deals?')) return

        setIsLoading(true)
        try {
            const res = await fetch('/api/admin/clear-deals', { method: 'POST' })
            if (res.ok) {
                alert("Expired deals cleared")
            } else {
                alert("Failed to clear deals")
            }
        } catch (error) {
            alert("Error connecting to server")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') return <div className="p-8">Loading...</div>

    return (
        <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-[var(--text-muted)]">System management & controls</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Status Card */}
                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-4 mb-4">
                        <Activity className="w-6 h-6 text-blue-500" />
                        <h3 className="text-lg font-semibold">System Status</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Database</span>
                            <span className="text-green-500 font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Connected</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Scraper</span>
                            <span className="text-green-500 font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Ready</span>
                        </div>
                    </div>
                </div>

                {/* Actions Card */}
                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleScrape}
                            disabled={isLoading}
                            className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                </div>
                                <span className="font-semibold">Trigger Scrape</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">Run the deal scraper manually now.</p>
                        </button>

                        <button
                            onClick={handleClearDeals}
                            disabled={isLoading}
                            className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Cleanup Deals</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">Remove expired and old deals from DB.</p>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold">Admin Access</h4>
                    <p className="text-sm opacity-90">This page is currently visible to all logged-in users for demonstration. In production, add a role check (e.g. `if (session.user.role !== 'ADMIN')`) to secure it.</p>
                </div>
            </div>
        </div>
    )
}
