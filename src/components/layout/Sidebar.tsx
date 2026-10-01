import { NavLink } from 'react-router-dom'
import { Route as RouteIcon, BookOpen, Pencil, AlignLeft, Zap, BarChart2, SquareLibrary, Home, Smartphone, PenLine, Hash, MessageSquare, Repeat2, Calculator, Headphones, FileText, Trophy, AudioLines, Crown, Gamepad2, Sparkles, PenTool, Mic, BookMarked } from 'lucide-react'
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
  writingDue?: number
}

export function Sidebar({ dueCount, writingDue = 0 }: SidebarProps) {
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
        <div className="space-y-0.5">
          <NavItem to="/" icon={<Home size={15} />} label="Accueil" end />
          <NavItem
            to="/session"
            icon={<Sparkles size={15} />}
            label="Session du jour"
            labelJP="今日"
            badge={dueCount > 0 ? String(dueCount) : undefined}
          />
          <NavItem to="/parcours" icon={<RouteIcon size={15} />} label="Parcours" labelJP="道" />
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Écriture — 書き方
          </p>
          <div className="space-y-0.5">
            <NavItem to="/hiragana" icon={<Pencil size={15} />}  label="Hiragana" labelJP="ひらがな" />
            <NavItem to="/katakana" icon={<Pencil size={15} />}  label="Katakana" labelJP="カタカナ" />
            <NavItem to="/ecriture" icon={<PenLine size={15} />} label="Écriture"  labelJP="書き練習" badge={writingDue > 0 ? String(writingDue) : undefined} />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Kanji — 漢字
          </p>
          <div className="space-y-0.5">
            <NavItem to="/kanji" icon={<SquareLibrary size={15} />} label="Kanji N5 · N4" labelJP="漢字" />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Langue — 言語
          </p>
          <div className="space-y-0.5">
            <NavItem to="/vocabulaire" icon={<BookOpen size={15} />}    label="Vocabulaire" labelJP="語彙" />
            <NavItem to="/grammaire"   icon={<AlignLeft size={15} />}   label="Grammaire"   labelJP="文法" />
            <NavItem to="/conjugaison" icon={<Repeat2 size={15} />}     label="Conjugaison" labelJP="活用" />
            <NavItem to="/particules"  icon={<AlignLeft size={15} />}   label="Particules"  labelJP="助詞" />
            <NavItem to="/keigo"       icon={<Crown size={15} />}       label="Keigo"       labelJP="敬語" />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Expressions — 表現
          </p>
          <div className="space-y-0.5">
            <NavItem to="/phrases"       icon={<MessageSquare size={15} />} label="Phrases"       labelJP="表現" />
            <NavItem to="/compteurs"     icon={<Calculator size={15} />}    label="Compteurs"     labelJP="助数詞" />
            <NavItem to="/chiffres"      icon={<Hash size={15} />}          label="Chiffres"      labelJP="数字" />
            <NavItem to="/onomatopees"   icon={<AudioLines size={15} />}    label="Onomatopées"   labelJP="擬音語" />
            <NavItem to="/telephone"     icon={<Smartphone size={15} />}    label="Téléphone"     labelJP="スマホ" />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Immersion — 実践
          </p>
          <div className="space-y-0.5">
            <NavItem to="/ecoute"        icon={<Headphones size={15} />} label="Écoute"        labelJP="聴く" />
            <NavItem to="/prononciation" icon={<Mic size={15} />}        label="Prononciation" labelJP="発音" />
            <NavItem to="/lecture"       icon={<FileText size={15} />}   label="Lecture"       labelJP="読む" />
            <NavItem to="/jlpt"    icon={<Trophy size={15} />}     label="JLPT"    labelJP="試験" />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-3 mb-2">
            Jeux — 遊び
          </p>
          <div className="space-y-0.5">
            <NavItem to="/jeux" icon={<Gamepad2 size={15} />} label="Jeux" labelJP="遊び" end />
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
            <NavItem to="/production"  icon={<PenTool size={15} />}   label="Production"  labelJP="産出" />
            <NavItem to="/mots"        icon={<BookMarked size={15} />} label="Mes mots"   labelJP="単語帳" />
            <NavItem to="/exercices"   icon={<Trophy size={15} />}    label="Exercices"   labelJP="練習問題" />
            <NavItem to="/progression" icon={<BarChart2 size={15} />} label="Progression" labelJP="進歩" />
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border flex items-center justify-between">
        <span className="text-[10px] text-sidebar-foreground/30 tracking-wider">JLPT N5 · N4</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-sidebar-foreground/30">En ligne</span>
        </div>
      </div>
    </aside>
  )
}
