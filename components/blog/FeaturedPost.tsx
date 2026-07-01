'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryImage } from '@/lib/blogImages'

interface FeaturedPostProps {
  post: any
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  if (!post) return null
  const imageUrl = post.featuredImage || getCategoryImage(post.category)

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="group relative rounded-[32px] overflow-hidden cursor-pointer border border-white/[0.06] bg-white/[0.01]"
        style={{
          boxShadow: '0 0 60px rgba(255,122,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 122, 0, 0.3)'
          e.currentTarget.style.boxShadow =
            '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 122, 0, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
          e.currentTarget.style.boxShadow = '0 0 60px rgba(255,122,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)'
        }}
      >
        {/* Background image & gradient overlay */}
        <div className="relative aspect-[21/9] sm:aspect-[16/7] overflow-hidden w-full h-full">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
            unoptimized={imageUrl.startsWith('http')}
          />
          {/* Rich double overlay gradients */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent"
            style={{ mixBlendMode: 'normal' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
        </div>

        {/* Content layout */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 py-8 max-w-2xl z-10">
          {/* Eyebrow / categories */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-black text-black uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #ff7a00, #ffb300)',
              }}
            >
              ⭐ FEATURED
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-wider"
              style={{
                background: 'rgba(255, 122, 0, 0.08)',
                border: '1px solid rgba(255, 122, 0, 0.15)',
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-anton uppercase text-white leading-[1.05] mb-4 group-hover:text-orange-100 transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-anton), Anton, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-lg line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta specs */}
          <div className="flex items-center gap-4 text-gray-500 text-xs sm:text-sm">
            <span className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-black flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #ff7a00, #ffb300)',
                }}
              >
                {(post.author || 'A')[0].toUpperCase()}
              </div>
              <span className="text-gray-300 font-semibold">{post.author || 'Admin'}</span>
            </span>
            <span>·</span>
            <span className="font-semibold">{post.readingTime || 3} MIN READ</span>
            <span>·</span>
            <span className="font-semibold">{(post.views || 0).toLocaleString()} VIEWS</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline font-semibold">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'RECENT'}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
