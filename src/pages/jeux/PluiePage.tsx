import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Heart, CloudRain } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { cn } from '@/lib/utils'

interface Drop {
  id: number
  kana: string
  romaji: string
  x: number
  y: number
  speed: number
}

type Phase = 'menu' | 'playing' | 'results'
type Pool = 'hiragana' | 'katakana' | 'mix'

const TICK_MS = 50
const MAX_DROPS = 5
const SPAWN_MS = 1500
const BASE_SPEED = 0.45
const SPEED_STEP = 0.07

let nextId = 0

function poolFor(p: Pool) {
  const h = ALL_HIRAGANA.filter(k => !k.isDigraph)
  const k = ALL_KATAKANA.filter(k => !k.isDigraph)
  return p === 'hiragana' ? h : p === 'katakana' ? k : [...h, ...k]
}

export function PluiePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('menu')
  const [pool, setPool] = useState<Pool>('hiragana')
  const [drops, setDrops] = useState<Drop[]>([])
  const [input, setInput] = useState('')
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(0)
  const [destroyed, setDestroyed] = useState(0)
  const [flashId, setFlashId] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef({ score, level, pool })

  useEffect(() => { stateRef.current = { score, level, pool } }, [score, level, pool])

  const stopTimers = () => {
    if (tickRef.current) clearInterval(tickRef.current)
    if (spawnRef.current) clearInterval(spawnRef.current)
  }

  const endGame = useCallback((finalScore: number) => {
    stopTimers()
    setPhase('results')
    const prev = parseInt(localStorage.getItem('best_pluie') ?? '0')
    if (finalScore > prev) localStorage.setItem('best_pluie', String(finalScore))
  }, [])

  const startGame = (p: Pool) => {
    stopTimers()
    nextId = 0
    setPool(p)
    setDrops([])
    setInput('')
    setLives(3)
    setScore(0)
    setLevel(0)
    setDestroyed(0)
    setFlashId(null)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  // Boucle de chute — intervalle stable, ne dépend que de `phase`
  useEffect(() => {
    if (phase !== 'playing') return
    tickRef.current = setInterval(() => {
      setDrops(prev => {
        const updated = prev.map(d => ({ ...d, y: d.y + d.speed }))
        const alive = updated.filter(d => d.y < 100)
        const fallenCount = updated.length - alive.length
        if (fallenCount > 0) {
          setLives(l => {
            const next = l - fallenCount
            if (next <= 0) { endGame(stateRef.current.score); return 0 }
            return next
          })
        }
        return alive
      })
    }, TICK_MS)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [phase, endGame])

  // Apparition — intervalle fixe, la difficulté passe par la vitesse
  useEffect(() => {
    if (phase !== 'playing') return
    spawnRef.current = setInterval(() => {
      setDrops(prev => {
        if (prev.length >= MAX_DROPS) return prev
        const { level: lvl, pool: p } = stateRef.current
        const list = poolFor(p)
        const kana = list[Math.floor(Math.random() * list.length)]
        return [...prev, {
          id: nextId++,
          kana: kana.kana,
          romaji: kana.romaji,
          x: 8 + Math.random() * 80,
          y: -6,
          speed: BASE_SPEED + lvl * SPEED_STEP + Math.random() * 0.18,
        }]
      })
    }, SPAWN_MS)
    return () => { if (spawnRef.current) clearInterval(spawnRef.current) }
  }, [phase])

  const tryMatch = (val: string) => {
    setDrops(prev => {
      // vise le kana correspondant le plus bas (le plus urgent)
      const candidates = prev.filter(d => d.romaji === val).sort((a, b) => b.y - a.y)
      const match = candidates[0]
      if (!match) return prev
      setFlashId(match.id)
      setTimeout(() => setFlashId(null), 250)
      setInput('')
      setScore(s => s + 10)
      setDestroyed(n => {
        const next = n + 1
        setLevel(Math.floor(next / 10))
        return next
      })
      return prev.filter(d => d.id !== match.id)
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '')
    setInput(val)
    if (val) tryMatch(val)
  }

  useEffect(() => () => stopTimers(), [])

  const bestScore = parseInt(localStorage.getItem('best_pluie') ?? '0')

  // ── Menu ────────────────────────────────────────────────────────
  if (phase === 'menu') return (
    <div className="max-w-md mx-auto py-2 space-y-6">
      <button onClick={() => navigate('/jeux')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={15} /> Retour aux jeux
      </button>
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 mb-1">
          <CloudRain size={28} className="text-sky-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Pluie de kana <span className="font-jp text-xl text-muted-foreground">文字の雨</span></h1>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 text-sm text-muted-foreground space-y-1.5">
        <p>Des kana tombent du ciel. Tape leur romaji pour les détruire avant qu'ils touchent le sol.</p>
        <p>3 vies. La vitesse augmente tous les 10 kana.</p>
      </div>
      <div>
        <p className="text-sm font-medium mb-2.5">Choisis ton syllabaire</p>
        <div className="grid grid-cols-3 gap-2">
          {([['hiragana', 'Hiragana', 'あ'], ['katakana', 'Katakana', 'ア'], ['mix', 'Mélange', '安']] as const).map(([p, label, glyph]) => (
            <button key={p} onClick={() => startGame(p)}
              className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border border-border bg-card hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all">
              <span className="font-jp text-2xl">{glyph}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
      {bestScore > 0 && <p className="text-center text-sm text-muted-foreground">Meilleur score : <span className="font-bold text-foreground">{bestScore} pts</span></p>}
    </div>
  )

  // ── Résultats ───────────────────────────────────────────────────
  if (phase === 'results') return (
    <div className="max-w-md mx-auto py-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-sky-500/10 border-2 border-sky-500/20 flex items-center justify-center mx-auto">
        <CloudRain size={34} className="text-sky-500" />
      </div>
      <div>
        <p className="text-5xl font-bold text-primary tabular-nums">{score}</p>
        <p className="text-muted-foreground mt-1">points</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Kana détruits', value: destroyed }, { label: 'Niveau atteint', value: level + 1 }].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xl font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate('/jeux')} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Jeux</button>
        <button onClick={() => startGame(pool)} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5"><RotateCcw size={15} /> Rejouer</button>
      </div>
    </div>
  )

  // ── Jeu ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto space-y-3" onClick={() => inputRef.current?.focus()}>
      {/* HUD */}
      <div className="flex items-center justify-between">
        <button onClick={() => endGame(score)} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(i => <Heart key={i} size={18} className={cn(i <= lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30')} />)}
        </div>
        <div className="text-sm font-bold text-foreground tabular-nums">{score} pts</div>
      </div>

      {/* Arène */}
      <div className="relative h-[58vh] min-h-[360px] rounded-2xl border border-border bg-gradient-to-b from-sky-50 to-background dark:from-sky-950/30 overflow-hidden">
        <div className="absolute top-2 right-3 text-xs text-muted-foreground font-mono">niv. {level + 1}</div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-red-400/40" />
        {drops.map(drop => (
          <div
            key={drop.id}
            className={cn('absolute -translate-x-1/2 pointer-events-none', flashId === drop.id && 'opacity-0')}
            style={{ left: `${drop.x}%`, top: `${drop.y}%` }}
          >
            <span className="font-jp text-3xl font-bold text-foreground leading-none drop-shadow-sm">{drop.kana}</span>
          </div>
        ))}
      </div>

      {/* Saisie */}
      <input
        ref={inputRef}
        value={input}
        onChange={onChange}
        onKeyDown={e => e.key === 'Enter' && setInput('')}
        placeholder="tape le romaji…"
        autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false}
        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground text-center text-lg font-mono tracking-widest focus:outline-none focus:border-sky-400 transition-colors placeholder:text-muted-foreground/40"
      />
    </div>
  )
}
