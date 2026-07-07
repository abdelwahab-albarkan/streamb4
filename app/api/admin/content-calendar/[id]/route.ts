import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Setting }   from '@/lib/models/Setting'
import type { CalendarTopic } from '@/lib/types/content-calendar'

/**
 * PUT /api/admin/content-calendar/:id
 * Update the status (or any field) of a single topic in the cached calendar data.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id }      = await params
    const body        = await req.json() as Partial<CalendarTopic>

    await connectDB()

    const setting = await Setting.findOne({ key: 'content-calendar-data' })
    if (!setting) {
      return NextResponse.json({ success: false, error: 'No calendar data found' }, { status: 404 })
    }

    const topics: CalendarTopic[] = JSON.parse(String(setting.value))
    const idx = topics.findIndex(t => t._id === id)
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 })
    }

    topics[idx] = { ...topics[idx], ...body, _id: id }
    await Setting.findOneAndUpdate({ key: 'content-calendar-data' }, { value: JSON.stringify(topics) })

    return NextResponse.json({ success: true, topic: topics[idx] })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
