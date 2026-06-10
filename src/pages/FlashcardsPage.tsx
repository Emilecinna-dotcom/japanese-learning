import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Zap, RotateCcw, Trophy } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { isDue } from '@/lib/srs'
import { useProgressContext } from '@/hooks/useProgress'

interface FlashItem {
  id: string
  front: string
  back: string
  reading?: string
  type: 'kana' | 'kanji' | 'vocab'
}

function buildAllFlashItems(): FlashItem[] {
  const items: FlashItem[] = []
  ALL_HIRAGANA.slice(0, 46).forEach(k => {
    items.push({ id: k.id, front: k.kana, back: k.romaji, type: 'kana' })
  })
  ALL_KATAKANA.forEach(k => {
    items.push({ id: k.id, front: k.kana, back: k.romaji, type: 'kana' })
  })
  KANJI_N5.forEach(k => {
    items.push({ id: k.id, front: k.character, back: k.meaningFR.join(', '), reading: k.kunyomi[0] ?? k.onyomi[0], type: 'kanji' })
  })
  ALL_THEMES.forEach(theme => {
    theme.items.forEach(v => {
      items.push({ id: v.id, front: v.japanese, back: v.frenchTranslation, reading: v.kana !== v.japanese ? v.kana : undefined, type: 'vocab' })
    })
  })
  return items
}

const ALL_FLASH_ITEMS = buildAllFlashItems()

