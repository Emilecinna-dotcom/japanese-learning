import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, ArrowLeft, Check, X, Plus, Sparkles, Type } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { GRADED_TEXTS, type GradedText, type RToken } from '@/data/lectureGraded'
import { useProgressContext } from '@/hooks/useProgress'
import { cn } from '@/lib/utils'

type LevelFilter = 'Tous' | 'N5' | 'N4'
const FILTERS: LevelFilter[] = ['Tous', 'N5', 'N4']

const LEVEL_BADGE: Record<string, string> = {
  N5: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
  N4: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700',
}

const hasKanji = (s: string) => /[一-龯]/.test(s)
const sentenceText = (s: RToken[]) => s.map(t => t.t).join('')

// ── Carte d'index ─────────────────────────────────────────────────
function TextCard({ text, onClick }: { text: GradedText; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-2xl p-5 text-left w-full transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base leading-tight mb-0.5 group-hover:text-primary transition-colors">{text.title}</p>
          <p className="font-jp text-sm text-muted-foreground">{text.titleJp}</p>
        </div>
        <span className={cn('shrink-0 text-xs font-bold px-2.5 py-1 rounded-full', LEVEL_BADGE[text.level])}>{text.level}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{text.summary}</p>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Lire <ArrowRight size={12} />
      </div>
    </button>
  )
}

// ── Mot cliquable ─────────────────────────────────────────────────
function Word({ token, furigana, onPick }: { token: RToken; furigana: boolean; onPick: (t: RToken) => void }) {
  const tappable = !!token.m
  const showRuby = furigana && token.r && hasKanji(token.t)

  const content = showRuby ? (
    <ruby>
      {token.t}
      <rt className="font-jp text-[0.6em] text-muted-foreground font-normal">{token.r}</rt>
    </ruby>
  ) : token.t

  if (!tappable) return <span className="font-jp">{content}</span>

  return (
    <button
      onClick={() => onPick(token)}
      className="font-jp rounded-md px-0.5 -mx-0.5 transition-colors hover:bg-primary/10 underline decoration-dotted decoration-primary/40 underline-offset-4"
    >
      {content}
    </button>
  )
}

