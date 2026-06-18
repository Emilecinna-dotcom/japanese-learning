import { useState } from 'react'
import { Brain, BookOpen } from 'lucide-react'
import { useSpeech } from '@/hooks/useSpeech'
import { HIRAGANA_ROWS, HIRAGANA_DAKUTEN, ALL_HIRAGANA } from '@/data/hiragana'
import { KanaCard } from '@/components/kana/KanaCard'
import { KanaDetailPanel } from '@/components/kana/KanaDetailPanel'
import { useKanaQuiz } from '@/hooks/useKanaQuiz'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizResult } from '@/components/quiz/QuizResult'
import { useProgressContext } from '@/hooks/useProgress'
import type { KanaCharacter } from '@/types/kana'

export function HiraganaPage() {
  const { progress, markKanaLearned, markKanaMastered, recordQuizScore } = useProgressContext()
  const [tab, setTab] = useState<'apprendre' | 'quiz'>('apprendre')
  const [showDakuten, setShowDakuten] = useState(false)
  const [selected, setSelected] = useState<KanaCharacter | null>(null)
  const { speak } = useSpeech()

  const baseKana = HIRAGANA_ROWS.flatMap(r => r.characters)
  const quiz = useKanaQuiz(ALL_HIRAGANA, showDakuten ? ALL_HIRAGANA : baseKana)

  const handleQuizNext = () => {
    if (quiz.phase === 'feedback' && quiz.selected === quiz.currentCard?.id) {
      markKanaMastered(quiz.currentCard.id, 'hiragana')
    }
    quiz.next()
  }

  const handleQuizRestart = () => {
    if (quiz.phase === 'complete') {
      recordQuizScore('hiragana', {
        date: new Date().toISOString(),
        score: quiz.score,
        total: quiz.total,
        durationSeconds: quiz.durationSeconds,
      })
    }
    quiz.restart()
  }

  const learnedSet = new Set(progress.hiragana.learned)
  const masteredSet = new Set(progress.hiragana.mastered)
  const learnedCount = learnedSet.size
  const totalBase = baseKana.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hiragana <span className="font-jp">ひらがな</span></h1>
            <p className="text-muted-foreground mt-1">L'alphabet syllabique de base du japonais — 46 caractères</p>
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

      {/* Tabs */}
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

      {/* Learn tab */}
      {tab === 'apprendre' && (
        <div className="space-y-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={showDakuten}
              onChange={e => setShowDakuten(e.target.checked)}
              className="rounded"
            />
            <span>Afficher les dakuten (が、ざ、だ...)</span>
          </label>

          {HIRAGANA_ROWS.map(row => (
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

          {showDakuten && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Dakuten & Handakuten</h3>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {HIRAGANA_DAKUTEN.map(kana => (
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
          )}
        </div>
      )}

      {/* Quiz tab */}
      {tab === 'quiz' && (
        <div className="max-w-lg mx-auto">
          {quiz.phase === 'complete' ? (
            <QuizResult
              score={quiz.score}
              total={quiz.total}
              durationSeconds={quiz.durationSeconds}
              onRestart={handleQuizRestart}
              title="Hiragana"
            />
          ) : quiz.currentCard ? (
            <QuizCard
              question={quiz.currentCard.kana}
              choices={quiz.choices.map(c => ({ id: c.id, label: c.romaji }))}
              selected={quiz.selected}
              correctId={quiz.currentCard.id}
              phase={quiz.phase}
              onAnswer={quiz.answer}
              onNext={handleQuizNext}
              score={quiz.score}
              currentIndex={quiz.currentIndex}
              total={quiz.total}
            />
          ) : null}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <KanaDetailPanel
          kana={selected}
          onClose={() => setSelected(null)}
          onMarkLearned={() => markKanaLearned(selected.id, 'hiragana')}
          isLearned={learnedSet.has(selected.id)}
        />
      )}
    </div>
  )
}
