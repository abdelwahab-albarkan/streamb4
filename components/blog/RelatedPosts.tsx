'use client'

import { PostCard } from './PostCard'

interface RelatedPostsProps {
  posts: any[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="mt-16">
      <h3 className="font-anton text-2xl text-white uppercase tracking-wider mb-8"
        style={{ fontFamily: 'var(--font-anton), Anton, sans-serif' }}>
        Related Articles
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  )
}
export default RelatedPosts
