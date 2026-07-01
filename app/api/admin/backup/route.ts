import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const files = await fs.readdir(dataDir)
    
    const backup: Record<string, any> = {}
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(
          path.join(dataDir, file), 'utf-8'
        )
        backup[file.replace('.json','')] = JSON.parse(content)
      }
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
    return NextResponse.json({error:'Backup failed'}, {status:500})
  }
}
