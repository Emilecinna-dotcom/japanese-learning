import { useCallback, useRef, useState } from 'react'

let _audioEl: HTMLAudioElement | null = null

function getAudioEl(): HTMLAudioElement {
  if (!_audioEl) {
    _audioEl = document.createElement('audio')
    _audioEl.setAttribute('playsinline', '')
    _audioEl.setAttribute('preload', 'none')
    document.body.appendChild(_audioEl)
  }
  return _audioEl
}

function speakFallback(text: string, onStart: () => void, onEnd: () => void) {
  if (!('speechSynthesis' in window)) { onEnd(); return }
  if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.85
  u.volume = 1
  const voices = window.speechSynthesis.getVoices()
  const jp =
    voices.find(v => v.lang === 'ja-JP' && v.localService) ??
    voices.find(v => v.lang === 'ja-JP') ??
    voices.find(v => v.lang.startsWith('ja'))
  if (jp) u.voice = jp
  u.onstart = onStart
  u.onend = onEnd
  u.onerror = onEnd
  window.speechSynthesis.speak(u)
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const abortRef = useRef(false)

  const speak = useCallback((text: string) => {
    setAudioError(false)
    abortRef.current = false

    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    const audio = getAudioEl()
    audio.pause()
    audio.onplay = null
    audio.onended = null
    audio.onerror = null

    // Google TTS en premier — meilleure qualité pour le japonais
    audio.src = `/api/tts?text=${encodeURIComponent(text)}`
    audio.load()

    audio.onplay  = () => { if (!abortRef.current) setSpeaking(true) }
    audio.onended = () => setSpeaking(false)
    audio.onerror = () => {
      // Fallback : voix système du navigateur
      setSpeaking(false)
      setAudioError(true)
      speakFallback(text, () => setSpeaking(true), () => setSpeaking(false))
    }

    audio.play().catch(() => {
      // play() bloqué (iOS sans geste, politique autoplay) → voix système
      setSpeaking(false)
      speakFallback(text, () => setSpeaking(true), () => setSpeaking(false))
    })
  }, [])

  const stop = useCallback(() => {
    abortRef.current = true
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (_audioEl) { _audioEl.pause(); _audioEl.currentTime = 0 }
    setSpeaking(false)
  }, [])

  return { speak, stop, speaking, audioError }
}
