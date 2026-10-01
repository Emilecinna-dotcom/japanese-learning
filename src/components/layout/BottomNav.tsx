import { NavLink } from 'react-router-dom'
import { Home, Zap, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProgressContext } from '@/hooks/useProgress'

interface BottomNavProps {
  onMenuOpen: () => void
}

const NAV_ITEMS = [
  { to: '/hiragana',   label: 'Kana',     icon: null,              kana: 'あ',  end: false },
  { to: '/',           label: 'Accueil',  icon: <Home size={20} />,kana: null,  end: true  },
  { to: '/parcours',   label: 'Parcours', icon: null,              kana: '道',  end: false },
  { to: '/kanji',      label: 'Kanji',    icon: null,              kana: '漢',  end: false },
  { to: '/flashcards', label: 'Révision', icon: <Zap size={20} />, kana: null,  end: false },
]

export function BottomNav({ onMenuOpen }: BottomNavProps) {
  const { getTodayDueCount } = useProgressContext()
  const dueCount = getTodayDueCount()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-sidebar/95 backdrop-blur-md border-t border-sidebar-border" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch h-16">
        {/* Bouton Tout — à gauche, ouvre le drawer */}
        <button
          onClick={onMenuOpen}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          <LayoutGrid size={20} />
          <span>Tout</span>
        </button>

        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative',
                isActive
                  ? 'text-primary'
                  : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-primary" />
                )}
                <span className={cn(
                  'flex items-center justify-center transition-transform',
                  isActive && 'scale-110',
                  item.kana ? 'font-jp text-2xl leading-none' : ''
                )}>
                  {item.kana ?? item.icon}
                </span>
                <span className="relative">
                  {item.label}
                  {item.to === '/flashcards' && dueCount > 0 && (
                    <span className="absolute -top-1 -right-3 min-w-[14px] h-[14px] rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center px-0.5">
                      {dueCount > 9 ? '9+' : dueCount}
                    </span>
                  )}
                </span>
              </>
            )}
          </NavLink>
        ))}

      </div>
    </nav>
  )
}
