import { useState, useEffect, useMemo } from 'react'
import { Trophy, Timer, RefreshCw, ChevronRight } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { SystemeEcritureInfo, JLPT_INFO } from '@/components/SystemeEcritureInfo'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { GRAMMAR_POINTS } from '@/data/grammaire'
import { VERBS, FORM_INFO } from '@/data/conjugaison'
import { EXERCISES } from '@/data/particules'
import { cn } from '@/lib/utils'
import type { KanaCharacter } from '@/types/kana'

// ─── Types ────────────────────────────────────────────────────────────────────

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
type N5Category = 'hiragana' | 'katakana' | 'kanji' | 'vocab'
type N4Category = 'grammaire' | 'conjugaison' | 'particules' | 'vocab'
type QuizCategory = N5Category | N4Category
type QuizPhase = 'level' | 'category' | 'quiz' | 'results'

interface Question {
  id: string
  prompt: string
  promptSub?: string
  choices: string[]
  correctIndex: number
  type: 'kana' | 'kanji-reading' | 'kanji-meaning' | 'vocab'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ─── Question generators ───────────────────────────────────────────────────────

function buildKanaQuestions(chars: KanaCharacter[], count: number): Question[] {
  const pool = pickRandom(chars, count)
  return pool.map((char) => {
    const distractors = shuffle(chars.filter((c) => c.id !== char.id))
      .slice(0, 3)
      .map((c) => c.romaji)
    const correct = char.romaji
    const choices = shuffle([correct, ...distractors])
    return {
      id: char.id,
      prompt: char.kana,
      choices,
      correctIndex: choices.indexOf(correct),
      type: 'kana',
    }
  })
}

function buildKanjiQuestions(count: number): Question[] {
  const pool = pickRandom(KANJI_N5, count)
  return pool.map((kanji) => {
    const useReading = Math.random() > 0.5

    if (useReading) {
      const correct = kanji.kunyomi[0] ?? kanji.onyomi[0]
      const distractors = shuffle(
        KANJI_N5.filter((k) => k.id !== kanji.id)
          .map((k) => k.kunyomi[0] ?? k.onyomi[0])
          .filter(Boolean),
      ).slice(0, 3)
      const choices = shuffle([correct, ...distractors])
      return {
        id: kanji.id,
        prompt: kanji.character,
        promptSub: 'Quelle est la lecture ?',
        choices,
        correctIndex: choices.indexOf(correct),
        type: 'kanji-reading',
      }
    } else {
      const correct = kanji.meaningFR[0]
      const distractors = shuffle(
        KANJI_N5.filter((k) => k.id !== kanji.id).map((k) => k.meaningFR[0]),
      ).slice(0, 3)
      const choices = shuffle([correct, ...distractors])
      return {
        id: kanji.id,
        prompt: kanji.character,
        promptSub: 'Quel est le sens ?',
        choices,
        correctIndex: choices.indexOf(correct),
        type: 'kanji-meaning',
      }
    }
  })
}

function buildVocabQuestions(count: number): Question[] {
  const allItems = ALL_THEMES.flatMap((t) =>
    t.items.map((item) => ({
      id: item.id,
      japanese: item.japanese,
      meaning: item.frenchTranslation,
    })),
  )
  const pool = pickRandom(allItems, count)
  return pool.map((item) => {
    const correct = item.meaning
    const distractors = shuffle(
      allItems.filter((i) => i.id !== item.id).map((i) => i.meaning),
    ).slice(0, 3)
    const choices = shuffle([correct, ...distractors])
    return {
      id: item.id,
      prompt: item.japanese,
      promptSub: 'Quel est le sens ?',
      choices,
      correctIndex: choices.indexOf(correct),
      type: 'vocab',
    }
  })
}

function buildGrammarQuestions(count: number): Question[] {
  const pool = pickRandom(GRAMMAR_POINTS, count)
  return pool.map((gp) => {
    const correct = gp.structure ?? gp.titleJP
    const distractors = shuffle(
      GRAMMAR_POINTS.filter((g) => g.id !== gp.id).map((g) => g.structure ?? g.titleJP).filter(Boolean)
    ).slice(0, 3) as string[]
    const choices = shuffle([correct, ...distractors])
    return {
      id: gp.id,
      prompt: gp.titleFR,
      promptSub: 'Quelle est la structure japonaise ?',
      choices,
      correctIndex: choices.indexOf(correct),
      type: 'vocab' as const,
    }
  })
}

function buildConjugaisonQuestions(count: number): Question[] {
  const pairs = VERBS.flatMap((verb) =>
    FORM_INFO.map((fi) => ({ verb, fi }))
  )
  const pool = pickRandom(pairs, count)
  return pool.map(({ verb, fi }) => {
    const correct = verb.forms[fi.key].jp
    const distractors = shuffle(
      VERBS.filter((v) => v.id !== verb.id).map((v) => v.forms[fi.key].jp)
    ).slice(0, 3)
    const choices = shuffle([correct, ...distractors])
    return {
      id: `${verb.id}-${fi.key}`,
      prompt: verb.dictionary,
      promptSub: `Forme "${fi.label}" — ${verb.meaning}`,
      choices,
      correctIndex: choices.indexOf(correct),
      type: 'vocab' as const,
    }
  })
}

function buildParticulesQuestions(count: number): Question[] {
  const pool = pickRandom(EXERCISES, count)
  return pool.map((ex) => {
    const choices = shuffle([...ex.options])
    return {
      id: ex.id,
      prompt: ex.sentence.replace('___', '＿＿＿'),
      promptSub: ex.translation,
      choices,
      correctIndex: choices.indexOf(ex.answer),
      type: 'vocab' as const,
    }
  })
}

function generateQuestions(level: JLPTLevel, category: QuizCategory): Question[] {
  const count = 20
  if (level === 'N5') {
    switch (category as N5Category) {
      case 'hiragana': return buildKanaQuestions(ALL_HIRAGANA, count)
      case 'katakana': return buildKanaQuestions(ALL_KATAKANA, count)
      case 'kanji':    return buildKanjiQuestions(count)
      case 'vocab':    return buildVocabQuestions(count)
    }
  }
  // N4
  switch (category as N4Category) {
    case 'grammaire':    return buildGrammarQuestions(count)
    case 'conjugaison':  return buildConjugaisonQuestions(count)
    case 'particules':   return buildParticulesQuestions(count)
    case 'vocab':        return buildVocabQuestions(count)
  }
  return buildVocabQuestions(count)
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const LEVEL_ITEMS: { level: JLPTLevel; label: string; desc: string; available: boolean }[] = [
  { level: 'N5', label: 'N5', desc: 'Niveau débutant — kana, kanji simples, vocabulaire de base', available: true },
  { level: 'N4', label: 'N4', desc: 'Niveau élémentaire — grammaire, conjugaison, particules', available: true },
  { level: 'N3', label: 'N3', desc: 'Niveau intermédiaire — 650 kanji, conversations courantes', available: false },
  { level: 'N2', label: 'N2', desc: 'Niveau avancé — 1 000 kanji, textes complexes', available: false },
  { level: 'N1', label: 'N1', desc: 'Niveau expert — maîtrise complète du japonais', available: false },
]

const N5_CATEGORIES: { cat: N5Category; label: string; sub: string }[] = [
  { cat: 'hiragana', label: 'ひらがな', sub: 'Hiragana' },
  { cat: 'katakana', label: 'カタカナ', sub: 'Katakana' },
  { cat: 'kanji',    label: '漢字',     sub: 'Kanji N5' },
  { cat: 'vocab',    label: '語彙',     sub: 'Vocabulaire' },
]

const N4_CATEGORIES: { cat: N4Category; label: string; sub: string }[] = [
  { cat: 'grammaire',   label: '文法',  sub: 'Grammaire' },
  { cat: 'conjugaison', label: '活用',  sub: 'Conjugaison' },
  { cat: 'particules',  label: '助詞',  sub: 'Particules' },
  { cat: 'vocab',       label: '語彙',  sub: 'Vocabulaire' },
]

// ─── Main component ────────────────────────────────────────────────────────────

export function JLPTPage() {
  const [phase, setPhase] = useState<QuizPhase>('level')
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null)

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [chosen, setChosen] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  // Timer
  const TOTAL_SECONDS = 15 * 60
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const [timeTaken, setTimeTaken] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    if (!timerActive) return
    if (timeLeft <= 0) {
      finishQuiz()
      return
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timerActive, timeLeft])

