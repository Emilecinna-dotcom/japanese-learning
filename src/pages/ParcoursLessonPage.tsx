import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProgressContext } from '@/hooks/useProgress'
import { useKanaQuiz } from '@/hooks/useKanaQuiz'
import { QuizCard } from '@/components/quiz/QuizCard'
import { TypingQuiz } from '@/components/quiz/TypingQuiz'
import { SpeakButton } from '@/components/SpeakButton'
import { shuffle } from '@/lib/flashItems'
import { isLessonPassed, isLessonUnlocked, scorePercent, PASS_PERCENT } from '@/lib/parcours'
import { BASIC_HIRAGANA, FINAL_TEST_SIZE, HIRAGANA_UNIT, LESSON_IDS, type Lesson } from '@/data/curriculum'
import type { KanaCharacter } from '@/types/kana'

type Step = 'intro' | 'qcm' | 'reverse' | 'typing' | 'result'
// graded : la leçon compte pour la validation. practice : refaire les kana ratés, sans enregistrer.
type Run = 'graded' | 'practice'

interface StepResult {
  score: number
  total: number
  wrongIds: string[]
}

// Le test final tire quelques kana au hasard, une leçon normale prend tous ceux de sa ligne.
const pickCards = (lesson: Lesson) =>
  lesson.kind === 'final' ? shuffle(lesson.characters).slice(0, FINAL_TEST_SIZE) : lesson.characters

const STEPS: { id: Exclude<Step, 'result'>; label: string }[] = [
  { id: 'intro', label: 'Découverte' },
  { id: 'qcm', label: 'Lire' },
  { id: 'reverse', label: 'Retrouver' },
  { id: 'typing', label: 'Saisie' },
]

// Un quiz de la leçon. Monté à neuf à chaque étape : useKanaQuiz repart donc de zéro.
function QuizStep({ mode, cards, onDone }: { mode: 'qcm' | 'reverse' | 'typing'; cards: KanaCharacter[]; onDone: (r: StepResult) => void }) {
  const quiz = useKanaQuiz(BASIC_HIRAGANA, cards)
  const doneRef = useRef(false)

  useEffect(() => {
    if (quiz.phase !== 'complete' || doneRef.current) return
    doneRef.current = true
    onDone({ score: quiz.score, total: quiz.total, wrongIds: quiz.wrongIds })
  }, [quiz.phase, quiz.score, quiz.total, quiz.wrongIds, onDone])

  if (!quiz.currentCard) return null

  if (mode === 'typing') {
    return (
      <TypingQuiz
        card={quiz.currentCard}
        selected={quiz.selected}
        phase={quiz.phase}
        score={quiz.score}
        currentIndex={quiz.currentIndex}
        total={quiz.total}
        onAnswer={quiz.answer}
        onNext={quiz.next}
      />
    )
  }

  // Lire : on voit le kana, on choisit sa lecture. Retrouver : on voit la lecture, on choisit le kana.
  const reverse = mode === 'reverse'
  return (
    <QuizCard
      question={reverse ? quiz.currentCard.romaji : quiz.currentCard.kana}
      questionLabel={reverse ? 'Quel kana se lit ainsi ?' : undefined}
      speakText={reverse ? undefined : quiz.currentCard.kana}
      choices={quiz.choices.map(c => ({ id: c.id, label: reverse ? c.kana : c.romaji }))}
      selected={quiz.selected}
      correctId={quiz.currentCard.id}
      phase={quiz.phase}
      onAnswer={quiz.answer}
      onNext={quiz.next}
      score={quiz.score}
      currentIndex={quiz.currentIndex}
      total={quiz.total}
    />
  )
}

function LessonIntro({ lesson, cards, onStart }: { lesson: Lesson; cards: KanaCharacter[]; onStart: () => void }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {lesson.kind === 'final'
          ? `${cards.length} kana tirés au hasard parmi les 46. Il faut ${PASS_PERCENT} % de bonnes réponses pour valider.`
          : `Regarde ces ${cards.length} kana et écoute leur son. Ensuite, deux QCM puis une saisie : ${PASS_PERCENT} % de bonnes réponses pour valider.`}
      </p>
      {lesson.kind === 'lesson' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cards.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-1 text-center">
              <span className="font-jp-serif text-5xl leading-none">{c.kana}</span>
              <span className="text-lg font-semibold mt-1">{c.romaji}</span>
              <span className="text-[11px] text-muted-foreground leading-snug">{c.frenchPhonetic}</span>
              <SpeakButton text={c.kana} size="sm" className="mt-1" />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onStart}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25 hover:opacity-95 transition-opacity"
      >
        Commencer <ArrowRight size={16} />
      </button>
    </div>
  )
}