const RATINGS = [
  { rating: 0 as const, label: 'À revoir', key: '1', cls: 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-950/60' },
  { rating: 1 as const, label: 'Difficile', key: '2', cls: 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-950/60' },
  { rating: 2 as const, label: 'Bien',      key: '3', cls: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-950/60' },
  { rating: 3 as const, label: 'Facile',    key: '4', cls: 'bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-950/60' },
]

export function FlashcardsPage() {
  const { progress, rateFlashcard } = useProgressContext()
  const [deckFilter, setDeckFilter] = useState<'tout' | 'kana' | 'kanji' | 'vocab'>('tout')
  const [sessionItems, setSessionItems] = useState<FlashItem[] | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionScore, setSessionScore] = useState({ good: 0, again: 0 })
  const isRating = useRef(false)

  const dueItems = useMemo(() => {
    const candidates = deckFilter === 'tout'
      ? ALL_FLASH_ITEMS
      : ALL_FLASH_ITEMS.filter(i => i.type === deckFilter)
    return candidates.filter(i => {
      const srs = progress.flashcards[i.id]
      return srs ? isDue(srs) : true
    }).slice(0, 20)
  }, [deckFilter, progress.flashcards])

  const startSession = () => {
    setSessionItems(dueItems)
    setCurrentIdx(0)
    setFlipped(false)
    setSessionScore({ good: 0, again: 0 })
  }

  const handleRate = useCallback((rating: 0 | 1 | 2 | 3) => {
    if (!sessionItems || isRating.current) return
    isRating.current = true
    const item = sessionItems[currentIdx]
    rateFlashcard(item.id, item.type, rating)
    if (rating >= 2) setSessionScore(s => ({ ...s, good: s.good + 1 }))
    else setSessionScore(s => ({ ...s, again: s.again + 1 }))
    setFlipped(false)
    setTimeout(() => {
      setCurrentIdx(prev => {
        if (prev + 1 >= sessionItems.length) {
          setSessionItems(null)
          return prev
        }
        return prev + 1
      })
      isRating.current = false
    }, 150)
  }, [sessionItems, currentIdx, rateFlashcard])

  // Keyboard shortcuts: Space/Enter to flip, 1-4 to rate
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (!sessionItems || sessionItems.length === 0) return

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped(f => !f)
        return
      }
      if (flipped) {
        if (e.key === '1') handleRate(0)
        else if (e.key === '2') handleRate(1)
        else if (e.key === '3') handleRate(2)
        else if (e.key === '4') handleRate(3)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [sessionItems, flipped, handleRate])

  // ── Session résultats ───────────────────────────────────────────
  if (sessionItems === null && sessionScore.good + sessionScore.again > 0) {
    const total = sessionScore.good + sessionScore.again
    const pct   = Math.round((sessionScore.good / total) * 100)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Flashcards <span className="font-jp">復習</span></h1>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center mx-auto mb-5">
            <Trophy size={36} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Session terminée !</h2>
          <p className="text-muted-foreground mb-2">{total} carte{total > 1 ? 's' : ''} révisée{total > 1 ? 's' : ''}</p>
          <p className="text-sm font-semibold text-primary mb-6">{pct}% de bonnes réponses</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 dark:bg-green-950/75 rounded-xl p-4 border border-green-200 dark:border-green-900/50">
              <div className="text-3xl font-bold text-green-600">{sessionScore.good}</div>
              <div className="text-sm text-green-700 dark:text-green-400">Correctes</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/75 rounded-xl p-4 border border-red-200 dark:border-red-900/50">
              <div className="text-3xl font-bold text-red-600">{sessionScore.again}</div>
              <div className="text-sm text-red-700 dark:text-red-400">À revoir</div>
            </div>
          </div>
          <button
            onClick={() => { setSessionScore({ good: 0, again: 0 }); startSession() }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 mx-auto transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            Nouvelle session
          </button>
        </div>
      </div>
    )
  }

  // ── Session active ──────────────────────────────────────────────
  if (sessionItems && sessionItems.length > 0) {
    const item = sessionItems[currentIdx]
    if (!item) return null
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
          <span className="text-sm text-muted-foreground tabular-nums">{currentIdx + 1}/{sessionItems.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentIdx / sessionItems.length) * 100}%` }} />
        </div>

        {/* 3D Flip Card */}
        <div
          className="flashcard-scene cursor-pointer"
          style={{ height: '260px' }}
          onClick={() => setFlipped(f => !f)}
          role="button"
          tabIndex={0}
          aria-label={flipped ? "Carte retournée — appuyer pour remettre à l'endroit" : 'Appuyer pour révéler la réponse'}
          onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f) } }}
        >
          <div className={`flashcard-inner${flipped ? ' is-flipped' : ''}`}>
            {/* Recto */}
            <div className="flashcard-face bg-card border border-border hover:border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors">
              <div className="font-jp text-7xl leading-none select-none">{item.front}</div>
              <p className="text-xs text-muted-foreground">Espace · Entrée · Clic</p>
            </div>

            {/* Verso */}
            <div className="flashcard-face flashcard-face--back bg-card border border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-3">
              <div className="font-jp text-6xl leading-none text-primary/35 select-none">{item.front}</div>
              <div className="text-center space-y-1">
                {item.reading && <p className="font-jp text-lg text-muted-foreground">{item.reading}</p>}
                <p className="text-2xl font-bold">{item.back}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons de notation */}
        {flipped ? (
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map(({ rating, label, key, cls }) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${cls}`}
              >
                <span className="block text-[10px] opacity-50 mb-0.5">{key}</span>
                {label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Retourne la carte, puis note ta réponse avec les touches <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">1</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">4</kbd>
          </p>
        )}
      </div>
    )
  }

  // ── Menu de sélection ───────────────────────────────────────────
  const dueCount = dueItems.length
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Flashcards <span className="font-jp">復習</span></h1>
        <p className="text-muted-foreground mt-1">Répétition espacée pour mémoriser efficacement</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'À réviser',     value: dueCount,                                                                              color: 'text-primary' },
          { label: 'Cartes totales', value: ALL_FLASH_ITEMS.length,                                                               color: 'text-foreground' },
          { label: 'Maîtrisées',    value: Object.values(progress.flashcards).filter(c => c.repetitions >= 3).length,             color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Deck</p>
        <div className="flex flex-wrap gap-2">
          {([['tout', 'Tout'], ['kana', 'Kana'], ['kanji', 'Kanji'], ['vocab', 'Vocabulaire']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDeckFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                deckFilter === key ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={startSession}
        disabled={dueCount === 0}
        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Zap size={18} />
        {dueCount > 0 ? `Commencer (${Math.min(dueCount, 20)} cartes)` : 'Aucune carte à réviser'}
      </button>

      {dueCount === 0 && (
        <div className="bg-green-50 dark:bg-green-950/70 border border-green-200 dark:border-green-900/40 rounded-xl p-4 text-sm text-green-700 dark:text-green-400">
          Bravo ! Tu as révisé toutes tes cartes pour aujourd'hui. Reviens demain pour continuer !
        </div>
      )}

      <div className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
        <p className="font-medium mb-1">Comment fonctionne la répétition espacée ?</p>
        <p>L'algorithme SM-2 ajuste l'intervalle de révision selon ta réponse. Les cartes faciles reviennent moins souvent, les difficiles plus souvent.</p>
      </div>
    </div>
  )
}
