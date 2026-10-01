import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { PenTool, Keyboard, Blocks, ArrowRight, ArrowLeft, Check, X, RotateCcw, CornerDownLeft } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { ALL_THEMES } from '@/data/vocabulary'
import { shuffle } from '@/lib/flashItems'
import { romajiToKana, romajiRoundTrips, readingMatches } from '@/lib/romajiKana'
import { useProgressContext } from '@/hooks/useProgress'

type Mode = 'lecture' | 'kana' | 'phrase'
const SESSION_LEN = 10
const PHRASE_LEN = 8

// ── Phrases pour la composition (distinctes du jeu « ordre des mots ») ──
interface Sentence { words: string[]; french: string }
const PHRASE_SET: Sentence[] = [
  { words: ['わたし', 'の', 'なまえ', 'は', 'たなか', 'です', '。'], french: 'Je m\'appelle Tanaka.' },
  { words: ['コーヒー', 'を', 'ふたつ', 'ください', '。'], french: 'Deux cafés, s\'il vous plaît.' },
  { words: ['えいご', 'が', 'はなせます', 'か', '。'], french: 'Parlez-vous anglais ?' },
  { words: ['きょう', 'は', 'やすみ', 'です', '。'], french: 'Aujourd\'hui, c\'est jour de repos.' },
  { words: ['この', 'みせ', 'は', 'たかい', 'です', 'ね', '。'], french: 'Ce magasin est cher, non ?' },
  { words: ['でんしゃ', 'で', 'いきます', '。'], french: 'J\'y vais en train.' },
  { words: ['あした', 'あめ', 'が', 'ふります', '。'], french: 'Demain, il va pleuvoir.' },
  { words: ['にく', 'より', 'さかな', 'が', 'すき', 'です', '。'], french: 'Je préfère le poisson à la viande.' },
  { words: ['ちょっと', 'まって', 'ください', '。'], french: 'Attendez un instant, s\'il vous plaît.' },
  { words: ['くうこう', 'まで', 'おねがい', 'します', '。'], french: 'À l\'aéroport, s\'il vous plaît.' },
  { words: ['いま', 'なんじ', 'です', 'か', '。'], french: 'Quelle heure est-il ?' },
  { words: ['みず', 'を', 'もらえます', 'か', '。'], french: 'Puis-je avoir de l\'eau ?' },
]

// ── Pools de frappe ───────────────────────────────────────────────
interface TypeQ { jp: string; answer: string; sub?: string; reading?: string; tag: string }

function buildLecturePool(scope: 'kana' | 'vocab' | 'mix'): TypeQ[] {
  const kana: TypeQ[] = []
  ALL_HIRAGANA.filter(k => !k.isDigraph).forEach(k => kana.push({ jp: k.kana, answer: k.romaji, tag: 'Hiragana' }))
  ALL_KATAKANA.filter(k => !k.isDigraph).forEach(k => kana.push({ jp: k.kana, answer: k.romaji, tag: 'Katakana' }))
  const vocab: TypeQ[] = []
  ALL_THEMES.forEach(t => t.items.forEach(v =>
    vocab.push({ jp: v.japanese, answer: v.romaji, sub: v.frenchTranslation, reading: v.kana !== v.japanese ? v.kana : undefined, tag: 'Vocabulaire' })
  ))
  if (scope === 'kana') return kana
  if (scope === 'vocab') return vocab
  return [...kana, ...vocab]
}

// Mots dont le romaji se reconvertit exactement en kana → résolubles à la frappe
function buildKanaPool(): TypeQ[] {
  const pool: TypeQ[] = []
  ALL_THEMES.forEach(t => t.items.forEach(v => {
    if (romajiRoundTrips(v.romaji, v.kana)) {
      pool.push({ jp: v.kana, answer: v.kana, sub: v.frenchTranslation, reading: v.romaji, tag: 'Vocabulaire' })
    }
  }))
  return pool
}

