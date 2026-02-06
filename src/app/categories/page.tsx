import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Grid3X3 } from 'lucide-react'

async function getCategories() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
    })

    return categories
}

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="min-h-screen p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Grid3X3 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500">Browse deals by category</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-emerald-400 hover:shadow-xl transition-all group text-center"
                    >
                        <div className="text-5xl mb-4">{category.icon || '📦'}</div>
                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {category.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {category._count.products} {category._count.products === 1 ? 'product' : 'products'}
                        </p>
                    </Link>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Grid3X3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No categories found</p>
                </div>
            )}
        </div>
    )
}