  const score = useMemo(
    () => answers.filter((a, i) => a === questions[i]?.correctIndex).length,
    [answers, questions],
  )

  function startQuiz(cat: QuizCategory) {
    const qs = generateQuestions(selectedLevel ?? 'N5', cat)
    setQuestions(qs)
    setAnswers(new Array(qs.length).fill(null))
    setCurrentIdx(0)
    setChosen(null)
    setRevealed(false)
    setTimeLeft(TOTAL_SECONDS)
    setTimeTaken(0)
    setTimerActive(true)
    setPhase('quiz')
  }

  function handleChoice(idx: number) {
    if (revealed) return
    setChosen(idx)
    setRevealed(true)
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIdx] = idx
      return next
    })
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrentIdx((i) => i + 1)
      setChosen(null)
      setRevealed(false)
    }
  }

  function finishQuiz() {
    setTimerActive(false)
    setTimeTaken(TOTAL_SECONDS - timeLeft)
    setPhase('results')
  }

  function handleRestart() {
    setPhase('category')
    setChosen(null)
    setRevealed(false)
  }

  const q = questions[currentIdx]
  const isTimeLow = timeLeft <= 120

  // ── Level selection ──────────────────────────────────────────────────────────
  if (phase === 'level') {
    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold font-jp-serif text-primary">JLPT</h1>
            </div>
            <p className="text-muted-foreground text-lg">Préparation aux examens</p>
          </div>

          <div className="mb-8">
            <SystemeEcritureInfo {...JLPT_INFO} />
          </div>

          {/* Level cards */}
          <div className="space-y-3">
            {LEVEL_ITEMS.map(({ level, label, desc, available }) => (
              <button
                key={level}
                onClick={() => {
                  if (!available) return
                  setSelectedLevel(level)
                  setPhase('category')
                }}
                disabled={!available}
                className={cn(
                  'w-full text-left px-6 py-4 rounded-xl border border-border bg-card transition-all duration-150',
                  available
                    ? 'hover:border-primary hover:shadow-md cursor-pointer'
                    : 'opacity-50 cursor-not-allowed',
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xl font-bold font-jp text-primary">{label}</span>
                      {!available && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          Bientôt disponible
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  {available && <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Category selection ───────────────────────────────────────────────────────
  if (phase === 'category') {
    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <Trophy className="w-7 h-7 text-primary" />
              <h1 className="text-3xl font-bold font-jp-serif text-primary">JLPT {selectedLevel}</h1>
            </div>
            <p className="text-muted-foreground">Choisissez une catégorie · 20 questions · 15 minutes</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(selectedLevel === 'N4' ? N4_CATEGORIES : N5_CATEGORIES).map(({ cat, label, sub }) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  startQuiz(cat)
                }}
                className="flex flex-col items-center justify-center gap-2 px-6 py-8 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all duration-150 cursor-pointer"
              >
                <span className="text-4xl font-jp">{label}</span>
                <span className="text-sm text-muted-foreground">{sub}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setPhase('level')}
            className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Changer de niveau
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────────
  if (phase === 'quiz' && q) {
    const progress = ((currentIdx + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-xl mx-auto">
          {/* Timer + progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Question {currentIdx + 1}/{questions.length}
              </span>
              <div
                className={cn(
                  'flex items-center gap-1.5 font-mono text-sm font-semibold px-3 py-1 rounded-full border',
                  isTimeLow
                    ? 'text-red-500 border-red-500/40 bg-red-500/10 animate-pulse'
                    : 'text-primary border-border bg-card',
                )}
              >
                <Timer className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-6 text-center shadow-sm">
            {q.promptSub && (
              <p className="text-sm text-muted-foreground mb-4">{q.promptSub}</p>
            )}
            {q.prompt.length <= 4 ? (
              <p className="text-7xl font-jp mb-2 leading-none">{q.prompt}</p>
            ) : (
              <p className="text-xl font-medium font-jp leading-relaxed">{q.prompt}</p>
            )}
          </div>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3">
            {q.choices.map((choice, idx) => {
              let variant: 'default' | 'correct' | 'wrong' = 'default'
              if (revealed) {
                if (idx === q.correctIndex) variant = 'correct'
                else if (idx === chosen) variant = 'wrong'
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleChoice(idx)}
                  disabled={revealed}
                  className={cn(
                    'px-4 py-4 rounded-xl border text-sm font-medium transition-all duration-150 font-jp',
                    variant === 'default' &&
                      'border-border bg-card hover:border-primary hover:bg-muted cursor-pointer',
                    variant === 'correct' &&
                      'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400',
                    variant === 'wrong' &&
                      'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400',
                    revealed && variant === 'default' && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          {/* Next button */}
          {revealed && (
            <button
              onClick={handleNext}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {currentIdx + 1 >= questions.length ? (
                <>
                  <Trophy className="w-4 h-4" />
                  Voir les résultats
                </>
              ) : (
                <>
                  Question suivante
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const pct = Math.round((score / questions.length) * 100)
    const passed = pct >= 60

    let verdict = ''
    if (pct === 100) verdict = 'Parfait !'
    else if (pct >= 80) verdict = 'Excellent !'
    else if (pct >= 60) verdict = 'Réussi !'
    else if (pct >= 40) verdict = 'Encore un effort'
    else verdict = 'Continue à t\'entraîner'

    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          {/* Trophy */}
          <div
            className={cn(
              'inline-flex items-center justify-center w-20 h-20 rounded-full mb-6',
              passed ? 'bg-yellow-500/10 text-yellow-500' : 'bg-muted text-muted-foreground',
            )}
          >
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-bold font-jp-serif text-primary mb-1">{verdict}</h2>
          <p className="text-muted-foreground mb-8">
            JLPT {selectedLevel} · {[...N5_CATEGORIES, ...N4_CATEGORIES].find((c) => c.cat === selectedCategory)?.sub}
          </p>

          {/* Score card */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-6 shadow-sm">
            {/* Big score */}
            <div className="mb-6">
              <span className="text-6xl font-bold font-jp-serif text-primary">{score}</span>
              <span className="text-2xl text-muted-foreground">/{questions.length}</span>
            </div>

            {/* Percentage bar */}
            <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  passed ? 'bg-green-500' : 'bg-red-400',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-6">{pct}% de bonnes réponses</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-1">Temps</div>
                <div className="font-mono font-semibold text-primary">{formatTime(timeTaken)}</div>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-1">Erreurs</div>
                <div className="font-semibold text-primary">{questions.length - score}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Refaire
            </button>
            <button
              onClick={() => setPhase('level')}
              className="w-full py-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary transition-colors text-sm font-medium"
            >
              Choisir un autre niveau
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
