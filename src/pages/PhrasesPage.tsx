import { useState, useMemo, useCallback } from 'react'
import { MessageSquare, ChevronDown, ChevronUp, Brain, BookOpen } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { SystemeEcritureInfo, PHRASES_INFO } from '@/components/SystemeEcritureInfo'
import { PHRASES, PHRASE_CATEGORIES } from '@/data/phrases'
import type { PhraseCategory } from '@/data/phrases'
import { cn } from '@/lib/utils'

function PhraseCard({ phrase }: { phrase: typeof PHRASES[0] }) {
  const [showRomaji, setShowRomaji] = useState(false)
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 space-y-1 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-jp text-lg font-semibold leading-snug">{phrase.japanese}</p>
          <p className="font-jp text-sm text-muted-foreground mt-0.5">{phrase.kana}</p>
          {showRomaji && (
            <p className="text-xs text-primary font-semibold tracking-wide mt-0.5">{phrase.romaji}</p>
          )}
        </div>
        <SpeakButton text={phrase.japanese} />
      </div>
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <p className="text-sm text-foreground">{phrase.frenchTranslation}</p>
        <button
          onClick={() => setShowRomaji(v => !v)}
          className="text-[10px] text-muted-foreground hover:text-primary transition-colors shrink-0 flex items-center gap-0.5"
        >
          Romaji {showRomaji ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>
      </div>
      {phrase.notes && (
        <p className="text-xs text-muted-foreground/70 italic border-t border-border/50 pt-1.5 mt-1">{phrase.notes}</p>
      )}
    </div>
  )
}

// ── Quiz ────────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuizDeck(pool: typeof PHRASES) {
  return shuffle(pool).map(phrase => {
    const wrong = shuffle(pool.filter(p => p.id !== phrase.id)).slice(0, 3)
    const choices = shuffle([phrase, ...wrong])
    return { phrase, choices }
  })
}

interface QuizState {
  deck: ReturnType<typeof buildQuizDeck>
  index: number
  selected: string | null
  score: number
  phase: 'question' | 'feedback' | 'done'
}

function PhraseQuiz({ pool }: { pool: typeof PHRASES }) {
  const initState = useCallback((): QuizState => ({
    deck: buildQuizDeck(pool),
    index: 0,
    selected: null,
    score: 0,
    phase: 'question',
  }), [pool])

  const [state, setState] = useState<QuizState>(initState)

  const current = state.deck[state.index]
  const isCorrect = state.selected === current?.phrase.id

  const answer = (id: string) => {
    if (state.phase !== 'question') return
    setState(s => ({
      ...s,
      selected: id,
      score: id === s.deck[s.index].phrase.id ? s.score + 1 : s.score,
      phase: 'feedback',
    }))
  }

  const next = () => {
    const nextIndex = state.index + 1
    if (nextIndex >= state.deck.length) {
      setState(s => ({ ...s, phase: 'done' }))
    } else {
      setState(s => ({ ...s, index: nextIndex, selected: null, phase: 'question' }))
    }
  }

  const restart = () => setState(initState())

  if (state.phase === 'done') {
    const pct = Math.round((state.score / state.deck.length) * 100)
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-8">
        <div>
          <p className="text-6xl font-bold text-primary">{pct}%</p>
          <p className="text-muted-foreground mt-1">{state.score} / {state.deck.length} bonnes réponses</p>
        </div>
        <p className="text-2xl font-jp">
          {pct >= 80 ? '素晴らしい！' : pct >= 50 ? 'まあまあ' : 'もう一度！'}
        </p>
        <button
          onClick={restart}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Recommencer
        </button>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(state.index / state.deck.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{state.index + 1}/{state.deck.length}</span>
        <span className="text-xs font-bold text-primary shrink-0">{state.score} pts</span>
      </div>

      {/* Question */}
      <div className={cn(
        'bg-card border rounded-2xl p-6 text-center transition-all',
        state.phase === 'feedback' && isCorrect && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80',
        state.phase === 'feedback' && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/80',
        state.phase === 'question' && 'border-border'
      )}>
        <p className="text-xs text-muted-foreground mb-3 tracking-wide">Choisis la bonne traduction japonaise</p>
        <p className="text-xl font-semibold">{current.phrase.frenchTranslation}</p>
        {current.phrase.notes && (
          <p className="text-xs text-muted-foreground/70 italic mt-2">{current.phrase.notes}</p>
        )}
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 gap-2.5">
        {current.choices.map(choice => {
          const isSelected = state.selected === choice.id
          const isRight = choice.id === current.phrase.id
          let cls = 'border-border bg-card hover:bg-muted hover:border-primary/40 text-foreground'
          if (state.phase === 'feedback') {
            if (isRight) cls = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400'
            else cls = 'border-border bg-card opacity-40 text-muted-foreground'
          }
          return (
            <button
              key={choice.id}
              onClick={() => answer(choice.id)}
              disabled={state.phase === 'feedback'}
              className={cn('w-full px-4 py-3 rounded-xl border text-left transition-all disabled:cursor-default', cls)}
            >
              <span className="font-jp font-semibold text-base">{choice.japanese}</span>
              <span className="text-xs text-muted-foreground ml-2">{choice.romaji}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback bar */}
      {state.phase === 'feedback' && (
        <div className={cn(
          'rounded-xl px-4 py-3 flex items-center justify-between',
          isCorrect
            ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/60'
            : 'bg-red-50 border border-red-200 dark:bg-red-950/90 dark:border-red-800/60'
        )}>
          <div>
            {isCorrect ? (
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">正解！ Parfait !</p>
            ) : (
              <div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">不正解</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Réponse : <span className="font-jp">{current.phrase.japanese}</span>
                </p>
              </div>
            )}
          </div>
          <button
            onClick={next}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export function PhrasesPage() {
  const [tab, setTab] = useState<'apprendre' | 'quiz'>('apprendre')
  const [activeCategory, setActiveCategory] = useState<PhraseCategory | null>(null)

  const filtered = useMemo(
    () => activeCategory ? PHRASES.filter(p => p.category === activeCategory) : PHRASES,
    [activeCategory]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={20} className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Phrases <span className="font-jp">表現</span></h1>
          </div>
          <p className="text-muted-foreground">Expressions essentielles pour survivre au Japon</p>
        </div>
      </div>

      <SystemeEcritureInfo {...PHRASES_INFO} />

      {/* Tab bar */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {([['apprendre', 'Apprendre', BookOpen], ['quiz', 'Quiz', Brain]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'quiz' ? (
        <PhraseQuiz pool={activeCategory ? filtered : PHRASES} />
      ) : (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                activeCategory === null
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}
            >
              Toutes ({PHRASES.length})
            </button>
            {PHRASE_CATEGORIES.map(cat => {
              const count = PHRASES.filter(p => p.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                    activeCategory === cat.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {cat.label} ({count})
                </button>
              )
            })}
          </div>

          {/* Phrases */}
          {activeCategory ? (
            <div className="space-y-2">
              {filtered.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)}
            </div>
          ) : (
            <div className="space-y-8">
              {PHRASE_CATEGORIES.map(cat => {
                const catPhrases = PHRASES.filter(p => p.category === cat.id)
                return (
                  <div key={cat.id}>
                    <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-3', cat.color)}>
                      <span>{cat.label}</span>
                      <span className="font-jp">{cat.labelJP}</span>
                    </div>
                    <div className="space-y-2">
                      {catPhrases.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
