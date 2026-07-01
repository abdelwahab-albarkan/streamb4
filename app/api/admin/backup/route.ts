import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { User } from '@/lib/models/User'
import { Comment } from '@/lib/models/Comment'
import { Player } from '@/lib/models/Player'
import { Subscriber } from '@/lib/models/Subscriber'
import { Setting } from '@/lib/models/Setting'
import { PublishLog } from '@/lib/models/PublishLog'
import { PublishQueue } from '@/lib/models/PublishQueue'
import { PublishVersion } from '@/lib/models/PublishVersion'
import { PublishAnalytics } from '@/lib/models/PublishAnalytics'

export async function GET() {
  try {
    await connectDB()

    const [posts, users, comments, players, subscribers, settings, publishLogs, publishQueue, publishVersions, publishAnalytics] = await Promise.all([
      Post.find({}).lean(),
      User.find({}).lean(),
      Comment.find({}).lean(),
      Player.find({}).lean(),
      Subscriber.find({}).lean(),
      Setting.find({}).lean(),
      PublishLog.find({}).lean(),
      PublishQueue.find({}).lean(),
      PublishVersion.find({}).lean(),
      PublishAnalytics.find({}).lean(),
    ])

    const settingsObj: Record<string, any> = {}
    for (const s of settings) {
      settingsObj[s.key] = s.value
    }

    const backup = {
      posts,
      users,
      comments,
      players,
      subscribers,
      settings: settingsObj,
      'publish-logs': publishLogs,
      'publish-queue': publishQueue,
      'publish-versions': publishVersions,
      'publish-analytics': publishAnalytics,
    }

    const timestamp = new Date().toISOString().split('T')[0]

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition':
          `attachment; filename="streamb4-backup-${timestamp}.json"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 })
  }
}
