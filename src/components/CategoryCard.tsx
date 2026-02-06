import Link from 'next/link'

interface Category {
    id: string
    name: string
    slug: string
    icon: string
    _count?: {
        products: number
    }
}

interface CategoryCardProps {
    category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/category/${category.slug}`}>
            <div className="category-card">
                <span className="icon">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
                {category._count && (
                    <span className="text-xs text-gray-500">
                        {category._count.products} deals
                    </span>
                )}
            </div>
        </Link>
    )
}

interface CategoryGridProps {
    categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
    return (
        <div className="category-grid">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ))}
        </div>
    )
}

export default CategoryCard
