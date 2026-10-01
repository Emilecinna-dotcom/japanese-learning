import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Sprout, Repeat2, X, Check, Flame, ArrowRight, BookOpenCheck, Sun } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { isDue } from '@/lib/srs'
import { ALL_FLASH_ITEMS, savedWordsToItems, TYPE_LABELS, TYPE_COLORS, shuffle, type FlashItem } from '@/lib/flashItems'
import { useProgressContext } from '@/hooks/useProgress'

// Objectif quotidien
const DAILY_NEW = 5
const DAILY_REVIEW = 15

// Petite lecture de clôture — phrase du jour
const PHRASES = [
  { jp: '継続は力なり。', romaji: 'Keizoku wa chikara nari.', fr: 'La persévérance, c\'est la force.' },
  { jp: '少しずつ上手になっています。', romaji: 'Sukoshi zutsu jōzu ni natte imasu.', fr: 'Tu progresses petit à petit.' },
  { jp: '一歩一歩進もう。', romaji: 'Ippo ippo susumō.', fr: 'Avançons pas à pas.' },
  { jp: '毎日少しでいい。', romaji: 'Mainichi sukoshi de ii.', fr: 'Un peu chaque jour, c\'est suffisant.' },
  { jp: 'やればできる。', romaji: 'Yareba dekiru.', fr: 'Si tu fais l\'effort, tu y arrives.' },
  { jp: '今日もよく頑張った。', romaji: 'Kyō mo yoku ganbatta.', fr: 'Tu as bien travaillé aujourd\'hui encore.' },
  { jp: '焦らずゆっくり。', romaji: 'Aserazu yukkuri.', fr: 'Sans précipitation, tranquillement.' },
]

interface QueueItem extends FlashItem {
  isNew: boolean
}

type Phase = 'intro' | 'running' | 'done'

