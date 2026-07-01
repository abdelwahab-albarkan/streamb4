export async function generateImageWithAI(
  title: string,
  category: string
): Promise<string> {
  
  const prompt = `${title}, ${category}, premium streaming technology, dark cinematic background, orange glow accents, professional photography, 4K ultra HD quality, modern tech aesthetic, no text, no watermark, no people`

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://streamb4.com',
          'X-Title': 'STREAMB4 Blog'
        },
        body: JSON.stringify({
          model: 'black-forest-labs/flux-schnell',
          prompt: prompt,
          n: 1,
          size: '1280x720',
        })
      }
    )

    const data = await response.json()
    return data.data?.[0]?.url || ''
    
  } catch (error) {
    console.error('Image generation error:', error)
    // Fallback to Unsplash
    return `https://images.unsplash.com/photo-1593359677879?w=1280&q=80`
  }
}
