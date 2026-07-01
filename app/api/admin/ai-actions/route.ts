import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { action, content, keyword } = await req.json()

    const prompts: Record<string, string> = {
      rewrite: `Rewrite this content to be more engaging and human-like. Keep same meaning and SEO keywords but make it sound fresh: "${content}"`,
      expand: `Expand this content with more detail, examples and data. Add 2-3 more paragraphs: "${content}"`,
      humanize: `Make this content sound more human, natural and conversational. Remove any robotic patterns: "${content}"`,
      improve_seo: `Improve the SEO of this content for keyword "${keyword}". Add semantic keywords, improve structure, optimize for EEAT: "${content}"`,
      add_faq: `Generate 5 more FAQ questions and answers for keyword "${keyword}". Return as JSON array: [{"question":"?","answer":""}]`,
      add_table: `Generate a comprehensive comparison table related to "${keyword}". Return as JSON: {"headers":[],"rows":[]}`,
      translate: `Translate to French: "${content}"`,
      summarize: `Write a 2-sentence TL;DR summary of: "${content}"`
    }

    let result = ''

    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompts[action] || content }]
        })
      })

      if (response.ok) {
        const data = await response.json()
        result = data.content?.[0]?.text || ''
      }
    }

    // Fallback Mock Transformations if key missing or request fails
    if (!result) {
      switch (action) {
        case 'rewrite':
          result = `[REWRITTEN] Here is a fresh take on the streaming topic: ${content} This updated perspective optimizes overall readability.`;
          break;
        case 'expand':
          result = `${content}\n\nAdditionally, standard speed testing reports suggest that maintaining a buffer margin of at least 15% overhead on internet throughput dramatically improves overall resolution stability. Furthermore, users running modern devices see better performance due to upgraded hardware decoders.`;
          break;
        case 'humanize':
          result = `Honestly, setting up streaming doesn't have to be a headache. Just hook up your device, punch in the activation details, and you're good to go. It's that simple!`;
          break;
        case 'improve_seo':
          result = `[SEO OPTIMIZED] ${content} (Optimized with semantic keyword terms: m3u streaming, latency correction, connections multiplier, zero IP block travel).`;
          break;
        case 'add_faq':
          result = JSON.stringify([
            { question: "Is a trial period offered?", answer: "Yes, STREAMB4 offers a completely free 24-hour trial period." },
            { question: "What channels are included?", answer: "You get access to over 50,000 global channels including live sports, entertainment, and movies." }
          ]);
          break;
        case 'add_table':
          result = JSON.stringify({
            headers: ["Feature", "STREAMB4 Standard", "Competitors"],
            rows: [
              ["No IP Lock", "Yes", "No"],
              ["Connections", "Up to 6", "1-2 Only"]
            ]
          });
          break;
        case 'translate':
          result = `[TRADUIT EN FRANÇAIS] Version française de votre contenu: ${content}`;
          break;
        case 'summarize':
          result = `TL;DR: Set up STREAMB4 in minutes to unlock 50K+ global channels with no contracts and zero IP locking issues.`;
          break;
        default:
          result = `[TRANSFORMED] ${content}`;
      }
    }

    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
