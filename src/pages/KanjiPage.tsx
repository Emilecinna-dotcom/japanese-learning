import { useState, useMemo } from 'react'
import { Search, Brain, BookOpen } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { KANJI_N5 } from '@/data/kanji-n5'
import { useVocabQuiz } from '@/hooks/useVocabQuiz'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizResult } from '@/components/quiz/QuizResult'
import { useProgressContext } from '@/hooks/useProgress'
import type { VocabItem } from '@/types/vocabulary'

function kanjiToVocabItem(k: typeof KANJI_N5[0]): VocabItem {
  return {
    id: k.id,
    japanese: k.character,
    kana: k.kunyomi[0] ?? k.onyomi[0] ?? '',
    romaji: '',
    frenchTranslation: k.meaningFR.join(', '),
    category: k.tags[0] ?? '',
    level: 'débutant',
    tags: k.tags,
  }
}

const KANJI_AS_VOCAB = KANJI_N5.map(kanjiToVocabItem)

interface KanjiCardProps {
  kanji: typeof KANJI_N5[0]
  isSeen?: boolean
  onClick: () => void
}

function KanjiCard({ kanji, isSeen, onClick }: KanjiCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-card border border-border rounded-xl p-3 text-left hover:border-primary/40 hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-jp text-4xl leading-none">{kanji.character}</span>
        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">{kanji.jlptLevel}</span>
      </div>
      <p className="text-xs font-medium text-foreground line-clamp-1">{kanji.meaningFR.join(', ')}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{kanji.onyomi.join('・')}</p>
      {isSeen && <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary" />}
    </button>
  )
}

interface KanjiDetailModalProps {
  kanji: typeof KANJI_N5[0]
  onClose: () => void
  onMarkSeen: () => void
  isSeen: boolean
}

function KanjiDetailModal({ kanji, onClose, onMarkSeen, isSeen }: KanjiDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <span className="font-jp text-8xl leading-none">{kanji.character}</span>
          <div className="flex items-center gap-2">
            <SpeakButton text={kanji.character} />
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl p-1">✕</button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-1">{kanji.meaningFR.join(', ')}</h2>
        <div className="flex gap-2 mb-4">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{kanji.jlptLevel}</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">{kanji.strokeCount} traits</span>
        </div>

        <div className="space-y-3 mb-4">
          {kanji.onyomi.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lecture On（音読み）</p>
              <div className="flex flex-wrap gap-1.5">
                {kanji.onyomi.map(r => (
                  <span key={r} className="font-jp text-sm bg-orange-50 dark:bg-orange-950/75 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">{r}</span>
                ))}
              </div>
            </div>
          )}
          {kanji.kunyomi.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lecture Kun（訓読み）</p>
              <div className="flex flex-wrap gap-1.5">
                {kanji.kunyomi.map(r => (
                  <span key={r} className="font-jp text-sm bg-blue-50 dark:bg-blue-950/75 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">{r}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Exemples</p>
          <div className="space-y-2">
            {kanji.examples.map((ex, i) => (
              <div key={i} className="bg-muted rounded-lg p-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-jp font-semibold">{ex.word}</span>
                  <span className="font-jp text-sm text-muted-foreground">{ex.reading}</span>
                </div>
                <p className="text-sm text-muted-foreground">{ex.meaningFR}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { onMarkSeen(); onClose() }}
          disabled={isSeen}
          className={`mt-4 w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
            isSeen ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isSeen ? 'Déjà vu ✓' : 'Marquer comme vu'}
        </button>
      </div>
    </div>
  )
}

export function KanjiPage() {
  const { progress, markItemSeen } = useProgressContext()
  const [tab, setTab] = useState<'apprendre' | 'quiz'>('apprendre')
  const [search, setSearch] = useState('')
  const [selectedKanji, setSelectedKanji] = useState<typeof KANJI_N5[0] | null>(null)

  const quiz = useVocabQuiz(KANJI_AS_VOCAB, 'jp-to-fr')

  const filtered = useMemo(() => {
    if (!search) return KANJI_N5
    const q = search.toLowerCase()
    return KANJI_N5.filter(k =>
      k.character.includes(q) ||
      k.meaningFR.some(m => m.toLowerCase().includes(q)) ||
      k.onyomi.some(r => r.toLowerCase().includes(q)) ||
      k.kunyomi.some(r => r.toLowerCase().includes(q))
    )
  }, [search])

  const seenCount = Object.keys(progress.kanji).length

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kanji <span className="font-jp">漢字</span> N5</h1>
            <p className="text-muted-foreground mt-1">Les 50 kanji essentiels du niveau débutant JLPT N5</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{seenCount}/{KANJI_N5.length}</div>
            <div className="text-xs text-muted-foreground">vus</div>
          </div>
        </div>
      </div>

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
        <>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un kanji ou une signification..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {filtered.map(k => (
              <KanjiCard
                key={k.id}
                kanji={k}
                isSeen={!!progress.kanji[k.id]?.seen}
                onClick={() => setSelectedKanji(k)}
              />
            ))}
          </div>
        </>
      )}

      {tab === 'quiz' && (
        <div className="max-w-lg mx-auto">
          {quiz.phase === 'complete' ? (
            <QuizResult
              score={quiz.score}
              total={quiz.total}
              durationSeconds={quiz.durationSeconds}
              onRestart={quiz.restart}
              title="Kanji N5"
            />
          ) : quiz.currentItem ? (
            <QuizCard
              question={quiz.currentItem.japanese}
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

      {selectedKanji && (
        <KanjiDetailModal
          kanji={selectedKanji}
          onClose={() => setSelectedKanji(null)}
          onMarkSeen={() => markItemSeen('kanji', selectedKanji.id)}
          isSeen={!!progress.kanji[selectedKanji.id]?.seen}
        />
      )}
    </div>
  )
}
