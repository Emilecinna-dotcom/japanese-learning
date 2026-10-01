'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { RefreshCw, Eye } from 'lucide-react'

const CDN = 'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji'
const VBOX = 109   // système de coordonnées KanjiVG

interface StrokeMeta {
  d: string
  length: number
  pts: Array<{ x: number; y: number }>
  sx: number; sy: number
  ex: number; ey: number; ea: number
}

function parseStroke(d: string): StrokeMeta | null {
  try {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
    document.body.appendChild(svg)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    svg.appendChild(path)
    const L = path.getTotalLength()
    const N = 30
    const pts = Array.from({ length: N }, (_, i) => path.getPointAtLength(i * L / (N - 1))).map(p => ({ x: p.x, y: p.y }))
    const end = path.getPointAtLength(L)
    const near = path.getPointAtLength(Math.max(0, L - 5))
    const start = path.getPointAtLength(0)
    const ea = Math.atan2(end.y - near.y, end.x - near.x) * 180 / Math.PI
    document.body.removeChild(svg)
    return { d, length: L, pts, sx: start.x, sy: start.y, ex: end.x, ey: end.y, ea }
  } catch { return null }
}

function Arrow({ x, y, angle, size = 7, color = '#4f7fe8' }: { x: number; y: number; angle: number; size?: number; color?: string }) {
  return <polygon points={`${-size * 0.6},${-size * 0.45} ${size * 0.8},0 ${-size * 0.6},${size * 0.45}`} fill={color} transform={`translate(${x},${y}) rotate(${angle})`} />
}

const strokeCache: Record<string, StrokeMeta[]> = {}

interface Props {
  character: string
  mode?: 'guide' | 'memo'
  onComplete?: (mistakes: number) => void
}

