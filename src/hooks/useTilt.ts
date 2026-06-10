import { useRef, useCallback } from 'react'

export function useTilt(maxAngle = 12) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotX = -(y - 0.5) * maxAngle * 2
    const rotY = (x - 0.5) * maxAngle * 2
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(14px)`
    const shine = el.querySelector<HTMLElement>('.tilt-shine')
    if (shine) shine.style.backgroundImage = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.25) 0%, transparent 65%)`
  }, [maxAngle])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)'
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    const shine = el.querySelector<HTMLElement>('.tilt-shine')
    if (shine) shine.style.backgroundImage = 'none'
    setTimeout(() => { if (ref.current) ref.current.style.transition = '' }, 650)
  }, [])

  const onMouseEnter = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.1s ease-out'
  }, [])

  return { ref, onMouseMove, onMouseLeave, onMouseEnter }
}
