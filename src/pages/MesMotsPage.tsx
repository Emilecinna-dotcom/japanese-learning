import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookMarked, Plus, Trash2, Zap, BookOpen, ArrowRight } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import { isDue } from '@/lib/srs'
import { useProgressContext } from '@/hooks/useProgress'

export function MesMotsPage() {
  const { progress, saveWord, removeWord } = useProgressContext()
  const navigate = useNavigate()
  const [front, setFront] = useState('')
  const [reading, setReading] = useState('')
  const [back, setBack] = useState('')

  const words = useMemo(() => {
    return Object.entries(progress.savedWords ?? {})
      .map(([key, w]) => ({ key, ...w }))
      .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
  }, [progress.savedWords])

  const dueCount = words.filter(w => {
    const srs = progress.flashcards[`saved-${w.key}`]
    return srs ? isDue(srs) : true
  }).length

  const add = () => {
    const f = front.trim()
    const b = back.trim()
    if (!f || !b) return
    saveWord(f, { front: f, back: b, reading: reading.trim() || undefined })
    setFront(''); setReading(''); setBack('')
  }

  const masteredCount = words.filter(w => (progress.flashcards[`saved-${w.key}`]?.repetitions ?? 0) >= 3).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Mes mots <span className="font-jp-serif text-primary text-2xl">単語帳</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Ton carnet de vocabulaire personnel. Tout ce que tu gardes ici se révise avec le SRS.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{words.length}</div>
            <div className="text-xs text-muted-foreground">mots</div>
          </div>
        </div>
        {words.length > 0 && (
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-muted-foreground">{dueCount} à réviser · {masteredCount} maîtrisé{masteredCount > 1 ? 's' : ''}</span>
            {dueCount > 0 && (
              <button
                onClick={() => navigate('/flashcards', { state: { deck: 'saved' } })}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Zap size={15} /> Réviser mes mots
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ajout manuel */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <p className="text-sm font-medium flex items-center gap-2"><Plus size={15} className="text-primary" /> Ajouter un mot</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={front} onChange={e => setFront(e.target.value)} placeholder="日本語"
            className="font-jp px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors" />
          <input value={reading} onChange={e => setReading(e.target.value)} placeholder="lecture (kana, option.)"
            className="font-jp px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors" />
          <input value={back} onChange={e => setBack(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') add() }} placeholder="traduction française"
            className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
        <button onClick={add} disabled={!front.trim() || !back.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40">
          Ajouter
        </button>
      </div>

      {/* Liste */}
      {words.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground space-y-3">
          <BookMarked size={32} className="mx-auto opacity-40" />
          <p className="text-sm max-w-xs mx-auto">Ton carnet est vide. Lis un texte et touche un mot pour le garder, ou ajoute-le à la main ci-dessus.</p>
          <button onClick={() => navigate('/lecture')} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <BookOpen size={15} /> Aller à la lecture <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {words.map(w => {
            const srs = progress.flashcards[`saved-${w.key}`]
            const due = srs ? isDue(srs) : true
            const mastered = (srs?.repetitions ?? 0) >= 3
            return (
              <div key={w.key} className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                <SpeakButton text={w.front} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-jp-serif text-lg font-bold text-foreground">{w.front}</span>
                    {w.reading && <span className="font-jp text-xs text-muted-foreground">{w.reading}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{w.back}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  mastered ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : due ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {mastered ? 'Maîtrisé' : due ? 'À réviser' : 'En cours'}
                </span>
                <button onClick={() => removeWord(w.key)} aria-label="Retirer" className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
