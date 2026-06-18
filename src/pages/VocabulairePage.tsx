import { useState } from 'react'
import { Brain, BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { ALL_THEMES } from '@/data/vocabulary'
import { useVocabQuiz } from '@/hooks/useVocabQuiz'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizResult } from '@/components/quiz/QuizResult'
import { useProgressContext } from '@/hooks/useProgress'
import type { VocabTheme } from '@/types/vocabulary'
import { Hash, Palette, Users, Utensils, Train, PersonStanding, Calendar, HandMetal, BookOpen as BookIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ReactNode> = {
  hash:             <Hash size={22} />,
  palette:          <Palette size={22} />,
  users:            <Users size={22} />,
  utensils:         <Utensils size={22} />,
  train:            <Train size={22} />,
  'person-standing':<PersonStanding size={22} />,
  calendar:         <Calendar size={22} />,
  'hand-wave':      <HandMetal size={22} />,
}

const LEVEL_STYLE: Record<string, string> = {
  débutant:     'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  intermédiaire:'bg-amber-100   dark:bg-amber-900   text-amber-700   dark:text-amber-300',
  avancé:       'bg-red-100     dark:bg-red-900     text-red-700     dark:text-red-300',
}

interface ThemeDetailViewProps {
  theme: VocabTheme
  onBack: () => void
}

function ThemeDetailView({ theme, onBack }: ThemeDetailViewProps) {
  const [tab, setTab] = useState<'liste' | 'quiz'>('liste')
  const { markItemSeen, progress } = useProgressContext()
  const quiz = useVocabQuiz(theme.items, 'jp-to-fr')
  const seenCount = theme.items.filter(i => !!progress.vocabulary[i.id]?.seen).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-muted hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{theme.labelFR}</h1>
            <p className="text-muted-foreground text-xs">{theme.description} · {theme.items.length} mots</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-primary">{seenCount}</p>
            <p className="text-xs text-muted-foreground">/ {theme.items.length} vus</p>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(seenCount / theme.items.length) * 100}%` }} />
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2">
        {([['liste', 'Liste des mots', BookOpen], ['quiz', 'Quiz', Brain]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
              tab === key
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {tab === 'liste' && (
        <div className="space-y-2">
          {theme.items.map(item => {
            const isSeen = !!progress.vocabulary[item.id]?.seen
            return (
              <div
                key={item.id}
                onClick={() => markItemSeen('vocabulary', item.id)}
                className={cn(
                  'bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md group',
                  isSeen ? 'border-primary/30' : 'border-border hover:border-primary/20'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Japonais + kana + romaji */}
                    <div className="flex items-baseline gap-3 flex-wrap mb-1">
                      <span className="font-jp-serif text-2xl font-bold text-foreground">{item.japanese}</span>
                      {item.kana !== item.japanese && (
                        <span className="font-jp text-sm text-muted-foreground">{item.kana}</span>
                      )}
                      <span className="text-xs text-muted-foreground font-mono tracking-wide">{item.romaji}</span>
                    </div>
                    {/* Traduction */}
                    <p className="text-base font-semibold text-foreground">{item.frenchTranslation}</p>
                    {/* Exemple */}
                    {item.exampleSentence && (
                      <div className="mt-2 pl-3 border-l-2 border-primary/40">
                        <p className="font-jp text-xs text-muted-foreground">{item.exampleSentence.kana}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.exampleSentence.frenchTranslation}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <SpeakButton text={item.japanese} size="sm" />
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', LEVEL_STYLE[item.level] ?? LEVEL_STYLE.débutant)}>
                      {item.level}
                    </span>
                    {isSeen
                      ? <CheckCircle2 size={16} className="text-primary" />
                      : <div className="w-4 h-4 rounded-full border-2 border-border group-hover:border-primary/40 transition-colors" />
                    }
                  </div>
                </div>
              </div>
            )
          })}
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
              title={theme.labelFR}
            />
          ) : quiz.currentItem ? (
            <QuizCard
              question={quiz.currentItem.japanese}
              questionSub={quiz.currentItem.kana !== quiz.currentItem.japanese ? quiz.currentItem.kana : undefined}
              choices={quiz.choices.map(c => ({ id: c.id, label: c.frenchTranslation }))}
              selected={quiz.selected}
              correctId={quiz.currentItem.id}
              phase={quiz.phase}
              onAnswer={quiz.answer}
              onNext={quiz.next}
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

export function VocabulairePage() {
  const [activeTheme, setActiveTheme] = useState<VocabTheme | null>(null)
  const { progress } = useProgressContext()

  if (activeTheme) {
    return <ThemeDetailView theme={activeTheme} onBack={() => setActiveTheme(null)} />
  }

  const totalVocab = ALL_THEMES.reduce((s, t) => s + t.items.length, 0)
  const totalSeen  = ALL_THEMES.reduce((s, t) => s + t.items.filter(i => !!progress.vocabulary[i.id]?.seen).length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Vocabulaire
              <span className="font-jp-serif text-primary text-3xl">語彙</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Vocabulaire thématique pour débuter</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{totalSeen}</div>
            <div className="text-xs text-muted-foreground">/ {totalVocab} mots vus</div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${(totalSeen / totalVocab) * 100}%` }} />
        </div>
      </div>

      {/* Grille des thèmes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ALL_THEMES.map(theme => {
          const seenCount = theme.items.filter(i => !!progress.vocabulary[i.id]?.seen).length
          const pct = Math.round((seenCount / theme.items.length) * 100)
          const done = seenCount === theme.items.length

          return (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme)}
              className={cn(
                'bg-card border rounded-2xl p-4 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group relative overflow-hidden',
                done ? 'border-primary/40' : 'border-border hover:border-primary/30'
              )}
            >
              {done && (
                <div className="absolute top-2.5 right-2.5">
                  <CheckCircle2 size={14} className="text-primary" />
                </div>
              )}

              {/* Icône */}
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110', theme.colorClass)}>
                {ICON_MAP[theme.icon] ?? <BookIcon size={22} />}
              </div>

              {/* Texte */}
              <p className="font-bold text-sm mb-0.5">{theme.labelFR}</p>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{theme.description}</p>

              {/* Stats + barre */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">{theme.items.length} mots</span>
                <span className={cn('font-bold', done ? 'text-primary' : 'text-muted-foreground')}>
                  {seenCount}/{theme.items.length}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
