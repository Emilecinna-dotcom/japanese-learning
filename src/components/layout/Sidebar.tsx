import { NavLink } from 'react-router-dom'
import { BookOpen, Pencil, AlignLeft, Zap, BarChart2, SquareLibrary, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  labelJP?: string
  badge?: string
  end?: boolean
}

function NavItem({ to, icon, label, labelJP, badge, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-primary text-white shadow-md shadow-primary/25'
            : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'
        )
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {labelJP && (
        <span className="font-jp-serif text-xs opacity-40 shrink-0">{labelJP}</span>
      )}
      {badge && (
        <span className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse ml-1">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

interface SidebarProps {
  dueCount: number
}

export function Sidebar({ dueCount }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-62 shrink-0 border-r border-sidebar-border bg-sidebar h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
            <span className="font-jp-serif text-white text-lg font-bold leading-none">日</span>
          </div>
          <div>
            <p className="font-bold text-sm text-sidebar-foreground leading-tight tracking-wide">Nihongo</p>
            <p className="text-[10px] text-sidebar-foreground/35 tracking-wider uppercase">日本語学習</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <NavItem to="/" icon={<Home size={15} />} label="Accueil" end />
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Écriture — 書き方
          </p>
          <div className="space-y-0.5">
            <NavItem to="/hiragana" icon={<Pencil size={15} />} label="Hiragana" labelJP="ひらがな" />
            <NavItem to="/katakana" icon={<Pencil size={15} />} label="Katakana" labelJP="カタカナ" />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Lecture — 読み方
          </p>
          <div className="space-y-0.5">
            <NavItem to="/kanji" icon={<SquareLibrary size={15} />} label="Kanji N5" labelJP="漢字" />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Langue — 言語
          </p>
          <div className="space-y-0.5">
            <NavItem to="/vocabulaire" icon={<BookOpen size={15} />} label="Vocabulaire" labelJP="語彙" />
            <NavItem to="/grammaire" icon={<AlignLeft size={15} />} label="Grammaire" labelJP="文法" />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Pratique — 練習
          </p>
          <div className="space-y-0.5">
            <NavItem
              to="/flashcards"
              icon={<Zap size={15} />}
              label="Flashcards"
              labelJP="復習"
              badge={dueCount > 0 ? String(dueCount) : undefined}
            />
            <NavItem to="/progression" icon={<BarChart2 size={15} />} label="Progression" labelJP="進歩" />
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border flex items-center justify-between">
        <span className="text-[10px] text-sidebar-foreground/30 tracking-wider">JLPT N5</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-sidebar-foreground/30">En ligne</span>
        </div>
      </div>
    </aside>
  )
}
