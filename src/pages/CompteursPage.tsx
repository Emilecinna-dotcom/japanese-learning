import { useState, useMemo, useCallback } from 'react'
import { Hash, CheckCircle, RotateCcw } from 'lucide-react'
import { COUNTERS } from '@/data/compteurs'
import { SystemeEcritureInfo, COMPTEURS_INFO } from '@/components/SystemeEcritureInfo'
import type { Counter } from '@/data/compteurs'
import { cn } from '@/lib/utils'

// ─── helpers ──────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const IRREGULAR_MARKERS = ['irrégulier', 'ippon', 'issatsu', 'ippiki', 'ittou', 'ikko', 'ikkai', 'ippai', 'happon', 'roppiki', 'roppon', 'roppai', 'hassatsu', 'happiki', 'happai', 'hatori', 'hittou']
const IRREGULAR_PATTERNS = /^(ip|is|hap|has|rop|ik|jup|jus|juk)/

function isIrregular(note: string | undefined): boolean {
  if (!note) return false
  const lower = note.toLowerCase()
  if (lower.includes('irrégulier')) return true
  const romaji = lower.split(' ')[0]
  return IRREGULAR_MARKERS.includes(romaji) || IRREGULAR_PATTERNS.test(romaji)
}

const CATEGORY_COLORS: Record<string, string> = {
  Objets:    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Animaux:   'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Personnes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Machines:  'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Boissons:  'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  Temps:     'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
}

// ─── quiz logic ───────────────────────────────────────────────────────────────

interface QuizQuestion {
  counterIndex: number
  numberIndex: number
  correctNote: string
  options: string[]
}

function buildQuizQuestion(
  counter: Counter,
  numIdx: number,
  allCounters: Counter[]
): QuizQuestion {
  const correct = counter.numbers[numIdx]
  const correctNote = correct.note ?? correct.reading

  // gather distractors from same counter (different numbers) + other counters (same or close number)
  const distractors: string[] = []

  // from the same counter, different numbers
  for (let i = 0; i < counter.numbers.length; i++) {
    if (i !== numIdx) {
      const n = counter.numbers[i].note ?? counter.numbers[i].reading
      if (n !== correctNote) distractors.push(n)
    }
  }

  // from other counters, same number index
  for (const c of allCounters) {
    if (c.id !== counter.id && c.numbers[numIdx]) {
      const n = c.numbers[numIdx].note ?? c.numbers[numIdx].reading
      if (n !== correctNote) distractors.push(n)
    }
  }

  const shuffledDistractors = shuffleArray(distractors).slice(0, 3)
  const options = shuffleArray([correctNote, ...shuffledDistractors])

  return {
    counterIndex: allCounters.findIndex(c => c.id === counter.id),
    numberIndex: numIdx,
    correctNote,
    options,
  }
}

function generateQuizQueue(allCounters: Counter[]): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  for (const counter of allCounters) {
    for (let i = 0; i < counter.numbers.length; i++) {
      questions.push(buildQuizQuestion(counter, i, allCounters))
    }
  }
  return shuffleArray(questions)
}

// ─── sub-components ───────────────────────────────────────────────────────────

interface CounterCardProps {
  counter: Counter
  isExpanded: boolean
  onToggle: () => void
}

