import { X } from 'lucide-react'
import type { KanaCharacter } from '@/types/kana'
import { SpeakButton } from '@/components/SpeakButton'

interface KanaDetailPanelProps {
  kana: KanaCharacter
  onClose: () => void
  onMarkLearned?: () => void
  isLearned?: boolean
}

export function KanaDetailPanel({ kana, onClose, onMarkLearned, isLearned }: KanaDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6 relative animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {/* Big character */}
        <div className="text-center mb-6">
          <div className="font-jp text-9xl leading-none mb-3 text-foreground">{kana.kana}</div>
          <div className="flex items-center justify-center gap-3">
            <div className="text-2xl font-mono tracking-widest text-primary font-semibold">{kana.romaji}</div>
            <SpeakButton text={kana.kana} />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Prononciation</p>
            <p className="text-sm font-medium">{kana.frenchPhonetic}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Traits</p>
              <p className="text-sm font-semibold">{kana.strokeCount}</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ligne</p>
              <p className="text-sm font-semibold capitalize">{kana.row.replace('-row', '').replace('-standalone', ' seul')}</p>
            </div>
          </div>

          {kana.mnemonicFR && (
            <div className="bg-card border border-primary/30 rounded-xl p-3">
              <p className="text-xs text-primary/70 uppercase tracking-wide mb-1">Mémo</p>
              <p className="text-sm">{kana.mnemonicFR}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => { onMarkLearned?.(); onClose() }}
          className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-colors ${
            isLearned
              ? 'bg-muted text-muted-foreground cursor-default'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          disabled={isLearned}
        >
          {isLearned ? 'Déjà appris ✓' : 'Marquer comme appris'}
        </button>
      </div>
    </div>
  )
}
