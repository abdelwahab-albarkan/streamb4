'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled';
  featuredImage?: string;
  seoScore?: number;
  views?: number;
  createdAt?: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data.posts) ? data.posts : Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = posts.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter
    const matchSearch = p.title?.toLowerCase()
      .includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Anton'] text-4xl 
            text-white uppercase">BLOG POSTS</h1>
          <p className="text-gray-500 text-sm mt-1">
            {posts.length} total posts
          </p>
        </div>
        <Link href="/admin/posts/new">
          <motion.button
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            className="flex items-center gap-2 px-6 py-3
              rounded-xl font-black text-black text-sm uppercase cursor-pointer"
            style={{
              background:'linear-gradient(135deg,#ff7a00,#ffb300)',
              boxShadow:'0 0 20px rgba(255,122,0,0.3)'
            }}>
            ✏️ New Post
          </motion.button>
        </Link>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 px-4 py-2.5 rounded-xl
            text-white text-sm outline-none placeholder-gray-600"
          style={{
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)'
          }}/>

        {['all','published','draft','scheduled'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs 
              font-bold uppercase transition-all duration-200 cursor-pointer
              ${filter===f ? 'text-black' : 'text-gray-600'}`}
            style={filter===f ? {
              background:'linear-gradient(135deg,#ff7a00,#ffb300)'
            } : {
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.06)'
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="rounded-[20px] overflow-hidden"
        style={{
          background:'rgba(15,15,15,0.95)',
          border:'1px solid rgba(255,255,255,0.06)'
        }}>

        {loading ? (
          /* Skeleton loading */
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-12 rounded-xl animate-pulse"
                style={{background:'rgba(255,255,255,0.04)'}}/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-white font-bold text-lg mb-2">
              No posts found
            </p>
            <p className="text-gray-600 text-sm mb-6">
              {search ? 'Try a different search' : 'Create your first post'}
            </p>
            <Link href="/admin/posts/new">
              <button className="px-6 py-3 rounded-xl
                font-black text-black text-sm uppercase cursor-pointer"
                style={{
                  background:'linear-gradient(135deg,#ff7a00,#ffb300)'
                }}>
                Create Post
              </button>
            </Link>
          </div>
        ) : (
          <div className="p-4 md:p-0">
            {/* Desktop table */}
            <table className="hidden md:table w-full">
              <thead>
                <tr style={{
                  borderBottom:'1px solid rgba(255,255,255,0.04)'
                }}>
                  {['Title','Status','SEO','Views','Date','Actions']
                    .map(h => (
                    <th key={h} className="px-6 py-4 text-left
                      text-gray-600 text-xs font-bold 
                      uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, i) => (
                  <motion.tr
                    key={post.id}
                    initial={{opacity:0, y:10}}
                    animate={{opacity:1, y:0}}
                    transition={{delay:i*0.04}}
                    className="group border-b hover:bg-white/[0.02]
                      transition-colors duration-150"
                    style={{
                      borderColor:'rgba(255,255,255,0.03)'
                    }}>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          <img src={post.featuredImage}
                            alt=""
                            className="w-10 h-10 rounded-lg 
                              object-cover flex-shrink-0"/>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm
                            truncate max-w-[220px] group-hover:text-orange-100
                            transition-colors">
                            {post.title || 'Untitled'}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5 truncate">
                            /{post.slug || 'no-slug'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full
                        text-[11px] font-black uppercase tracking-wider"
                        style={post.status === 'published' ? {
                          background:'rgba(34,197,94,0.1)',
                          color:'#22c55e',
                          border:'1px solid rgba(34,197,94,0.2)'
                        } : post.status === 'scheduled' ? {
                          background:'rgba(59,130,246,0.1)',
                          color:'#3b82f6',
                          border:'1px solid rgba(59,130,246,0.2)'
                        } : {
                          background:'rgba(255,179,0,0.1)',
                          color:'#ffb300',
                          border:'1px solid rgba(255,179,0,0.2)'
                        }}>
                        {post.status || 'draft'}
                      </span>
                    </td>

                    {/* SEO Score */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full
                          bg-white/[0.06]">
                          <div className="h-full rounded-full"
                            style={{
                              width:`${post.seoScore || 0}%`,
                              background: (post.seoScore||0) >= 80 
                                ? '#22c55e'
                                : (post.seoScore||0) >= 50 
                                  ? '#ffb300'
                                  : '#ef4444'
                            }}/>
                        </div>
                        <span className="text-xs"
                          style={{
                            color: (post.seoScore||0) >= 80
                              ? '#22c55e'
                              : (post.seoScore||0) >= 50
                                ? '#ffb300'
                                : '#ef4444'
                          }}>
                          {post.seoScore || 0}
                        </span>
                      </div>
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {(post.views || 0).toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {post.createdAt 
                        ? new Date(post.createdAt)
                            .toLocaleDateString('en-US', {
                              month:'short', day:'numeric', year:'numeric'
                            })
                        : 'No date'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-3 opacity-0 
                        group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/posts/${post.id}`}>
                          <button className="text-gray-500 
                            hover:text-orange-400 transition-colors 
                            text-xs font-medium cursor-pointer">
                            Edit
                          </button>
                        </Link>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <button className="text-gray-500 
                            hover:text-blue-400 transition-colors 
                            text-xs font-medium cursor-pointer">
                            View
                          </button>
                        </Link>
                        <button
                          onClick={async () => {
                            if (confirm('Delete this post?')) {
                              await fetch(`/api/admin/posts/${post.id}`, 
                                {method:'DELETE'})
                              setPosts(prev => 
                                prev.filter(p => p.id !== post.id))
                            }
                          }}
                          className="text-gray-500 hover:text-red-400
                            transition-colors text-xs font-medium cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map(post => (
                <div key={post.id} className="p-4 rounded-[16px]"
                  style={{background:'rgba(15,15,15,0.95)',
                    border:'1px solid rgba(255,255,255,0.06)'}}>
                  <p className="text-white font-bold text-sm mb-1 truncate">
                    {post.title || 'Untitled'}
                  </p>
                  <p className="text-gray-600 text-xs mb-3">/{post.slug || 'no-slug'}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase"
                      style={post.status==='published'?{
                        background:'rgba(34,197,94,0.1)',color:'#22c55e'
                      }:{
                        background:'rgba(255,179,0,0.1)',color:'#ffb300'
                      }}>
                      {post.status || 'draft'}
                    </span>
                    <div className="flex gap-3 items-center">
                      <Link href={`/admin/posts/${post.id}`}>
                        <span className="text-orange-500 text-xs font-bold">Edit</span>
                      </Link>
                      <span className="text-gray-600 text-xs">
                        SEO: {post.seoScore||0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between
          text-gray-600 text-xs px-2">
          <span>Showing {filtered.length} of {posts.length} posts</span>
          <div className="flex gap-4">
            <span className="text-green-500">
              ✓ {posts.filter(p=>p.status==='published').length} published
            </span>
            <span className="text-yellow-500">
              ● {posts.filter(p=>p.status==='draft').length} drafts
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
