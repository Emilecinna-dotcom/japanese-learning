import { RotateCcw, Home, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

interface QuizResultProps {
  score: number
  total: number
  durationSeconds: number
  onRestart: () => void
  title: string
  wrongCount?: number
  onRetryWrong?: () => void
}

export function QuizResult({ score, total, durationSeconds, onRestart, title, wrongCount, onRetryWrong }: QuizResultProps) {
  const pct     = Math.round((score / total) * 100)
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60

  const result =
    pct >= 90 ? { kanji: '優', label: '優秀', fr: 'Maîtrise parfaite !',  color: 'text-amber-500',   bg: 'bg-amber-50  dark:bg-amber-950/70',  border: 'border-amber-200  dark:border-amber-800/40'  } :
    pct >= 70 ? { kanji: '良', label: '良好', fr: 'Très bon résultat !',  color: 'text-blue-500',    bg: 'bg-blue-50   dark:bg-blue-950/70',   border: 'border-blue-200   dark:border-blue-800/40'   } :
    pct >= 50 ? { kanji: '可', label: '可',   fr: 'Continue à pratiquer', color: 'text-orange-500',  bg: 'bg-orange-50 dark:bg-orange-950/70', border: 'border-orange-200 dark:border-orange-800/40' } :
                { kanji: '頑', label: '頑張', fr: 'Ne lâche pas !',        color: 'text-rose-500',    bg: 'bg-rose-50   dark:bg-rose-950/70',   border: 'border-rose-200   dark:border-rose-800/40'   }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col items-center gap-6 text-center">

        {/* Big result kanji */}
        <div className={`w-24 h-24 rounded-2xl ${result.bg} border-2 ${result.border} flex flex-col items-center justify-center shadow-md`}>
          <span className={`font-jp-serif text-5xl font-bold leading-none ${result.color}`}>{result.kanji}</span>
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${result.color} opacity-70`}>{result.label}</span>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-1">{title} — Résultat</h2>
          <p className={`text-base font-medium ${result.color}`}>{result.fr}</p>
        </div>

        {/* Stats */}
        <div className="bg-muted border border-border rounded-2xl p-5 w-full grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{score}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Correctes</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="text-3xl font-bold">{pct}%</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{minutes > 0 ? `${minutes}m${seconds}s` : `${seconds}s`}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Durée</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          {wrongCount !== undefined && wrongCount > 0 && onRetryWrong && (
            <button
              onClick={onRetryWrong}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
            >
              <RefreshCw size={15} />
              Refaire les {wrongCount} erreur{wrongCount > 1 ? 's' : ''}
            </button>
          )}
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <RotateCcw size={15} />
            もう一度
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-muted font-medium text-sm hover:bg-accent transition-colors"
          >
            <Home size={15} />
            Accueil
          </Link>
        </div>

        {pct >= 80 && (
          <p className="text-xs text-muted-foreground bg-muted border border-primary/30 rounded-xl px-4 py-2.5 w-full">
            すごい！ Essaie les flashcards pour bien ancrer ça.
          </p>
        )}
      </div>
    </div>
  )
}