export function StrokeCalligraphy({ character, mode = 'guide', onComplete }: Props) {
  const [strokes, setStrokes] = useState<StrokeMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [current, setCurrent] = useState(0)
  const [animPct, setAnimPct] = useState(0)
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [revealed, setRevealed] = useState(false)   // indice du trait courant visible (mode mémoire)
  const [mistakes, setMistakes] = useState(0)

  const strokeMissRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDown = useRef(false)
  const userPts = useRef<Array<{ x: number; y: number }>>([])
  const rafRef = useRef<number>(0)
  const animT0 = useRef<number>(0)
  const ANIM_DUR = 900

  const showGuide = mode === 'guide' || revealed

  // ─── Chargement KanjiVG ──────────────────────────────────────────
  useEffect(() => {
    setLoading(true); setFailed(false); setCurrent(0); setDone(false)
    setFeedback(null); setAnimPct(0); setRevealed(false); setMistakes(0); strokeMissRef.current = 0
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, 480, 480)

    const code = character.codePointAt(0)!.toString(16).padStart(5, '0')
    if (strokeCache[code]) { setStrokes(strokeCache[code]); setLoading(false); if (!strokeCache[code].length) setFailed(true); return }

    fetch(`${CDN}/${code}.svg`)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
        const metas = Array.from(doc.querySelectorAll(`[id^="kvg:${code}-s"]`)).map(el => parseStroke(el.getAttribute('d') ?? '')).filter(Boolean) as StrokeMeta[]
        strokeCache[code] = metas
        setStrokes(metas); setLoading(false); if (!metas.length) setFailed(true)
      })
      .catch(() => { setLoading(false); setFailed(true) })
  }, [character])

  // ─── Animation du trait courant (boucle) ─────────────────────────
  useEffect(() => {
    if (strokes.length === 0 || done || !showGuide) { setAnimPct(1); return }
    let alive = true
    animT0.current = 0
    const tick = (ts: number) => {
      if (!alive) return
      if (!animT0.current) animT0.current = ts
      const elapsed = (ts - animT0.current) % (ANIM_DUR + 300)
      setAnimPct(Math.min(elapsed / ANIM_DUR, 1))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { alive = false; if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [current, strokes, done, showGuide])

  const toCanvas = (e: MouseEvent | Touch) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    const cx = 'clientX' in e ? e.clientX : (e as Touch).clientX
    const cy = 'clientY' in e ? e.clientY : (e as Touch).clientY
    return { x: (cx - r.left) * c.width / r.width, y: (cy - r.top) * c.height / r.height }
  }

  const onDown = useCallback((e: MouseEvent | Touch) => {
    if (done || feedback) return
    isDown.current = true
    setReason(null)
    const pos = toCanvas(e)
    userPts.current = [pos]
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.clearRect(0, 0, 480, 480)
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
  }, [done, feedback])

  const onMove = useCallback((e: MouseEvent | Touch) => {
    if (!isDown.current) return
    const pos = toCanvas(e)
    userPts.current.push(pos)
    const ctx = canvasRef.current!.getContext('2d')!
    const prev = userPts.current[userPts.current.length - 2]
    ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1e3a6e'; ctx.lineWidth = 480 * 0.038; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke()
  }, [])

  const onUp = useCallback(() => {
    if (!isDown.current) return
    isDown.current = false
    if (strokes.length === 0 || !canvasRef.current) return

    const stroke = strokes[current]
    const cSize = canvasRef.current.width
    const pts = userPts.current.map(p => ({ x: p.x * VBOX / cSize, y: p.y * VBOX / cSize }))
    if (pts.length < 5) { canvasRef.current.getContext('2d')!.clearRect(0, 0, 480, 480); return }

    const a = pts[0]
    const b = pts[pts.length - 1]

    // Longueur réellement tracée par l'utilisateur
    let userLen = 0
    for (let i = 1; i < pts.length; i++) userLen += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)

    const startDist = Math.hypot(a.x - stroke.sx, a.y - stroke.sy)   // départ au bon endroit ?
    const endDist   = Math.hypot(b.x - stroke.ex, b.y - stroke.ey)   // arrivée au bon endroit ?
    const revStart  = Math.hypot(a.x - stroke.ex, a.y - stroke.ey)   // sens inversé ?

    // Couverture : chaque point du trait de référence a-t-il été passé ?
    let cov = 0
    for (const rp of stroke.pts) {
      let m = Infinity
      for (const up of pts) { const d = Math.hypot(up.x - rp.x, up.y - rp.y); if (d < m) m = d }
      cov += m
    }
    cov /= stroke.pts.length

    // Précision : l'utilisateur est-il resté sur le trait ?
    let prec = 0
    for (const up of pts) {
      let m = Infinity
      for (const rp of stroke.pts) { const d = Math.hypot(up.x - rp.x, up.y - rp.y); if (d < m) m = d }
      prec += m
    }
    prec /= pts.length

    const lenRatio = stroke.length > 0 ? userLen / stroke.length : 0

    const reversed   = revStart < startDist && revStart < 22
    const rightStart = startDist < 24
    const reachedEnd = endDist < 24 && lenRatio > 0.6
    const onPath     = cov < 15 && prec < 17
    const isGood = rightStart && reachedEnd && onPath && !reversed

    let why: string | null = null
    if (!isGood) {
      if (reversed) why = 'Mauvais sens — pars du point bleu'
      else if (!rightStart) why = 'Commence au point bleu'
      else if (!reachedEnd) why = 'Va jusqu’au bout du trait'
      else why = 'Reste bien sur le trait'
    }

    setFeedback(isGood ? 'good' : 'bad')
    setReason(why)
    if (!isGood) {
      setMistakes(m => m + 1)
      strokeMissRef.current += 1
      if (mode === 'memo' && strokeMissRef.current >= 2) setRevealed(true)   // indice auto après 2 erreurs
    }

    setTimeout(() => {
      canvasRef.current?.getContext('2d')?.clearRect(0, 0, 480, 480)
      if (isGood) {
        const next = current + 1
        if (next >= strokes.length) { setDone(true); onComplete?.(mistakes) }
        else { setCurrent(next); strokeMissRef.current = 0; setRevealed(false) }
        setReason(null)
      }
      setFeedback(null)
    }, isGood ? 450 : 950)
  }, [strokes, current, onComplete, mode, mistakes])

  // ─── Écouteurs ───────────────────────────────────────────────────
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const mD = (e: MouseEvent) => onDown(e)
    const mM = (e: MouseEvent) => onMove(e)
    const mU = () => onUp()
    const tS = (e: TouchEvent) => { e.preventDefault(); onDown(e.touches[0]) }
    const tM = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0]) }
    const tE = () => onUp()
    c.addEventListener('mousedown', mD); c.addEventListener('mousemove', mM)
    c.addEventListener('mouseup', mU); c.addEventListener('mouseleave', mU)
    c.addEventListener('touchstart', tS, { passive: false }); c.addEventListener('touchmove', tM, { passive: false }); c.addEventListener('touchend', tE)
    return () => {
      c.removeEventListener('mousedown', mD); c.removeEventListener('mousemove', mM)
      c.removeEventListener('mouseup', mU); c.removeEventListener('mouseleave', mU)
      c.removeEventListener('touchstart', tS); c.removeEventListener('touchmove', tM); c.removeEventListener('touchend', tE)
    }
  }, [onDown, onMove, onUp])

  const reset = () => {
    setCurrent(0); setDone(false); setFeedback(null); setRevealed(false); setMistakes(0); strokeMissRef.current = 0
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, 480, 480)
  }

  if (loading) return <div className="aspect-square w-full max-w-sm mx-auto rounded-2xl bg-muted animate-pulse" />
  if (failed || strokes.length === 0) return (
    <div className="aspect-square w-full max-w-sm mx-auto rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm text-center px-6">
      Tracé indisponible pour ce caractère (hors ligne ?).
    </div>
  )

  const activeSt = strokes[current]
  const grade = mistakes === 0 ? { label: 'Parfait', color: 'text-emerald-600' }
    : mistakes <= 2 ? { label: 'Très bien', color: 'text-emerald-600' }
    : mistakes <= 5 ? { label: 'Bien', color: 'text-amber-600' }
    : { label: 'À retravailler', color: 'text-red-500' }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Progression */}
      <div className="w-full max-w-sm space-y-1.5">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(current / strokes.length) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{done ? `${strokes.length} traits ✓` : `Trait ${current + 1} / ${strokes.length}`}</span>
          {mistakes > 0 && <span className="text-red-500">{mistakes} erreur{mistakes > 1 ? 's' : ''}</span>}
        </div>
      </div>

      {/* Zone de tracé */}
      <div className="relative w-full max-w-sm aspect-square select-none">
        <svg viewBox="0 0 109 109" className="absolute inset-0 w-full h-full rounded-2xl bg-white dark:bg-neutral-950 border-2 border-border shadow-sm">
          {/* Grille repère 米 */}
          <g stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="3 3" opacity="0.35">
            <line x1="54.5" y1="2" x2="54.5" y2="107" />
            <line x1="2" y1="54.5" x2="107" y2="54.5" />
          </g>
          <g stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.2">
            <line x1="4" y1="4" x2="105" y2="105" />
            <line x1="105" y1="4" x2="4" y2="105" />
          </g>

          {/* Silhouette de tous les traits (toujours visible, légère) */}
          {strokes.map((s, i) => (
            <path key={`ghost-${i}`} d={s.d} fill="none" stroke={i < current ? '#cbd5e1' : '#e2e8f0'} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {/* Traits validés */}
          {strokes.slice(0, current).map((s, i) => (
            <path key={`done-${i}`} d={s.d} fill="none" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {/* Indice du trait courant — animé (guide, ou révélé en mémoire) */}
          {!done && activeSt && showGuide && (
            <g>
              <path d={activeSt.d} fill="none" stroke="#4f7fe8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={activeSt.length} strokeDashoffset={activeSt.length * (1 - animPct)} />
              <Arrow x={activeSt.ex} y={activeSt.ey} angle={activeSt.ea} size={8} />
              <circle cx={activeSt.sx} cy={activeSt.sy} r="5.5" fill="none" stroke="#4f7fe8" strokeWidth="2" />
              <circle cx={activeSt.sx} cy={activeSt.sy} r="2.5" fill="#4f7fe8" />
            </g>
          )}

          {done && (
            <text x="54.5" y="80" fontSize="72" fontFamily="'Noto Serif JP', serif" textAnchor="middle" fill="rgba(79,127,232,0.18)" style={{ userSelect: 'none' }}>{character}</text>
          )}
        </svg>

        <canvas ref={canvasRef} width={480} height={480} className="absolute inset-0 w-full h-full rounded-2xl touch-none cursor-crosshair" style={{ background: 'transparent' }} />

        {feedback === 'good' && <div className="absolute inset-0 rounded-2xl bg-emerald-500/15 flex items-center justify-center pointer-events-none"><span className="text-5xl font-bold text-emerald-600 drop-shadow">✓</span></div>}
        {feedback === 'bad' && <div className="absolute inset-0 rounded-2xl bg-red-500/10 flex items-center justify-center pointer-events-none"><span className="text-5xl font-bold text-red-500 drop-shadow">✗</span></div>}

        {done && (
          <div className="absolute inset-0 rounded-2xl bg-background/55 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none gap-1">
            <p className="font-jp-serif text-6xl leading-none">{character}</p>
            <p className={`font-bold text-lg ${grade.color}`}>{grade.label}</p>
            <p className="text-xs text-muted-foreground">{strokes.length} traits · {mistakes} erreur{mistakes > 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {mode === 'memo' && !done && !revealed && (
          <button onClick={() => setRevealed(true)} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Eye size={13} /> Montrer le trait
          </button>
        )}
        <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw size={13} /> Recommencer
        </button>
      </div>

      {!done && (
        feedback === 'bad' && reason ? (
          <p className="text-xs font-semibold text-red-500 text-center max-w-[260px]">{reason}</p>
        ) : (
          <p className="text-xs text-muted-foreground text-center max-w-[260px]">
            {showGuide ? 'Suis le trait bleu en entier, du cercle jusqu\'à la flèche.' : 'Trace le bon trait, de mémoire, dans l\'ordre.'}
          </p>
        )
      )}
    </div>
  )
}
