import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Flame, Lock, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProgressContext } from '@/hooks/useProgress'
import { isLessonUnlocked, PASS_PERCENT } from '@/lib/parcours'
import { HIRAGANA_UNIT, LESSON_IDS } from '@/data/curriculum'

// Géométrie du chemin : les pastilles zigzaguent (centre, droite, centre, gauche) et une courbe les relie.
const WIDTH = 320
const PITCH = 124
const AMP = 76
const R = 36
const TOP = R + 8
const OFFSETS = [0, 1, 0, -1]
const LESSONS = HIRAGANA_UNIT.lessons
const HEIGHT = TOP + (LESSONS.length - 1) * PITCH + R + 52

const point = (i: number) => ({ x: WIDTH / 2 + OFFSETS[i % OFFSETS.length] * AMP, y: TOP + i * PITCH })

function pathTo(last: number) {
  let d = `M ${point(0).x} ${point(0).y}`
  for (let i = 1; i <= last; i++) {
    const a = point(i - 1)
    const b = point(i)
    d += ` C ${a.x} ${a.y + PITCH / 2}, ${b.x} ${b.y - PITCH / 2}, ${b.x} ${b.y}`
  }
  return d
}

export function ParcoursPage() {
  const { progress } = useProgressContext()
  const reduceMotion = useReducedMotion()

  const bests = LESSONS.map(l => progress.parcours[l.id]?.best ?? 0)
  const done = bests.map(b => b >= PASS_PERCENT)
  const doneCount = done.filter(Boolean).length
  const current = done.indexOf(false) // première leçon pas encore validée, -1 si tout est fait
  const lastDone = current === -1 ? LESSONS.length - 1 : current - 1

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Unité 1</p>
            <h1 className="text-2xl font-bold mt-0.5">
              {HIRAGANA_UNIT.title} <span className="font-jp-serif text-muted-foreground font-normal">ひらがな</span>
            </h1>
          </div>
          {progress.streak > 0 && (
            <span className="inline-flex items-center gap-1 text-sm font-medium shrink-0">
              <Flame size={15} className="text-amber-500" />
              {progress.streak} j
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-foreground/15 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={LESSONS.length} aria-valuenow={doneCount}>
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(doneCount / LESSONS.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">{doneCount} / {LESSONS.length}</span>
        </div>
      </div>

      <div className="relative mx-auto" style={{ width: WIDTH, height: HEIGHT }}>
        <svg className="absolute inset-0" width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" aria-hidden="true">
          <path d={pathTo(LESSONS.length - 1)} className="stroke-border" strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" />
          {lastDone >= 1 && <path d={pathTo(lastDone)} className="stroke-primary" strokeWidth={5} strokeLinecap="round" />}
        </svg>

        {LESSONS.map((lesson, i) => {
          const { x, y } = point(i)
          const unlocked = isLessonUnlocked(i, LESSON_IDS, progress.parcours)
          const isCurrent = i === current
          const isFinal = lesson.kind === 'final'
          const label = `${isFinal ? 'Test final' : `Leçon ${i + 1}`}, ${lesson.title}, ${done[i] ? `validée à ${bests[i]} %` : unlocked ? 'disponible' : 'verrouillée'}`

          const face = (
            <>
              {isCurrent && !reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full border-4 border-primary"
                  animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              )}
              {!unlocked ? <Lock size={22} /> : isFinal ? <Trophy size={28} /> : <span className="font-jp-serif text-3xl leading-none">{lesson.characters[0].kana}</span>}
              {done[i] && (
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-background">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </>
          )

          const faceClass = cn(
            'absolute flex items-center justify-center rounded-full transition-transform',
            done[i] && 'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
            isCurrent && 'bg-card border-4 border-primary text-primary shadow-lg shadow-primary/20',
            unlocked && !done[i] && !isCurrent && 'bg-card border-2 border-primary/40 text-primary',
            !unlocked && 'bg-muted text-muted-foreground',
            unlocked && 'hover:scale-105 active:scale-95',
          )
          const faceStyle = { left: x - R, top: y - R, width: R * 2, height: R * 2 }

          return (
            <motion.div
              key={lesson.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: 0.3 }}
            >
              {unlocked ? (
                <Link to={`/parcours/${lesson.id}`} aria-label={label} className={faceClass} style={faceStyle}>{face}</Link>
              ) : (
                <div role="img" aria-label={label} className={faceClass} style={faceStyle}>{face}</div>
              )}
              <div className="absolute text-center pointer-events-none" style={{ left: x - 70, top: y + R + 6, width: 140 }}>
                <p className={cn('text-xs font-medium leading-tight', !unlocked && 'text-muted-foreground')}>{lesson.title}</p>
                {isCurrent && <p className="text-[11px] font-semibold text-primary mt-0.5">Commencer</p>}
                {done[i] && <p className="text-[11px] text-muted-foreground tabular-nums mt-0.5">{bests[i]} %</p>}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
