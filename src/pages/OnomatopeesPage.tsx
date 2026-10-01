import { useState } from 'react'
import { SpeakButton } from '@/components/SpeakButton'
import { ONOMATOPEES, ONO_CATEGORIES } from '@/data/onomatopees'
import { SystemeEcritureInfo, ONOMATOPEES_INFO } from '@/components/SystemeEcritureInfo'
import type { OnoCategory } from '@/data/onomatopees'
import { cn } from '@/lib/utils'

export function OnomatopeesPage() {
  const [filter, setFilter] = useState<OnoCategory | 'tous'>('tous')
  const [expanded, setExpanded] = useState<string | null>(null)

  const categories = Object.keys(ONO_CATEGORIES) as OnoCategory[]
  const filtered = filter === 'tous' ? ONOMATOPEES : ONOMATOPEES.filter(o => o.category === filter)

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Onomatopées <span className="font-jp text-2xl">擬音語・擬態語</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sons et états exprimés par des mots imitatifs — essentiels pour parler naturellement
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="text-center">
              <p className="font-bold text-primary text-xl">{ONOMATOPEES.length}</p>
              <p className="text-xs text-muted-foreground">expressions</p>
            </div>
          </div>
        </div>

        {/* Type legend */}
        <div className="flex gap-3 mt-4 flex-wrap">

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            <span><strong>擬音語</strong> (giongo) — imite un son réel</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
            <span><strong>擬態語</strong> (gitaigo) — décrit un état ou une sensation</span>
          </div>
        </div>
      </div>

      <SystemeEcritureInfo {...ONOMATOPEES_INFO} />

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('tous')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
            filter === 'tous' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          Tous ({ONOMATOPEES.length})
        </button>
        {categories.map(cat => {
          const info = ONO_CATEGORIES[cat]
          const count = ONOMATOPEES.filter(o => o.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                filter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {info.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {filtered.map(ono => {
          const catInfo = ONO_CATEGORIES[ono.category]
          const isOpen = expanded === ono.id
          return (
            <div
              key={ono.id}
              className={cn(
                'bg-card border rounded-xl overflow-hidden transition-all',
                isOpen ? 'border-primary/40 shadow-md' : 'border-border'
              )}
            >
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/40 transition-colors"
                onClick={() => setExpanded(isOpen ? null : ono.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-jp font-bold text-xl tracking-wider text-primary">{ono.expression}</span>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', catInfo.color)}>
                      {catInfo.labelJP}
                    </span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-mono font-bold',
                      ono.type === 'giongo'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
                    )}>
                      {ono.type}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">{ono.meaning}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <SpeakButton text={ono.expression} size="sm" />
                </div>
                <span className="text-muted-foreground text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-border bg-muted/30 p-4 space-y-3 animate-fade-up">
                  <p className="text-xs text-muted-foreground italic">{ono.usageNote}</p>

                  <div className="bg-card border border-border rounded-xl p-3 space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Exemple</p>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="font-jp font-semibold text-base">{ono.example}</p>
                        <p className="font-jp text-xs text-muted-foreground mt-0.5">{ono.exampleReading}</p>
                        <p className="text-sm text-foreground/80 mt-1">{ono.exampleFR}</p>
                      </div>
                      <SpeakButton text={ono.example} size="sm" className="shrink-0 mt-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
