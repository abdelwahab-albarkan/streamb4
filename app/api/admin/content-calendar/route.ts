import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { connectDB }  from '@/lib/mongodb'
import { Setting }    from '@/lib/models/Setting'
import type { CalendarTopic, CalendarMeta } from '@/lib/types/content-calendar'

export const runtime = 'nodejs'

// ─── Column header aliases ────────────────────────────────────────────────────

function get(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k]
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
  }
  return ''
}

function mapRow(row: Record<string, unknown>, idx: number): CalendarTopic {
  return {
    _id:               `topic-${idx}`,
    month:             get(row, 'Month',              'month'),
    week:              get(row, 'Week',               'week'),
    priority:          get(row, 'Priority',           'priority'),
    category:          get(row, 'Category',           'category'),
    cluster:           get(row, 'Cluster',            'cluster'),
    topic:             get(row, 'Topic',              'topic'),
    blogTitle:         get(row, 'Blog Title',         'BlogTitle',         'blog title',  'Title',  'title'),
    slug:              get(row, 'Slug',               'slug'),
    primaryKeyword:    get(row, 'Primary Keyword',    'PrimaryKeyword',    'primary keyword',   'Primary'),
    secondaryKeywords: get(row, 'Secondary Keywords', 'SecondaryKeywords', 'secondary keywords'),
    searchIntent:      get(row, 'Search Intent',      'SearchIntent',      'search intent',     'Intent'),
    country:           get(row, 'Country',            'country'),
    difficulty:        get(row, 'Difficulty',         'difficulty'),
    wordCount:         Number(get(row, 'Word Count',  'WordCount',         'word count',  'Words', 'words')) || 3500,
    tags:              get(row, 'Tags',               'tags'),
    notes:             get(row, 'Notes',              'notes'),
    status:            get(row, 'Status',             'status') || 'Pending',
  }
}

// ─── GET — return cached topics ───────────────────────────────────────────────

export async function GET() {
  try {
    await connectDB()

    const [dataSetting, metaSetting] = await Promise.all([
      Setting.findOne({ key: 'content-calendar-data' }).lean(),
      Setting.findOne({ key: 'content-calendar-meta' }).lean(),
    ])

    const topics: CalendarTopic[] = dataSetting?.value
      ? JSON.parse(String(dataSetting.value))
      : []

    const metadata: CalendarMeta | null = metaSetting?.value
      ? JSON.parse(String(metaSetting.value))
      : null

    return NextResponse.json({ success: true, topics, metadata })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

// ─── POST — upload Excel → parse → cache in MongoDB ──────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv',
    ]
    // Relaxed check — some browsers send generic MIME for xlsx
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(file.type) && !['xlsx','xls','csv'].includes(ext ?? '')) {
      return NextResponse.json({ success: false, error: 'File must be .xlsx, .xls or .csv' }, { status: 400 })
    }

    const buffer   = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true, raw: false })
    const sheet    = workbook.Sheets[workbook.SheetNames[0]]
    const rows     = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

    const topics: CalendarTopic[] = rows
      .filter(row => Object.values(row).some(v => String(v ?? '').trim() !== ''))
      .map((row, i) => mapRow(row, i))
      .filter(t => (t.blogTitle || t.topic).trim() !== '')

    const metadata: CalendarMeta = {
      fileName:   file.name,
      uploadedAt: new Date().toISOString(),
      count:      topics.length,
    }

    await connectDB()

    await Promise.all([
      Setting.findOneAndUpdate(
        { key: 'content-calendar-data' },
        { value: JSON.stringify(topics) },
        { upsert: true },
      ),
      Setting.findOneAndUpdate(
        { key: 'content-calendar-meta' },
        { value: JSON.stringify(metadata) },
        { upsert: true },
      ),
    ])

    return NextResponse.json({ success: true, count: topics.length, topics, metadata })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

// ─── DELETE — clear cached data ───────────────────────────────────────────────

export async function DELETE() {
  try {
    await connectDB()
    await Promise.all([
      Setting.findOneAndDelete({ key: 'content-calendar-data' }),
      Setting.findOneAndDelete({ key: 'content-calendar-meta' }),
    ])
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
