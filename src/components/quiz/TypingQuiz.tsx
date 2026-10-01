import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { SpeakButton } from '@/components/SpeakButton'
import type { KanaCharacter } from '@/types/kana'

const ROMAJI_ALTS: Record<string, string[]> = {
  shi: ['si'], chi: ['ti'], tsu: ['tu'], fu: ['hu'],
  ji: ['zi', 'di'], dzu: ['zu'], wo: ['o'],
  sha: ['sya'], shi_: ['si'], shu: ['syu'], sho: ['syo'],
  cha: ['tya'], chu: ['tyu'], cho: ['tyo'],
  ja: ['jya', 'zya'], ju: ['jyu', 'zyu'], jo: ['jyo', 'zyo'],
}

function checkRomaji(input: string, correct: string): boolean {
  const norm = input.trim().toLowerCase()
  const canon = correct.toLowerCase()
  if (norm === canon) return true
  const alts = ROMAJI_ALTS[canon] ?? []
  return alts.includes(norm)
}

interface TypingQuizProps {
  card: KanaCharacter
  selected: string | null
  phase: 'question' | 'feedback' | 'complete'
  score: number
  currentIndex: number
  total: number
  onAnswer: (id: string) => void
  onNext: () => void
}

export function TypingQuiz({ card, selected, phase, score, currentIndex, total, onAnswer, onNext }: TypingQuizProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isCorrect = selected === card.id

  useEffect(() => {
    setInput('')
    if (phase === 'question') inputRef.current?.focus()
  }, [card.id, phase])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (phase === 'feedback' && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight')) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, onNext])

  const submit = () => {
    if (phase !== 'question' || !input.trim()) return
    onAnswer(checkRomaji(input, card.romaji) ? card.id : '__wrong__')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentIndex / total) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{currentIndex + 1}/{total}</span>
        <span className="text-xs font-bold text-primary shrink-0">{score} pts</span>
      </div>

      {/* Card */}
      <div className={cn(
        'bg-card border rounded-2xl p-8 text-center transition-all',
        phase === 'feedback' && isCorrect  && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80',
        phase === 'feedback' && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/80',
        phase === 'question' && 'border-border',
      )}>
        <p className="text-xs text-muted-foreground mb-4 tracking-wide">Tape la lecture en romaji</p>
        <div className={cn(
          'font-jp-serif text-8xl leading-none mb-3 transition-colors',
          phase === 'feedback' && isCorrect  && 'text-emerald-600 dark:text-emerald-400',
          phase === 'feedback' && !isCorrect && 'text-red-500 dark:text-red-400',
        )}>
          {card.kana}
        </div>
        <p className="text-xs text-muted-foreground">{card.frenchPhonetic}</p>
      </div>

      {/* Input */}
      {phase === 'question' && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit() }}
            placeholder="ex : ka, shi, tsu…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-base font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            OK
          </button>
        </div>
      )}

      {/* Feedback bar */}
      {phase === 'feedback' && (
        <div className={cn(
          'rounded-xl px-4 py-3 flex items-center justify-between gap-3 animate-fade-up',
          isCorrect
            ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/60'
            : 'bg-red-50 border border-red-200 dark:bg-red-950/90 dark:border-red-800/60',
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <SpeakButton text={card.kana} size="sm" className="shrink-0" />
            <div>
              {isCorrect ? (
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  正解！&nbsp;<span className="font-normal opacity-75">Parfait !</span>
                </p>
              ) : (
                <div>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">不正解</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Réponse : <span className="font-semibold text-foreground font-mono">{card.romaji}</span>
                    {input.trim() && (
                      <span className="ml-1 opacity-60">— tu as écrit <span className="font-mono">{input.trim()}</span></span>
                    )}
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
