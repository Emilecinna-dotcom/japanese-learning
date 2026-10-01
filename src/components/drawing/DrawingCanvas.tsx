'use client'
import { useRef, useEffect, useCallback, useState } from 'react'
import { Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Result = 'good' | 'ok' | 'bad' | null

interface DrawingCanvasProps {
  character: string
  onClear?: () => void
  onSuccess?: () => void
  className?: string
  showGuide?: boolean
}

export function DrawingCanvas({ character, onClear, onSuccess, className, showGuide = true }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  // Historique des snapshots (un par trait fini) pour undo
  const history = useRef<ImageData[]>([])
  const [hasStrokes, setHasStrokes] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [score, setScore] = useState(0)

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = 'clientX' in e ? e.clientX : (e as Touch).clientX
    const clientY = 'clientY' in e ? e.clientY : (e as Touch).clientY
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
  }

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = canvas.width

    ctx.clearRect(0, 0, size, size)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    ctx.strokeStyle = 'rgba(220, 38, 38, 0.12)'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 6])
    ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.06)'
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(size, 0); ctx.lineTo(0, size); ctx.stroke()

    if (showGuide) {
      ctx.font = `bold ${size * 0.62}px "Noto Serif JP", serif`
      ctx.fillStyle = 'rgba(220, 38, 38, 0.13)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(character, size / 2, size / 2)
    }
  }, [character, showGuide])

  useEffect(() => {
    drawGuide()
    history.current = []
    setHasStrokes(false)
    setResult(null)
  }, [drawGuide])

  const startDraw = useCallback((pos: { x: number; y: number }) => {
    isDrawing.current = true
    lastPos.current = pos
    setResult(null)

    // Snapshot avant ce nouveau trait
    const canvas = canvasRef.current
    if (canvas) {
      const snap = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)
      history.current.push(snap)
    }

    setHasStrokes(true)
  }, [])

  const draw = useCallback((pos: { x: number; y: number }) => {
    if (!isDrawing.current || !lastPos.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = canvas.width * 0.025
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }, [])

  const stopDraw = useCallback(() => {
    isDrawing.current = false
    lastPos.current = null
  }, [])

  const undo = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || history.current.length === 0) return
    const prev = history.current.pop()!
    canvas.getContext('2d')!.putImageData(prev, 0, 0)
    setResult(null)
    if (history.current.length === 0) setHasStrokes(false)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onMouseDown = (e: MouseEvent) => startDraw(getPos(e, canvas))
    const onMouseMove = (e: MouseEvent) => { if (isDrawing.current) draw(getPos(e, canvas)) }
    const onMouseUp = () => stopDraw()
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); startDraw(getPos(e.touches[0], canvas)) }
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); draw(getPos(e.touches[0], canvas)) }
    const onTouchEnd = () => stopDraw()

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('mouseleave', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [startDraw, draw, stopDraw])

  const check = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ref = document.createElement('canvas')
    ref.width = canvas.width
    ref.height = canvas.height
    const refCtx = ref.getContext('2d')!
    refCtx.fillStyle = '#ffffff'
    refCtx.fillRect(0, 0, ref.width, ref.height)
    refCtx.font = `bold ${ref.width * 0.62}px "Noto Serif JP", serif`
    refCtx.fillStyle = '#000000'
    refCtx.textAlign = 'center'
    refCtx.textBaseline = 'middle'
    refCtx.fillText(character, ref.width / 2, ref.height / 2)

    const userData = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data
    const refData = refCtx.getImageData(0, 0, ref.width, ref.height).data

    let refPixels = 0, userPixels = 0, overlap = 0
    for (let i = 0; i < refData.length; i += 4) {
      const isRef = refData[i] < 128
      const isUser = userData[i] < 100
      if (isRef) refPixels++
      if (isUser) { userPixels++; if (isRef) overlap++ }
    }

    const coverage = refPixels > 0 ? overlap / refPixels : 0
    const precision = userPixels > 0 ? overlap / userPixels : 0
    const combined = coverage * 0.55 + precision * 0.45
    const pct = Math.round(combined * 100)
    setScore(pct)

    if (combined >= 0.52) {
      setResult('good')
      setTimeout(() => onSuccess?.(), 1400)
    } else {
      // Échec → affiche le résultat 1.2s puis efface automatiquement
      setResult(combined >= 0.32 ? 'ok' : 'bad')
      setTimeout(() => {
        drawGuide()
        history.current = []
        setHasStrokes(false)
        setResult(null)
      }, 1200)
    }
  }

  const clear = () => {
    drawGuide()
    history.current = []
    setHasStrokes(false)
    setResult(null)
    onClear?.()
  }

  const resultConfig = {
    good: { label: 'Parfait !',          bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' },
    ok:   { label: 'Pas tout à fait…',   bg: 'bg-amber-50 border-amber-200',    text: 'text-amber-700',   bar: 'bg-amber-400' },
    bad:  { label: 'Recommence',          bg: 'bg-red-50 border-red-200',        text: 'text-red-700',     bar: 'bg-red-500' },
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative w-full" style={{ maxWidth: '440px' }}>
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="w-full aspect-square rounded-2xl border-2 border-border cursor-crosshair touch-none shadow-sm"
        />

        {/* Tampon succès */}
        {result === 'good' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ transform: 'rotate(-10deg)' }}>
              <div className="animate-stamp w-36 h-36 rounded-full border-4 border-primary flex flex-col items-center justify-center gap-1 select-none bg-background/85 ring-[7px] ring-primary/12">
                <span className="font-jp-serif text-5xl font-bold text-primary leading-none">合格</span>
                <span className="text-[9px] font-bold text-primary tracking-[0.28em] uppercase">Appris !</span>
              </div>
            </div>
          </div>
        )}



        {/* Boutons overlay */}
        {hasStrokes && !result && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={undo}
              title="Annuler le dernier trait"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 border border-border text-muted-foreground hover:text-foreground hover:bg-white transition-all shadow-sm"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={clear}
              className="px-3 py-1.5 rounded-lg bg-white/90 border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white transition-all shadow-sm"
            >
              Effacer
            </button>
          </div>
        )}
      </div>

      {/* Bouton vérifier */}
      {hasStrokes && !result && (
        <button
          onClick={check}
          className="w-full max-w-[440px] py-3 rounded-xl bg-primary text-white font-semibold text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/25"
        >
          Vérifier mon tracé
        </button>
      )}

      {/* Résultat avec barre de score — seulement pour les échecs */}
      {result && result !== 'good' && (
        <div className={cn('w-full max-w-[440px] rounded-xl border px-4 py-3 space-y-2', resultConfig[result].bg)}>
          <div className="flex items-center justify-between">
            <span className={cn('font-semibold text-sm', resultConfig[result].text)}>
              {resultConfig[result].label}
            </span>
            <span className={cn('text-lg font-bold tabular-nums', resultConfig[result].text)}>
              {score}%
            </span>
          </div>
          {/* Barre de progression */}
          <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', resultConfig[result].bar)}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className={cn('text-xs', resultConfig[result].text, 'opacity-70')}>
            Le canvas se réinitialise automatiquement…
          </p>
        </div>
      )}
    </div>
  )
}