// ── Lecteur ───────────────────────────────────────────────────────
function Reader({ text, onBack, onNext }: { text: GradedText; onBack: () => void; onNext: (() => void) | null }) {
  const { progress, saveWord } = useProgressContext()
  const [furigana, setFurigana] = useState(true)
  const [picked, setPicked] = useState<RToken | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const fullText = text.sentences.map(sentenceText).join('')
  const allAnswered = text.questions.every((_, i) => answers[i] !== undefined)
  const score = text.questions.filter((q, i) => answers[i] === q.answer).length
  const isSaved = picked ? !!progress.savedWords?.[picked.t] : false

  return (
    <div className="space-y-5 pb-28">
      {/* Barre haut */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-sm font-medium">
          <ArrowLeft size={15} /> Retour
        </button>
        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', LEVEL_BADGE[text.level])}>{text.level}</span>
        <button
          onClick={() => setFurigana(f => !f)}
          className={cn(
            'ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
            furigana ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground'
          )}
        >
          <Type size={14} /> Furigana
        </button>
      </div>

      {/* Titre */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold mb-1">{text.title}</h2>
            <p className="font-jp text-muted-foreground">{text.titleJp}</p>
          </div>
          <SpeakButton text={fullText} size="md" />
        </div>
        <p className="text-sm text-muted-foreground mt-3">{text.summary}</p>
      </div>

      {/* Texte */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" />
          Touche un mot souligné pour sa traduction et l'ajouter à tes révisions.
        </p>
        {text.sentences.map((sentence, si) => (
          <div key={si} className="flex items-start gap-2 group">
            <p className="font-jp text-lg leading-loose flex-1" style={{ lineHeight: furigana ? 2.4 : 2 }}>
              {sentence.map((token, ti) => (
                <Word key={ti} token={token} furigana={furigana} onPick={setPicked} />
              ))}
            </p>
            <span className="shrink-0 pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
              <SpeakButton text={sentenceText(sentence)} size="sm" />
            </span>
          </div>
        ))}
      </div>

      {/* Compréhension */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
        <h3 className="font-bold text-base">Compréhension</h3>
        {text.questions.map((q, qi) => {
          const sel = answers[qi]
          return (
            <div key={qi} className="space-y-2.5">
              <p className="font-semibold text-sm">{qi + 1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = sel === oi
                  const correctOpt = submitted && oi === q.answer
                  const wrongSel = submitted && selected && oi !== q.answer
                  return (
                    <button
                      key={oi}
                      onClick={() => !submitted && setAnswers(p => ({ ...p, [qi]: oi }))}
                      disabled={submitted}
                      className={cn(
                        'w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all',
                        correctOpt ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-semibold'
                          : wrongSel ? 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300'
                          : selected ? 'bg-primary/10 border-primary text-foreground font-medium'
                          : 'border-border hover:border-primary/40 hover:bg-muted'
                      )}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {!submitted ? (
          <button
            onClick={() => allAnswered && setSubmitted(true)}
            disabled={!allAnswered}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            Valider
          </button>
        ) : (
          <div className="space-y-3">
            <div className={cn('rounded-2xl px-5 py-4 text-center', score === text.questions.length ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-amber-100 dark:bg-amber-900/40')}>
              <p className={cn('text-3xl font-bold', score === text.questions.length ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300')}>
                {score} / {text.questions.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{score === text.questions.length ? 'Parfait !' : 'Relis le texte et réessaie.'}</p>
            </div>
            {onNext && (
              <button onClick={onNext} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Texte suivant <ArrowRight size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Feuille de définition */}
      {picked && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setPicked(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="max-w-md mx-auto bg-card border border-border rounded-3xl shadow-2xl p-5 animate-fade-up">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-jp-serif text-2xl font-bold">{picked.t}</span>
                    {picked.r && picked.r !== picked.t && <span className="font-jp text-sm text-muted-foreground">{picked.r}</span>}
                    <SpeakButton text={picked.t} size="sm" />
                  </div>
                  <p className="text-base text-foreground mt-1">{picked.m}</p>
                </div>
                <button onClick={() => setPicked(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0">
                  <X size={16} />
                </button>
              </div>

              <button
                onClick={() => { if (!isSaved) saveWord(picked.t, { front: picked.t, back: picked.m ?? '', reading: picked.r !== picked.t ? picked.r : undefined }) }}
                disabled={isSaved}
                className={cn(
                  'mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors',
                  isSaved ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 cursor-default' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {isSaved ? <><Check size={16} /> Déjà dans tes révisions</> : <><Plus size={16} /> Ajouter aux révisions</>}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────
export function LecturePage() {
  const { progress } = useProgressContext()
  const [filter, setFilter] = useState<LevelFilter>('Tous')
  const [active, setActive] = useState<GradedText | null>(null)

  const filtered = filter === 'Tous' ? GRADED_TEXTS : GRADED_TEXTS.filter(t => t.level === filter)
  const savedCount = Object.keys(progress.savedWords ?? {}).length

  if (active) {
    const idx = filtered.findIndex(t => t.id === active.id)
    const next = idx !== -1 && idx < filtered.length - 1 ? () => setActive(filtered[idx + 1]) : null
    return <Reader text={active} onBack={() => setActive(null)} onNext={next} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Lecture <span className="font-jp-serif text-primary text-3xl">読む</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Lis des textes courts, touche les mots, garde-les pour les réviser.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{GRADED_TEXTS.length}</div>
            <div className="text-xs text-muted-foreground">textes</div>
          </div>
        </div>
        {savedCount > 0 && (
          <Link to="/mots" className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Sparkles size={12} className="text-primary" />
            {savedCount} mot{savedCount > 1 ? 's' : ''} dans ton carnet — voir « Mes mots »
            <ArrowRight size={11} />
          </Link>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              filter === tab ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
            )}
          >
            {tab}
            {tab !== 'Tous' && <span className="ml-1.5 text-xs opacity-70">({GRADED_TEXTS.filter(t => t.level === tab).length})</span>}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucun texte pour ce niveau.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(text => <TextCard key={text.id} text={text} onClick={() => setActive(text)} />)}
        </div>
      )}
    </div>
  )
}
