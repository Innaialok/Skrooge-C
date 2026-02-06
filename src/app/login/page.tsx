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

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-color)]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--card-bg)] text-[var(--text-muted)]">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium flex items-center justify-center gap-3 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </button>
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
