import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    actionLink?: string
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Icon className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-[var(--text-secondary)] max-w-sm mb-8">{description}</p>
            {actionLabel && actionLink && (
                <Link href={actionLink} className="btn-primary">
                    {actionLabel}
                </Link>
            )}
        </div>
    )
}
