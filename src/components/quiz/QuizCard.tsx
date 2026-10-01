import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SpeakButton } from '@/components/SpeakButton'

interface Choice {
  id: string
  label: string
}

interface QuizCardProps {
  question: string
  questionSub?: string
  questionLabel?: string
  speakText?: string
  choices: Choice[]
  selected: string | null
  correctId: string
  phase: 'question' | 'feedback' | 'complete'
  onAnswer: (id: string) => void
  onNext: () => void
  score: number
  currentIndex: number
  total: number
}

export function QuizCard({
  question,
  questionSub,
  questionLabel = 'Comment lit-on ce caractère ?',
  speakText,
  choices,
  selected,
  correctId,
  phase,
  onAnswer,
  onNext,
  score,
  currentIndex,
  total,
}: QuizCardProps) {
  const isCorrect = selected === correctId

  // Keyboard shortcuts: 1-4 to pick answer, Space/Enter to go next
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (phase === 'question') {
        const idx = parseInt(e.key) - 1
        if (idx >= 0 && idx < choices.length) {
          e.preventDefault()
          onAnswer(choices[idx].id)
        }
      } else if (phase === 'feedback') {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault()
          onNext()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, choices, onAnswer, onNext])

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{currentIndex + 1}/{total}</span>
        <span className="text-xs font-bold text-primary shrink-0">{score} pts</span>
      </div>

      {/* Question */}
      <div
        className={cn(
          'bg-card border rounded-2xl p-8 text-center transition-all backdrop-blur-sm',
          phase === 'feedback' && isCorrect  && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80',
          phase === 'feedback' && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/80',
          phase === 'question' && 'border-border'
        )}
      >
        <p className="text-xs text-muted-foreground mb-4 tracking-wide">{questionLabel}</p>

        <div className="relative inline-block">
          <div
            className={cn(
              'font-jp-serif leading-none mb-3',
              'text-8xl',
              phase === 'question' && 'animate-question-3d',
              phase === 'feedback' && isCorrect  && 'text-emerald-600 dark:text-emerald-400',
              phase === 'feedback' && !isCorrect && 'text-red-500 dark:text-red-400',
            )}
          >
            {question}
          </div>

          {/* Stamp overlay on correct */}
          {phase === 'feedback' && isCorrect && (
            <div className="absolute -top-2 -right-6 animate-stamp pointer-events-none">
              <span className="font-jp-serif text-2xl font-bold text-emerald-500 border-2 border-emerald-500 rounded px-1 py-0.5 leading-none opacity-90 rotate-[-12deg] inline-block">
                正解
              </span>
            </div>
          )}
        </div>

        {questionSub && <p className="text-sm text-muted-foreground">{questionSub}</p>}
      </div>

      {/* Choices */}
      <div
        className={cn(
          'grid grid-cols-2 gap-3',
          phase === 'feedback' && !isCorrect && 'animate-shake'
        )}
      >
        {choices.map(choice => {
          const isSelected = selected === choice.id
          const isRight = choice.id === correctId

          let cls = 'border-border bg-card backdrop-blur-sm hover:bg-muted hover:border-primary/40 hover:shadow-sm'
          if (phase === 'feedback') {
            if (isRight)                cls = 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/90 dark:text-emerald-400 shadow-sm'
            else if (isSelected && !isRight) cls = 'border-red-400 bg-red-50 text-red-600 dark:bg-red-950/90 dark:text-red-400'
          }

          const choiceIdx = choices.indexOf(choice) + 1
          return (
            <button
              key={choice.id}
              onClick={() => phase === 'question' && onAnswer(choice.id)}
              disabled={phase === 'feedback'}
              className={cn(
                'relative p-4 rounded-xl border text-center transition-all font-medium text-sm cursor-pointer disabled:cursor-default',
                cls
              )}
            >
              {phase === 'question' && (
                <span className="absolute top-1.5 left-2 text-[9px] font-mono opacity-30">{choiceIdx}</span>
              )}
              {choice.label}
            </button>
          )
        })}
      </div>

      {/* Feedback bar */}
      {phase === 'feedback' && (
        <div className={cn(
          'rounded-xl px-4 py-3 flex items-center justify-between gap-3 animate-fade-up',
          isCorrect
            ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/60 backdrop-blur-sm'
            : 'bg-red-50 border border-red-200 dark:bg-red-950/90 dark:border-red-800/60 backdrop-blur-sm'
        )}>
          <div className="flex items-center gap-2 min-w-0">
            {speakText && <SpeakButton text={speakText} size="sm" className="shrink-0" />}
            <div>
              {isCorrect ? (
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  正解！&nbsp;<span className="font-normal opacity-75">Parfait !</span>
                </p>
              ) : (
                <div>
                  <p className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wide mb-0.5">不正解</p>
                  <p className="text-base font-bold text-foreground">
                    {choices.find(c => c.id === correctId)?.label}
                  </p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0 cursor-pointer"
          >
            次へ
            <kbd className="text-[9px] opacity-60 bg-white/20 px-1 py-0.5 rounded font-mono">↵</kbd>
          </button>
        </div>
      )}
    </div>
  )
}
