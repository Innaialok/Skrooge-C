'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Moon, Sun, Bell, Shield, LogOut, ChevronRight, Mail, Trash2 } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'

export default function SettingsPage() {
    const { data: session, status } = useSession()
    const { theme, toggleTheme } = useTheme()
    const router = useRouter()

    if (status === 'loading') return null

    // Helper for sections
    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4 px-1">{title}</h2>
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden divide-y divide-[var(--border-color)]">
                {children}
            </div>
        </div>
    )

    // Helper for rows
    const Row = ({
        icon: Icon,
        label,
        value,
        onClick,
        href,
        danger = false,
        action
    }: {
        icon: any,
        label: string,
        value?: string,
        onClick?: () => void,
        href?: string,
        danger?: boolean,
        action?: React.ReactNode
    }) => {
        const content = (
            <div className={`p-4 flex items-center justify-between ${onClick || href ? 'cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors' : ''}`}
                onClick={onClick}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${danger ? 'bg-red-500/10 text-red-500' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`font-medium ${danger ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>{label}</p>
                        {value && <p className="text-sm text-[var(--text-muted)]">{value}</p>}
                    </div>
                </div>
                {action || (onClick || href ? <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" /> : null)}
            </div>
        )

        return href ? <Link href={href}>{content}</Link> : content
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 max-w-3xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-[var(--text-muted)]">Manage your account and preferences</p>
            </header>

            {status === 'authenticated' ? (
                <>
                    <Section title="Account">
                        <div className="p-6 flex items-center gap-4 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
                            <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                                {session.user?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{session.user?.name}</h3>
                                <p className="text-[var(--text-muted)]">{session.user?.email}</p>
                            </div>
                        </div>
                        <Row
                            icon={Shield}
                            label="Admin Dashboard"
                            href="/admin"
                            value="Manage system"
                        />
                    </Section>

                    <Section title="Preferences">
                        <Row
                            icon={theme === 'dark' ? Moon : Sun}
                            label="Appearance"
                            value={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            onClick={toggleTheme}
                            action={
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                                    style={{ backgroundColor: theme === 'dark' ? 'var(--accent)' : 'var(--bg-tertiary)' }}
                                >
                                    <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                </div>
                            }
                        />
                        <Row
                            icon={Bell}
                            label="Notifications"
                            value="Push notifications enabled"
                            onClick={() => alert("Notification settings coming soon!")}
                        />
                    </Section>

                    <Section title="Data & Privacy">
                        <Row icon={Shield} label="Privacy Policy" href="/privacy" />
                        <Row icon={Shield} label="Terms of Service" href="/terms" />
                    </Section>

                    <div className="space-y-4">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>

                        <button
                            onClick={() => {
                                if (confirm('Are you sure? This cannot be undone.')) {
                                    alert('Account deletion not implemented in demo')
                                }
                            }}
                            className="w-full p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete Account
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
                    <User className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" />
                    <h2 className="text-xl font-bold mb-2">Sign in to manage settings</h2>
                    <p className="text-[var(--text-muted)] mb-6">Access your profile, preferences, and account settings.</p>
                    <Link href="/login" className="btn-primary inline-flex">
                        Sign In / Register
                    </Link>
                </div>
            )}
        </div>
    )
}
