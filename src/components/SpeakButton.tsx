import { Volume2, Loader2, VolumeX } from 'lucide-react'
import { useSpeech } from '@/hooks/useSpeech'
import { cn } from '@/lib/utils'

interface SpeakButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
}

export function SpeakButton({ text, className, size = 'md' }: SpeakButtonProps) {
  const { speak, speaking, audioError } = useSpeech()
  const iconSize = size === 'md' ? 16 : 13

  return (
    <button
      onClick={e => { e.stopPropagation(); speak(text) }}
      aria-label="Écouter la prononciation"
      title={audioError ? 'Son indisponible — vérifiez le volume' : undefined}
      className={cn(
        'flex items-center justify-center rounded-full transition-colors',
        size === 'md' ? 'w-9 h-9' : 'w-7 h-7',
        audioError
          ? 'bg-red-100 dark:bg-red-900/40 text-red-500'
          : speaking
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary',
        className
      )}
    >
      {speaking
        ? <Loader2 size={iconSize} className="animate-spin" />
        : audioError
          ? <VolumeX size={iconSize} />
          : <Volume2 size={iconSize} />
      }
    </button>
  )
}
