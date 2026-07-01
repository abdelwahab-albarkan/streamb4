'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function PerformancePage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.4}}>
        <h1 className="font-['Anton'] text-4xl 
          text-white uppercase mb-2">
          Performance
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor your application performance and Lighthouse speed index scores here.
        </p>
      </motion.div>
      
      {/* Page content */}
      <div className="p-6 rounded-[20px]"
        style={{
          background:'rgba(15,15,15,0.95)',
          border:'1px solid rgba(255,255,255,0.06)'
        }}>
        <p className="text-gray-400 text-sm">Performance tracking dashboard is loading...</p>
      </div>
    </div>
  )
}
