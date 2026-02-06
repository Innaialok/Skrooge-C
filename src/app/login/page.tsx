'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, Loader2, DollarSign } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (isLogin) {
                // Login with NextAuth
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                })

                if (result?.error) {
                    setError(result.error)
                } else {
                    router.push('/')
                    router.refresh()
                }
            } else {
                // Register new account
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                const data = await res.json()

                if (!res.ok) {
                    setError(data.error || 'Registration failed')
                } else {
                    // Auto login after registration
                    const result = await signIn('credentials', {
                        email: formData.email,
                        password: formData.password,
                        redirect: false,
                    })

                    if (result?.ok) {
                        router.push('/')
                        router.refresh()
                    }
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 
                        flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        {isLogin ? 'Welcome back!' : 'Create an account'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-2">
                        {isLogin
                            ? 'Sign in to save favorites and get price alerts'
                            : 'Join Skrooge to never miss a deal'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-[var(--border-color)] p-6 sm:p-8"
                    style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-lg)' }}>

                    {/* Toggle */}
                    <div className="flex rounded-xl bg-[var(--bg-tertiary)] p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${isLogin
                                    ? 'bg-[var(--accent)] text-white shadow-md'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${!isLogin
                                    ? 'bg-[var(--accent)] text-white shadow-md'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name field (only for registration) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your name"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            style={{
                                background: 'var(--cta-bg)',
                                boxShadow: '0 4px 14px 0 var(--cta-shadow)'
                            }}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
