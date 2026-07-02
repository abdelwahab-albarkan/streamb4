'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryImage } from '@/lib/blogImages'

interface PostCardProps {
  post: any
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const imageUrl = post.featuredImage || getCategoryImage(post.category)

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
        className="group rounded-[24px] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative"
        style={{
          background: 'rgba(12, 12, 12, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 122, 0, 0.3)'
          e.currentTarget.style.boxShadow =
            '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 122, 0, 0.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
          e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.04)'
        }}
      >
        {/* Glow behind on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,122,0,0.06),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image wrapper */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            unoptimized={imageUrl.startsWith('http')}
          />
          {/* Top overlays */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-black text-black uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #ff7a00, #ffb300)',
              }}
            >
              {post.category || 'Guide'}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider"
              style={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {post.readingTime || 3} MIN
            </span>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 flex flex-col flex-1 relative z-10">
          <h3 className="text-white font-black text-lg leading-snug mb-3 line-clamp-2 group-hover:text-orange-300 transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
            {post.excerpt || 'Read this complete guide to learn more.'}
          </p>

          {/* Card Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-black"
                style={{
                  background: 'linear-gradient(135deg, #ff7a00, #ffb300)',
                }}
              >
                {(post.author || 'A')[0].toUpperCase()}
              </div>
              <span className="text-gray-400 text-xs font-semibold">{post.author || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              <span className="font-medium">{(post.views || 0).toLocaleString()} views</span>
              <span>·</span>
              <span className="text-orange-500 font-bold group-hover:text-orange-400 transition-colors">
                Read →
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
