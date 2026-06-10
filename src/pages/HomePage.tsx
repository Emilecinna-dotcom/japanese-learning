import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { BookOpen, Pencil, SquareLibrary, AlignLeft, Zap, BarChart2, ArrowRight, Flame } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { GRAMMAR_POINTS } from '@/data/grammaire'
import { useProgressContext } from '@/hooks/useProgress'
import { useTilt } from '@/hooks/useTilt'

const GALLERY = [
  { src: '/images/tokyo-ikebukuro.jpg', label: 'Ikebukuro',     sub: '池袋の夜',         type: 'japan' },
  { src: '/images/skyline-gtr.jpg',     label: 'Nissan Skyline', sub: 'スカイライン',     type: 'car'   },
  { src: '/images/shinjuku.jpg',        label: 'Shinjuku',       sub: '新宿の夜',         type: 'japan' },
  { src: '/images/gtr-r34.jpg',         label: 'GT-R R34',       sub: 'スカイライン R34', type: 'car'   },
  { src: '/images/tokyo-night.jpg',     label: 'Tokyo la nuit',  sub: '東京の夜',         type: 'japan' },
  { src: '/images/supra.jpg',           label: 'Toyota Supra',   sub: 'スープラ',         type: 'car'   },
  { src: '/images/rue-japonaise.jpg',   label: 'Rue japonaise',  sub: '日本の街',         type: 'japan' },
  { src: '/images/nissan-r34.jpg',      label: 'Skyline GT-R',   sub: '日産スカイライン', type: 'car'   },
]

