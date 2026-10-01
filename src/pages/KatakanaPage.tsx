import { useState, useMemo, useEffect } from 'react'
import { Brain, BookOpen, Volume2, Keyboard, Layers } from 'lucide-react'
import { SystemeEcritureInfo, KATAKANA_INFO } from '@/components/SystemeEcritureInfo'
import { ProgressionQuiz } from '@/components/quiz/ProgressionQuiz'
import { useSpeech } from '@/hooks/useSpeech'
import { KATAKANA_ROWS, KATAKANA_YOUON, ALL_KATAKANA } from '@/data/katakana'
import { KanaCard } from '@/components/kana/KanaCard'
import { KanaDetailPanel } from '@/components/kana/KanaDetailPanel'
import { useKanaQuiz } from '@/hooks/useKanaQuiz'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizResult } from '@/components/quiz/QuizResult'
import { TypingQuiz } from '@/components/quiz/TypingQuiz'
import { useProgressContext } from '@/hooks/useProgress'
import { cn } from '@/lib/utils'
import type { KanaCharacter } from '@/types/kana'

type QuizMode = 'kana' | 'romaji' | 'audio' | 'frappe' | 'progression'

const YOUON_GROUPS = Object.values(
  KATAKANA_YOUON.reduce<Record<string, KanaCharacter[]>>((acc, c) => {
    if (!acc[c.row]) acc[c.row] = []
    acc[c.row].push(c)
    return acc
  }, {})
)

const YOUON_ROW_LABELS: Record<string, string> = {
  'k-youon':  'K + Y (キャ行)', 'sh-youon': 'SH (シャ行)', 'ch-youon': 'CH (チャ行)',
  'ny-youon': 'N + Y (ニャ行)', 'hy-youon': 'H + Y (ヒャ行)', 'my-youon': 'M + Y (ミャ行)',
  'ry-youon': 'R + Y (リャ行)', 'gy-youon': 'G + Y (ギャ行)', 'j-youon':  'J (ジャ行)',
  'by-youon': 'B + Y (ビャ行)', 'py-youon': 'P + Y (ピャ行)', 'f-youon':  'F (ファ行) — sons étrangers',
}

