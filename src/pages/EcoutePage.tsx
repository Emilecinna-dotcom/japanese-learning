import { useState, useEffect, useCallback, useRef } from 'react'
import { Headphones, Volume2, Play, CheckCircle, XCircle } from 'lucide-react'
import { useSpeech } from '@/hooks/useSpeech'
import { SystemeEcritureInfo, ECOUTE_INFO } from '@/components/SystemeEcritureInfo'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_THEMES } from '@/data/vocabulary'
import type { KanaCharacter } from '@/types/kana'
import type { VocabItem } from '@/types/vocabulary'

const SESSION_LENGTH = 20

type Mode = 'kana' | 'vocabulaire'
type AnswerState = 'idle' | 'correct' | 'incorrect'

interface KanaQuestion {
  type: 'kana'
  target: KanaCharacter
  options: KanaCharacter[]
  correctId: string
}

interface VocabQuestion {
  type: 'vocabulaire'
  target: VocabItem
  options: VocabItem[]
  correctId: string
}

type Question = KanaQuestion | VocabQuestion

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const pool = exclude !== undefined ? arr.filter(x => x !== exclude) : arr
  return shuffleArray(pool).slice(0, count)
}

function buildKanaQuestions(count: number): KanaQuestion[] {
  const pool = ALL_HIRAGANA.filter(k => !k.isDigraph).slice(0, 46)
  const targets = shuffleArray(pool).slice(0, count)
  return targets.map(target => {
    const distractors = pickRandom(pool, 3, target)
    const options = shuffleArray([target, ...distractors])
    return { type: 'kana', target, options, correctId: target.id }
  })
}

function buildVocabQuestions(count: number): VocabQuestion[] {
  const allItems: VocabItem[] = ALL_THEMES.flatMap(t => t.items)
  const targets = shuffleArray(allItems).slice(0, count)
  return targets.map(target => {
    const distractors = pickRandom(allItems, 3, target)
    const options = shuffleArray([target, ...distractors])
    return { type: 'vocabulaire', target, options, correctId: target.id }
  })
}

