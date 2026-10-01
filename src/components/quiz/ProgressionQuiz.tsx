import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { KanaCharacter, KanaRow } from '@/types/kana'

interface Props {
  rows: KanaRow[]
  allKana: KanaCharacter[]
}

type Phase = 'question' | 'feedback' | 'row-done' | 'all-done'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function ProgressionQuiz({ rows, allKana }: Props) {
  const [rowIndex, setRowIndex] = useState(0)
  const [remaining, setRemaining] = useState<string[]>(() => rows[0].characters.map(c => c.id))
  const [passed, setPassed] = useState<string[]>([])
  const [removed, setRemoved] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('question')
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [choices, setChoices] = useState<KanaCharacter[]>([])

  const currentRow = rows[rowIndex]
  const currentKana = allKana.find(k => k.id === remaining[0])

  useEffect(() => {
    if (!currentKana || phase !== 'question') return
    const wrong = shuffle(allKana.filter(k => k.id !== currentKana.id && !k.isDigraph)).slice(0, 3)
    setChoices(shuffle([currentKana, ...wrong]))
  }, [remaining[0], phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (id: string) => {
    if (phase !== 'question' || !currentKana) return
    setLastCorrect(id === currentKana.id)
    setPhase('feedback')
  }

  const handleNext = () => {
    if (!currentKana) return
    const nextPassed   = lastCorrect ? [...passed, currentKana.id] : passed
    const nextRemoved  = lastCorrect ? removed : [...removed, currentKana.id]
    const nextRemaining = remaining.slice(1)
    setPassed(nextPassed)
    setRemoved(nextRemoved)
    setRemaining(nextRemaining)
    if (nextRemaining.length === 0) {
      setPhase(rowIndex + 1 >= rows.length ? 'all-done' : 'row-done')
    } else {
      setPhase('question')
    }
  }

  const goToNextRow = () => {
    const next = rowIndex + 1
    setRowIndex(next)
    setRemaining(rows[next].characters.map(c => c.id))
    setPassed([]); setRemoved([]); setLastCorrect(null); setPhase('question')
  }

  const restart = () => {
    setRowIndex(0); setRemaining(rows[0].characters.map(c => c.id))
    setPassed([]); setRemoved([]); setLastCorrect(null); setPhase('question')
  }

  if (phase === 'all-done') return (
    <div className="text-center space-y-5 py-6">
      <p className="text-4xl">🎉</p>
      <div>
        <p className="text-xl font-bold text-foreground">Toutes les lignes terminées !</p>
        <p className="text-sm text-muted-foreground mt-1">Tu as parcouru les {rows.length} lignes.</p>
      </div>
      <button onClick={restart} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
        Recommencer depuis le début
      </button>
    </div>
  )

  if (phase === 'row-done') return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{currentRow.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Ligne terminée</p>
      </div>
      <div className="flex justify-center gap-3 flex-wrap">
        {currentRow.characters.map(k => (
          <div key={k.id} className={cn(
            'flex flex-col items-center gap-1 p-3 rounded-xl border text-center w-16',
            passed.includes(k.id)  && 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-700',
            removed.includes(k.id) && 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800',
            !passed.includes(k.id) && !removed.includes(k.id) && 'bg-muted border-border',
          )}>
            <span className="font-jp text-2xl leading-none">{k.kana}</span>
            <span className="text-xs text-muted-foreground font-mono">{k.romaji}</span>
            <span className="text-xs">{passed.includes(k.id) ? '✓' : removed.includes(k.id) ? '✗' : ''}</span>
          </div>
        ))}
      </div>
      {removed.length > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          {removed.length} kana à revoir — entraîne-toi avec le mode quiz classique.
        </p>
      )}
      {rowIndex + 1 < rows.length && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Prochaine ligne : <span className="font-medium text-foreground">{rows[rowIndex + 1].label}</span>
          </p>
          <button onClick={goToNextRow} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
            Ligne suivante →
          </button>
        </div>
      )}
    </div>
  )

  if (!currentKana) return null

  const doneCount = passed.length + removed.length

  return (
    <div className="space-y-4">
      {/* Row progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{currentRow.label}</p>
          <p className="text-xs text-muted-foreground">{doneCount}/{currentRow.characters.length}</p>
        </div>
        <div className="flex gap-1.5">
          {currentRow.characters.map(k => (
            <div key={k.id} className={cn(
              'flex-1 h-2 rounded-full transition-all',
              passed.includes(k.id)  && 'bg-emerald-500',
              removed.includes(k.id) && 'bg-red-400',
              k.id === currentKana.id && !passed.includes(k.id) && !removed.includes(k.id) && 'bg-primary',
              !passed.includes(k.id) && !removed.includes(k.id) && k.id !== currentKana.id && 'bg-muted',
            )} />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className={cn(
        'bg-card border rounded-2xl p-8 text-center transition-colors duration-150',
        phase === 'feedback' && lastCorrect  && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
        phase === 'feedback' && !lastCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/50',
        phase === 'question' && 'border-border',
      )}>
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Quel est le romaji ?</p>
        <p className="font-jp-serif text-8xl leading-none">{currentKana.kana}</p>
        {phase === 'feedback' && (
          <p className="text-sm text-muted-foreground mt-3">{currentKana.frenchPhonetic}</p>
        )}
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map(choice => {
          let cls = 'border-border bg-card hover:bg-muted hover:border-primary/40 text-foreground'
          if (phase === 'feedback') {
            if (choice.id === currentKana.id) cls = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
            else cls = 'border-border bg-card opacity-40 text-muted-foreground'
          }
          return (
            <button key={choice.id} onClick={() => handleAnswer(choice.id)} disabled={phase === 'feedback'}
              className={cn('p-4 rounded-xl border text-sm font-mono font-bold text-center uppercase tracking-widest transition-all disabled:cursor-default', cls)}>
              {choice.romaji}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {phase === 'feedback' && (
        <div className={cn(
          'rounded-xl px-4 py-3 flex items-center justify-between',
          lastCorrect
            ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/60'
            : 'bg-red-50 border border-red-200 dark:bg-red-950/90 dark:border-red-800/60'
        )}>
          <div>
            {lastCorrect
              ? <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">正解！ Parfait !</p>
              : <div>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">不正解 — kana retiré de la session</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-jp">{currentKana.kana}</span> = <span className="font-mono font-bold">{currentKana.romaji}</span>
                  </p>
                </div>
            }
          </div>
          <button onClick={handleNext} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            次へ
          </button>
        </div>
      )}
    </div>
  )
}
