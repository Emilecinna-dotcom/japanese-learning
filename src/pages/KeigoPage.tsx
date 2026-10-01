import { useState } from 'react'
import { SpeakButton } from '@/components/SpeakButton'
import { KEIGO_VERBS, KEIGO_TYPES, KEIGO_RULES } from '@/data/keigo'
import { SystemeEcritureInfo, KEIGO_INFO } from '@/components/SystemeEcritureInfo'
import type { KeigoType } from '@/data/keigo'
import { cn } from '@/lib/utils'

export function KeigoPage() {
  const [filter, setFilter] = useState<KeigoType | 'tous'>('tous')
  const [expanded, setExpanded] = useState<string | null>(null)

  const displayed = filter === 'tous' ? KEIGO_VERBS : KEIGO_VERBS.filter(v => v.type === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Keigo <span className="font-jp text-2xl">敬語</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Langage poli et formel japonais — indispensable en milieu professionnel et social
            </p>
          </div>
        </div>

        {/* Les 3 types */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {(Object.entries(KEIGO_TYPES) as [KeigoType, typeof KEIGO_TYPES[KeigoType]][]).map(([type, info]) => (
            <div key={type} className={cn('rounded-xl p-3', info.color)}>
              <p className="text-xs font-bold">{info.label}</p>
              <p className="font-jp text-sm font-semibold mt-0.5">{info.labelJP}</p>
              <p className="text-xs mt-1 opacity-75">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      <SystemeEcritureInfo {...KEIGO_INFO} />

      {/* Règles de construction */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-sm">Règles de construction</h2>
        <div className="space-y-2">
          {KEIGO_RULES.map(rule => (
            <div key={rule.id} className="bg-muted rounded-xl p-3">
              <p className="font-semibold text-sm">{rule.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{rule.descriptionFR}</p>
              <p className="font-mono text-xs bg-background border border-border rounded px-2 py-1 mt-2 text-primary">{rule.pattern}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {rule.examples.map(ex => (
                  <span key={ex} className="font-jp text-xs bg-background border border-border rounded px-1.5 py-0.5">{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('tous')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
            filter === 'tous' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          Tous les verbes
        </button>
        {(Object.entries(KEIGO_TYPES) as [KeigoType, typeof KEIGO_TYPES[KeigoType]][]).map(([type, info]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              filter === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {info.labelJP}
          </button>
        ))}
      </div>

      {/* Verbes */}
      <div className="space-y-2">
        {displayed.map(entry => {
          const typeInfo = KEIGO_TYPES[entry.type]
          const isOpen = expanded === entry.id
          const formalForm = entry.honorific ?? entry.humble ?? entry.polite

          return (
            <div
              key={entry.id}
              className={cn(
                'bg-card border rounded-xl overflow-hidden transition-all',
                isOpen ? 'border-primary/40 shadow-md' : 'border-border'
              )}
            >
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/40 transition-colors"
                onClick={() => setExpanded(isOpen ? null : entry.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', typeInfo.color)}>
                      {typeInfo.labelJP}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Ordinaire</p>
                      <p className="font-jp font-semibold text-base">{entry.plain}</p>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div>
                      <p className="text-xs text-primary font-semibold">Keigo</p>
                      <p className="font-jp font-bold text-base text-primary">{formalForm}</p>
                    </div>
                    <div className="flex-1 hidden sm:block">
                      <p className="text-sm text-muted-foreground">{entry.meaningFR}</p>
                    </div>
                  </div>
                </div>
                <span className="text-muted-foreground text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-border bg-muted/30 p-4 space-y-4 animate-fade-up">
                  <p className="text-sm text-muted-foreground">{entry.usageNote}</p>

                  {/* Formes */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-card border border-border rounded-xl p-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Ordinaire</p>
                      <p className="font-jp text-lg font-semibold">{entry.plain}</p>
                      <p className="font-jp text-xs text-muted-foreground">{entry.plainReading}</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Poli (ます)</p>
                      <p className="font-jp text-lg font-semibold">{entry.polite}</p>
                      <p className="font-jp text-xs text-muted-foreground">{entry.politeReading}</p>
                    </div>
                    {entry.honorific && (
                      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Honorifique</p>
                        <p className="font-jp text-lg font-semibold">{entry.honorific}</p>
                        <p className="font-jp text-xs text-muted-foreground">{entry.honorificReading}</p>
                      </div>
                    )}
                    {entry.humble && (
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Humble</p>
                        <p className="font-jp text-lg font-semibold">{entry.humble}</p>
                        <p className="font-jp text-xs text-muted-foreground">{entry.humbleReading}</p>
                      </div>
                    )}
                  </div>

                  {/* Exemple */}
                  <div className="bg-card border border-border rounded-xl p-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Exemple</p>
                    <p className="text-xs text-muted-foreground mb-1">{entry.example.frenchTranslation}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-0.5">Ordinaire</p>
                        <div className="flex items-start gap-1">
                          <p className="font-jp text-sm">{entry.example.plain}</p>
                          <SpeakButton text={entry.example.plain} size="sm" className="shrink-0" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-primary font-semibold mb-0.5">Keigo</p>
                        <div className="flex items-start gap-1">
                          <p className="font-jp text-sm font-semibold">{entry.example.polite}</p>
                          <SpeakButton text={entry.example.polite} size="sm" className="shrink-0" />
                        </div>
                      </div>
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
