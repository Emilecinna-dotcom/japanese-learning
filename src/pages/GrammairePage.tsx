import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'
import { GRAMMAR_POINTS } from '@/data/grammaire'
import { cn } from '@/lib/utils'
import { useProgressContext } from '@/hooks/useProgress'
import type { GrammarPoint } from '@/types/grammar'

const LEVEL_COLORS: Record<string, { pill: string; dot: string }> = {
  N5: { pill: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  N4: { pill: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',             dot: 'bg-blue-500'   },
  N3: { pill: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',     dot: 'bg-orange-500' },
}

const CATEGORY_LABELS: Record<string, string> = {
  verbes: 'Verbes',
  particules: 'Particules',
  adjectifs: 'Adjectifs',
  phrases: 'Phrases',
  'temps-et-aspect': 'Temps & aspect',
}

const CATEGORY_ICONS: Record<string, string> = {
  particules: '助',
  verbes: '動',
  adjectifs: '形',
  phrases: '文',
  'temps-et-aspect': '時',
}

interface GrammarAccordionProps {
  point: GrammarPoint
  isSeen?: boolean
  onSeen: () => void
}

function GrammarAccordion({ point, isSeen, onSeen }: GrammarAccordionProps) {
  const [open, setOpen] = useState(false)
  const level = LEVEL_COLORS[point.level] ?? LEVEL_COLORS.N5

  const handleToggle = () => {
    if (!open && !isSeen) onSeen()
    setOpen(o => !o)
  }

  return (
    <div className={cn(
      'bg-card border rounded-xl overflow-hidden transition-all duration-200 shadow-sm',
      open ? 'border-primary/40 shadow-md' : isSeen ? 'border-primary/20' : 'border-border'
    )}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted transition-colors"
      >
        {/* Indicateur de niveau */}
        <div className={cn('w-1.5 h-10 rounded-full shrink-0', level.dot)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide', level.pill)}>
              {point.level}
            </span>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
              {CATEGORY_LABELS[point.category] ?? point.category}
            </span>
            {isSeen && <CheckCircle2 size={13} className="text-primary" />}
          </div>
          <h3 className="font-bold text-sm leading-tight">{point.titleFR}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-jp">{point.titleJP}</p>
        </div>

        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0',
          open ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-card animate-fade-up">
          <div className="p-4 space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">{point.shortExplanationFR}</p>

            {/* Structure */}
            <div className="bg-muted border border-border rounded-xl p-3">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Structure</p>
              <p className="text-sm font-mono font-semibold">{point.structure}</p>
            </div>

            {/* Exemples */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Exemples</p>
              <div className="space-y-2">
                {point.examples.map((ex, i) => (
                  <div key={i} className="bg-muted border border-border rounded-xl p-3 flex gap-3">
                    <span className="text-primary font-bold text-xs mt-0.5 shrink-0">{i + 1}</span>
                    <div>
                      <p className="font-jp font-semibold text-base">{ex.japanese}</p>
                      <p className="font-jp text-xs text-muted-foreground mt-0.5">{ex.kana}</p>
                      <p className="text-sm mt-1 text-foreground/80">{ex.frenchTranslation}</p>
                      {ex.note && <p className="text-xs text-primary mt-1 font-medium">→ {ex.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table de conjugaison */}
            {point.conjugationTable && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Conjugaison</p>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left p-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Forme</th>
                        <th className="text-left p-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Japonais</th>
                        <th className="text-left p-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Français</th>
                      </tr>
                    </thead>
                    <tbody>
                      {point.conjugationTable.map((row, i) => (
                        <tr key={i} className={cn('border-t border-border', i % 2 === 0 ? 'bg-card' : 'bg-muted')}>
                          <td className="p-2.5 text-xs text-muted-foreground font-medium">{row.form}</td>
                          <td className="p-2.5 font-jp font-semibold">{row.japanese}</td>
                          <td className="p-2.5 text-xs text-foreground/80">{row.frenchTranslation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Explication complète */}
            <div className="bg-muted border border-border rounded-xl p-3 space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Explication</p>
              {point.fullExplanationFR.split('\n').map((line, i) => (
                <p key={i} className={cn(
                  'text-sm leading-relaxed',
                  line.trim().startsWith('**') ? 'font-bold text-foreground' : 'text-muted-foreground'
                )}>
                  {line.replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function GrammairePage() {
  const { progress, markItemSeen } = useProgressContext()
  const [filter, setFilter] = useState<string>('tous')

  const categories = ['tous', 'particules', 'verbes', 'adjectifs', 'phrases', 'temps-et-aspect']
  const filtered = filter === 'tous' ? GRAMMAR_POINTS : GRAMMAR_POINTS.filter(p => p.category === filter)
  const seenCount = Object.keys(progress.grammar).length
  const countFor = (cat: string) => cat === 'tous' ? GRAMMAR_POINTS.length : GRAMMAR_POINTS.filter(p => p.category === cat).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Grammaire
              <span className="font-jp-serif text-primary text-3xl">文法</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Les bases de la grammaire japonaise expliquées en français</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{seenCount}</div>
            <div className="text-xs text-muted-foreground">/ {GRAMMAR_POINTS.length} vus</div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${(seenCount / GRAMMAR_POINTS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all',
              filter === cat
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
          >
            {cat !== 'tous' && (
              <span className="font-jp-serif text-base leading-none">{CATEGORY_ICONS[cat]}</span>
            )}
            {cat === 'tous' ? 'Tous' : CATEGORY_LABELS[cat] ?? cat}
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums',
              filter === cat ? 'bg-white/20' : 'bg-muted-foreground/15'
            )}>{countFor(cat)}</span>
          </button>
        ))}
      </div>

      {/* Liste des points */}
      <div className="space-y-2">
        {filtered.map(point => (
          <GrammarAccordion
            key={point.id}
            point={point}
            isSeen={!!progress.grammar[point.id]?.seen}
            onSeen={() => markItemSeen('grammar', point.id)}
          />
        ))}
      </div>
    </div>
  )
}
