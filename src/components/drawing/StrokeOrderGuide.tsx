import { useEffect, useState, useRef, useCallback } from 'react'
import { Play, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const CDN = 'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji'

interface EndInfo { x: number; y: number; angle: number }

function getStartPoint(d: string): { x: number; y: number } | null {
  const m = d.match(/M\s*([\d.]+)[,\s]+([\d.]+)/)
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null
}

function getEndInfo(d: string): EndInfo | null {
  try {
    // Safari exige que l'élément soit dans le DOM pour que getTotalLength() fonctionne
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden'
    document.body.appendChild(svg)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    svg.appendChild(path)
    const len = path.getTotalLength()
    let result: EndInfo | null = null
    if (len >= 2) {
      const end  = path.getPointAtLength(len)
      const near = path.getPointAtLength(Math.max(0, len - 4))
      result = { x: end.x, y: end.y, angle: Math.atan2(end.y - near.y, end.x - near.x) * 180 / Math.PI }
    }
    document.body.removeChild(svg)
    return result
  } catch {
    return null
  }
}

/** Flèche dessinée manuellement — pas de markerEnd (contournement bug Safari) */
function Arrow({ x, y, angle, color, size = 7 }: { x: number; y: number; angle: number; color: string; size?: number }) {
  return (
    <polygon
      points={`${-size * 0.6},${-size * 0.45} ${size * 0.8},0 ${-size * 0.6},${size * 0.45}`}
      fill={color}
      transform={`translate(${x},${y}) rotate(${angle})`}
    />
  )
}

interface StrokeInfo { d: string; start: { x: number; y: number } | null; end: EndInfo | null }

interface StrokeOrderGuideProps {
  character: string
  overlay?: boolean
  className?: string
}

const cache: Record<string, StrokeInfo[]> = {}

export function StrokeOrderGuide({ character, overlay = false, className }: StrokeOrderGuideProps) {
  const [strokes, setStrokes] = useState<StrokeInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLoading(true)
    setStrokes([])
    setStep(0)
    setIsAnimating(false)
    if (timerRef.current) clearTimeout(timerRef.current)

    const code = character.codePointAt(0)!.toString(16).padStart(5, '0')

    if (cache[code]) {
      setStrokes(cache[code])
      setLoading(false)
      return
    }

    fetch(`${CDN}/${code}.svg`)
      .then(r => { if (!r.ok) throw new Error(); return r.text() })
      .then(text => {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
        const infos: StrokeInfo[] = Array.from(doc.querySelectorAll(`[id^="kvg:${code}-s"]`))
          .map(el => {
            const d = el.getAttribute('d') ?? ''
            return { d, start: getStartPoint(d), end: getEndInfo(d) }
          })
          .filter(s => s.d)
        cache[code] = infos
        setStrokes(infos)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [character])

  const animate = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStep(1)
    setIsAnimating(true)
  }, [])

  useEffect(() => {
    if (!isAnimating || strokes.length === 0) return
    if (step > strokes.length) {
      timerRef.current = setTimeout(() => { setStep(0); setIsAnimating(false) }, 600)
      return
    }
    timerRef.current = setTimeout(() => setStep(s => s + 1), 850)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isAnimating, step, strokes.length])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  if (loading) {
    if (overlay) return null
    return <div className={cn('aspect-square rounded-xl bg-muted animate-pulse', className)} />
  }
  if (strokes.length === 0) return null

  const isInitial   = step === 0
  const activeIdx   = isInitial ? -1 : step - 1
  const completedEnd = isInitial ? strokes.length : step - 1

  // En overlay : agrandit le viewBox pour aligner le guide sur le fantôme canvas (62%).
  const viewBox = overlay ? '-35 -35 179 179' : '0 0 109 109'

  const svgEl = (
    <svg
      viewBox={viewBox}
      className={overlay
        ? 'w-full h-full'
        : 'w-full aspect-square rounded-xl border border-border bg-white dark:bg-neutral-900'}
      xmlns="http://www.w3.org/2000/svg"
    >
        {/* Ghost du caractère */}
        <text
          x="54.5" y="87"
          fontSize="78"
          fontFamily="'Noto Serif JP', serif"
          textAnchor="middle"
          fill="rgba(220,38,38,0.07)"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >{character}</text>

        {/* Fond très léger de tous les traits */}
        {strokes.map((s, i) => (
          <path key={`bg-${i}`} d={s.d} fill="none" stroke="#1a1a2e" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" opacity={0.06} />
        ))}

        {/* Traits futurs — très légers */}
        {!isInitial && strokes.slice(step).map((s, i) => (
          <path key={`fut-${i}`} d={s.d} fill="none" stroke="#1a1a2e" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" opacity={0.09} />
        ))}

        {/* Traits complétés — gris avec numéro + flèche */}
        {strokes.slice(0, completedEnd).map((s, i) => (
          <g key={`done-${i}`}>
            <path d={s.d} fill="none" stroke="#64748b" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
            {/* Flèche de direction en bout de trait */}
            {s.end && <Arrow x={s.end.x} y={s.end.y} angle={s.end.angle} color="rgba(100,116,139,0.75)" size={7} />}
            {/* Numéro au départ */}
            {s.start && (
              <g>
                <circle cx={s.start.x} cy={s.start.y} r="5.5" fill="#64748b" opacity={0.7} />
                <text x={s.start.x} y={s.start.y} fontSize="5.5" textAnchor="middle"
                  dominantBaseline="middle" fill="white" fontWeight="bold"
                  style={{ userSelect: 'none' }}>{i + 1}</text>
              </g>
            )}
          </g>
        ))}

        {/* Trait actif — rouge vif avec grande flèche */}
        {activeIdx >= 0 && strokes[activeIdx] && (() => {
          const s = strokes[activeIdx]
          return (
            <g key="active">
              <path d={s.d} fill="none" stroke="#be123c" strokeWidth="5"
                strokeLinecap="round" strokeLinejoin="round" />
              {s.end && <Arrow x={s.end.x} y={s.end.y} angle={s.end.angle} color="#be123c" size={9} />}
              {s.start && (
                <g>
                  <circle cx={s.start.x} cy={s.start.y} r="6.5" fill="#be123c" />
                  <text x={s.start.x} y={s.start.y} fontSize="6.5" textAnchor="middle"
                    dominantBaseline="middle" fill="white" fontWeight="bold"
                    style={{ userSelect: 'none' }}>{activeIdx + 1}</text>
                </g>
              )}
            </g>
          )
        })()}
      </svg>
  )

  if (overlay) return svgEl

  return (
    <div className={cn('space-y-2', className)}>
      {svgEl}
      <div className="flex gap-2">
        <button
          onClick={animate}
          disabled={isAnimating}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors disabled:opacity-50"
        >
          <Play size={12} />
          {isAnimating
            ? `Trait ${Math.min(step, strokes.length)} / ${strokes.length}`
            : 'Animer le tracé'}
        </button>
        <button
          onClick={() => { setStep(0); setIsAnimating(false) }}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Réinitialiser"
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </div>
  )
}