export function KatakanaPage() {
  const { progress, markKanaLearned, markKanaMastered, recordQuizScore } = useProgressContext()
  const [tab, setTab] = useState<'apprendre' | 'quiz'>('apprendre')
  const [showYouon, setShowYouon] = useState(false)
  const [selected, setSelected] = useState<KanaCharacter | null>(null)
  const [quizRow, setQuizRow] = useState<string | null>(null)
  const [quizMode, setQuizMode] = useState<QuizMode>('kana')
  const [onlyUnmastered, setOnlyUnmastered] = useState(false)
  const { speak } = useSpeech()

  const masteredSet = useMemo(() => new Set(progress.katakana.mastered), [progress.katakana.mastered])

  const allKanaForQuiz = useMemo(() => {
    return showYouon ? [...ALL_KATAKANA, ...KATAKANA_YOUON] : ALL_KATAKANA
  }, [showYouon])

  const quizSubset = useMemo(() => {
    if (quizRow === 'youon') return KATAKANA_YOUON
    if (quizRow) {
      const row = KATAKANA_ROWS.find(r => r.id === quizRow)
      return row?.characters ?? ALL_KATAKANA
    }
    return showYouon ? [...ALL_KATAKANA, ...KATAKANA_YOUON] : ALL_KATAKANA
  }, [quizRow, showYouon])

  const quizSubsetFiltered = useMemo(() => {
    if (!onlyUnmastered) return quizSubset
    const filtered = quizSubset.filter(c => !masteredSet.has(c.id))
    return filtered.length > 0 ? filtered : quizSubset
  }, [quizSubset, onlyUnmastered, masteredSet])

  const quiz = useKanaQuiz(allKanaForQuiz, quizSubsetFiltered)

  useEffect(() => {
    if (tab === 'quiz' && quizMode === 'audio' && quiz.currentCard && quiz.phase === 'question') {
      speak(quiz.currentCard.kana)
    }
  }, [quiz.currentCard?.id, tab, quizMode, quiz.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleQuizNext = () => {
    if (quiz.phase === 'feedback' && quiz.selected === quiz.currentCard?.id) {
      markKanaMastered(quiz.currentCard.id, 'katakana')
    }
    quiz.next()
  }

  const handleQuizRestart = () => {
    if (quiz.phase === 'complete') {
      recordQuizScore('katakana', {
        date: new Date().toISOString(),
        score: quiz.score,
        total: quiz.total,
        durationSeconds: quiz.durationSeconds,
      })
    }
    quiz.restart()
  }

  const learnedSet = new Set(progress.katakana.learned)
  const learnedCount = learnedSet.size
  const totalBase = ALL_KATAKANA.length

  const rowOptions = [
    { id: null, label: 'Tous' },
    ...KATAKANA_ROWS.map(r => ({ id: r.id, label: r.label.split(' ')[0] })),
    ...(showYouon ? [{ id: 'youon', label: 'Youon' }] : []),
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Katakana <span className="font-jp">カタカナ</span></h1>
            <p className="text-muted-foreground mt-1">Pour les mots étrangers et les onomatopées — 46 caractères</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{learnedCount}/{totalBase}</div>
            <div className="text-xs text-muted-foreground">appris</div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(learnedCount / totalBase) * 100}%` }} />
        </div>
      </div>

      <SystemeEcritureInfo {...KATAKANA_INFO} />

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

      {tab === 'apprendre' && (
        <div className="space-y-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
            <input type="checkbox" checked={showYouon} onChange={e => setShowYouon(e.target.checked)} className="rounded" />
            <span>Youon — combinaisons (キャ、シュ…)</span>
          </label>

          {KATAKANA_ROWS.map(row => (
            <div key={row.id}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{row.label}</h3>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {row.characters.map(kana => (
                  <KanaCard
                    key={kana.id}
                    kana={kana}
                    isLearned={learnedSet.has(kana.id)}
                    isMastered={masteredSet.has(kana.id)}
                    onClick={() => { speak(kana.kana); setSelected(kana) }}
                  />
                ))}
              </div>
            </div>
          ))}

          {showYouon && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Youon — combinaisons (拗音)</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Ki/Shi/Chi + ya/yu/yo — ex. キャ = ki+ya = "kya". ファ/フィ… = sons étrangers adaptés.
                </p>
              </div>
              {YOUON_GROUPS.map((group, gi) => (
                <div key={gi}>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">{YOUON_ROW_LABELS[group[0]?.row] ?? group[0]?.row}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {group.map(kana => (
                      <KanaCard key={kana.id} kana={kana} isLearned={learnedSet.has(kana.id)} isMastered={masteredSet.has(kana.id)}
                        onClick={() => { speak(kana.kana); setSelected(kana) }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'quiz' && (
        <div className="max-w-lg mx-auto space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit flex-wrap">
            {([
              ['kana',        'Kana → Romaji',  null],
              ['romaji',      'Romaji → Kana',  null],
              ['audio',       'Écouter → Kana', Volume2],
              ['frappe',      'Voir → Taper',   Keyboard],
              ['progression', 'Par ligne',      Layers],
            ] as [QuizMode, string, typeof Volume2 | null][]).map(([m, label, Icon]) => (
              <button
                key={m}
                onClick={() => { setQuizMode(m); quiz.restart() }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  quizMode === m ? 'bg-white dark:bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {Icon && <Icon size={11} />}
                {label}
              </button>
            ))}
          </div>

          {quizMode !== 'progression' && (
            <>
              <div className="flex flex-wrap gap-1.5">
                {rowOptions.map(opt => (
                  <button key={opt.id ?? 'all'} onClick={() => { setQuizRow(opt.id); quiz.restart() }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${quizRow === opt.id ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <input type="checkbox" checked={onlyUnmastered}
                    onChange={e => { setOnlyUnmastered(e.target.checked); quiz.restart() }} className="rounded" />
                  Non maîtrisés seulement
                </label>
                {onlyUnmastered && (
                  <span className="text-xs text-primary font-medium">
                    {quizSubsetFiltered.length} caractère{quizSubsetFiltered.length > 1 ? 's' : ''} restant{quizSubsetFiltered.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {showYouon && quizRow !== 'youon' && (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  Youon activés — les combinaisons sont dans le quiz. Filtre "Youon" pour les isoler.
                </p>
              )}

              {quiz.phase === 'complete' ? (
                <QuizResult score={quiz.score} total={quiz.total} durationSeconds={quiz.durationSeconds} onRestart={handleQuizRestart} title="Katakana" wrongCount={quiz.wrongIds.length} onRetryWrong={quiz.retryWrong} />
              ) : quiz.currentCard ? (
                quizMode === 'kana' ? (
                  <QuizCard question={quiz.currentCard.kana} speakText={quiz.currentCard.kana}
                    choices={quiz.choices.map(c => ({ id: c.id, label: c.romaji }))}
                    selected={quiz.selected} correctId={quiz.currentCard.id} phase={quiz.phase} onAnswer={quiz.answer}
                    onNext={handleQuizNext} score={quiz.score} currentIndex={quiz.currentIndex} total={quiz.total} />
                ) : quizMode === 'romaji' ? (
                  <RomajiToKanaQuiz card={quiz.currentCard} choices={quiz.choices} selected={quiz.selected} phase={quiz.phase}
                    score={quiz.score} currentIndex={quiz.currentIndex} total={quiz.total}
                    onAnswer={quiz.answer} onNext={handleQuizNext} />
                ) : quizMode === 'frappe' ? (
                  <TypingQuiz card={quiz.currentCard} selected={quiz.selected} phase={quiz.phase}
                    score={quiz.score} currentIndex={quiz.currentIndex} total={quiz.total}
                    onAnswer={quiz.answer} onNext={handleQuizNext} />
                ) : (
                  <AudioQuiz card={quiz.currentCard} choices={quiz.choices} selected={quiz.selected} phase={quiz.phase}
                    score={quiz.score} currentIndex={quiz.currentIndex} total={quiz.total}
                    onAnswer={quiz.answer} onNext={handleQuizNext} onSpeak={() => speak(quiz.currentCard!.kana)} />
                )
              ) : null}
            </>
          )}

          {quizMode === 'progression' && (
            <ProgressionQuiz rows={KATAKANA_ROWS} allKana={ALL_KATAKANA} />
          )}
        </div>
      )}

      {selected && (
        <KanaDetailPanel
          kana={selected}
          onClose={() => setSelected(null)}
          onMarkLearned={() => markKanaLearned(selected.id, 'katakana')}
          isLearned={learnedSet.has(selected.id)}
        />
      )}
    </div>
  )
}

interface RomajiQuizProps {
  card: KanaCharacter; choices: KanaCharacter[]; selected: string | null
  phase: 'question' | 'feedback' | 'complete'; score: number; currentIndex: number; total: number
  onAnswer: (id: string) => void; onNext: () => void
}

function RomajiToKanaQuiz({ card, choices, selected, phase, score, currentIndex, total, onAnswer, onNext }: RomajiQuizProps) {
  const isCorrect = selected === card.id
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (phase === 'feedback' && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight')) {
        e.preventDefault(); onNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, onNext])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentIndex / total) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{currentIndex + 1}/{total}</span>
        <span className="text-xs font-bold text-primary shrink-0">{score} pts</span>
      </div>

      <div className={cn(
        'bg-card border rounded-2xl p-8 text-center transition-all',
        phase === 'feedback' && isCorrect  && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80',
        phase === 'feedback' && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/80',
        phase === 'question' && 'border-border'
      )}>
        <p className="text-xs text-muted-foreground mb-4 tracking-wide">Quel kana correspond à cette romanisation ?</p>
        <p className={cn(
          'text-6xl font-bold tracking-widest leading-none mb-2 font-mono uppercase',
          phase === 'feedback' && isCorrect  && 'text-emerald-600 dark:text-emerald-400',
          phase === 'feedback' && !isCorrect && 'text-red-500 dark:text-red-400',
          phase === 'question' && 'text-foreground'
        )}>
          {card.romaji}
        </p>
        {phase === 'feedback' && (
          <p className="text-muted-foreground text-sm mt-2">{card.frenchPhonetic}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {choices.map(choice => {
          const isSelected = selected === choice.id, isRight = choice.id === card.id
          let cls = 'border-border bg-card hover:bg-muted hover:border-primary/40 text-foreground'
          if (phase === 'feedback') {
            if (isRight)         cls = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400'
            else                 cls = 'border-border bg-card opacity-40 text-muted-foreground'
          }
          return (
            <button key={choice.id} onClick={() => phase === 'question' && onAnswer(choice.id)} disabled={phase === 'feedback'}
              className={cn('p-4 rounded-xl border text-center transition-all font-jp-serif text-5xl leading-none py-6 disabled:cursor-default', cls)}>
              {choice.kana}
            </button>
          )
        })}
      </div>

      {phase === 'feedback' && (
        <div className={cn(
          'rounded-xl px-4 py-3 flex items-center justify-between',
          isCorrect ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/60'
                    : 'bg-red-50 border border-red-200 dark:bg-red-950/90 dark:border-red-800/60'
        )}>
          <div>
            {isCorrect
              ? <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">正解！ Parfait !</p>
              : <div>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">不正解</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Réponse : <span className="font-jp-serif text-xl">{card.kana}</span></p>
                </div>
            }
          </div>
          <button onClick={onNext} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
            次へ <kbd className="text-[9px] opacity-60 bg-white/20 px-1 py-0.5 rounded font-mono">↵</kbd>
          </button>
        </div>
      )}
    </div>
  )
}

interface AudioQuizProps {
  card: KanaCharacter
  choices: KanaCharacter[]
  selected: string | null
  phase: 'question' | 'feedback' | 'complete'
  score: number
  currentIndex: number
  total: number
  onAnswer: (id: string) => void
  onNext: () => void
  onSpeak: () => void
}

function AudioQuiz({ card, choices, selected, phase, score, currentIndex, total, onAnswer, onNext, onSpeak }: AudioQuizProps) {
  const isCorrect = selected === card.id

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentIndex / total) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{currentIndex + 1}/{total}</span>
        <span className="text-xs font-bold text-primary shrink-0">{score} pts</span>
      </div>

      <div className={cn(
        'bg-card border rounded-2xl p-8 text-center transition-all',
        phase === 'feedback' && isCorrect  && 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80',
        phase === 'feedback' && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-950/80',
        phase === 'question' && 'border-border'
      )}>
        <p className="text-xs text-muted-foreground mb-6 tracking-wide">Écoute et sélectionne le bon kana</p>
        <button
          onClick={onSpeak}
          className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all active:scale-95 hover:scale-105',
            phase === 'feedback' && isCorrect  ? 'bg-emerald-500 text-white' :
            phase === 'feedback' && !isCorrect ? 'bg-red-500 text-white' :
            'bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20'
          )}
        >
          <Volume2 size={40} />
        </button>
        {phase === 'question' && <p className="text-xs text-muted-foreground mt-4 opacity-60">Appuie pour réécouter</p>}
        {phase === 'feedback' && <p className="mt-4 font-jp-serif text-4xl font-bold">{card.kana}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {choices.map(choice => {
          const isSelected = selected === choice.id
          const isRight = choice.id === card.id
          let cls = 'border-border bg-card hover:bg-muted hover:border-primary/40 text-foreground'
          if (phase === 'feedback') {
            if (isRight) cls = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400'
            else cls = 'border-border bg-card opacity-50 text-muted-foreground'
          }
          return (
            <button
              key={choice.id}
              onClick={() => phase === 'question' && onAnswer(choice.id)}
              disabled={phase === 'feedback'}
              className={cn('p-4 rounded-xl border text-center transition-all font-jp-serif text-5xl leading-none py-6 disabled:cursor-default', cls)}
            >
              {choice.kana}
            </button>
          )
        })}
      </div>

      {phase === 'feedback' && (
        <div className={cn(
          'rounded-xl px-4 py-3 flex items-center justify-between',
          isCorrect ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/60' : 'bg-red-50 border border-red-200 dark:bg-red-950/90 dark:border-red-800/60'
        )}>
          <div>
            {isCorrect ? (
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">正解！ Parfait !</p>
            ) : (
              <div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">不正解</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Réponse : <span className="font-jp text-base">{card.kana}</span> ({card.romaji})
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  )
}