function ScoreBar({ current, total, correct }: { current: number; total: number; correct: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {Math.min(current + 1, total)} / {total}</span>
        <span className="font-medium text-primary">{correct} correcte{correct !== 1 ? 's' : ''}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ResultsScreen({
  correct,
  total,
  onRestart,
}: {
  correct: number
  total: number
  onRestart: () => void
}) {
  const pct = Math.round((correct / total) * 100)
  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'

  return (
    <div className="flex flex-col items-center gap-8 py-10 text-center">
      <div className="text-7xl">{emoji}</div>
      <div>
        <p className="text-4xl font-bold text-primary font-jp">
          {correct} <span className="text-muted-foreground text-2xl font-normal">/ {total}</span>
        </p>
        <p className="mt-2 text-muted-foreground">
          {pct >= 80
            ? 'Excellent travail, continuez ainsi !'
            : pct >= 50
            ? 'Bon début, pratiquez encore un peu.'
            : 'Ne vous découragez pas, la pratique paie.'}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Recommencer
        </button>
      </div>
    </div>
  )
}

export function EcoutePage() {
  const { speak, stop, speaking } = useSpeech()
  const [mode, setMode] = useState<Mode>('kana')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentQuestion = questions[currentIdx] ?? null

  const speakCurrentQuestion = useCallback((q: Question) => {
    if (!q) return
    const text = q.type === 'kana' ? q.target.kana : q.target.japanese
    speak(text)
  }, [speak])

  const clearTimers = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current)
  }, [])

  const startSession = useCallback((m: Mode) => {
    clearTimers()
    stop()
    const qs: Question[] = m === 'kana'
      ? buildKanaQuestions(SESSION_LENGTH)
      : buildVocabQuestions(SESSION_LENGTH)
    setQuestions(qs)
    setCurrentIdx(0)
    setCorrect(0)
    setAnswerState('idle')
    setSelectedId(null)
    setFinished(false)
    setStarted(true)
    autoPlayTimer.current = setTimeout(() => speakCurrentQuestion(qs[0]), 500)
  }, [clearTimers, stop, speakCurrentQuestion])

  // Auto-play when question changes (after initial start)
  useEffect(() => {
    if (!started || !currentQuestion || finished) return
    autoPlayTimer.current = setTimeout(() => speakCurrentQuestion(currentQuestion), 500)
    return () => { if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, started, finished])

  const advanceToNext = useCallback(() => {
    clearTimers()
    const next = currentIdx + 1
    if (next >= SESSION_LENGTH) {
      setFinished(true)
    } else {
      setCurrentIdx(next)
      setAnswerState('idle')
      setSelectedId(null)
    }
  }, [clearTimers, currentIdx])

  const handleAnswer = useCallback((id: string) => {
    if (answerState !== 'idle' || !currentQuestion) return
    setSelectedId(id)
    const isCorrect = id === currentQuestion.correctId
    setAnswerState(isCorrect ? 'correct' : 'incorrect')
    if (isCorrect) {
      setCorrect(c => c + 1)
      advanceTimer.current = setTimeout(advanceToNext, 1500)
    }
    // Si faux : pas d'auto-avance, l'utilisateur doit cliquer "Continuer"
  }, [answerState, currentQuestion, advanceToNext])

  const handleReplay = useCallback(() => {
    if (currentQuestion) speakCurrentQuestion(currentQuestion)
  }, [currentQuestion, speakCurrentQuestion])

  const handleModeChange = (m: Mode) => {
    if (m === mode) return
    setMode(m)
    if (started) {
      clearTimers()
      stop()
      startSession(m)
    }
  }

  const handleRestart = () => {
    startSession(mode)
  }

  // Keyboard shortcuts: Space = réécouter, Enter/→ = continuer quand faux
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!started || finished) return
      if (answerState === 'incorrect' && (e.code === 'Enter' || e.code === 'ArrowRight')) {
        e.preventDefault()
        advanceToNext()
      } else if (answerState !== 'idle' && e.code === 'Space') {
        e.preventDefault()
        handleReplay()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [started, finished, answerState, handleReplay, advanceToNext])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-3">
          <Headphones className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold font-jp text-primary">聴く</h1>
        </div>
        <p className="text-muted-foreground text-sm">Entraînement à l'écoute</p>
      </div>

      <SystemeEcritureInfo {...ECOUTE_INFO} />

      {/* Mode tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        {(['kana', 'vocabulaire'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={[
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              mode === m
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary',
            ].join(' ')}
          >
            {m === 'kana' ? 'Kana' : 'Vocabulaire'}
          </button>
        ))}
      </div>

      {/* Main content */}
      {!started ? (
        <div className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Volume2 className="w-9 h-9 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              {mode === 'kana' ? 'Reconnaissance des kana' : 'Reconnaissance du vocabulaire'}
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              {mode === 'kana'
                ? 'Écoutez le son et identifiez le kana correspondant parmi quatre choix.'
                : 'Écoutez le mot japonais et trouvez sa traduction française parmi quatre choix.'}
            </p>
            <p className="text-muted-foreground text-xs">{SESSION_LENGTH} questions par session</p>
          </div>
          <button
            onClick={() => startSession(mode)}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" />
            Commencer
          </button>
        </div>
      ) : finished ? (
        <ResultsScreen
          correct={correct}
          total={SESSION_LENGTH}
          onRestart={handleRestart}
        />
      ) : currentQuestion ? (
        <div className="space-y-6">
          {/* Score bar */}
          <ScoreBar current={currentIdx} total={SESSION_LENGTH} correct={correct} />

          {/* Listen area */}
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              {mode === 'kana' ? 'Quel kana entendez-vous ?' : 'Quelle est la traduction ?'}
            </p>
            <button
              onClick={handleReplay}
              disabled={speaking}
              className={[
                'mx-auto flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-medium transition-all',
                speaking
                  ? 'bg-primary/10 text-primary border-primary/30 scale-95'
                  : 'bg-muted hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground',
              ].join(' ')}
            >
              <Volume2 className={['w-5 h-5', speaking ? 'animate-pulse' : ''].join(' ')} />
              {speaking ? 'Lecture…' : 'Écouter à nouveau'}
            </button>
          </div>

          {/* Options */}
          {currentQuestion.type === 'kana' ? (
            <div className="grid grid-cols-2 gap-3">
              {(currentQuestion as KanaQuestion).options.map(opt => {
                const isSelected = selectedId === opt.id
                const isCorrectOpt = opt.id === currentQuestion.correctId
                let cls = 'relative flex flex-col items-center justify-center gap-1 p-6 rounded-2xl border-2 transition-all cursor-pointer select-none'

                if (answerState === 'idle') {
                  cls += ' border-border bg-card hover:border-primary/50 hover:bg-primary/5 active:scale-95'
                } else if (isCorrectOpt) {
                  cls += ' border-green-500 bg-green-50 dark:bg-green-950/30'
                } else if (isSelected && !isCorrectOpt) {
                  cls += ' border-red-500 bg-red-50 dark:bg-red-950/30'
                } else {
                  cls += ' border-border bg-card opacity-50'
                }

                return (
                  <button key={opt.id} className={cls} onClick={() => handleAnswer(opt.id)}>
                    {answerState !== 'idle' && isCorrectOpt && (
                      <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-green-500" />
                    )}
                    {answerState !== 'idle' && isSelected && !isCorrectOpt && (
                      <XCircle className="absolute top-2 right-2 w-4 h-4 text-red-500" />
                    )}
                    <span className="text-5xl font-jp leading-none">{opt.kana}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {(currentQuestion as VocabQuestion).options.map(opt => {
                const isSelected = selectedId === opt.id
                const isCorrectOpt = opt.id === currentQuestion.correctId
                let cls = 'relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer select-none'

                if (answerState === 'idle') {
                  cls += ' border-border bg-card hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]'
                } else if (isCorrectOpt) {
                  cls += ' border-green-500 bg-green-50 dark:bg-green-950/30'
                } else if (isSelected && !isCorrectOpt) {
                  cls += ' border-red-500 bg-red-50 dark:bg-red-950/30'
                } else {
                  cls += ' border-border bg-card opacity-50'
                }

                return (
                  <button key={opt.id} className={cls} onClick={() => handleAnswer(opt.id)}>
                    <span className="flex-1 font-medium text-sm text-primary">{opt.frenchTranslation}</span>
                    {answerState !== 'idle' && isCorrectOpt && (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    )}
                    {answerState !== 'idle' && isSelected && !isCorrectOpt && (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Feedback */}
          {answerState !== 'idle' && (
            <div className={[
              'flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium',
              answerState === 'correct'
                ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
            ].join(' ')}>
              {answerState === 'correct' ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Correct !
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide opacity-75 mb-0.5">Bonne réponse</p>
                      <p className="font-bold text-base text-foreground">
                        {currentQuestion.type === 'kana'
                          ? <><span className="font-jp">{(currentQuestion as KanaQuestion).target.kana}</span>{' '}<span className="text-sm font-normal opacity-60">({(currentQuestion as KanaQuestion).target.romaji})</span></>
                          : (currentQuestion as VocabQuestion).target.frenchTranslation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={advanceToNext}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    Continuer <kbd className="text-[9px] opacity-50 font-mono">↵</kbd>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
