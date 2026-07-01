import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'publish-analytics.json')

function readAnalytics(): any {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) return {}
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8') || '{}')
  } catch { return {} }
}

export async function GET() {
  try {
    const data = readAnalytics()
    const byDate: Record<string, any> = data.byDate || {}
    const today = new Date().toISOString().slice(0, 10)

    const todayData = byDate[today] || { total: 0, success: 0, failed: 0, website: 0, blogger: 0, devto: 0, totalDuration: 0 }

    // Last 7 days
    const last7: { date: string; total: number; success: number; failed: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const dayData = byDate[key] || { total: 0, success: 0, failed: 0 }
      last7.push({ date: key, total: dayData.total || 0, success: dayData.success || 0, failed: dayData.failed || 0 })
    }

    // Totals across all days
    let totalPublications = 0
    let totalSuccess = 0
    let totalFailed = 0
    let totalWebsite = 0
    let totalBlogger = 0
    let totalDevto = 0
    let totalDuration = 0
    let publishCount = 0

    for (const day of Object.values(byDate)) {
      const d = day as any
      totalPublications += d.total || 0
      totalSuccess += d.success || 0
      totalFailed += d.failed || 0
      totalWebsite += d.website || 0
      totalBlogger += d.blogger || 0
      totalDevto += d.devto || 0
      totalDuration += d.totalDuration || 0
      publishCount += d.total || 0
    }

    const avgDuration = publishCount > 0 ? Math.round(totalDuration / publishCount) : 0
    const successRate = totalPublications > 0 ? Math.round((totalSuccess / totalPublications) * 100) : 0

    return NextResponse.json({
      total: data.total || totalPublications,
      today: todayData.total || 0,
      todaySuccess: todayData.success || 0,
      todayFailed: todayData.failed || 0,
      successRate,
      avgDurationMs: avgDuration,
      byPlatform: { website: totalWebsite, blogger: totalBlogger, devto: totalDevto },
      last7,
      failed: totalFailed,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
