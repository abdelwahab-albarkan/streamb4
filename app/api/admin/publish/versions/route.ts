import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const VERSIONS_FILE = path.join(process.cwd(), 'data', 'publish-versions.json')

function readVersions(): any[] {
  try {
    if (!fs.existsSync(VERSIONS_FILE)) { fs.writeFileSync(VERSIONS_FILE, '[]', 'utf8'); return [] }
    return JSON.parse(fs.readFileSync(VERSIONS_FILE, 'utf8') || '[]')
  } catch { return [] }
}

function writeVersions(versions: any[]): void {
  try {
    fs.mkdirSync(path.dirname(VERSIONS_FILE), { recursive: true })
    fs.writeFileSync(VERSIONS_FILE, JSON.stringify(versions, null, 2), 'utf8')
  } catch {}
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    let versions = readVersions()
    if (slug) versions = versions.filter((v: any) => v.articleSlug === slug)
    return NextResponse.json({ versions })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const versions = readVersions().filter((v: any) => v.id !== id)
    writeVersions(versions)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
