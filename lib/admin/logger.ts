import { connectDB } from '@/lib/mongodb'
import { PublishLog } from '@/lib/models/PublishLog'

export async function addAdminLog(entry: { platform?: string; status: string; article?: string; message: string; url?: string }) {
  try {
    await connectDB()
    await PublishLog.create({
      timestamp: new Date().toISOString(),
      platform: entry.platform || 'system',
      status: entry.status,
      article: entry.article || '',
      message: entry.message,
      url: entry.url || '',
    })
    // Keep only latest 500
    const count = await PublishLog.countDocuments()
    if (count > 500) {
      const oldest = await PublishLog.find({}).sort({ timestamp: 1 }).limit(count - 500).select('_id')
      await PublishLog.deleteMany({ _id: { $in: oldest.map((d: any) => d._id) } })
    }
  } catch (e) {
    console.error('Logger error:', e)
  }
}

// Legacy export for backward compatibility
export async function logAction(action: string, user: string, details: string, _ip: string = '127.0.0.1') {
  await addAdminLog({ status: 'info', message: `[${action}] user=${user} ${details}` })
}
