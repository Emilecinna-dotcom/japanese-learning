import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const GAMES = [
  {
    path: '/jeux/memoire',
    title: 'Mémoire',
    titleJP: '記憶',
    emoji: '🃏',
    description: 'Retourne des paires de cartes pour associer kana, kanji et traductions.',
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-800/30',
    difficulty: 2,
    scoreKey: 'best_memoire',
    scoreLabel: 'essais',
  },
  {
    path: '/jeux/blitz',
    title: 'Blitz',
    titleJP: '速攻',
    emoji: '⚡',
    description: '60 secondes. Enchaîne les bonnes réponses pour multiplier ton score.',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800/30',
    difficulty: 2,
    scoreKey: 'best_blitz',
    scoreLabel: 'pts',
  },
  {
    path: '/jeux/pluie',
    title: 'Pluie de kana',
    titleJP: '文字の雨',
    emoji: '🌧️',
    description: 'Des kana tombent du ciel. Tape leur romaji avant qu\'ils touchent le sol.',
    gradient: 'from-sky-500 to-blue-500',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    border: 'border-sky-200 dark:border-sky-800/30',
    difficulty: 3,
    scoreKey: 'best_pluie',
    scoreLabel: 'pts',
  },
  {
    path: '/jeux/ordre',
    title: 'Ordre des mots',
    titleJP: '並べ替え',
    emoji: '🧩',
    description: 'Remets les mots d\'une phrase japonaise dans le bon ordre.',
    gradient: 'from-teal-500 to-emerald-500',
    bg: 'bg-teal-50 dark:bg-teal-950/20',
    border: 'border-teal-200 dark:border-teal-800/30',
    difficulty: 2,
    scoreKey: 'best_ordre',
    scoreLabel: 'pts',
  },
]

export function JeuxHubPage() {
  const scores = GAMES.reduce<Record<string, number | null>>((acc, g) => {
    const raw = localStorage.getItem(g.scoreKey)
    acc[g.scoreKey] = raw ? parseInt(raw) : null
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold font-jp text-primary">遊び</h1>
        <p className="text-muted-foreground text-sm">Apprends en jouant</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAMES.map(game => (
          <Link
            key={game.path}
            to={game.path}
            className={cn(
              'group relative flex flex-col p-5 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5',
              game.bg, game.border
            )}
          >
            {/* Gradient accent */}
            <div className={cn('absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r', game.gradient)} />

            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">{game.emoji}</span>
              {scores[game.scoreKey] !== null && (
                <span className="text-xs font-bold text-muted-foreground bg-background/80 px-2 py-1 rounded-full border border-border">
                  Meilleur : {scores[game.scoreKey]} {game.scoreLabel}
                </span>
              )}
            </div>

            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{game.title}</h2>
              <span className="font-jp text-sm text-muted-foreground">{game.titleJP}</span>
            </div>

            <p className="text-sm text-muted-foreground flex-1">{game.description}</p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-0.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className={cn(
                    'w-3 h-3 rounded-full',
                    i <= game.difficulty
                      ? `bg-gradient-to-br ${game.gradient}`
                      : 'bg-muted'
                  )} />
                ))}
              </div>
              <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                Jouer →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
