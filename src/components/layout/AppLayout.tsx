import { Outlet } from 'react-router-dom'
import { useState, memo, useRef, useEffect } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useProgressContext } from '@/hooks/useProgress'

const JAPAN_BG = '/images/japan-bg.jpg'

// Trois couches de profondeur : avant (z>0), milieu (z≈0), arrière (z<0)
const KANA_3D_SCENE = [
  // ── Avant-plan ── proche, grands, opacity plus visible
  { char: '日', x: 10, y: 10, z: 220, size: 130, opacity: 0.055, dur: 8,  delay: 0,   anim: 'kanaFloat'  },
  { char: '語', x: 87, y: 38, z: 190, size: 118, opacity: 0.050, dur: 9,  delay: 0.5, anim: 'kanaFloat2' },
  { char: '夢', x: 50, y: 18, z: 170, size: 108, opacity: 0.045, dur: 7,  delay: 1.5, anim: 'kanaFloat3' },
  // ── Milieu ──
  { char: '水', x: 65, y: 63, z: 80,  size: 88,  opacity: 0.038, dur: 10, delay: 1,   anim: 'kanaFloat3' },
  { char: 'の', x: 82, y: 7,  z: 70,  size: 80,  opacity: 0.034, dur: 11, delay: 2,   anim: 'kanaFloat2' },
  { char: '山', x: 5,  y: 50, z: 60,  size: 82,  opacity: 0.034, dur: 12, delay: 1.5, anim: 'kanaFloat'  },
  { char: '風', x: 30, y: 72, z: 90,  size: 86,  opacity: 0.038, dur: 13, delay: 0.8, anim: 'kanaFloat2' },
  { char: '心', x: 58, y: 45, z: 50,  size: 78,  opacity: 0.030, dur: 11, delay: 3.5, anim: 'kanaFloat'  },
  // ── Arrière-plan ── loin, petits, très subtils
  { char: 'あ', x: 20, y: 80, z: -90, size: 60,  opacity: 0.022, dur: 14, delay: 3,   anim: 'kanaFloat'  },
  { char: 'は', x: 42, y: 3,  z: -70, size: 56,  opacity: 0.020, dur: 13, delay: 4,   anim: 'kanaFloat3' },
  { char: 'き', x: 55, y: 88, z: -110,size: 50,  opacity: 0.018, dur: 15, delay: 2.5, anim: 'kanaFloat2' },
  { char: '花', x: 33, y: 40, z: -60, size: 52,  opacity: 0.020, dur: 16, delay: 5,   anim: 'kanaFloat3' },
  { char: '月', x: 18, y: 28, z: -130,size: 46,  opacity: 0.015, dur: 17, delay: 3.5, anim: 'kanaFloat2' },
  { char: '空', x: 70, y: 6,  z: -80, size: 48,  opacity: 0.018, dur: 12, delay: 7,   anim: 'kanaFloat3' },
  { char: 'こ', x: 75, y: 76, z: -100,size: 44,  opacity: 0.016, dur: 11, delay: 6,   anim: 'kanaFloat'  },
]

const FloatingKanaBackground = memo(function FloatingKanaBackground() {
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let rafId: number
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const scene = sceneRef.current
        if (!scene) return
        const rx = (e.clientY / window.innerHeight - 0.5) * -14  // tilt vertical
        const ry = (e.clientX / window.innerWidth  - 0.5) *  18  // tilt horizontal
        scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
      aria-hidden
      style={{ perspective: '650px', perspectiveOrigin: '50% 50%' }}
    >
      <div
        ref={sceneRef}
        style={{
          position: 'absolute',
          inset: '-20%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.14s ease-out',
          willChange: 'transform',
        }}
      >
        {KANA_3D_SCENE.map((item, i) => (
          // Wrapper positionné en Z — l'animation float est sur l'enfant pour éviter les conflits
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translateZ(${item.z}px)`,
            }}
          >
            <div
              className="font-jp-serif font-bold text-foreground"
              style={{
                fontSize: `${item.size}px`,
                opacity: item.opacity,
                lineHeight: 1,
                animation: `${item.anim} ${item.dur}s ${item.delay}s ease-in-out infinite`,
              }}
            >
              {item.char}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

interface NavItemMobileProps {
  to: string
  label: string
  onClick: () => void
  end?: boolean
}

function NavItemMobile({ to, label, onClick, end }: NavItemMobileProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isActive ? 'bg-primary text-white shadow-md shadow-primary/25' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
        )
      }
    >
      {label}
    </NavLink>
  )
}

export function AppLayout() {
  const { getTodayDueCount } = useProgressContext()
  const dueCount = getTodayDueCount()
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setDark(d => !d)
  }

  return (
    <div className="flex min-h-screen">
      {/* Fond Japan — image très subtile */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <img
          src={JAPAN_BG}
          alt=""
          className="w-full h-full object-cover object-center select-none opacity-30 dark:opacity-25"
          loading="eager"
          decoding="async"
        />
      </div>

      <FloatingKanaBackground />

      {/* Desktop sidebar */}
      <Sidebar dueCount={dueCount} />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-out lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="font-jp text-white text-base leading-none">日</span>
            </div>
            <span className="font-bold text-sm text-sidebar-foreground">Nihongo</span>
          </NavLink>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 transition-colors">
            <X size={18} />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {[
            { to: '/', label: 'Accueil', end: true },
            { to: '/hiragana', label: 'Hiragana' },
            { to: '/katakana', label: 'Katakana' },
            { to: '/kanji', label: 'Kanji N5' },
            { to: '/vocabulaire', label: 'Vocabulaire' },
            { to: '/grammaire', label: 'Grammaire' },
            { to: '/flashcards', label: 'Flashcards' },
            { to: '/progression', label: 'Progression' },
          ].map(item => (
            <NavItemMobile key={item.to} to={item.to} label={item.label} end={item.end} onClick={() => setMobileOpen(false)} />
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/60">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 lg:flex-none" />
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Basculer le mode sombre"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
