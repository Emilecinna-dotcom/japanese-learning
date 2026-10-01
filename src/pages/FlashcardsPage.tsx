import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Zap, RotateCcw, Trophy, X, Check } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { isDue } from '@/lib/srs'
import { ALL_FLASH_ITEMS, savedWordsToItems, TYPE_LABELS, TYPE_COLORS, shuffle, type FlashItem } from '@/lib/flashItems'
import { useProgressContext } from '@/hooks/useProgress'

const SESSION_SIZE = 20

type DeckFilter = 'tout' | 'kana' | 'kanji' | 'vocab' | 'saved'

export function FlashcardsPage() {
  const { progress, rateFlashcard } = useProgressContext()
  const location = useLocation()
  const initialDeck = (location.state as { deck?: DeckFilter } | null)?.deck ?? 'tout'
  const [deckFilter, setDeckFilter] = useState<DeckFilter>(initialDeck)
  const [sessionItems, setSessionItems] = useState<FlashItem[] | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionScore, setSessionScore] = useState({ good: 0, again: 0 })
  const [animating, setAnimating] = useState(false)
  const isRating = useRef(false)

  const allItems = useMemo(
    () => [...ALL_FLASH_ITEMS, ...savedWordsToItems(progress.savedWords ?? {})],
    [progress.savedWords]
  )

  const filtered = useMemo(() => {
    if (deckFilter === 'tout') return allItems
    if (deckFilter === 'saved') return allItems.filter(i => i.id.startsWith('saved-'))
    return allItems.filter(i => i.type === deckFilter)
  }, [allItems, deckFilter])

  const dueItems = useMemo(() => {
    const due = filtered.filter(i => {
      const srs = progress.flashcards[i.id]
      return srs ? isDue(srs) : true
    })
    return shuffle(due).slice(0, SESSION_SIZE)
  }, [filtered, progress.flashcards])

  const startSession = () => {
    setSessionItems(shuffle(dueItems))
    setCurrentIdx(0)
    setFlipped(false)
    setSessionScore({ good: 0, again: 0 })
  }

  const handleRate = useCallback((knew: boolean) => {
    if (!sessionItems || isRating.current || animating) return
    isRating.current = true
    setAnimating(true)

    const item = sessionItems[currentIdx]
    const rating = knew ? 3 : 0
    rateFlashcard(item.id, item.type as 'kana' | 'kanji' | 'vocab' | 'grammaire', rating)

    if (knew) setSessionScore(s => ({ ...s, good: s.good + 1 }))
    else      setSessionScore(s => ({ ...s, again: s.again + 1 }))

    setTimeout(() => {
      setFlipped(false)
      setTimeout(() => {
        setCurrentIdx(prev => {
          if (prev + 1 >= sessionItems.length) {
            setSessionItems(null)
          }
          return prev + 1
        })
        setAnimating(false)
        isRating.current = false
      }, 180)
    }, 100)
  }, [sessionItems, currentIdx, rateFlashcard, animating])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (!sessionItems) return
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f); return }
      if (!flipped) return
      if (e.key === 'ArrowLeft'  || e.key === '1') handleRate(false)
      if (e.key === 'ArrowRight' || e.key === '2') handleRate(true)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [sessionItems, flipped, handleRate])

  // ── Résultats de session ────────────────────────────────────────
  if (sessionItems === null && sessionScore.good + sessionScore.again > 0) {
    const total = sessionScore.good + sessionScore.again
    const pct   = Math.round((sessionScore.good / total) * 100)
    return (
      <div className="max-w-md mx-auto space-y-6 py-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-200 dark:border-amber-800/50 flex items-center justify-center mx-auto mb-4">
            <Trophy size={36} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold">Session terminée !</h2>
          <p className="text-muted-foreground mt-1">{total} carte{total > 1 ? 's' : ''} révisée{total > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{pct}%</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Score</div>
          </div>
          <div className="border-x border-border">
            <div className="text-3xl font-bold text-emerald-600">{sessionScore.good}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Correctes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500">{sessionScore.again}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">À revoir</div>
          </div>
        </div>

        <button
          onClick={() => { setSessionScore({ good: 0, again: 0 }); startSession() }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <RotateCcw size={16} />
          Nouvelle session
        </button>
      </div>
    )
  }

  // ── Session active ──────────────────────────────────────────────
  if (sessionItems && sessionItems.length > 0) {
    const item = sessionItems[currentIdx]
    if (!item) return null
    const progress_pct = (currentIdx / sessionItems.length) * 100

    return (
      <div className="max-w-md mx-auto space-y-5 py-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSessionItems(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {currentIdx + 1} / {sessionItems.length}
          </span>
          <div className="w-5" />
        </div>

        {/* Barre de progression */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress_pct}%` }}
          />
        </div>

        {/* Carte */}
        <div
          className="flashcard-scene cursor-pointer select-none"
          style={{ height: '280px' }}
          onClick={() => !animating && setFlipped(f => !f)}
        >
          <div className={`flashcard-inner${flipped ? ' is-flipped' : ''}`}>

            {/* Recto */}
            <div className="flashcard-face bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-3 relative">
              <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${TYPE_COLORS[item.type]}`}>
                {TYPE_LABELS[item.type]}
              </span>
              <div className="font-jp text-[80px] leading-none">{item.front}</div>
              <p className="text-xs text-muted-foreground">Appuie pour voir la réponse</p>
              <div className="absolute bottom-4 right-4" onClick={e => e.stopPropagation()}>
                <SpeakButton text={item.front} size="sm" />
              </div>
            </div>

            {/* Verso */}
            <div className="flashcard-face flashcard-face--back bg-card border border-primary/25 rounded-2xl flex flex-col items-center justify-center gap-2 relative">
              <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${TYPE_COLORS[item.type]}`}>
                {TYPE_LABELS[item.type]}
              </span>
              <div className="font-jp text-5xl leading-none text-muted-foreground/40">{item.front}</div>
              <div className="text-center mt-1">
                {item.reading && (
                  <p className="font-jp text-lg text-muted-foreground mb-1">{item.reading}</p>
                )}
                <p className="text-2xl font-bold text-foreground">{item.back}</p>
              </div>
              <div className="absolute bottom-4 right-4" onClick={e => e.stopPropagation()}>
                <SpeakButton text={item.front} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Boutons ou hint */}
        {flipped ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRate(false)}
              disabled={animating}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-950/70 transition-colors disabled:opacity-50"
            >
              <X size={17} />
              À revoir
            </button>
            <button
              onClick={() => handleRate(true)}
              disabled={animating}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-colors disabled:opacity-50"
            >
              <Check size={17} />
              Je savais
            </button>
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground pt-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Espace</kbd> pour retourner ·
            <kbd className="mx-1 px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">←</kbd>À revoir ·
            <kbd className="ml-1 px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">→</kbd> Je savais
          </p>
        )}
      </div>
    )
  }

  // ── Menu ────────────────────────────────────────────────────────
  const masteredCount = Object.values(progress.flashcards).filter(c => c.repetitions >= 3).length
  const dueCount = dueItems.length

  const savedCount = Object.keys(progress.savedWords ?? {}).length
  const DECK_FILTERS: [DeckFilter, string][] = [
    ['tout', 'Tout'],
    ['kana', 'Kana'],
    ['kanji', 'Kanji'],
    ['vocab', 'Vocabulaire'],
    ...(savedCount > 0 ? [['saved', 'Mes mots'] as [DeckFilter, string]] : []),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Flashcards <span className="font-jp text-2xl">復習</span></h1>
        <p className="text-muted-foreground mt-1 text-sm">Répétition espacée — révise ce qui est dû aujourd'hui</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary tabular-nums">{dueCount}</div>
          <div className="text-xs text-muted-foreground mt-0.5">À réviser</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold tabular-nums">{filtered.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Total deck</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">{masteredCount}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Maîtrisées</div>
        </div>
      </div>

      {/* Filtre deck */}
      <div>
        <p className="text-sm font-medium mb-2.5">Deck</p>
        <div className="flex flex-wrap gap-2">
          {DECK_FILTERS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDeckFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                deckFilter === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70 text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={startSession}
        disabled={dueCount === 0}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Zap size={20} />
        {dueCount > 0
          ? `Commencer — ${Math.min(dueCount, SESSION_SIZE)} carte${Math.min(dueCount, SESSION_SIZE) > 1 ? 's' : ''}`
          : 'Aucune carte à réviser aujourd\'hui'}
      </button>

      {dueCount === 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 text-sm text-emerald-700 dark:text-emerald-400">
          C'est tout pour aujourd'hui ! Les prochaines cartes arriveront demain.
        </div>
      )}

      <div className="bg-muted/50 border border-border rounded-xl p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Comment ça marche ?</p>
        <p>Retourne la carte, puis dis si tu savais ou non. Les cartes maîtrisées reviennent moins souvent, celles ratées reviennent demain.</p>
      </div>
    </div>
  )
}