export function SessionDuJourPage() {
  const { progress, rateFlashcard } = useProgressContext()

  // Pools calculés en direct pour l'écran d'intro (combien dispo aujourd'hui)
  const pools = useMemo(() => {
    const isNew: FlashItem[] = []
    const due: FlashItem[] = []
    const items = [...ALL_FLASH_ITEMS, ...savedWordsToItems(progress.savedWords ?? {})]
    for (const it of items) {
      const srs = progress.flashcards[it.id]
      if (!srs) isNew.push(it)
      else if (isDue(srs)) due.push(it)
    }
    return { isNew, due }
  }, [progress.flashcards, progress.savedWords])

  const plannedNew = Math.min(pools.isNew.length, DAILY_NEW)
  const plannedReview = Math.min(pools.due.length, DAILY_REVIEW)
  const plannedTotal = plannedNew + plannedReview

  const [phase, setPhase] = useState<Phase>('intro')
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [score, setScore] = useState({ learned: 0, good: 0, again: 0 })
  const [animating, setAnimating] = useState(false)
  const isRating = useRef(false)

  const dayIdx = Math.floor(Date.now() / 86400000)
  const phrase = PHRASES[dayIdx % PHRASES.length]

  const startSession = () => {
    // On gèle la file au démarrage : nouveautés d'abord (on apprend), puis révisions.
    const news: QueueItem[] = shuffle(pools.isNew).slice(0, DAILY_NEW).map(it => ({ ...it, isNew: true }))
    const reviews: QueueItem[] = shuffle(pools.due).slice(0, DAILY_REVIEW).map(it => ({ ...it, isNew: false }))
    const built = [...news, ...reviews]
    if (built.length === 0) return
    setQueue(built)
    setIdx(0)
    setFlipped(false)
    setScore({ learned: 0, good: 0, again: 0 })
    setPhase('running')
  }

  const current = queue[idx]

  const handleRate = useCallback((knew: boolean) => {
    if (isRating.current || animating) return
    const item = queue[idx]
    if (!item) return
    isRating.current = true
    setAnimating(true)

    rateFlashcard(item.id, item.type, knew ? 3 : 0)
    setScore(s => ({
      learned: s.learned + (item.isNew ? 1 : 0),
      good:    s.good + (item.isNew ? 0 : knew ? 1 : 0),
      again:   s.again + (!item.isNew && !knew ? 1 : 0),
    }))

    setTimeout(() => {
      setFlipped(false)
      setTimeout(() => {
        setIdx(prev => {
          const next = prev + 1
          if (next >= queue.length) setPhase('done')
          return next
        })
        setAnimating(false)
        isRating.current = false
      }, 180)
    }, 100)
  }, [queue, idx, rateFlashcard, animating])

  // Clavier
  useEffect(() => {
    if (phase !== 'running') return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f); return }
      if (!flipped) return
      if (e.key === 'ArrowLeft'  || e.key === '1') handleRate(false)
      if (e.key === 'ArrowRight' || e.key === '2') handleRate(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, flipped, handleRate])

  // ── INTRO ───────────────────────────────────────────────────────
  if (phase === 'intro') {
    const allClear = plannedTotal === 0
    return (
      <div className="max-w-md mx-auto py-2 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-1">
            <Sparkles size={30} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Session du jour</h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {allClear ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center mx-auto">
              <Check size={26} className="text-emerald-600" />
            </div>
            <p className="font-semibold text-foreground">Tout est à jour !</p>
            <p className="text-sm text-muted-foreground">
              Aucune révision en attente et toutes les nouveautés du jour sont vues. Reviens demain, ou explore une nouvelle section.
            </p>
            <Link to="/kanji" className="inline-flex items-center gap-2 mt-1 text-sm font-medium text-primary hover:underline">
              Découvrir des kanji <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-stretch divide-x divide-border">
                <div className="flex-1 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                    <Sprout size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums leading-none">{plannedNew}</p>
                    <p className="text-xs text-muted-foreground mt-1">à découvrir</p>
                  </div>
                </div>
                <div className="flex-1 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Repeat2 size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums leading-none">{plannedReview}</p>
                    <p className="text-xs text-muted-foreground mt-1">à réviser</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-muted/40 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpenCheck size={14} />
                <span>Environ {Math.max(2, Math.round(plannedTotal * 0.25))} min · {plannedTotal} carte{plannedTotal > 1 ? 's' : ''}</span>
                {progress.streak > 0 && (
                  <span className="ml-auto inline-flex items-center gap-1 font-medium text-foreground">
                    <Flame size={13} className="text-amber-500" />
                    {progress.streak} j
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 active:scale-[0.99] transition-all"
            >
              <Sparkles size={19} />
              Commencer la session
            </button>

            <div className="bg-muted/50 border border-border rounded-xl p-4 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Comment ça marche ?</p>
              <p>
                On commence par {plannedNew > 0 ? 'quelques nouveautés à apprendre, ' : ''}puis on révise ce qui est dû.
                Ce que tu rates revient demain, ce que tu sais s'espace dans le temps. Une session par jour entretient ta série.
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  // ── DONE ────────────────────────────────────────────────────────
  if (phase === 'done') {
    const reviewed = score.good + score.again
    const remainingReview = Math.max(0, pools.due.length - DAILY_REVIEW)
    return (
      <div className="max-w-md mx-auto py-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-200 dark:border-amber-800/50 flex items-center justify-center mx-auto">
            <Sun size={36} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Session terminée !</h1>
          <p className="text-muted-foreground text-sm inline-flex items-center gap-1.5">
            <Flame size={15} className="text-amber-500" />
            Série de {progress.streak} jour{progress.streak > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-600 tabular-nums">{score.learned}</div>
            <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">Appris</div>
          </div>
          <div className="border-x border-border">
            <div className="text-3xl font-bold text-primary tabular-nums">{reviewed}</div>
            <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">Révisé</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground tabular-nums">{score.again}</div>
            <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">À revoir</div>
          </div>
        </div>

        {/* Lecture de clôture — phrase du jour */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 pt-4 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Lecture du jour</span>
            <SpeakButton text={phrase.jp} size="sm" />
          </div>
          <div className="px-5 pb-5 pt-2 space-y-2">
            <p className="font-jp text-2xl leading-snug text-foreground">{phrase.jp}</p>
            <p className="text-xs font-mono text-muted-foreground">{phrase.romaji}</p>
            <p className="text-sm font-medium text-foreground/75 pt-2 border-t border-border">{phrase.fr}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {remainingReview > 0 && (
            <Link
              to="/flashcards"
              className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-primary/8 border border-primary/20 hover:bg-primary/12 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                Continuer — {remainingReview} révision{remainingReview > 1 ? 's' : ''} restante{remainingReview > 1 ? 's' : ''}
              </span>
              <ArrowRight size={15} className="text-primary" />
            </Link>
          )}
          <Link
            to="/"
            className="flex items-center justify-center w-full py-3.5 rounded-xl bg-muted hover:bg-muted/70 text-foreground font-medium text-sm transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  // ── RUNNING ─────────────────────────────────────────────────────
  if (!current) return null
  const pct = (idx / queue.length) * 100

  return (
    <div className="max-w-md mx-auto space-y-5 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPhase('intro')}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Quitter la session"
        >
          <X size={18} />
        </button>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {idx + 1} / {queue.length}
        </span>
        <div className="w-5" />
      </div>

      {/* Progression */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
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
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${TYPE_COLORS[current.type]}`}>
                {TYPE_LABELS[current.type]}
              </span>
              {current.isNew && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 inline-flex items-center gap-1">
                  <Sprout size={11} /> Nouveau
                </span>
              )}
            </div>
            <div className="font-jp text-[80px] leading-none">{current.front}</div>
            <p className="text-xs text-muted-foreground">
              {current.isNew ? 'Nouveau — appuie pour découvrir' : 'Appuie pour voir la réponse'}
            </p>
            <div className="absolute bottom-4 right-4" onClick={e => e.stopPropagation()}>
              <SpeakButton text={current.front} size="sm" />
            </div>
          </div>

          {/* Verso */}
          <div className="flashcard-face flashcard-face--back bg-card border border-primary/25 rounded-2xl flex flex-col items-center justify-center gap-2 relative">
            <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${TYPE_COLORS[current.type]}`}>
              {TYPE_LABELS[current.type]}
            </span>
            <div className="font-jp text-5xl leading-none text-muted-foreground/40">{current.front}</div>
            <div className="text-center mt-1">
              {current.reading && <p className="font-jp text-lg text-muted-foreground mb-1">{current.reading}</p>}
              <p className="text-2xl font-bold text-foreground">{current.back}</p>
            </div>
            <div className="absolute bottom-4 right-4" onClick={e => e.stopPropagation()}>
              <SpeakButton text={current.front} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Boutons / hint */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleRate(false)}
            disabled={animating}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-950/70 transition-colors disabled:opacity-50"
          >
            <X size={17} />
            {current.isNew ? 'Pas encore' : 'À revoir'}
          </button>
          <button
            onClick={() => handleRate(true)}
            disabled={animating}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-colors disabled:opacity-50"
          >
            <Check size={17} />
            {current.isNew ? 'Compris' : 'Je savais'}
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground pt-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Espace</kbd> pour retourner ·
          <kbd className="mx-1 px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">←</kbd> non ·
          <kbd className="ml-1 px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">→</kbd> oui
        </p>
      )}
    </div>
  )
}
