'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center my-8">
      {['All', ...categories].map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.toLowerCase()
        const href = cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`

        return (
          <Link
            key={cat}
            href={href}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
              isActive ? 'text-black' : 'text-gray-400 hover:text-white'
            }`}
            style={
              isActive
                ? {
                    background: 'linear-gradient(135deg, #ff7a00, #ffb300)',
                    boxShadow: '0 0 20px rgba(255,122,0,0.3)',
                  }
                : {
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }
            }
          >
            {cat}
          </Link>
        )
      })}
    </div>
  )
}
