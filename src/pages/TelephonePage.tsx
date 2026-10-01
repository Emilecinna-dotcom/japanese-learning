import { useState, useMemo } from 'react'
import { Smartphone, Brain, BookOpen, X } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { useSpeech } from '@/hooks/useSpeech'
import {
  PHONE_ITEMS,
  PHONE_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_DOT,
  type PhoneItem,
  type PhoneCategory,
} from '@/data/kanji-telephone'
import { useVocabQuiz } from '@/hooks/useVocabQuiz'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizResult } from '@/components/quiz/QuizResult'
import type { VocabItem } from '@/types/vocabulary'

function phoneToVocab(item: PhoneItem): VocabItem {
  return {
    id: item.id,
    japanese: item.kanji,
    kana: item.kana,
    romaji: item.romaji,
    frenchTranslation: item.fr,
    category: item.category,
    level: 'débutant',
    tags: [item.category],
  }
}

const ALL_AS_VOCAB = PHONE_ITEMS.map(phoneToVocab)

// ── Card ────────────────────────────────────────────────────────────────────

interface PhoneCardProps {
  item: PhoneItem
  onClick: () => void
}

function PhoneCard({ item, onClick }: PhoneCardProps) {
  const colorCls = CATEGORY_COLORS[item.category]
  const dotCls = CATEGORY_DOT[item.category]
  return (
    <button
      onClick={onClick}
      className="group bg-card border border-border rounded-xl p-3 text-left hover:border-primary/40 hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col gap-1.5 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-1 min-w-0">
        <span className="font-jp text-xl leading-none min-w-0 flex-1 overflow-hidden whitespace-nowrap block">{item.kanji}</span>
        <span className="text-base leading-none mt-0.5 shrink-0">{item.emoji}</span>
      </div>
      <p className="font-jp text-xs text-muted-foreground truncate">{item.kana}</p>
      <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">{item.fr}</p>
      <span className={`self-start text-[10px] px-1.5 py-0.5 rounded-full border font-medium truncate max-w-full ${colorCls}`}>
        <span className={`inline-block w-1 h-1 rounded-full mr-1 ${dotCls}`} />
        {item.category}
      </span>
    </button>
  )
}

// ── Modal ────────────────────────────────────────────────────────────────────

interface PhoneDetailModalProps {
  item: PhoneItem
  onClose: () => void
}

function PhoneDetailModal({ item, onClose }: PhoneDetailModalProps) {
  const colorCls = CATEGORY_COLORS[item.category]
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{item.emoji}</span>
            <div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${colorCls}`}>
                {item.category}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="font-jp text-7xl font-bold mb-2 leading-none">{item.kanji}</p>
          <p className="font-jp text-xl text-muted-foreground mb-1">{item.kana}</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm text-muted-foreground font-mono">{item.romaji}</p>
            <SpeakButton text={item.kana} />
          </div>
        </div>

        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-lg font-bold">{item.fr}</p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Tu verras ce mot dans les menus de ton téléphone en japonais.
        </p>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function TelephonePage() {
  const [tab, setTab] = useState<'référence' | 'quiz'>('référence')
  const [activeCategory, setActiveCategory] = useState<PhoneCategory | 'tout'>('tout')
  const [selected, setSelected] = useState<PhoneItem | null>(null)
  const { speak } = useSpeech()

  const filtered = useMemo(() =>
    activeCategory === 'tout'
      ? PHONE_ITEMS
      : PHONE_ITEMS.filter(i => i.category === activeCategory),
    [activeCategory]
  )

  const quizItems = useMemo(() =>
    activeCategory === 'tout'
      ? ALL_AS_VOCAB
      : ALL_AS_VOCAB.filter(i => i.category === activeCategory),
    [activeCategory]
  )

  const quiz = useVocabQuiz(quizItems, 'jp-to-fr')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Smartphone size={26} className="text-primary" />
            Téléphone <span className="font-jp">スマホ</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {PHONE_ITEMS.length} mots pour lire ton téléphone en japonais
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{PHONE_ITEMS.length}</div>
          <div className="text-xs text-muted-foreground">mots-clés</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {([['référence', 'Référence', BookOpen], ['quiz', 'Quiz', Brain]] as const).map(([key, label, Icon]) => (
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

      {/* Category filter — scroll horizontal sur mobile, wrap sur desktop */}
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        <button
          onClick={() => setActiveCategory('tout')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            activeCategory === 'tout'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
          }`}
        >
          Tout ({PHONE_ITEMS.length})
        </button>
        {PHONE_CATEGORIES.map(cat => {
          const count = PHONE_ITEMS.filter(i => i.category === cat).length
          const isActive = activeCategory === cat
          const colorCls = CATEGORY_COLORS[cat]
          const dotCls = CATEGORY_DOT[cat]
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isActive ? colorCls : 'bg-muted text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dotCls}`} />
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Référence grid */}
      {tab === 'référence' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filtered.map(item => (
            <PhoneCard key={item.id} item={item} onClick={() => { speak(item.kana); setSelected(item) }} />
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
              title="Vocabulaire téléphone"
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

      {/* Detail modal */}
      {selected && (
        <PhoneDetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
