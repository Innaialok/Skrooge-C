'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
    id: string
    message: string
    type: ToastType
    onClose: (id: string) => void
}

export default function Toast({ id, message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true))

        // Auto dismiss
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300) // Wait for exit animation
        }, 3000)

        return () => clearTimeout(timer)
    }, [id, onClose])

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    }

    const bgColors = {
        success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50',
        error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50',
        info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50'
    }

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform
                ${bgColors[type]}
                ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
            `}
            role="alert"
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(() => onClose(id), 300)
                }}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors ml-2"
            >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
        </div>
    )
}
