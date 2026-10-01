import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, RotateCcw, CheckCircle2, XCircle, Trophy } from 'lucide-react'
import { EXERCISES, PARTICLE_INFO } from '@/data/particules'
import { SystemeEcritureInfo, PARTICULES_INFO } from '@/components/SystemeEcritureInfo'
import type { ParticleExercise, ParticleInfo } from '@/data/particules'
import { cn } from '@/lib/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ALL_PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'から', 'まで', 'より']

const JLPT_COLORS: Record<string, string> = {
  N5: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  N4: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  N3: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Render sentence with the blank shown as the particle slot
function SentenceDisplay({ sentence, reveal }: { sentence: string; reveal?: string }) {
  const parts = sentence.split('___')
  return (
    <span className="font-jp text-2xl font-semibold leading-relaxed">
      {parts[0]}
      <span className={cn(
        'inline-flex items-center justify-center min-w-[2.5rem] px-2 mx-0.5 rounded-lg border-2 transition-colors',
        reveal
          ? 'border-primary/60 bg-primary/10 text-primary'
          : 'border-dashed border-border text-muted-foreground'
      )}>
        {reveal ?? '＿'}
      </span>
      {parts[1]}
    </span>
  )
}

// ─── Reference Tab ────────────────────────────────────────────────────────────

function ParticleCard({ info }: { info: ParticleInfo }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn(
      'bg-card border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm cursor-pointer',
      open ? 'border-primary/40 shadow-md' : 'border-border hover:border-primary/20'
    )}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Big particle */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="font-jp-serif text-3xl text-primary font-bold">
            {info.particle}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Readings */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {info.readings.map(r => (
              <span key={r} className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {r}
              </span>
            ))}
          </div>
          {/* First use as preview */}
          <p className="text-sm text-muted-foreground truncate">{info.uses[0]}</p>
        </div>

        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0',
          open ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-muted/30 p-4 space-y-4">
          {/* Uses */}
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Usages</p>
            <ul className="space-y-1.5">
              {info.uses.map((use, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  {use}
                </li>
              ))}
            </ul>
          </div>

          {/* Examples */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Exemples</p>
            <div className="space-y-2">
              {info.examples.map((ex, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3 flex gap-3">
                  <span className="text-primary font-bold text-xs mt-0.5 shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-jp font-semibold text-base">{ex.jp}</p>
                    <p className="text-sm mt-0.5 text-muted-foreground">{ex.fr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ReferenceTab() {
  return (
    <div className="space-y-3">
      {PARTICLE_INFO.map(info => (
        <ParticleCard key={info.particle} info={info} />
      ))}
    </div>
  )
}

// ─── Exercises Tab ────────────────────────────────────────────────────────────

type AnswerState = 'idle' | 'correct' | 'incorrect'

function ExercisesTab() {
  const [filterParticle, setFilterParticle] = useState<string>('Tous')
  const [queue, setQueue] = useState<ParticleExercise[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)

  // Build queue whenever filter changes
  useEffect(() => {
    const filtered =
      filterParticle === 'Tous'
        ? EXERCISES
        : EXERCISES.filter(e => e.particle === filterParticle)
    setQueue(shuffle(filtered))
    setIndex(0)
    setScore(0)
    setAnswerState('idle')
    setChosenAnswer(null)
    setShowExplanation(false)
    setFinished(false)
  }, [filterParticle])

  const current = queue[index]

  function handleChoice(choice: string) {
    if (answerState !== 'idle') return
    setChosenAnswer(choice)
    if (choice === current.answer) {
      setAnswerState('correct')
      setScore(s => s + 1)
    } else {
      setAnswerState('incorrect')
    }
    setShowExplanation(true)
  }

  function handleNext() {
    if (index + 1 >= queue.length) {
      setFinished(true)
      return
    }
    setIndex(i => i + 1)
    setAnswerState('idle')
    setChosenAnswer(null)
    setShowExplanation(false)
  }

  function restart() {
    setQueue(shuffle(queue))
    setIndex(0)
    setScore(0)
    setAnswerState('idle')
    setChosenAnswer(null)
    setShowExplanation(false)
    setFinished(false)
  }

  const total = queue.length
  const progress = total > 0 ? ((index + (answerState !== 'idle' ? 1 : 0)) / total) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Particle filter */}
      <div className="flex flex-wrap gap-2">
        {['Tous', ...ALL_PARTICLES].map(p => (
          <button
            key={p}
            onClick={() => setFilterParticle(p)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-sm font-semibold transition-all',
              p === 'Tous' ? 'font-sans' : 'font-jp-serif text-base',
              filterParticle === p
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* No exercises */}
      {total === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Aucun exercice pour cette particule.</p>
        </div>
      )}

      {/* Finished screen */}
      {finished && total > 0 && (
        <div className="bg-card border border-primary/20 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Trophy size={28} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{score} / {total}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {score === total
                ? 'Parfait ! Toutes les réponses sont correctes.'
                : score >= total * 0.8
                ? 'Très bien ! Continuez comme ça.'
                : score >= total * 0.5
                ? 'Pas mal. Un peu de pratique supplémentaire sera utile.'
                : 'Continuez à vous entraîner, vous allez progresser.'}
            </p>
          </div>
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/25"
          >
            <RotateCcw size={15} />
            Recommencer
          </button>
        </div>
      )}

      {/* Exercise card */}
      {!finished && current && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {index + (answerState !== 'idle' ? 1 : 0)} / {total}
              </span>
              <span className="font-semibold text-primary">Score : {score}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className={cn(
            'bg-card border-2 rounded-2xl p-6 shadow-sm transition-all duration-300',
            answerState === 'correct'
              ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10'
              : answerState === 'incorrect'
              ? 'border-red-400 bg-red-50/30 dark:bg-red-900/10'
              : 'border-border'
          )}>
            {/* JLPT badge */}
            <div className="flex items-center justify-between mb-5">
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide', JLPT_COLORS[current.jlpt])}>
                {current.jlpt}
              </span>
              {answerState !== 'idle' && (
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  {answerState === 'correct'
                    ? <><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Correct !</span></>
                    : <><XCircle size={16} className="text-red-500" /><span className="text-red-600 dark:text-red-400">Incorrect</span></>
                  }
                </div>
              )}
            </div>

            {/* Sentence */}
            <div className="text-center py-4">
              <SentenceDisplay
                sentence={current.sentence}
                reveal={answerState !== 'idle' ? current.answer : undefined}
              />
            </div>

            {/* Translation */}
            <p className="text-center text-muted-foreground text-sm mt-2 mb-6">
              {current.translation}
            </p>

            {/* Choices */}
            <div className="grid grid-cols-2 gap-3">
              {current.options.map(opt => {
                const isChosen = opt === chosenAnswer
                const isCorrect = opt === current.answer
                let variant = 'idle'
                if (answerState !== 'idle') {
                  if (isCorrect) variant = 'correct'
                  else if (isChosen) variant = 'wrong'
                  else variant = 'disabled'
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleChoice(opt)}
                    disabled={answerState !== 'idle'}
                    className={cn(
                      'py-3 px-4 rounded-xl font-jp-serif text-2xl font-semibold transition-all duration-200 border-2',
                      variant === 'idle'
                        ? 'bg-muted border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
                        : variant === 'correct'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                        : variant === 'wrong'
                        ? 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300'
                        : 'bg-muted border-border text-muted-foreground opacity-50'
                    )}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={cn(
                'mt-4 p-3 rounded-xl border text-sm leading-relaxed',
                answerState === 'correct'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              )}>
                {answerState === 'incorrect' && (
                  <p className="font-semibold mb-1">
                    Réponse correcte : <span className="font-jp-serif text-lg">{current.answer}</span>
                  </p>
                )}
                <p>{current.explanation}</p>
              </div>
            )}
          </div>

          {/* Next button */}
          {answerState !== 'idle' && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
            >
              {index + 1 >= total ? 'Voir les résultats' : 'Question suivante →'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'reference' | 'exercices'

export function ParticulesPage() {
  const [tab, setTab] = useState<Tab>('reference')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Particules
              <span className="font-jp-serif text-primary text-3xl">助詞</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Les particules grammaticales du japonais : rôles, usages et exercices
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {ALL_PARTICLES.slice(0, 6).map(p => (
              <span key={p} className="font-jp-serif text-lg text-muted-foreground font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SystemeEcritureInfo {...PARTICULES_INFO} />

      {/* Tabs */}
      <div className="flex gap-2 bg-muted p-1 rounded-xl">
        {([
          { key: 'reference' as Tab, label: 'Référence', jp: '参照' },
          { key: 'exercices' as Tab, label: 'Exercices', jp: '練習' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all',
              tab === t.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
            <span className={cn('font-jp-serif text-xs', tab === t.key ? 'text-primary' : 'text-muted-foreground')}>
              {t.jp}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'reference' ? <ReferenceTab /> : <ExercisesTab />}
    </div>
  )
}
