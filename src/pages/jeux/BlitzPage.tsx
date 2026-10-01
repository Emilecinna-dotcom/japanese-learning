import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer, Zap, ArrowLeft, RotateCcw } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { cn } from '@/lib/utils'

interface Choice { id: string; label: string }
interface BlitzQuestion {
  prompt: string
  promptSub?: string
  choices: Choice[]
  correctId: string
  category: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Tire n distracteurs uniques, différents de la bonne réponse
function distractors(all: string[], correct: string, n: number): string[] {
  const seen = new Set([correct])
  const out: string[] = []
  for (const v of shuffle(all)) {
    if (out.length >= n) break
    if (!seen.has(v)) { seen.add(v); out.push(v) }
  }
  return out
}

function buildQuestionBank(): BlitzQuestion[] {
  const questions: BlitzQuestion[] = []

  const kanaPool = [...ALL_HIRAGANA, ...ALL_KATAKANA].filter(k => !k.isDigraph)
  const allRomaji = kanaPool.map(k => k.romaji)
  for (const kana of kanaPool) {
    const wrong = distractors(allRomaji, kana.romaji, 3)
    const opts = shuffle([kana.romaji, ...wrong])
    questions.push({
      prompt: kana.kana,
      choices: opts.map((label, i) => ({ id: `${i}`, label })),
      correctId: String(opts.indexOf(kana.romaji)),
      category: 'Kana',
    })
  }

  const allMeanings = KANJI_N5.map(k => k.meaningFR[0])
  for (const kanji of KANJI_N5) {
    const correct = kanji.meaningFR[0]
    const wrong = distractors(allMeanings, correct, 3)
    const opts = shuffle([correct, ...wrong])
    questions.push({
      prompt: kanji.character,
      promptSub: [...kanji.onyomi, ...kanji.kunyomi].slice(0, 3).join('・'),
      choices: opts.map((label, i) => ({ id: `${i}`, label })),
      correctId: String(opts.indexOf(correct)),
      category: 'Kanji N5',
    })
  }

  const allVocab = ALL_THEMES.flatMap(t => t.items)
  const allFr = allVocab.map(v => v.frenchTranslation)
  for (const item of allVocab) {
    const wrong = distractors(allFr, item.frenchTranslation, 3)
    const opts = shuffle([item.frenchTranslation, ...wrong])
    questions.push({
      prompt: item.japanese,
      promptSub: item.kana !== item.japanese ? item.kana : undefined,
      choices: opts.map((label, i) => ({ id: `${i}`, label })),
      correctId: String(opts.indexOf(item.frenchTranslation)),
      category: 'Vocabulaire',
    })
  }

  return shuffle(questions)
}

const COMBO_THRESHOLDS = [
  { streak: 10, mult: 5 },
  { streak: 5, mult: 3 },
  { streak: 3, mult: 2 },
  { streak: 0, mult: 1 },
]
const getMultiplier = (streak: number) => COMBO_THRESHOLDS.find(t => streak >= t.streak)!.mult

type Phase = 'menu' | 'playing' | 'results'

export function BlitzPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('menu')
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [questions, setQuestions] = useState<BlitzQuestion[]>([])
  const [qIndex, setQIndex] = useState(0)