function CounterCard({ counter, isExpanded, onToggle }: CounterCardProps) {
  const categoryColor = CATEGORY_COLORS[counter.category] ?? 'bg-muted text-muted-foreground'

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer hover:border-amber-400/60 hover:shadow-md hover:shadow-amber-500/5',
        isExpanded && 'border-amber-400/80 shadow-lg shadow-amber-500/10'
      )}
      onClick={onToggle}
    >
      {/* header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                'font-jp-serif text-5xl leading-none mb-3 transition-colors',
                isExpanded ? 'text-amber-500' : 'text-foreground'
              )}
            >
              {counter.kanji}
            </div>
            <div className="font-jp text-sm text-muted-foreground mb-1">{counter.reading}</div>
            <div className="text-sm font-semibold text-foreground">{counter.meaning}</div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', categoryColor)}>
              {counter.category}
            </span>
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                isExpanded
                  ? 'border-amber-400 bg-amber-400/20 text-amber-500'
                  : 'border-border text-muted-foreground'
              )}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className={cn('transition-transform', isExpanded ? 'rotate-180' : '')}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* examples */}
        <div className="flex flex-wrap gap-1 mt-3">
          {counter.examples.map((ex) => (
            <span
              key={ex}
              className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
            >
              {ex}
            </span>
          ))}
        </div>
      </div>

      {/* expanded: numbers grid */}
      {isExpanded && (
        <div
          className="border-t border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20 px-5 pb-5 pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-3 uppercase tracking-wide">
            Lecture 1 → 10
          </p>
          <div className="grid grid-cols-2 gap-2">
            {counter.numbers.map((n) => {
              const irregular = isIrregular(n.note)
              return (
                <div
                  key={n.num}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all',
                    irregular
                      ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800/40'
                      : 'bg-card border-border'
                  )}
                >
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{n.num}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-jp text-base leading-tight">{n.jp}</div>
                    <div className="font-jp text-xs text-muted-foreground leading-tight">{n.reading}</div>
                    {n.note && (
                      <div
                        className={cn(
                          'text-xs font-mono leading-tight mt-0.5',
                          irregular ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-muted-foreground'
                        )}
                      >
                        {n.note}
                        {irregular && <span className="ml-1 text-orange-500">⚡</span>}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-orange-600/80 dark:text-orange-400/70 mt-3 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Fond orange = lecture irrégulière</span>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── quiz tab ─────────────────────────────────────────────────────────────────

interface QuizState {
  questions: QuizQuestion[]
  index: number
  selected: string | null
  phase: 'question' | 'feedback'
  score: number
  correct: number
}

function buildInitialQuizState(): QuizState {
  return {
    questions: generateQuizQueue(COUNTERS),
    index: 0,
    selected: null,
    phase: 'question',
    score: 0,
    correct: 0,
  }
}

function QuizTab() {
  const [state, setState] = useState<QuizState>(buildInitialQuizState)

  const restart = useCallback(() => {
    setState(buildInitialQuizState())
  }, [])

  const currentQuestion = state.questions[state.index]
  const counter = currentQuestion ? COUNTERS[currentQuestion.counterIndex] : null
  const numberEntry = counter?.numbers[currentQuestion?.numberIndex ?? 0]

  const handleAnswer = useCallback(
    (option: string) => {
      if (state.phase !== 'question') return
      const isRight = option === currentQuestion?.correctNote
      setState((prev) => ({
        ...prev,
        selected: option,
        phase: 'feedback',
        score: prev.score + (isRight ? 1 : 0),
        correct: prev.correct + (isRight ? 1 : 0),
      }))
    },
    [state.phase, currentQuestion]
  )

  const handleNext = useCallback(() => {
    setState((prev) => {
      const next = prev.index + 1
      if (next >= prev.questions.length) {
        return { ...prev, phase: 'feedback', index: prev.questions.length }
      }
      return { ...prev, index: next, selected: null, phase: 'question' }
    })
  }, [])

  const isComplete = state.index >= state.questions.length
  const total = state.questions.length
  const pct = total > 0 ? Math.round((state.correct / total) * 100) : 0

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto">
          <CheckCircle size={48} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Quiz terminé !</h2>
          <p className="text-muted-foreground mt-1">Tu as complété les {total} questions</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="text-5xl font-bold text-amber-500">{pct}%</div>
          <div className="text-sm text-muted-foreground">
            {state.correct} bonne{state.correct > 1 ? 's' : ''} réponse{state.correct > 1 ? 's' : ''} sur {total}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct >= 80 && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Excellent travail ! Tu maîtrises bien les compteurs.
            </p>
          )}
          {pct >= 50 && pct < 80 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              Bon début ! Continue à pratiquer les irréguliers.
            </p>
          )}
          {pct < 50 && (
            <p className="text-sm text-muted-foreground font-medium">
              Révise d'abord les cartes, puis retente le quiz.
            </p>
          )}
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors mx-auto"
        >
          <RotateCcw size={16} />
          Recommencer
        </button>
      </div>
    )
  }

  if (!counter || !numberEntry || !currentQuestion) return null

  const isCorrect = state.selected === currentQuestion.correctNote
  const progress = (state.index / total) * 100

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{state.index + 1} / {total}</span>
          <span className="font-bold text-amber-500">{state.score} correct{state.score > 1 ? 's' : ''}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* question card */}
      <div
        className={cn(
          'bg-card border rounded-2xl p-8 text-center transition-all duration-200',
          state.phase === 'feedback' && isCorrect && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
          state.phase === 'feedback' && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/50',
          state.phase === 'question' && 'border-border'
        )}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
          Quelle est la lecture ?
        </p>
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-4xl font-bold text-amber-500">{numberEntry.num}</span>
          <span className="font-jp-serif text-6xl text-foreground leading-none">{counter.kanji}</span>
        </div>
        <div className="mt-2">
          <span className="font-jp text-lg text-muted-foreground">{numberEntry.jp}</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{counter.meaning}</div>
      </div>

      {/* options */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option) => {
          const isSelected = state.selected === option
          const isRight = option === currentQuestion.correctNote

          let cls =
            'border-border bg-card hover:bg-amber-50 hover:border-amber-400/50 dark:hover:bg-amber-950/20 text-foreground'
          if (state.phase === 'feedback') {
            if (isRight)
              cls =
                'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
            else if (isSelected)
              cls = 'border-red-400 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400'
            else cls = 'border-border bg-card opacity-40 text-muted-foreground'
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={state.phase === 'feedback'}
              className={cn(
                'px-4 py-4 rounded-xl border font-mono text-base font-semibold transition-all duration-150 disabled:cursor-default active:scale-95',
                cls
              )}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* feedback banner */}
      {state.phase === 'feedback' && (
        <div
          className={cn(
            'rounded-xl px-4 py-3 border flex items-center justify-between',
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800/50'
              : 'bg-red-50 border-red-200 dark:bg-red-950/60 dark:border-red-800/50'
          )}
        >
          <div>
            {isCorrect ? (
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">正解！ Parfait !</p>
            ) : (
              <div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">不正解</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Réponse :{' '}
                  <span className="font-mono font-semibold text-foreground">
                    {currentQuestion.correctNote}
                  </span>
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
          >
            次へ →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

const categories = Array.from(new Set(COUNTERS.map((c) => c.category)))

export function CompteursPage() {
  const [tab, setTab] = useState<'apprendre' | 'quiz'>('apprendre')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!activeCategory) return COUNTERS
    return COUNTERS.filter((c) => c.category === activeCategory)
  }, [activeCategory])

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <Hash size={24} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              助数詞{' '}
              <span className="text-muted-foreground text-xl font-normal font-jp">joshūshi</span>
            </h1>
            <p className="text-muted-foreground mt-0.5">
              Les classificateurs numériques — comment compter selon la forme des objets
            </p>
          </div>
        </div>

        {/* stats ribbon */}
        <div className="mt-4 flex flex-wrap gap-3">
          {categories.map((cat) => {
            const count = COUNTERS.filter((c) => c.category === cat).length
            const color = CATEGORY_COLORS[cat] ?? 'bg-muted text-muted-foreground'
            return (
              <span
                key={cat}
                className={cn('text-xs font-medium px-3 py-1 rounded-full', color)}
              >
                {cat} · {count}
              </span>
            )
          })}
        </div>
      </div>

      <SystemeEcritureInfo {...COMPTEURS_INFO} />

      {/* tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {(
          [
            ['apprendre', 'Apprendre'],
            ['quiz', 'Quiz'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── apprendre tab ── */}
      {tab === 'apprendre' && (
        <div className="space-y-5">
          {/* category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                !activeCategory
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              Tous ({COUNTERS.length})
            </button>
            {categories.map((cat) => {
              const count = COUNTERS.filter((c) => c.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    activeCategory === cat
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>

          {/* tip */}
          <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3">
            Clique sur une carte pour afficher les lectures 1 → 10. Les lectures en orange sont irrégulières et méritent une attention particulière.
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((counter) => (
              <CounterCard
                key={counter.id}
                counter={counter}
                isExpanded={expandedId === counter.id}
                onToggle={() => toggleExpand(counter.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── quiz tab ── */}
      {tab === 'quiz' && (
        <div>
          <div className="mb-5 text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3">
            {COUNTERS.length} compteurs × 10 nombres ={' '}
            <span className="font-semibold text-foreground">{COUNTERS.length * 10} questions</span>.
            Les questions sont mélangées aléatoirement à chaque session.
          </div>
          <QuizTab key="quiz-tab" />
        </div>
      )}
    </div>
  )
}
