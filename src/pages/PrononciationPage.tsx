import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Mic, MicOff, Check, X, ArrowLeft, RotateCcw, Volume2, AudioLines } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { ALL_THEMES } from '@/data/vocabulary'
import { PHRASES } from '@/data/phrases'
import { shuffle } from '@/lib/flashItems'
import { useProgressContext } from '@/hooks/useProgress'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition?: any
    webkitSpeechRecognition?: any
  }
}

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined
const SESSION_LEN = 8

interface Prompt { jp: string; kana: string; fr: string }
type Scope = 'vocab' | 'phrases'

function buildPool(scope: Scope): Prompt[] {
  if (scope === 'phrases') {
    return PHRASES
      .filter(p => !/[〜~]/.test(p.japanese))
      .map(p => ({ jp: p.japanese, kana: p.kana, fr: p.frenchTranslation }))
  }
  const out: Prompt[] = []
  ALL_THEMES.forEach(t => t.items.forEach(v => out.push({ jp: v.japanese, kana: v.kana, fr: v.frenchTranslation })))
  return out
}

const clean = (s: string) => s.replace(/[\s、。，．・！？!?「」『』（）()]/g, '')

function heardMatches(heard: string, target: Prompt): boolean {
  const h = clean(heard)
  if (!h) return false
  const jp = clean(target.jp)
  const kana = clean(target.kana)
  return [jp, kana].some(t => t && (h === t || h.includes(t) || t.includes(h)))
}