function LessonResult({
  lesson, results, graded, nextLessonId, onRetry, onPractice,
}: {
  lesson: Lesson
  results: StepResult[]
  graded: boolean
  nextLessonId: string | null
  onRetry: () => void
  onPractice: (wrong: KanaCharacter[]) => void
}) {
  const score = results.reduce((s, r) => s + r.score, 0)
  const total = results.reduce((s, r) => s + r.total, 0)
  const percent = scorePercent(score, total)
  const passed = graded && isLessonPassed(score, total)
  const wrongKana = [...new Set(results.flatMap(r => r.wrongIds))]
    .map(id => BASIC_HIRAGANA.find(k => k.id === id))
    .filter((k): k is KanaCharacter => Boolean(k))

  const title = !graded ? 'Entraînement terminé' : passed ? (lesson.kind === 'final' ? 'Unité terminée !' : 'Leçon validée !') : 'Pas encore'
  const detail = !graded
    ? `${score} / ${total} bonnes réponses. Ce score n’est pas enregistré : refais la leçon pour la valider.`
    : passed
      ? `${score} / ${total} bonnes réponses (${percent} %). Ces kana sont ajoutés à tes révisions.`
      : `${score} / ${total} bonnes réponses (${percent} %). Il en faut ${PASS_PERCENT} % pour valider, tu peux réessayer sans pénalité.`

  const button = 'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-card font-medium hover:bg-muted transition-colors'

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className={cn(
          'w-24 h-24 rounded-full flex items-center justify-center border-4',
          !graded ? 'border-primary text-primary bg-primary/10'
            : passed ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
              : 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/50',
        )}>
          {passed ? <Check size={44} strokeWidth={3} /> : <span className="text-3xl font-bold tabular-nums">{percent}%</span>}
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{detail}</p>
        </div>

        {wrongKana.length > 0 && (
          <div className="w-full">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">À revoir</p>
            <div className="flex flex-wrap justify-center gap-2">
              {wrongKana.map(k => (
                <span key={k.id} className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-sm">
                  <span className="font-jp-serif text-lg mr-1.5">{k.kana}</span>
                  <span className="text-muted-foreground">{k.romaji}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full sm:justify-center">
          {passed && nextLessonId && (
            <Link to={`/parcours/${nextLessonId}`} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25">
              Leçon suivante <ArrowRight size={16} />
            </Link>
          )}
          {wrongKana.length > 0 && (
            <button onClick={() => onPractice(wrongKana)} className={button}>
              <RotateCcw size={15} /> Refaire les {wrongKana.length} kana raté{wrongKana.length > 1 ? 's' : ''}
            </button>
          )}
          <button onClick={onRetry} className={button}>
            <RotateCcw size={15} /> {!graded ? 'Refaire la leçon' : passed ? 'Rejouer' : 'Réessayer'}
          </button>
          <Link to="/parcours" className={button}>Retour au chemin</Link>
        </div>
      </div>
    </div>
  )
}

function LessonRunner({ lesson, nextLessonId }: { lesson: Lesson; nextLessonId: string | null }) {
  const { completeLesson } = useProgressContext()
  const [step, setStep] = useState<Step>('intro')
  const [run, setRun] = useState<Run>('graded')
  const [cards, setCards] = useState(() => pickCards(lesson))
  const [results, setResults] = useState<StepResult[]>([])

  // Les deux premiers quiz gardent leur score et passent à l'étape suivante.
  const next = (to: Step) => (r: StepResult) => {
    setResults(prev => [...prev, r])
    setStep(to)
  }

  const handleTypingDone = (r: StepResult) => {
    const all = [...results, r]
    if (run === 'graded') {
      completeLesson(lesson.id, cards.map(c => c.id), all.reduce((s, x) => s + x.score, 0), all.reduce((s, x) => s + x.total, 0))
    }
    setResults(all)
    setStep('result')
  }

  const retry = () => {
    setRun('graded')
    setCards(pickCards(lesson))
    setResults([])
    setStep('intro')
  }

  // Entraînement sur les kana ratés : mêmes trois quiz, sans découverte et sans enregistrement.
  const practice = (wrong: KanaCharacter[]) => {
    setRun('practice')
    setCards(wrong)
    setResults([])
    setStep('qcm')
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-5">
      <div>
        <Link to="/parcours" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Retour au chemin
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          {lesson.title}
          {run === 'practice' && <span className="ml-2 align-middle text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">Entraînement</span>}
        </h1>
        {step !== 'result' && (
          <ol className="flex flex-wrap items-center gap-2 mt-3" aria-label="Étapes de la leçon">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex items-center gap-2 text-xs">
                <span className={cn(
                  'px-2.5 py-1 rounded-full font-medium transition-colors',
                  s.id === step ? 'bg-primary text-primary-foreground' : STEPS.findIndex(x => x.id === step) > i ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                )}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <span className="w-3 h-px bg-border" />}
              </li>
            ))}
          </ol>
        )}
      </div>

      {step === 'intro' && <LessonIntro lesson={lesson} cards={cards} onStart={() => setStep('qcm')} />}
      {step === 'qcm' && <QuizStep key="qcm" mode="qcm" cards={cards} onDone={next('reverse')} />}
      {step === 'reverse' && <QuizStep key="reverse" mode="reverse" cards={cards} onDone={next('typing')} />}
      {step === 'typing' && <QuizStep key="typing" mode="typing" cards={cards} onDone={handleTypingDone} />}
      {step === 'result' && (
        <LessonResult lesson={lesson} results={results} graded={run === 'graded'} nextLessonId={nextLessonId} onRetry={retry} onPractice={practice} />
      )}
    </div>
  )
}

export function ParcoursLessonPage() {
  const { lessonId } = useParams()
  const { progress } = useProgressContext()
  const index = LESSON_IDS.indexOf(lessonId ?? '')

  // Adresse inconnue ou leçon verrouillée : retour au chemin.
  if (index < 0 || !isLessonUnlocked(index, LESSON_IDS, progress.parcours)) return <Navigate to="/parcours" replace />

  // key : changer de leçon (bouton « Leçon suivante ») remet tout l'état à zéro.
  return <LessonRunner key={lessonId} lesson={HIRAGANA_UNIT.lessons[index]} nextLessonId={LESSON_IDS[index + 1] ?? null} />
}
