'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Something went wrong!</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                    We apologize for the inconvenience. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="btn-primary inline-flex gap-2 items-center"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try again
                </button>
            </div>
        </div>
    )
}