  const scoreRef = useRef(0)
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { scoreRef.current = score }, [score])

  const currentQ = questions[qIndex % (questions.length || 1)]
  const multiplier = getMultiplier(streak)

  const startGame = () => {
    setQuestions(buildQuestionBank())
    setQIndex(0); setScore(0); setStreak(0); setMaxStreak(0)
    setCorrect(0); setTotal(0); setTimeLeft(60); setPicked(null)
    setPhase('playing')
  }

  // Timer — un seul intervalle, ne dépend que de `phase`
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id)
          setPhase('results')
          const prev = parseInt(localStorage.getItem('best_blitz') ?? '0')
          if (scoreRef.current > prev) localStorage.setItem('best_blitz', String(scoreRef.current))
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => () => { if (feedbackRef.current) clearTimeout(feedbackRef.current) }, [])

  const handleAnswer = (choiceId: string) => {
    if (picked) return
    const isCorrect = choiceId === currentQ.correctId
    const newStreak = isCorrect ? streak + 1 : 0
    const pts = isCorrect ? 10 * getMultiplier(newStreak) : 0

    setPicked(choiceId)
    setTotal(t => t + 1)
    setStreak(newStreak)
    setMaxStreak(s => Math.max(s, newStreak))
    if (isCorrect) { setCorrect(c => c + 1); setScore(s => s + pts) }

    feedbackRef.current = setTimeout(() => {
      setPicked(null)
      setQIndex(i => i + 1)
    }, 380)
  }

  const bestScore = parseInt(localStorage.getItem('best_blitz') ?? '0')

  if (phase === 'menu') return (
    <div className="max-w-md mx-auto py-2 space-y-6 text-center">
      <button onClick={() => navigate('/jeux')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={15} /> Retour aux jeux
      </button>
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <Zap size={28} className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Blitz <span className="font-jp text-xl text-muted-foreground">速攻</span></h1>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-1.5 text-sm text-muted-foreground">
        <p>60 secondes chrono.</p>
        <p>Kana, kanji N5 et vocabulaire mélangés.</p>
        <p>Enchaîne les bonnes réponses : combo ×2, ×3, ×5.</p>
        <p>Une erreur remet le combo à zéro.</p>
      </div>
      {bestScore > 0 && <p className="text-sm text-muted-foreground">Meilleur score : <span className="font-bold text-foreground">{bestScore} pts</span></p>}
      <button onClick={startGame} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors">Commencer</button>
    </div>
  )

  if (phase === 'results') return (
    <div className="max-w-md mx-auto py-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center mx-auto">
        <Zap size={34} className="text-amber-500" />
      </div>
      <div>
        <p className="text-5xl font-bold text-primary tabular-nums">{score}</p>
        <p className="text-muted-foreground mt-1">points</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Correctes', value: `${correct}/${total}` },
          { label: 'Série max', value: maxStreak },
          { label: 'Combo max', value: `×${getMultiplier(maxStreak)}` },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3">
            <p className="text-lg font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate('/jeux')} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Jeux</button>
        <button onClick={startGame} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5"><RotateCcw size={15} /> Rejouer</button>
      </div>
    </div>
  )

  if (!currentQ) return null

  return (
    <div className="max-w-md mx-auto py-2 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/jeux')} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold tabular-nums', timeLeft <= 10 ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400' : 'bg-muted text-foreground')}>
            <Timer size={14} /> {timeLeft}s
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            <Zap size={14} /> {score}
          </div>
        </div>
      </div>

      {/* Combo */}
      <div className="h-6 text-center">
        {multiplier > 1 && (
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 px-3 py-1 rounded-full animate-fade-up">
            ×{multiplier} COMBO — {streak} en série
          </span>
        )}
      </div>

      {/* Question */}
      <div className={cn('bg-card border rounded-2xl p-8 text-center transition-colors duration-150',
        picked && currentQ.correctId === picked && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
        picked && currentQ.correctId !== picked && 'border-red-400 bg-red-50 dark:bg-red-950/50',
        !picked && 'border-border')}>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">{currentQ.category}</p>
        <p className="font-jp-serif text-7xl leading-none mb-3">{currentQ.prompt}</p>
        {currentQ.promptSub && <p className="text-sm text-muted-foreground font-jp">{currentQ.promptSub}</p>}
      </div>

      {/* Choix */}
      <div className="grid grid-cols-2 gap-3">
        {currentQ.choices.map(choice => {
          let cls = 'border-border bg-card hover:bg-muted hover:border-primary/40'
          if (picked) {
            if (choice.id === currentQ.correctId) cls = 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
            else if (choice.id === picked) cls = 'border-red-400 bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300'
            else cls = 'border-border bg-card opacity-40 text-muted-foreground'
          }
          return (
            <button key={choice.id} onClick={() => handleAnswer(choice.id)} disabled={!!picked}
              className={cn('p-4 rounded-xl border text-sm font-medium text-center transition-all disabled:cursor-default', cls)}>
              {choice.label}
            </button>
          )
        })}
      </div>

      <div className="text-center text-xs text-muted-foreground">{correct}/{total} correctes</div>
    </div>
  )
}