function GalleryCard({ img }: { img: typeof GALLERY[0] }) {
  const { ref, onMouseMove, onMouseLeave, onMouseEnter } = useTilt(16)
  const src = img.src
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      className="shrink-0 snap-start w-52 md:w-64 h-36 md:h-44 rounded-2xl overflow-hidden relative cursor-pointer group"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="tilt-shine rounded-2xl z-20" />
      <img
        src={src}
        alt={img.label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        decoding="async"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Badge type */}
      <div className="absolute top-2.5 left-2.5 z-10" style={{ transform: 'translateZ(12px)' }}>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
          img.type === 'car'
            ? 'bg-amber-400/90 text-amber-900'
            : 'bg-white/20 backdrop-blur-sm text-white'
        }`}>
          {img.type === 'car' ? '🚗 JDM' : '🗾 Japan'}
        </span>
      </div>
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10" style={{ transform: 'translateZ(16px)' }}>
        <p className="text-white font-bold text-sm leading-tight drop-shadow">{img.label}</p>
        <p className="text-white/60 font-jp text-xs mt-0.5">{img.sub}</p>
      </div>
    </div>
  )
}

const MODULES = [
  {
    to: '/hiragana',
    icon: Pencil,
    title: 'Hiragana',
    titleJP: 'ひらがな',
    desc: "L'alphabet syllabique de base",
    gradient: 'from-rose-500/15 to-pink-400/10',
    borderHover: 'hover:border-rose-400/60',
    iconBg: 'bg-rose-500',
    accentColor: 'text-rose-600 dark:text-rose-400',
    progressColor: 'bg-rose-500',
  },
  {
    to: '/katakana',
    icon: Pencil,
    title: 'Katakana',
    titleJP: 'カタカナ',
    desc: 'Pour les mots étrangers',
    gradient: 'from-orange-500/15 to-amber-400/10',
    borderHover: 'hover:border-orange-400/60',
    iconBg: 'bg-orange-500',
    accentColor: 'text-orange-600 dark:text-orange-400',
    progressColor: 'bg-orange-500',
  },
  {
    to: '/kanji',
    icon: SquareLibrary,
    title: 'Kanji N5',
    titleJP: '漢字',
    desc: '50 kanji essentiels JLPT N5',
    gradient: 'from-amber-500/15 to-yellow-400/10',
    borderHover: 'hover:border-amber-400/60',
    iconBg: 'bg-amber-500',
    accentColor: 'text-amber-600 dark:text-amber-400',
    progressColor: 'bg-amber-500',
  },
  {
    to: '/vocabulaire',
    icon: BookOpen,
    title: 'Vocabulaire',
    titleJP: '語彙',
    desc: '8 thèmes du quotidien',
    gradient: 'from-emerald-500/15 to-green-400/10',
    borderHover: 'hover:border-emerald-400/60',
    iconBg: 'bg-emerald-500',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    progressColor: 'bg-emerald-500',
  },
  {
    to: '/grammaire',
    icon: AlignLeft,
    title: 'Grammaire',
    titleJP: '文法',
    desc: 'Particules, verbes, adjectifs',
    gradient: 'from-violet-500/15 to-purple-400/10',
    borderHover: 'hover:border-violet-400/60',
    iconBg: 'bg-violet-500',
    accentColor: 'text-violet-600 dark:text-violet-400',
    progressColor: 'bg-violet-500',
  },
  {
    to: '/flashcards',
    icon: Zap,
    title: 'Flashcards',
    titleJP: '復習',
    desc: 'Répétition espacée SM-2',
    gradient: 'from-primary/15 to-rose-600/10',
    borderHover: 'hover:border-primary/60',
    iconBg: 'bg-primary',
    accentColor: 'text-primary',
    progressColor: 'bg-primary',
    isFlashcard: true,
  },
]

type ModuleDef = typeof MODULES[0]
interface ModuleCardProps {
  mod: ModuleDef
  stat: { done: number | null; total: number | null }
  badge?: string
}

function ModuleCard3D({ mod, stat, badge }: ModuleCardProps) {
  const { ref, onMouseMove, onMouseLeave, onMouseEnter } = useTilt(14)
  const Icon = mod.icon
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Link
        to={mod.to}
        className={`group relative overflow-hidden bg-card border border-border rounded-2xl p-5 block hover:shadow-2xl transition-shadow duration-200 ${mod.borderHover}`}
      >
        <div className="tilt-shine rounded-2xl" />
        <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="relative z-10" style={{ transform: 'translateZ(18px)', transformStyle: 'preserve-3d' }}>
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-2.5 rounded-lg ${mod.iconBg} text-white shadow-md shadow-black/10`}
              style={{ transform: 'translateZ(8px)' }}
            >
              <Icon size={17} />
            </div>
            <div className="flex items-center gap-1.5">
              {badge && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {badge}
                </span>
              )}
              {stat.done !== null && stat.total !== null && (
                <span className="text-xs font-medium text-muted-foreground">{stat.done}/{stat.total}</span>
              )}
            </div>
          </div>

          <div className="mb-1 flex items-baseline gap-2">
            <h3 className="font-bold text-sm">{mod.title}</h3>
            <span className={`font-jp-serif text-sm ${mod.accentColor}`}>{mod.titleJP}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{mod.desc}</p>

          {stat.done !== null && stat.total !== null && (
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${mod.progressColor} rounded-full transition-all duration-500`}
                style={{ width: `${(stat.done / stat.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

// Kanji du jour — tourne chaque jour
const KANJI_DU_JOUR = [
  { char: '一', reading: 'ichi', meaning: 'un', romaji: 'ichi' },
  { char: '日', reading: 'nichi / hi', meaning: 'jour / soleil', romaji: 'nichi' },
  { char: '山', reading: 'yama', meaning: 'montagne', romaji: 'yama' },
  { char: '川', reading: 'kawa', meaning: 'rivière', romaji: 'kawa' },
  { char: '人', reading: 'hito', meaning: 'personne', romaji: 'hito' },
  { char: '水', reading: 'mizu', meaning: 'eau', romaji: 'mizu' },
  { char: '火', reading: 'hi', meaning: 'feu', romaji: 'hi' },
  { char: '月', reading: 'tsuki', meaning: 'lune / mois', romaji: 'tsuki' },
  { char: '木', reading: 'ki', meaning: 'arbre', romaji: 'ki' },
  { char: '金', reading: 'kane', meaning: 'or / argent', romaji: 'kane' },
  { char: '土', reading: 'tsuchi', meaning: 'terre / sol', romaji: 'tsuchi' },
  { char: '大', reading: 'ōki', meaning: 'grand', romaji: 'ōki' },
  { char: '小', reading: 'chiisa', meaning: 'petit', romaji: 'chiisa' },
  { char: '本', reading: 'hon', meaning: 'livre / origine', romaji: 'hon' },
]

function getGreeting(): { jp: string; fr: string } {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)  return { jp: 'おはようございます', fr: 'Bonjour' }
  if (h >= 12 && h < 18) return { jp: 'こんにちは', fr: 'Bonne après-midi' }
  return { jp: 'こんばんは', fr: 'Bonsoir' }
}

export function HomePage() {
  const { progress, getTodayDueCount } = useProgressContext()
  const dueCount = getTodayDueCount()

  const hiraganaBase = ALL_HIRAGANA.slice(0, 46)
  const totalVocab = ALL_THEMES.reduce((sum, t) => sum + t.items.length, 0)
  const seenVocab = ALL_THEMES.reduce((sum, t) => sum + t.items.filter(i => !!progress.vocabulary[i.id]?.seen).length, 0)

  const stats = [
    { done: progress.hiragana.mastered.length,     total: hiraganaBase.length },
    { done: progress.katakana.mastered.length,     total: ALL_KATAKANA.length },
    { done: Object.keys(progress.kanji).length,    total: KANJI_N5.length },
    { done: seenVocab,                             total: totalVocab },
    { done: Object.keys(progress.grammar).length,  total: GRAMMAR_POINTS.length },
    { done: null,                                  total: null },
  ]

  const totalDone  = stats.slice(0, 5).reduce((s, x) => s + (x.done ?? 0), 0)
  const totalItems = stats.slice(0, 5).reduce((s, x) => s + (x.total ?? 0), 0)
  const overallPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0

  const greeting = getGreeting()
  const dayIndex = Math.floor(Date.now() / 86400000) % KANJI_DU_JOUR.length
  const kanji = KANJI_DU_JOUR[dayIndex]

  const heroRef = useRef<HTMLDivElement>(null)
  const heroKanjiRef = useRef<HTMLDivElement>(null)
  const heroBlobRef = useRef<HTMLDivElement>(null)

  const onHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    if (heroKanjiRef.current) heroKanjiRef.current.style.transform = `translate(${x * 35}px, ${y * 22}px) scale(1.06) rotate(${x * 4}deg)`
    if (heroBlobRef.current) heroBlobRef.current.style.transform = `translate(${x * -20}px, ${y * -14}px) translate(-50%, 50%)`
  }

  const onHeroMouseLeave = () => {
    if (heroKanjiRef.current) {
      heroKanjiRef.current.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)'
      heroKanjiRef.current.style.transform = 'translate(0, 0) scale(1) rotate(0deg)'
      setTimeout(() => { if (heroKanjiRef.current) heroKanjiRef.current.style.transition = '' }, 900)
    }
    if (heroBlobRef.current) {
      heroBlobRef.current.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)'
      heroBlobRef.current.style.transform = 'translate(-50%, 50%)'
      setTimeout(() => { if (heroBlobRef.current) heroBlobRef.current.style.transition = '' }, 900)
    }
  }

  return (
    <div className="space-y-10">

      {/* ── HERO ── */}
      <div
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-rose-800 p-8 md:p-10 text-white shadow-2xl cursor-default"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Photo Japan en fond */}
        <img
          src="/images/hero-tokyo.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
          loading="eager"
          decoding="async"
          aria-hidden
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div ref={heroKanjiRef} className="absolute -right-4 -top-4 font-jp-serif font-bold text-[140px] leading-none opacity-[0.12] select-none" style={{ willChange: 'transform', transition: 'transform 0.1s ease-out' }}>語</div>
          <div ref={heroBlobRef} className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2" style={{ willChange: 'transform', transition: 'transform 0.1s ease-out' }} />
        </div>

        <div className="relative z-10">
          {/* Greeting */}
          <p className="font-jp text-sm text-white/60 mb-1 tracking-wider">{greeting.jp}</p>
          <div className="flex items-center gap-3 mb-5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {greeting.fr} — 日本語
            </h1>
            {progress.streak > 0 && (
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                <Flame size={13} className="text-amber-300" />
                {progress.streak}j
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs text-white/60 mb-1.5">
                <span>Progression globale</span>
                <span>{overallPct}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
              </div>
            </div>
            <Link
              to="/progression"
              className="flex items-center gap-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1.5 transition-colors shrink-0"
            >
              Détails <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── GALERIE ── */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Le Japon en images — 日本と車</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
          {GALLERY.map(img => <GalleryCard key={img.src} img={img} />)}
        </div>
      </div>

      {/* ── KANJI DU JOUR ── */}
      <Link to="/kanji" className="group flex items-center gap-6 bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all">
        <div className="shrink-0 w-20 h-20 flex items-center justify-center bg-primary/5 rounded-xl border border-primary/15 group-hover:bg-primary/10 transition-colors">
          <span className="font-jp-serif text-5xl font-bold text-primary leading-none">{kanji.char}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Kanji du jour</p>
          <p className="font-bold text-lg leading-tight">{kanji.meaning}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{kanji.reading}</p>
        </div>
        <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>

      {/* ── MODULES ── */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Modules — モジュール</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((mod, i) => {
            const stat  = stats[i]
            const badge = mod.isFlashcard && dueCount > 0 ? String(dueCount) : undefined
            return (
              <ModuleCard3D key={mod.to} mod={mod} stat={stat} badge={badge} />
            )
          })}
        </div>
      </div>

      {/* ── GUIDE ── */}
      <div className="bg-card/90 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-jp-serif text-xl text-primary">道</span>
          <h3 className="font-bold text-sm">Par où commencer ?</h3>
        </div>
        <ol className="text-sm text-muted-foreground space-y-2.5 list-none">
          {[
            { step: '1', text: 'Commence par les', bold: 'Hiragana', after: '— la base de tout le japonais', to: '/hiragana' },
            { step: '2', text: 'Apprends aussi les', bold: 'Katakana', after: 'pour lire les mots étrangers', to: '/katakana' },
            { step: '3', text: 'Explore les', bold: 'Salutations', after: 'dans Vocabulaire', to: '/vocabulaire' },
            { step: '4', text: 'Découvre les particules', bold: 'は が を', after: 'dans Grammaire', to: '/grammaire' },
            { step: '5', text: 'Révise chaque jour avec les', bold: 'Flashcards', to: '/flashcards' },
          ].map(item => (
            <li key={item.step} className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/12 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                {item.step}
              </span>
              <span>
                {item.text}{' '}
                <Link to={item.to} className="font-semibold text-foreground hover:text-primary transition-colors">
                  {item.bold}
                </Link>
                {item.after ? ` ${item.after}` : ''}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── PROGRESSION LINK ── */}
      <Link
        to="/progression"
        className="flex items-center justify-between bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500 text-white shadow-md shadow-black/10">
            <BarChart2 size={17} />
          </div>
          <div>
            <p className="font-bold text-sm">Ma progression</p>
            <p className="text-xs text-muted-foreground">
              Série {progress.streak} j · {Object.values(progress.flashcards).filter(c => c.repetitions >= 3).length} cartes maîtrisées
            </p>
          </div>
        </div>
        <ArrowRight size={15} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </Link>
    </div>
  )
}
