import { useState } from 'react'
import { Hash, Brain, BookOpen } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { SystemeEcritureInfo, CHIFFRES_INFO } from '@/components/SystemeEcritureInfo'
import { CHIFFRES_THEME } from '@/data/vocabulary/chiffres'
import { useVocabQuiz } from '@/hooks/useVocabQuiz'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizResult } from '@/components/quiz/QuizResult'
import { useProgressContext } from '@/hooks/useProgress'

const ITEMS = CHIFFRES_THEME.items

const GROUPS = [
  { label: 'De 0 à 10',    items: ITEMS.filter(i => ['c0','c1','c2','c3','c4','c5','c6','c7','c8','c9','c10'].includes(i.id)) },
  { label: 'Dizaines',     items: ITEMS.filter(i => ['c11','c12','c20'].includes(i.id)) },
  { label: 'Centaines',    items: ITEMS.filter(i => i.category === 'centaines') },
  { label: 'Milliers',     items: ITEMS.filter(i => i.category === 'milliers') },
]

export function ChiffresPage() {
  const { markItemSeen } = useProgressContext()
  const [tab, setTab] = useState<'apprendre' | 'quiz'>('apprendre')
  const quiz = useVocabQuiz(ITEMS, 'jp-to-fr')

  const handleNext = () => {
    if (quiz.phase === 'feedback' && quiz.selected === quiz.currentItem?.id) {
      markItemSeen('vocabulary', quiz.currentItem.id)
    }
    quiz.next()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hash size={20} className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Chiffres <span className="font-jp">数字</span></h1>
          </div>
          <p className="text-muted-foreground">Compter en japonais, de zéro à dix mille</p>
        </div>
      </div>

      <SystemeEcritureInfo {...CHIFFRES_INFO} />

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

      {/* Learn */}
      {tab === 'apprendre' && (
        <div className="space-y-6">
          {/* Règle de construction */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-1.5">
            <p className="text-sm font-semibold text-primary">Comment construire les nombres</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-jp font-semibold text-foreground">11 = 十一</span> (10+1), &nbsp;
              <span className="font-jp font-semibold text-foreground">23 = 二十三</span> (2×10+3), &nbsp;
              <span className="font-jp font-semibold text-foreground">100 = 百</span>, &nbsp;
              <span className="font-jp font-semibold text-foreground">1000 = 千</span>, &nbsp;
              <span className="font-jp font-semibold text-foreground">10000 = 一万</span>
            </p>
          </div>

          {GROUPS.map(group => (
            <div key={group.label}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{group.label}</h3>
              <div className="space-y-2">
                {group.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/30 transition-colors">
                    <span className="font-jp text-3xl font-bold leading-none w-16 text-center shrink-0">{item.japanese}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-jp text-sm text-muted-foreground">{item.kana}</p>
                      <p className="text-xs text-primary font-semibold tracking-widest uppercase">{item.romaji}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-foreground">{item.frenchTranslation}</p>
                      <SpeakButton text={item.japanese} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz */}
      {tab === 'quiz' && (
        <div className="max-w-lg mx-auto">
          {quiz.phase === 'complete' ? (
            <QuizResult
              score={quiz.score}
              total={quiz.total}
              durationSeconds={quiz.durationSeconds}
              onRestart={quiz.restart}
              title="Chiffres"
            />
          ) : quiz.currentItem ? (
            <QuizCard
              question={quiz.currentItem.japanese}
              questionLabel="Que signifie ce chiffre ?"
              choices={quiz.choices.map(c => ({ id: c.id, label: c.frenchTranslation }))}
              selected={quiz.selected}
              correctId={quiz.currentItem.id}
              phase={quiz.phase}
              onAnswer={quiz.answer}
              onNext={handleNext}
              score={quiz.score}
              currentIndex={quiz.currentIndex}
              total={quiz.total}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
