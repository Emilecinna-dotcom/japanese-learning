import { useState, useMemo, useCallback } from 'react'
import { X, Shuffle, ChevronRight, CheckCircle2, XCircle, RotateCcw, Trophy, BookOpen, Brain } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { SystemeEcritureInfo, CONJUGAISON_INFO } from '@/components/SystemeEcritureInfo'
import { VERBS, FORM_INFO } from '@/data/conjugaison'
import type { Verb, FormKey, VerbGroup } from '@/data/conjugaison'

// ── Types ──────────────────────────────────────────────────────────────────────

type GroupFilter = 'tous' | VerbGroup
type Tab = 'apprendre' | 'quiz'

interface QuizQuestion {
  verb: Verb
  formKey: FormKey
  correctAnswer: string
  choices: string[]
}

// ── Constants ──────────────────────────────────────────────────────────────────

const GROUP_STYLES: Record<VerbGroup, { pill: string; badge: string; border: string }> = {
  godan: {
    pill: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
  },
  ichidan: {
    pill: 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/40',
    badge: 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300',
    border: 'border-violet-300 dark:border-violet-700',
  },
  irregular: {
    pill: 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/40',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700',
  },
}

const GROUP_LABELS: Record<VerbGroup, string> = {
  godan: 'Godan',
  ichidan: 'Ichidan',
  irregular: 'Irrég.',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuizQuestions(verbs: Verb[], formKeys: FormKey[]): QuizQuestion[] {
  const allForms = VERBS.flatMap(v => Object.values(v.forms).map(f => f.jp))
  const questions: QuizQuestion[] = []

  for (const verb of verbs) {
    for (const formKey of formKeys) {
      const correct = verb.forms[formKey].jp
      const distractors = shuffle(
        allForms.filter(f => f !== correct)
      ).slice(0, 3)
      const choices = shuffle([correct, ...distractors])
      questions.push({ verb, formKey, correctAnswer: correct, choices })
    }
  }
  return shuffle(questions)
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function GroupBadge({ group }: { group: VerbGroup }) {
  const s = GROUP_STYLES[group]
  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
      {GROUP_LABELS[group]}
    </span>
  )
}

interface VerbCardProps {
  verb: Verb
  selected: boolean
  onSelect: (verb: Verb) => void
}

function VerbCard({ verb, selected, onSelect }: VerbCardProps) {
  const s = GROUP_STYLES[verb.group]
  return (
    <button
      onClick={() => onSelect(verb)}
      className={`w-full text-left bg-card border rounded-xl p-4 transition-all duration-150 hover:shadow-md cursor-pointer group ${
        selected
          ? `${s.border} shadow-md`
          : 'border-border hover:border-primary/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`font-jp-serif text-3xl leading-none ${selected ? 'text-primary' : ''}`}>
          {verb.dictionary}
        </span>
        <GroupBadge group={verb.group} />
      </div>
      <p className="font-jp text-sm text-muted-foreground mb-1">{verb.reading}</p>
      <p className="text-sm font-medium text-foreground">{verb.meaning}</p>
    </button>
  )
}

interface DetailPanelProps {
  verb: Verb
  onClose: () => void
}

function DetailPanel({ verb, onClose }: DetailPanelProps) {
  const s = GROUP_STYLES[verb.group]
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90dvh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 bg-card border-b border-border px-5 py-4 flex items-start justify-between gap-4 z-10`}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`font-jp-serif text-4xl leading-none`}>{verb.dictionary}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-jp text-base text-muted-foreground">{verb.reading}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-base font-semibold">{verb.meaning}</span>
              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${s.pill}`}>
                {verb.groupLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conjugation table */}
        <div className="p-5">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-semibold w-[42%]">Forme</th>
                  <th className="text-left px-4 py-2.5 font-semibold w-[46%]">Japonais</th>
                  <th className="text-left px-4 py-2.5 font-semibold w-[12%]">Audio</th>
                </tr>
              </thead>
              <tbody>
                {FORM_INFO.map((info, i) => {
                  const form = verb.forms[info.key]
                  return (
                    <tr
                      key={info.key}
                      className={`border-t border-border/60 transition-colors hover:bg-muted/30 ${
                        i % 2 === 0 ? '' : 'bg-muted/20'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium leading-tight">{info.label}</div>
                        <div className="font-jp text-xs text-muted-foreground mt-0.5">{info.labelJp}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-jp text-xl leading-none">{form.jp}</span>
                      </td>
                      <td className="px-4 py-3">
                        <SpeakButton text={form.jp} size="sm" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation notes */}
          <div className="mt-4 space-y-2">
            {FORM_INFO.slice(0, 3).map(info => (
              <div key={info.key} className="text-xs text-muted-foreground flex gap-2">
                <span className="font-jp shrink-0 text-foreground/70">{info.labelJp}</span>
                <span>{info.explanation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Quiz ───────────────────────────────────────────────────────────────────────

type QuizState = 'idle' | 'active' | 'feedback' | 'done'

interface QuizSetupProps {
  onStart: (verbs: Verb[]) => void
  groupFilter: GroupFilter
}

function QuizSetup({ onStart, groupFilter }: QuizSetupProps) {
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null)

  const filteredVerbs = useMemo(() => {
    if (groupFilter === 'tous') return VERBS
    return VERBS.filter(v => v.group === groupFilter)
  }, [groupFilter])

  const handleStart = () => {
    if (selectedVerb) {
      onStart([selectedVerb])
    } else {
      onStart(filteredVerbs)
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground border border-border">
        <p className="font-medium text-foreground mb-1">Comment jouer</p>
        <p>Sélectionne un verbe spécifique ou lance un quiz aléatoire sur tous les verbes filtrés. Tu devras choisir la bonne forme conjuguée parmi 4 options.</p>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">
          Sélectionne un verbe <span className="text-muted-foreground font-normal">(ou laisse vide pour quiz aléatoire)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredVerbs.map(verb => {
            const isSelected = selectedVerb?.id === verb.id
            const s = GROUP_STYLES[verb.group]
            return (
              <button
                key={verb.id}
                onClick={() => setSelectedVerb(isSelected ? null : verb)}
                className={`text-left p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                  isSelected
                    ? `${s.border} bg-card shadow-sm`
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                }`}
              >
                <span className="font-jp-serif text-xl leading-none block mb-1">{verb.dictionary}</span>
                <span className="text-muted-foreground text-xs">{verb.meaning}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer text-sm"
        >
          {selectedVerb ? (
            <>
              <ChevronRight size={16} />
              Quiz sur {selectedVerb.dictionary}
            </>
          ) : (
            <>
              <Shuffle size={16} />
              Quiz aléatoire ({filteredVerbs.length} verbe{filteredVerbs.length > 1 ? 's' : ''})
            </>
          )}
        </button>
      </div>
    </div>
  )
}

interface ActiveQuizProps {
  questions: QuizQuestion[]
  onDone: (score: number, total: number) => void
}

function ActiveQuiz({ questions, onDone }: ActiveQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [quizState, setQuizState] = useState<'answering' | 'feedback'>('answering')
  const [score, setScore] = useState(0)

  const question = questions[currentIdx]
  const formInfo = FORM_INFO.find(f => f.key === question.formKey)!
  const isCorrect = selected === question.correctAnswer

  const handleChoice = useCallback((choice: string) => {
    if (quizState !== 'answering') return
    setSelected(choice)
    setQuizState('feedback')
    if (choice === question.correctAnswer) {
      setScore(s => s + 1)
    }
  }, [quizState, question.correctAnswer])

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      onDone(score + (isCorrect ? 1 : 0), questions.length)
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setQuizState('answering')
    }
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground tabular-nums">{currentIdx + 1} / {questions.length}</span>
        <span className="text-muted-foreground tabular-nums">{score} correcte{score > 1 ? 's' : ''}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(currentIdx / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
        <div className="mb-2">
          <GroupBadge group={question.verb.group} />
        </div>
        <div className="font-jp-serif text-5xl mb-1 mt-3">{question.verb.dictionary}</div>
        <div className="font-jp text-base text-muted-foreground mb-1">{question.verb.reading}</div>
        <div className="text-base font-semibold mb-4">{question.verb.meaning}</div>
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-0.5">Comment conjuguer à la forme</p>
          <p className="text-base font-bold">
            {formInfo.label}{' '}
            <span className="font-jp text-muted-foreground font-normal">{formInfo.labelJp}</span>
          </p>
        </div>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {question.choices.map(choice => {
          let cls = 'border-border bg-card hover:border-primary/40 hover:bg-muted/30 cursor-pointer'
          if (quizState === 'feedback') {
            if (choice === question.correctAnswer) {
              cls = 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/60 cursor-default'
            } else if (choice === selected) {
              cls = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/60 cursor-default'
            } else {
              cls = 'border-border bg-card opacity-40 cursor-default'
            }
          }
          return (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              disabled={quizState === 'feedback'}
              className={`p-4 border-2 rounded-xl text-center transition-all duration-150 ${cls}`}
            >
              <span className="font-jp text-2xl leading-none block">{choice}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback banner */}
      {quizState === 'feedback' && (
        <div className={`rounded-xl p-4 flex items-start gap-3 border ${
          isCorrect
            ? 'bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800/40'
            : 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/40'
        }`}>
          {isCorrect
            ? <CheckCircle2 size={20} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            : <XCircle size={20} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          }
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {isCorrect ? 'Correct !' : 'Pas tout à fait'}
            </p>
            {!isCorrect && (
              <p className="text-sm mt-0.5 text-muted-foreground">
                La bonne réponse : <span className="font-jp text-base font-bold text-foreground">{question.correctAnswer}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{formInfo.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {currentIdx + 1 >= questions.length ? 'Terminer' : 'Suivant'}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

interface QuizResultsProps {
  score: number
  total: number
  onRestart: () => void
}

function QuizResults({ score, total, onRestart }: QuizResultsProps) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const perfect = score === total

  return (
    <div className="text-center py-8 space-y-5">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 ${
        perfect
          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700'
          : score / total >= 0.7
            ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-700'
            : 'bg-muted border-border'
      }`}>
        <Trophy size={36} className={
          perfect ? 'text-amber-500' : score / total >= 0.7 ? 'text-green-600' : 'text-muted-foreground'
        } />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-1">
          {perfect ? 'Parfait !' : score / total >= 0.7 ? 'Bien joué !' : 'Continue à pratiquer !'}
        </h2>
        <p className="text-muted-foreground text-sm">{total} question{total > 1 ? 's' : ''}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-2xl font-bold tabular-nums text-primary">{pct}%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Score</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800/40 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold tabular-nums text-green-600">{score}</div>
          <div className="text-[11px] text-green-700 dark:text-green-400 mt-0.5">Correctes</div>
        </div>
        <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/40 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold tabular-nums text-red-600">{total - score}</div>
          <div className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">Erreurs</div>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer text-sm"
      >
        <RotateCcw size={16} />
        Rejouer
      </button>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function ConjugaisonPage() {
  const [tab, setTab] = useState<Tab>('apprendre')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('tous')
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null)

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>('idle')
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null)

  const filteredVerbs = useMemo(() => {
    if (groupFilter === 'tous') return VERBS
    return VERBS.filter(v => v.group === groupFilter)
  }, [groupFilter])

  const handleStartQuiz = useCallback((verbs: Verb[]) => {
    const formKeys = FORM_INFO.map(f => f.key) as FormKey[]
    const questions = buildQuizQuestions(verbs, formKeys)
    // Limit to a reasonable number
    setQuizQuestions(questions.slice(0, Math.min(questions.length, 20)))
    setQuizState('active')
    setQuizResult(null)
  }, [])

  const handleQuizDone = useCallback((score: number, total: number) => {
    setQuizResult({ score, total })
    setQuizState('done')
  }, [])

  const handleQuizRestart = () => {
    setQuizState('idle')
    setQuizResult(null)
    setQuizQuestions([])
  }

  const FILTERS: { key: GroupFilter; label: string }[] = [
    { key: 'tous', label: 'Tous' },
    { key: 'godan', label: 'Godan' },
    { key: 'ichidan', label: 'Ichidan' },
    { key: 'irregular', label: 'Irréguliers' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Conjugaison <span className="font-jp">動詞</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Maîtrise les 10 formes essentielles des verbes japonais
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Verbes', value: VERBS.length, color: 'text-primary' },
          { label: 'Formes', value: FORM_INFO.length, color: 'text-foreground' },
          { label: 'Combinaisons', value: VERBS.length * FORM_INFO.length, color: 'text-muted-foreground' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <SystemeEcritureInfo {...CONJUGAISON_INFO} />

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {([
          { key: 'apprendre' as Tab, label: 'Apprendre', icon: BookOpen },
          { key: 'quiz' as Tab, label: 'Quiz', icon: Brain },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key)
              if (key === 'apprendre') {
                setQuizState('idle')
                setQuizResult(null)
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              tab === key
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Group filter (shared between tabs) */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => {
          const isActive = groupFilter === key
          const groupStyle = key !== 'tous' ? GROUP_STYLES[key as VerbGroup] : null
          return (
            <button
              key={key}
              onClick={() => setGroupFilter(key)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer border ${
                isActive
                  ? groupStyle
                    ? `${groupStyle.pill} border-current`
                    : 'bg-primary text-primary-foreground border-transparent'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {label}
              {key !== 'tous' && (
                <span className="ml-1.5 opacity-60 text-xs">
                  ({VERBS.filter(v => v.group === key).length})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── APPRENDRE TAB ── */}
      {tab === 'apprendre' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredVerbs.map(verb => (
            <VerbCard
              key={verb.id}
              verb={verb}
              selected={selectedVerb?.id === verb.id}
              onSelect={v => setSelectedVerb(selectedVerb?.id === v.id ? null : v)}
            />
          ))}
        </div>
      )}

      {/* ── QUIZ TAB ── */}
      {tab === 'quiz' && (
        <div>
          {quizState === 'idle' && (
            <QuizSetup onStart={handleStartQuiz} groupFilter={groupFilter} />
          )}
          {quizState === 'active' && quizQuestions.length > 0 && (
            <ActiveQuiz questions={quizQuestions} onDone={handleQuizDone} />
          )}
          {quizState === 'done' && quizResult && (
            <QuizResults
              score={quizResult.score}
              total={quizResult.total}
              onRestart={handleQuizRestart}
            />
          )}
        </div>
      )}

      {/* Detail panel modal */}
      {selectedVerb && tab === 'apprendre' && (
        <DetailPanel verb={selectedVerb} onClose={() => setSelectedVerb(null)} />
      )}
    </div>
  )
}
