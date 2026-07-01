/**
 * Migration script: Import all data/*.json files into MongoDB Atlas.
 *
 * Usage:
 *   npm run migrate
 *
 * The MONGODB_URI is read automatically from .env.local via tsx's dotenv support.
 * To override: MONGODB_URI="mongodb+srv://..." npm run migrate
 *
 * Run once after deploying. Safe to re-run (uses upsert).
 */

import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'

// Load .env.local automatically (tsx does not load it by default)
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (key && !(key in process.env)) process.env[key] = value
  }
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI required')

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')

  const dataDir = path.join(process.cwd(), 'data')

  // Helper
  function readJson(file: string) {
    const p = path.join(dataDir, file)
    if (!fs.existsSync(p)) return []
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  }
  function readJsonObj(file: string) {
    const p = path.join(dataDir, file)
    if (!fs.existsSync(p)) return {}
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  }

  const db = mongoose.connection.db!

  // Posts
  const posts = readJson('posts.json')
  if (posts.length) {
    await db.collection('posts').deleteMany({})
    await db.collection('posts').insertMany(posts)
    console.log(`✓ Migrated ${posts.length} posts`)
  }

  // Users
  const users = readJson('users.json')
  if (users.length) {
    await db.collection('users').deleteMany({})
    await db.collection('users').insertMany(users)
    console.log(`✓ Migrated ${users.length} users`)
  }

  // Comments
  const comments = readJson('comments.json')
  if (comments.length) {
    await db.collection('comments').deleteMany({})
    await db.collection('comments').insertMany(comments)
    console.log(`✓ Migrated ${comments.length} comments`)
  }

  // Players
  const players = readJson('players.json')
  if (players.length) {
    await db.collection('players').deleteMany({})
    await db.collection('players').insertMany(players)
    console.log(`✓ Migrated ${players.length} players`)
  }

  // Subscribers
  const subscribers = readJson('subscribers.json')
  if (subscribers.length) {
    await db.collection('subscribers').deleteMany({})
    await db.collection('subscribers').insertMany(subscribers)
    console.log(`✓ Migrated ${subscribers.length} subscribers`)
  }

  // Settings (object → array of {key, value})
  const settings = readJsonObj('settings.json')
  const settingDocs = Object.entries(settings).map(([key, value]) => ({ key, value }))
  if (settingDocs.length) {
    await db.collection('settings').deleteMany({})
    await db.collection('settings').insertMany(settingDocs)
    console.log(`✓ Migrated ${settingDocs.length} settings`)
  }

  // Publish logs
  const publishLogs = readJson('publish-logs.json')
  if (publishLogs.length) {
    await db.collection('publishlogs').deleteMany({})
    await db.collection('publishlogs').insertMany(publishLogs)
    console.log(`✓ Migrated ${publishLogs.length} publish logs`)
  }

  // Publish queue
  const queue = readJson('publish-queue.json')
  if (queue.length) {
    await db.collection('publishqueues').deleteMany({})
    await db.collection('publishqueues').insertMany(queue)
    console.log(`✓ Migrated ${queue.length} queue items`)
  }

  // Publish versions
  const versions = readJson('publish-versions.json')
  if (versions.length) {
    await db.collection('publishversions').deleteMany({})
    await db.collection('publishversions').insertMany(versions)
    console.log(`✓ Migrated ${versions.length} versions`)
  }

  // Publish analytics
  const analytics = readJsonObj('publish-analytics.json')
  const byDate = analytics.byDate || {}
  const analyticsDocs = Object.entries(byDate).map(([date, d]: [string, any]) => ({ date, ...d }))
  if (analyticsDocs.length) {
    await db.collection('publishanalytics').deleteMany({})
    await db.collection('publishanalytics').insertMany(analyticsDocs)
    console.log(`✓ Migrated ${analyticsDocs.length} analytics days`)
  }

  await mongoose.disconnect()
  console.log('\n✅ Migration complete!')
}

main().catch(e => { console.error(e); process.exit(1) })
