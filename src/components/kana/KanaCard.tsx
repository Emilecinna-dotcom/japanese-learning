import { cn } from '@/lib/utils'
import type { KanaCharacter } from '@/types/kana'

interface KanaCardProps {
  kana: KanaCharacter
  isLearned?: boolean
  isMastered?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function KanaCard({ kana, isLearned, isMastered, onClick, size = 'md' }: KanaCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'kana-card-hover-3d group relative flex flex-col items-center justify-center rounded-lg border cursor-pointer text-center',
        size === 'sm' && 'p-2 gap-0.5',
        size === 'md' && 'p-3 gap-1',
        size === 'lg' && 'p-4 gap-2',
        isMastered
          ? 'border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/70 shadow-sm shadow-emerald-200/50 dark:shadow-emerald-900/20'
          : isLearned
          ? 'border-primary/25 bg-primary/5 hover:border-primary/45'
          : 'border-border bg-card hover:border-primary/30 hover:bg-primary/3'
      )}
    >
      {/* Shine overlay */}
      <div className="tilt-shine rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* State indicator */}
      {isMastered && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-300" />
      )}
      {isLearned && !isMastered && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary/50" />
      )}

      {/* Kana character — serif when mastered for elegance */}
      <span
        className={cn(
          'leading-none transition-all',
          isMastered ? 'font-jp-serif' : 'font-jp',
          size === 'sm' && 'text-2xl',
          size === 'md' && 'text-4xl',
          size === 'lg' && 'text-5xl',
          isMastered
            ? 'text-emerald-700 dark:text-emerald-400'
            : isLearned
            ? 'text-primary'
            : 'text-foreground group-hover:text-primary transition-colors'
        )}
      >
        {kana.kana}
      </span>

      {/* Romaji */}
      <span className={cn(
        'font-mono uppercase tracking-wider transition-colors',
        size === 'sm' && 'text-[9px]',
        size === 'md' && 'text-[10px]',
        size === 'lg' && 'text-xs',
        isMastered
          ? 'text-emerald-600/70 dark:text-emerald-500/70'
          : 'text-muted-foreground'
      )}>
        {kana.romaji}
      </span>
    </button>
  )
}