export function ProductionPage() {
  const { recordProductionResult } = useProgressContext()
  const [mode, setMode] = useState<Mode | null>(null)

  if (mode === null) return <ModeMenu onPick={setMode} />
  if (mode === 'phrase') return <PhraseSession onExit={() => setMode(null)} record={recordProductionResult} />
  return <TypeSession mode={mode} onExit={() => setMode(null)} record={recordProductionResult} />
}

// ── Menu ──────────────────────────────────────────────────────────
function ModeMenu({ onPick }: { onPick: (m: Mode) => void }) {
  const cards: { mode: Mode; icon: React.ReactNode; title: string; jp: string; desc: string; accent: string }[] = [
    { mode: 'lecture', icon: <PenTool size={20} />, title: 'Lecture', jp: '読み', desc: 'On te montre du japonais, tu écris sa prononciation en romaji.', accent: 'text-primary bg-primary/10 border-primary/20' },
    { mode: 'kana', icon: <Keyboard size={20} />, title: 'Écrire en kana', jp: 'かな入力', desc: 'Tape au clavier en romaji, ça se transforme en kana. Reproduis le mot.', accent: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { mode: 'phrase', icon: <Blocks size={20} />, title: 'Composer une phrase', jp: '作文', desc: 'Reconstitue la phrase japonaise à partir du français, mot par mot.', accent: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20' },
  ]
  return (
    <div className="max-w-md mx-auto py-2 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-1">
          <PenTool size={28} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Production <span className="font-jp text-2xl text-muted-foreground">産出</span></h1>
        <p className="text-muted-foreground text-sm">Passe du français au japonais. Produire, c'est mémoriser deux fois mieux que reconnaître.</p>
      </div>

      <div className="space-y-3">
        {cards.map(c => (
          <button
            key={c.mode}
            onClick={() => onPick(c.mode)}
            className="group w-full flex items-center gap-4 bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/40 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${c.accent}`}>
              {c.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-foreground">{c.title}</p>
                <span className="font-jp text-xs text-muted-foreground">{c.jp}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.desc}</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Session de frappe (Lecture / Kana) ────────────────────────────
function TypeSession({ mode, onExit, record }: { mode: 'lecture' | 'kana'; onExit: () => void; record: (c: boolean) => void }) {
  const [scope, setScope] = useState<'kana' | 'vocab' | 'mix'>('mix')
  const [questions, setQuestions] = useState<TypeQ[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [score, setScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const pool = useMemo(() => (mode === 'lecture' ? buildLecturePool(scope) : buildKanaPool()), [mode, scope])

  const start = useCallback(() => {
    setQuestions(shuffle(pool).slice(0, SESSION_LEN))
    setIdx(0); setValue(''); setStatus('idle'); setScore(0)
  }, [pool])

  useEffect(() => {
    if (questions && status === 'idle') inputRef.current?.focus()
  }, [questions, idx, status])

  if (!questions) {
    return (
      <div className="max-w-md mx-auto py-2 space-y-6">
        <button onClick={onExit} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} /> Modes
        </button>
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold">{mode === 'lecture' ? 'Lecture' : 'Écrire en kana'}</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'lecture'
              ? 'Tape la prononciation en romaji de ce qui s\'affiche.'
              : 'Tape en romaji, ça devient des kana. Reproduis le mot affiché.'}
          </p>
        </div>

        {mode === 'lecture' && (
          <div className="flex justify-center gap-2">
            {([['kana', 'Kana'], ['vocab', 'Vocabulaire'], ['mix', 'Mélange']] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setScope(k)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${scope === k ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70 text-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <button onClick={start} className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 active:scale-[0.99] transition-all">
          Commencer — {SESSION_LEN} questions
        </button>
      </div>
    )
  }

  // Résultats
  if (idx >= questions.length) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-md mx-auto py-6 space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto">
          <PenTool size={34} className="text-primary" />
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
            Changer de réglage
          </button>
          <button onClick={onExit} className="w-full py-3.5 rounded-xl text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">
            Retour aux modes
          </button>
        </div>
      </div>
    )
  }

  const q = questions[idx]
  const isKata = mode === 'kana' && [...q.answer].some(ch => ch.charCodeAt(0) >= 0x30a0 && ch.charCodeAt(0) <= 0x30ff)
  const preview = mode === 'kana' ? romajiToKana(value.toLowerCase().replace(/[^a-z]/g, ''), isKata ? 'katakana' : 'hiragana') : ''

  const submit = () => {
    if (status !== 'idle') return
    if (!value.trim()) return
    const ok = mode === 'lecture'
      ? readingMatches(value, q.answer)
      : preview === q.answer
    setStatus(ok ? 'correct' : 'wrong')
    if (ok) setScore(s => s + 1)
    record(ok)
  }

  const next = () => {
    setIdx(i => i + 1); setValue(''); setStatus('idle')
  }

  const pct = (idx / questions.length) * 100

  return (
    <div className="max-w-md mx-auto py-2 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setQuestions(null)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">{idx + 1} / {questions.length}</span>
        <span className="text-sm font-medium tabular-nums text-emerald-600">{score} ✓</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Prompt */}
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-2 relative">
        <span className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{q.tag}</span>
        <div className="absolute top-2.5 right-3">
          <SpeakButton text={q.jp} size="sm" />
        </div>
        {mode === 'lecture' ? (
          <>
            <p className="font-jp text-6xl leading-tight pt-3">{q.jp}</p>
            {q.sub && <p className="text-sm text-muted-foreground">{q.sub}</p>}
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-widest pt-3">Écris en kana</p>
            <p className="text-2xl font-bold text-foreground">{q.sub}</p>
            <p className="font-mono text-sm text-muted-foreground">{q.reading}</p>
          </>
        )}
      </div>

      {/* Saisie */}
      <div>
        <div className="relative">
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') (status === 'idle' ? submit() : next()) }}
            disabled={status !== 'idle'}
            placeholder={mode === 'lecture' ? 'prononciation en romaji…' : 'tape en romaji (ex. ka → か)…'}
            autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false}
            className={`w-full px-4 py-3.5 rounded-xl border-2 bg-card text-base focus:outline-none transition-colors ${
              status === 'correct' ? 'border-emerald-400' : status === 'wrong' ? 'border-red-400' : 'border-border focus:border-primary'
            }`}
          />
          {mode === 'kana' && value && status === 'idle' && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-jp text-xl text-primary pointer-events-none">{preview}</span>
          )}
        </div>

        {/* Feedback */}
        {status === 'wrong' && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <X size={15} className="text-red-500 shrink-0" />
            <span className="text-muted-foreground">Réponse :</span>
            <span className="font-medium text-foreground font-jp">{q.answer}</span>
            {mode === 'lecture' && q.reading && <span className="font-jp text-muted-foreground">({q.reading})</span>}
          </div>
        )}
        {status === 'correct' && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Check size={15} className="text-emerald-500 shrink-0" />
            <span className="font-medium text-emerald-700 dark:text-emerald-400">Correct !</span>
          </div>
        )}
      </div>

      {/* Action */}
      {status === 'idle' ? (
        <button onClick={submit} disabled={!value.trim()} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40">
          Vérifier <CornerDownLeft size={15} />
        </button>
      ) : (
        <button onClick={next} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          {idx + 1 < questions.length ? 'Question suivante →' : 'Voir le résultat →'}
        </button>
      )}
    </div>
  )
}

// ── Session de composition (tuiles) ───────────────────────────────
interface Tile { id: string; word: string }
function makeTiles(words: string[]): Tile[] {
  return shuffle(words.map((w, i) => ({ id: `${i}-${w}`, word: w })))
}

function PhraseSession({ onExit, record }: { onExit: () => void; record: (c: boolean) => void }) {
  const [sentences] = useState(() => shuffle([...PHRASE_SET]).slice(0, PHRASE_LEN))
  const [index, setIndex] = useState(0)
  const [available, setAvailable] = useState<Tile[]>(() => makeTiles(sentences[0].words))
  const [answer, setAnswer] = useState<Tile[]>([])
  const [check, setCheck] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [score, setScore] = useState(0)

  const current = sentences[index]

  if (index >= sentences.length) {
    const pct = Math.round((score / sentences.length) * 100)
    return (
      <div className="max-w-md mx-auto py-6 space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-teal-500/10 border-2 border-teal-500/20 flex items-center justify-center mx-auto">
          <Blocks size={34} className="text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Terminé !</h2>
          <p className="text-muted-foreground mt-1">{score} / {sentences.length} phrases · {pct}%</p>
        </div>
        <button onClick={onExit} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          Retour aux modes
        </button>
      </div>
    )
  }

  const addTile = (t: Tile) => {
    if (check !== 'idle') return
    setAvailable(a => a.filter(x => x.id !== t.id))
    setAnswer(a => [...a, t])
  }
  const removeTile = (t: Tile) => {
    if (check !== 'idle') return
    setAnswer(a => a.filter(x => x.id !== t.id))
    setAvailable(a => [...a, t])
  }
  const verify = () => {
    const user = answer.map(t => t.word)
    const ok = current.words.length === user.length && current.words.every((w, i) => w === user[i])
    setCheck(ok ? 'correct' : 'wrong')
    if (ok) setScore(s => s + 1)
    record(ok)
  }
  const next = () => {
    const n = index + 1
    setIndex(n)
    if (n < sentences.length) { setAvailable(makeTiles(sentences[n].words)); setAnswer([]); setCheck('idle') }
  }

  const pct = (index / sentences.length) * 100

  return (
    <div className="max-w-lg mx-auto py-2 space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">{index + 1} / {sentences.length}</span>
        <span className="text-sm font-medium tabular-nums text-emerald-600">{score} ✓</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Traduis en japonais</p>
        <p className="text-lg font-medium text-foreground">{current.french}</p>
      </div>

      {/* Réponse */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Ta réponse</p>
        <div className={`min-h-16 p-3 rounded-xl border-2 flex flex-wrap gap-2 items-start transition-colors ${
          check === 'correct' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
            : check === 'wrong' ? 'border-red-400 bg-red-50 dark:bg-red-950/40'
            : 'border-dashed border-border bg-muted/30'
        }`}>
          {answer.length === 0 && <span className="text-sm text-muted-foreground/50 py-1">Touche les mots ci-dessous…</span>}
          {answer.map(t => (
            <button key={t.id} onClick={() => removeTile(t)} disabled={check !== 'idle'}
              className="font-jp px-3 py-1.5 rounded-lg text-base bg-card border border-border hover:border-red-300 transition-all disabled:cursor-default">
              {t.word}
            </button>
          ))}
        </div>
        {check === 'wrong' && (
          <div className="mt-2 flex items-start gap-2">
            <X size={15} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Réponse correcte :</p>
              <p className="font-jp text-base font-medium text-foreground">{current.words.join('')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Mots */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Mots disponibles</p>
        <div className="flex flex-wrap gap-2 min-h-12">
          {available.map(t => (
            <button key={t.id} onClick={() => addTile(t)} disabled={check !== 'idle'}
              className="font-jp px-3 py-1.5 rounded-lg text-base bg-card border border-border hover:bg-muted hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-default">
              {t.word}
            </button>
          ))}
        </div>
      </div>

      {/* Action */}
      {check === 'idle' ? (
        <button onClick={verify} disabled={answer.length === 0} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40">
          Vérifier
        </button>
      ) : (
        <button onClick={next} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          {index + 1 < sentences.length ? 'Phrase suivante →' : 'Voir le résultat →'}
        </button>
      )}
    </div>
  )
}
