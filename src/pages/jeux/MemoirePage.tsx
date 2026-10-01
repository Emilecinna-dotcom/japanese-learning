import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Clock, Layers } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { cn } from '@/lib/utils'

interface MemCard {
  id: string
  pairId: string
  display: string
  displaySub?: string
  flipped: boolean
  matched: boolean
}

type Category = 'hiragana' | 'katakana' | 'kanji' | 'vocab'
type Phase = 'menu' | 'playing' | 'results'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const PAIR_COUNT = 8

function buildCards(category: Category): MemCard[] {
  const cards: MemCard[] = []
  const push = (i: number, q: string, a: string, qSub?: string) => {
    cards.push({ id: `${i}-q`, pairId: `${i}`, display: q, displaySub: qSub, flipped: false, matched: false })
    cards.push({ id: `${i}-a`, pairId: `${i}`, display: a, flipped: false, matched: false })
  }

  if (category === 'hiragana') {
    shuffle(ALL_HIRAGANA.filter(k => !k.isDigraph)).slice(0, PAIR_COUNT).forEach((k, i) => push(i, k.kana, k.romaji))
  } else if (category === 'katakana') {
    shuffle(ALL_KATAKANA.filter(k => !k.isDigraph)).slice(0, PAIR_COUNT).forEach((k, i) => push(i, k.kana, k.romaji))
  } else if (category === 'kanji') {
    shuffle([...KANJI_N5]).slice(0, PAIR_COUNT).forEach((k, i) => push(i, k.character, k.meaningFR[0], k.onyomi[0] ?? k.kunyomi[0]))
  } else {
    shuffle(ALL_THEMES.flatMap(t => t.items)).slice(0, PAIR_COUNT).forEach((v, i) => push(i, v.japanese, v.frenchTranslation, v.kana !== v.japanese ? v.kana : undefined))
  }
  return shuffle(cards)
}

const CATEGORIES: { id: Category; label: string; glyph: string }[] = [
  { id: 'hiragana', label: 'Hiragana', glyph: 'あ' },
  { id: 'katakana', label: 'Katakana', glyph: 'ア' },
  { id: 'kanji', label: 'Kanji N5', glyph: '字' },
  { id: 'vocab', label: 'Vocabulaire', glyph: '語' },
]

export function MemoirePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('menu')
  const [category, setCategory] = useState<Category>('hiragana')
  const [cards, setCards] = useState<MemCard[]>([])
  const [flippedIds, setFlippedIds] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)
  const [locked, setLocked] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [bestAttempts, setBestAttempts] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500)
    return () => clearInterval(id)
  }, [phase, startTime])

  const startGame = (cat: Category) => {
    setCategory(cat)
    setCards(buildCards(cat))
    setFlippedIds([]); setAttempts(0); setMatchedCount(0)
    setLocked(false); setElapsed(0); setStartTime(Date.now())
    setPhase('playing')
  }

  const handleCard = useCallback((card: MemCard) => {
    if (locked || card.flipped || card.matched || flippedIds.length === 2) return

    const newFlipped = [...flippedIds, card.id]
    setCards(cs => cs.map(c => c.id === card.id ? { ...c, flipped: true } : c))
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1)
      setLocked(true)
      const isMatch = newFlipped[0].split('-')[0] === newFlipped[1].split('-')[0]

      setTimeout(() => {
        if (isMatch) {
          const pid = newFlipped[0].split('-')[0]
          setCards(cs => cs.map(c => c.pairId === pid ? { ...c, matched: true } : c))
          setMatchedCount(prev => {
            const next = prev + 1
            if (next === PAIR_COUNT) {
              setAttempts(finalAttempts => {
                const best = parseInt(localStorage.getItem('best_memoire') ?? '0')
                if (best === 0 || finalAttempts < best) localStorage.setItem('best_memoire', String(finalAttempts))
                return finalAttempts
              })
              setPhase('results')
            }
            return next
          })
        } else {
          setCards(cs => cs.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c))
        }
        setFlippedIds([])
        setLocked(false)
      }, 750)
    }
  }, [locked, flippedIds])

  useEffect(() => {
    const raw = localStorage.getItem('best_memoire')
    setBestAttempts(raw ? parseInt(raw) : null)
  }, [phase])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (phase === 'menu') return (
    <div className="max-w-md mx-auto py-2 space-y-6">
      <button onClick={() => navigate('/jeux')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={15} /> Retour aux jeux
      </button>
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-1">
          <Layers size={28} className="text-pink-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Mémoire <span className="font-jp text-xl text-muted-foreground">記憶</span></h1>
        <p className="text-sm text-muted-foreground">Retourne les cartes et associe chaque caractère à sa réponse.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => startGame(cat.id)}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-border bg-card hover:bg-muted hover:border-pink-400 transition-all">
            <span className="font-jp text-3xl">{cat.glyph}</span>
            <span className="font-semibold text-sm">{cat.label}</span>
          </button>
        ))}
      </div>
      {bestAttempts !== null && <p className="text-center text-sm text-muted-foreground">Record : <span className="font-bold text-foreground">{bestAttempts} essais</span></p>}
    </div>
  )

  if (phase === 'results') return (
    <div className="max-w-md mx-auto py-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-pink-500/10 border-2 border-pink-500/20 flex items-center justify-center mx-auto">
        <Layers size={34} className="text-pink-500" />
      </div>
      <div>
        <p className="text-4xl font-bold text-primary">{PAIR_COUNT}/{PAIR_COUNT}</p>
        <p className="text-muted-foreground mt-1">paires trouvées</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Essais', value: attempts }, { label: 'Temps', value: formatTime(elapsed) }].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xl font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {bestAttempts !== null && <p className="text-sm text-muted-foreground">Record : <span className="font-bold text-foreground">{bestAttempts} essais</span></p>}
      <div className="flex gap-3">
        <button onClick={() => navigate('/jeux')} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Jeux</button>
        <button onClick={() => startGame(category)} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5"><RotateCcw size={15} /> Rejouer</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={() => setPhase('menu')} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground flex items-center gap-1 tabular-nums"><Clock size={14} />{formatTime(elapsed)}</span>
          <span className="font-medium text-foreground tabular-nums">{matchedCount}/{PAIR_COUNT} paires</span>
          <span className="text-muted-foreground tabular-nums">{attempts} essais</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {cards.map(card => (
          <button key={card.id} onClick={() => handleCard(card)} disabled={card.matched}
            className={cn('aspect-square rounded-xl border text-center flex flex-col items-center justify-center p-1 transition-all duration-200 select-none',
              card.matched ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-700 cursor-default'
                : card.flipped ? 'bg-card border-primary shadow-sm'
                : 'bg-muted/60 border-border hover:bg-muted cursor-pointer hover:border-primary/30')}>
            {(card.flipped || card.matched) ? (
              <>
                <span className={cn('font-jp leading-tight', card.display.length <= 2 ? 'text-2xl' : card.display.length <= 4 ? 'text-lg' : 'text-sm')}>{card.display}</span>
                {card.displaySub && <span className="font-jp text-xs text-muted-foreground mt-0.5">{card.displaySub}</span>}
              </>
            ) : <span className="text-2xl text-muted-foreground/30">？</span>}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">Trouve les {PAIR_COUNT} paires en un minimum d'essais</p>
    </div>
  )
}
