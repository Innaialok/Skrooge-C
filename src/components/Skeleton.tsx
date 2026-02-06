export default function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-[var(--border-color)]/20 rounded-lg ${className}`} />
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-row md:flex-col rounded-xl border border-[var(--border-color)] overflow-hidden h-32 md:h-auto bg-[var(--card-bg)]">
            {/* Image placeholder */}
            <div className="w-32 sm:w-full shrink-0 aspect-square bg-[var(--bg-secondary)] animate-pulse" />

            {/* Content placeholder */}
            <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                <div className="space-y-2">
                    <div className="h-3 w-20 bg-[var(--border-color)]/30 rounded animate-pulse" />
                    <div className="h-4 w-full bg-[var(--border-color)]/30 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-[var(--border-color)]/30 rounded animate-pulse" />
                </div>
                <div className="flex justify-between items-end mt-4">
                    <div className="h-6 w-24 bg-[var(--border-color)]/30 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-[var(--border-color)]/30 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    )
}
