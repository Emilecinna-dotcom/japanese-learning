import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Trophy, BookOpen } from 'lucide-react'
import { GRAMMAR_EXERCISES } from '@/data/exercices-grammaire'
import { SpeakButton } from '@/components/SpeakButton'
import { cn } from '@/lib/utils'

const LEVEL_COLORS = {
  N5: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  N4: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
}

function SentenceWithBlank({ sentence, reveal, correct }: { sentence: string; reveal?: string; correct?: boolean }) {
  const parts = sentence.split('_____')
  return (
    <span className="font-jp text-2xl font-semibold leading-relaxed tracking-wide">
      {parts[0]}
      <span className={cn(
        'inline-flex items-center justify-center min-w-[3rem] px-2 mx-1 rounded-lg border-2 transition-all duration-200 font-bold',
        reveal === undefined
          ? 'border-dashed border-border text-transparent select-none'
          : correct
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
            : 'border-red-400 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
      )}>
        {reveal ?? '＿'}
      </span>
      {parts[1]}
    </span>
  )
}

interface ExerciseCardProps {
  exercise: typeof GRAMMAR_EXERCISES[0]
  index: number
  total: number
  onAnswer: (correct: boolean) => void
}

function ExerciseCard({ exercise, index, total, onAnswer }: ExerciseCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === exercise.correct
  const answered = selected !== null

  const handleSelect = (choice: string) => {
    if (answered) return
    setSelected(choice)
    onAnswer(choice === exercise.correct)
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{index + 1} / {total}</span>
        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide', LEVEL_COLORS[exercise.level])}>
          {exercise.level}
        </span>
      </div>

      {/* Phrase */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
        <p className="text-sm text-muted-foreground font-medium">{exercise.translation}</p>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <SentenceWithBlank
              sentence={exercise.sentence}
              reveal={selected ?? undefined}
              correct={isCorrect}
            />
            {answered && (
              <p className="font-jp text-sm text-muted-foreground mt-1.5">
                {exercise.kana.replace('___', exercise.correct)}
              </p>
            )}
          </div>
          {answered && (
            <SpeakButton
              text={exercise.sentence.replace('_____', exercise.correct)}
              size="sm"
              className="shrink-0 mt-1"
            />
          )}
        </div>
      </div>

      {/* Choix */}
      <div className="grid grid-cols-2 gap-3">
        {exercise.choices.map(choice => {
          const isSelected = selected === choice
          const isRight = choice === exercise.correct
          let cls = 'border-border bg-card hover:bg-muted hover:border-primary/40'
          if (answered) {
            if (isRight) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
            else if (isSelected && !isRight) cls = 'border-red-400 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
            else cls = 'border-border bg-card opacity-50'
          }
          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              disabled={answered}
              className={cn(
                'font-jp text-2xl font-semibold py-4 px-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2',
                cls,
                !answered && 'cursor-pointer active:scale-95'
              )}
            >
              {choice}
              {answered && isRight && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
              {answered && isSelected && !isRight && <XCircle size={16} className="text-red-400 shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Explication */}
      {answered && (
        <div className={cn(
          'rounded-xl p-4 border text-sm leading-relaxed animate-fade-up',
          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200'
        )}>
          {isCorrect ? '✓ ' : '→ Bonne réponse : '}<span className="font-jp font-bold">{exercise.correct}</span>
          {' — '}{exercise.explanation}
        </div>
      )}
    </div>
  )
}

export function ExercicesPage() {
  const [levelFilter, setLevelFilter] = useState<'tous' | 'N5' | 'N4'>('tous')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answeredCurrent, setAnsweredCurrent] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)

  const exercises = useMemo(() => {
    const pool = levelFilter === 'tous' ? GRAMMAR_EXERCISES : GRAMMAR_EXERCISES.filter(e => e.level === levelFilter)
    return [...pool].sort(() => Math.random() - 0.5)
  }, [levelFilter, sessionKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = exercises[currentIdx]

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(s => s + 1)
    setAnsweredCurrent(true)
  }

  const handleNext = () => {
    if (currentIdx + 1 >= exercises.length) {
      setFinished(true)
    } else {
      setCurrentIdx(i => i + 1)
      setAnsweredCurrent(false)
    }
  }

  const restart = () => {
    setCurrentIdx(0)
    setScore(0)
    setFinished(false)
    setAnsweredCurrent(false)
    setSessionKey(k => k + 1)
  }

  const pct = Math.round((score / exercises.length) * 100)

  if (finished) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Exercices <span className="font-jp text-primary">練習</span>
          </h1>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-5 text-center">
          <Trophy size={40} className="text-amber-400" />
          <div>
            <p className="text-3xl font-bold tabular-nums">{score}/{exercises.length}</p>
            <p className="text-muted-foreground mt-1">{pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué.' : 'Continue à pratiquer.'}</p>
          </div>
          <div className="w-full max-w-xs h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-primary')}
              style={{ width: `${pct}%` }}
            />
          </div>
          <button
            onClick={restart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <RotateCcw size={15} />
            Recommencer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Exercices <span className="font-jp text-2xl">練習</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Complète les phrases — choisis le bon élément grammatical</p>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
            {(['tous', 'N5', 'N4'] as const).map(lv => (
              <button
                key={lv}
                onClick={() => { setLevelFilter(lv); restart() }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                  levelFilter === lv ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentIdx / exercises.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">{score} ✓</span>
        </div>
      </div>

      {current && (
        <ExerciseCard
          key={`${sessionKey}-${currentIdx}`}
          exercise={current}
          index={currentIdx}
          total={exercises.length}
          onAnswer={handleAnswer}
        />
      )}

      {answeredCurrent && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {currentIdx + 1 >= exercises.length ? (
            <><Trophy size={16} /> Voir les résultats</>
          ) : (
            <><BookOpen size={16} /> Question suivante</>
          )}
        </button>
      )}
    </div>
  )
}
