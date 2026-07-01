import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { title, category } = await req.json()

    const response = await fetch(
      'https://openrouter.ai/api/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://streamb4.com',
          'X-Title': 'STREAMB4'
        },
        body: JSON.stringify({
          model: 'black-forest-labs/flux-schnell',
          prompt: `${title}, ${category}, dark premium streaming background, orange neon glow, cinematic, professional, 4K quality, no text, no logos`,
          n: 1,
          size: '1280x720'
        })
      }
    )

    const data = await response.json()
    const imageUrl = data.data?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image generated' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ url: imageUrl })

  } catch (error) {
    return NextResponse.json(
      { error: 'Generation failed' }, 
      { status: 500 }
    )
  }
}
