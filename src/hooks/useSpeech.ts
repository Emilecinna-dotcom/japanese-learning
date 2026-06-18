import { useCallback, useRef, useState } from 'react'

// Élément <audio> persistant dans le DOM — iOS le traite comme "media playback"
// et ne le coupe PAS avec le commutateur silencieux (contrairement à AudioContext)
let _audioEl: HTMLAudioElement | null = null

function getAudioEl(): HTMLAudioElement {
  if (!_audioEl) {
    _audioEl = document.createElement('audio')
    _audioEl.setAttribute('playsinline', '')   // iOS: ne pas passer en plein écran
    _audioEl.setAttribute('preload', 'none')
    document.body.appendChild(_audioEl)
  }
  return _audioEl
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const utRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback((text: string) => {
    setAudioError(false)

    // ── Pré-charger le son IMMÉDIATEMENT depuis le geste (requis par iOS)
    // Si speechSynthesis échoue, on pourra play() sans nouveau geste
    const audio = getAudioEl()
    if (audio.src !== '') {
      audio.pause()
    }
    audio.src = `/api/tts?text=${encodeURIComponent(text)}`
    audio.load() // déclenche le "user gesture unlock" sur iOS

    // ── 1. Web Speech API : synchrone, offline, sans réseau ─────────────────
    if ('speechSynthesis' in window) {
      // Annuler UNIQUEMENT si en train de parler (pas à vide — ça casse iOS)
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }

      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'ja-JP'
      u.rate = 0.85
      u.volume = 1

      // Voix synchro — peut être vide au 1er appel, iOS utilisera la voix par défaut
      const voices = window.speechSynthesis.getVoices()
      const jp =
        voices.find(v => v.lang === 'ja-JP' && v.localService) ??
        voices.find(v => v.lang === 'ja-JP') ??
        voices.find(v => v.lang.startsWith('ja'))
      if (jp) u.voice = jp

      u.onstart = () => setSpeaking(true)
      u.onend = () => { setSpeaking(false); utRef.current = null }
      u.onerror = (e) => {
        utRef.current = null
        if (e.error === 'interrupted') { setSpeaking(false); return }
        // speechSynthesis a échoué → fallback <audio>
        setSpeaking(false)
        audio.onplay = () => setSpeaking(true)
        audio.onended = () => setSpeaking(false)
        audio.onerror = () => { setSpeaking(false); setAudioError(true) }
        audio.play().catch(() => { setSpeaking(false); setAudioError(true) })
      }

      utRef.current = u
      setSpeaking(true)
      window.speechSynthesis.speak(u)
      return
    }

    // ── 2. <audio> element uniquement (si pas de speechSynthesis) ────────────
    audio.onplay = () => setSpeaking(true)
    audio.onended = () => setSpeaking(false)
    audio.onerror = () => { setSpeaking(false); setAudioError(true) }
    audio.play().catch(() => { setSpeaking(false); setAudioError(true) })
  }, [])

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (_audioEl) { _audioEl.pause(); _audioEl.currentTime = 0 }
    setSpeaking(false)
  }, [])

  return { speak, stop, speaking, audioError }
}
