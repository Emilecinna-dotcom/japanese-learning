export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get('text') ?? ''

  if (!text || text.length > 300) {
    return new Response('Invalid text', { status: 400 })
  }

  const url =
    `https://translate.google.com/translate_tts` +
    `?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ja&client=tw-ob&ttsspeed=0.9`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        Referer: 'https://translate.google.com/',
        Accept: 'audio/mpeg, audio/*',
      },
    })

    if (!res.ok) {
      return new Response(`TTS upstream error: ${res.status}`, { status: 502 })
    }

    return new Response(res.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new Response('TTS unavailable', { status: 502 })
  }
}
