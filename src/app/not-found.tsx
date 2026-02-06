import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-[var(--accent)] opacity-50" />
                </div>
                <h1 className="text-6xl font-black text-[var(--text-primary)] mb-2">404</h1>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Page Not Found</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <Link href="/" className="btn-primary inline-flex gap-2">
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
