import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Blocks } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Sentence { words: string[]; french: string; note?: string }

const SENTENCES: Sentence[] = [
  { words: ['わたし', 'は', 'がくせい', 'です', '。'], french: 'Je suis étudiant(e).' },
  { words: ['きょう', 'は', 'いい', 'てんき', 'です', 'ね', '。'], french: 'Il fait beau aujourd\'hui, n\'est-ce pas ?' },
  { words: ['にほんご', 'を', 'べんきょう', 'して', 'います', '。'], french: 'J\'étudie le japonais.' },
  { words: ['えき', 'は', 'どこ', 'です', 'か', '。'], french: 'Où est la gare ?' },
  { words: ['まいあさ', 'コーヒー', 'を', 'のみます', '。'], french: 'Je bois du café chaque matin.' },
  { words: ['この', 'ほん', 'は', 'おもしろい', 'です', '。'], french: 'Ce livre est intéressant.' },
  { words: ['にほん', 'に', 'いきたい', 'です', '。'], french: 'Je veux aller au Japon.' },
  { words: ['ともだち', 'と', 'えいが', 'を', 'みました', '。'], french: 'J\'ai regardé un film avec un ami.' },
  { words: ['なに', 'を', 'たべたい', 'です', 'か', '。'], french: 'Qu\'est-ce que tu veux manger ?' },
  { words: ['としょかん', 'で', 'べんきょう', 'します', '。'], french: 'J\'étudie à la bibliothèque.' },
  { words: ['たなかさん', 'は', 'いしゃ', 'です', '。'], french: 'Tanaka-san est médecin.' },
  { words: ['わたし', 'は', 'にほんご', 'が', 'すき', 'です', '。'], french: 'J\'aime le japonais.' },
  { words: ['あした', 'は', 'がっこう', 'に', 'いきます', '。'], french: 'Demain, je vais à l\'école.' },
  { words: ['これ', 'は', 'いくら', 'です', 'か', '。'], french: 'C\'est combien ?' },
  { words: ['にほんご', 'は', 'むずかしい', 'です', 'が', 'たのしい', 'です', '。'], french: 'Le japonais est difficile mais amusant.' },
  { words: ['おなか', 'が', 'すいて', 'います', '。'], french: 'J\'ai faim.' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Tile { id: string; word: string }
const makeTiles = (words: string[]): Tile[] => shuffle(words.map((w, i) => ({ id: `${i}-${w}`, word: w })))

type Check = 'idle' | 'correct' | 'wrong'

export function OrdrePage() {
  const navigate = useNavigate()
  const [sentences] = useState(() => shuffle([...SENTENCES]))
  const [index, setIndex] = useState(0)
  const [available, setAvailable] = useState<Tile[]>(() => makeTiles(sentences[0].words))
  const [answer, setAnswer] = useState<Tile[]>([])
  const [check, setCheck] = useState<Check>('idle')
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = sentences[index]

  const reset = useCallback(() => {
    setAvailable(makeTiles(current.words))
    setAnswer([])
    setCheck('idle')
  }, [current])

  const addToAnswer = (tile: Tile) => {
    if (check !== 'idle') return
    setAvailable(a => a.filter(t => t.id !== tile.id))
    setAnswer(a => [...a, tile])
  }
  const removeFromAnswer = (tile: Tile) => {
    if (check !== 'idle') return
    setAnswer(a => a.filter(t => t.id !== tile.id))
    setAvailable(a => [...a, tile])
  }

  const checkAnswer = () => {
    const user = answer.map(t => t.word)
    const correct = current.words.length === user.length && current.words.every((w, i) => w === user[i])
    setCheck(correct ? 'correct' : 'wrong')
    if (correct) setScore(s => s + 1)
  }

  const nextSentence = () => {
    const next = index + 1
    if (next >= sentences.length) {
      const best = parseInt(localStorage.getItem('best_ordre') ?? '0')
      if (score > best) localStorage.setItem('best_ordre', String(score))
      setFinished(true)
    } else {
      setIndex(next)
      setAvailable(makeTiles(sentences[next].words))
      setAnswer([])
      setCheck('idle')
    }
  }

  if (finished) {
    const best = parseInt(localStorage.getItem('best_ordre') ?? '0')
    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-teal-500/10 border-2 border-teal-500/20 flex items-center justify-center mx-auto">
          <Blocks size={34} className="text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <p className="text-5xl font-bold text-primary tabular-nums">{score}<span className="text-2xl text-muted-foreground">/{sentences.length}</span></p>
          <p className="text-muted-foreground mt-1">phrases correctes</p>
        </div>
        {best > 0 && <p className="text-sm text-muted-foreground">Meilleur : <span className="font-bold text-foreground">{best}/{sentences.length}</span></p>}
        <div className="flex gap-3">
          <button onClick={() => navigate('/jeux')} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Jeux</button>
          <button onClick={() => { setIndex(0); setScore(0); setAvailable(makeTiles(sentences[0].words)); setAnswer([]); setCheck('idle'); setFinished(false) }} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5"><RotateCcw size={15} /> Rejouer</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-2 space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/jeux')} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /></button>
        <div className="text-sm text-muted-foreground tabular-nums">
          <span className="font-bold text-foreground">{index + 1}</span>/{sentences.length}
          <span className="ml-3 font-medium text-emerald-600">{score} ✓</span>
        </div>
      </div>

      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(index / sentences.length) * 100}%` }} />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Traduis en japonais</p>
        <p className="text-lg font-medium text-foreground">{current.french}</p>
        {current.note && <p className="text-xs text-muted-foreground mt-1 italic">{current.note}</p>}
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Ta réponse</p>
        <div className={cn('min-h-16 p-3 rounded-xl border-2 flex flex-wrap gap-2 items-start transition-colors',
          check === 'correct' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
            : check === 'wrong' ? 'border-red-400 bg-red-50 dark:bg-red-950/40'
            : 'border-dashed border-border bg-muted/30')}>
          {answer.length === 0 && <span className="text-sm text-muted-foreground/50 py-1">Touche les mots ci-dessous…</span>}
          {answer.map(tile => (
            <button key={tile.id} onClick={() => removeFromAnswer(tile)} disabled={check !== 'idle'}
              className={cn('font-jp px-3 py-1.5 rounded-lg text-base border transition-all',
                check !== 'idle' ? 'cursor-default border-transparent bg-transparent' : 'bg-card border-border hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30')}>
              {tile.word}
            </button>
          ))}
        </div>
        {check === 'wrong' && (
          <div className="mt-2 flex items-start gap-2">
            <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Réponse correcte :</p>
              <p className="font-jp text-base font-medium text-foreground">{current.words.join('')}</p>
            </div>
          </div>
        )}
        {check === 'correct' && (
          <div className="mt-2 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Correct !</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Mots disponibles</p>
        <div className="flex flex-wrap gap-2 min-h-12">
          {available.map(tile => (
            <button key={tile.id} onClick={() => addToAnswer(tile)} disabled={check !== 'idle'}
              className="font-jp px-3 py-1.5 rounded-lg text-base bg-card border border-border hover:bg-muted hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-default">
              {tile.word}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {check === 'idle' ? (
          <>
            <button onClick={reset} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Réinitialiser</button>
            <button onClick={checkAnswer} disabled={answer.length === 0} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-default">Vérifier</button>
          </>
        ) : (
          <button onClick={nextSentence} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            {index + 1 < sentences.length ? 'Phrase suivante →' : 'Voir les résultats →'}
          </button>
        )}
      </div>
    </div>
  )
}