export function PrononciationPage() {
  const { recordProductionResult } = useProgressContext()
  const [scope, setScope] = useState<Scope>('vocab')
  const [questions, setQuestions] = useState<Prompt[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<'ok' | 'ko' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recRef = useRef<any>(null)

  const pool = useMemo(() => buildPool(scope), [scope])

  const start = () => {
    setQuestions(shuffle(pool).slice(0, SESSION_LEN))
    setIdx(0); setScore(0); setHeard(null); setVerdict(null); setError(null)
  }

  const stopRec = useCallback(() => {
    try { recRef.current?.stop() } catch { /* noop */ }
    setListening(false)
  }, [])

  const listen = useCallback((target: Prompt) => {
    if (!SR) return
    setError(null); setHeard(null); setVerdict(null)
    const rec = new SR()
    recRef.current = rec
    rec.lang = 'ja-JP'
    rec.interimResults = true
    rec.maxAlternatives = 3
    rec.continuous = false

    rec.onresult = (e: any) => {
      let interim = ''
      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) {
          // teste toutes les alternatives, garde la meilleure
          let best = res[0].transcript
          for (let a = 0; a < res.length; a++) {
            if (heardMatches(res[a].transcript, target)) { best = res[a].transcript; break }
          }
          finalText += best
        } else {
          interim += res[0].transcript
        }
      }
      setHeard(finalText || interim)
      if (finalText) {
        const ok = heardMatches(finalText, target)
        setVerdict(ok ? 'ok' : 'ko')
      }
    }
    rec.onerror = (e: any) => {
      setListening(false)
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setError('Micro refusé. Autorise l\'accès au micro dans ton navigateur.')
      else if (e.error === 'no-speech') setError('Je n\'ai rien entendu. Réessaie en parlant plus fort.')
      else setError('La reconnaissance a échoué. Réessaie.')
    }
    rec.onend = () => setListening(false)

    try { rec.start(); setListening(true) } catch { setListening(false) }
  }, [])

  useEffect(() => () => { try { recRef.current?.abort() } catch { /* noop */ } }, [])

  // ── Intro ───────────────────────────────────────────────────────
  if (!questions) {
    return (
      <div className="max-w-md mx-auto py-2 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-1">
            <Mic size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Prononciation <span className="font-jp text-2xl text-muted-foreground">発音</span></h1>
          <p className="text-muted-foreground text-sm">Lis à voix haute, le micro t'écoute et compare à la prononciation cible.</p>
        </div>

        {!SR && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
            Ton navigateur ne gère pas la reconnaissance vocale (essaie Chrome). Tu peux quand même t'entraîner : écoute le modèle et évalue-toi toi-même.
          </div>
        )}

        <div className="flex justify-center gap-2">
          {([['vocab', 'Vocabulaire'], ['phrases', 'Phrases']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setScope(k)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${scope === k ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70 text-foreground'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <button onClick={start} className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 active:scale-[0.99] transition-all">
          <Mic size={19} /> Commencer — {SESSION_LEN} mots
        </button>
      </div>
    )
  }

  // ── Résultats ───────────────────────────────────────────────────
  if (idx >= questions.length) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-md mx-auto py-6 space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto">
          <AudioLines size={34} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Terminé !</h2>
          <p className="text-muted-foreground mt-1">{score} / {questions.length} réussites · {pct}%</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button onClick={start} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            <RotateCcw size={16} /> Recommencer
          </button>
          <button onClick={() => setQuestions(null)} className="w-full py-3.5 rounded-xl bg-muted hover:bg-muted/70 text-foreground font-medium text-sm transition-colors">
            Retour
          </button>
        </div>
      </div>
    )
  }

  const q = questions[idx]
  const pct = (idx / questions.length) * 100

  const advance = (ok: boolean) => {
    recordProductionResult(ok)
    if (ok) setScore(s => s + 1)
    stopRec()
    setIdx(i => i + 1); setHeard(null); setVerdict(null); setError(null)
  }

  return (
    <div className="max-w-md mx-auto py-2 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => { stopRec(); setQuestions(null) }} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">{idx + 1} / {questions.length}</span>
        <span className="text-sm font-medium tabular-nums text-emerald-600">{score} ✓</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Prompt */}
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Dis à voix haute</p>
        <p className="font-jp text-4xl leading-tight">{q.jp}</p>
        {q.kana !== q.jp && <p className="font-jp text-base text-muted-foreground">{q.kana}</p>}
        <p className="text-sm text-foreground/70">{q.fr}</p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Écouter le modèle</span>
          <SpeakButton text={q.jp} size="sm" />
        </div>
      </div>

      {/* Zone micro / auto-évaluation */}
      {SR ? (
        <div className="space-y-3">
          <button
            onClick={() => (listening ? stopRec() : listen(q))}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-base transition-all ${
              listening ? 'bg-red-500 text-white animate-pulse' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {listening ? <><MicOff size={19} /> J'écoute… (appuie pour arrêter)</> : <><Mic size={19} /> Parler</>}
          </button>

          {heard && (
            <div className={`rounded-xl border p-4 ${verdict === 'ok' ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40' : verdict === 'ko' ? 'border-red-300 bg-red-50 dark:bg-red-950/40' : 'border-border bg-muted/40'}`}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Entendu</p>
              <p className="font-jp text-lg">{heard}</p>
              {verdict === 'ok' && <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"><Check size={15} /> Bien prononcé !</p>}
              {verdict === 'ko' && <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5"><X size={15} /> Pas tout à fait — réessaie ou écoute le modèle.</p>}
            </div>
          )}

          {error && <p className="text-sm text-amber-700 dark:text-amber-400 text-center">{error}</p>}

          {/* Actions */}
          {verdict ? (
            <div className="flex gap-2.5">
              {verdict === 'ko' && (
                <button onClick={() => listen(q)} className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/70 text-foreground font-medium text-sm transition-colors flex items-center justify-center gap-1.5">
                  <RotateCcw size={14} /> Réessayer
                </button>
              )}
              <button onClick={() => advance(verdict === 'ok')} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                Suivant →
              </button>
            </div>
          ) : (
            <button onClick={() => advance(false)} className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Passer
            </button>
          )}
        </div>
      ) : (
        // Fallback sans reconnaissance vocale : auto-évaluation
        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Volume2 size={13} /> Écoute le modèle, répète, puis évalue-toi.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => advance(false)} className="py-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-950/70 transition-colors">
              À retravailler
            </button>
            <button onClick={() => advance(true)} className="py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-colors">
              Bien dit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
