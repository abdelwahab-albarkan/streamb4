import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json()
    if (!keyword || !keyword.trim()) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    const volume = Math.floor(Math.random() * 20000) + 1200
    const difficultyScore = Math.floor(Math.random() * 45) + 30
    let difficultyLabel = 'Medium'
    if (difficultyScore < 40) difficultyLabel = 'Easy'
    else if (difficultyScore > 70) difficultyLabel = 'Hard'

    const analysis = {
      keyword,
      searchVolume: volume.toLocaleString(),
      difficulty: difficultyLabel,
      difficultyScore,
      cpc: (Math.random() * 3 + 0.5).toFixed(2),
      competition: Math.random() > 0.4 ? 'Medium' : 'Low',
      lsiKeywords: [
        'streaming receiver setup',
        'm3u playlist configure',
        'iptv service subscription',
        'smart tv media app'
      ],
      userIntent: 'Informational',
      questions: [
        `How to setup ${keyword}?`,
        `What is the cost of ${keyword}?`,
        `Is ${keyword} compatible with Firestick?`
      ],
      topCompetitors: [
        { domain: 'streamingadvisor.com', rank: 1, strength: 'High' },
        { domain: 'firesticktricks.com', rank: 2, strength: 'High' },
        { domain: 'iptvinsider.com', rank: 3, strength: 'Medium' }
      ]
    }

    return NextResponse.json(analysis)
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
