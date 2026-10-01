import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Gamepad2, BookOpen, BarChart2, Sparkles, PenTool, Route as RouteIcon } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { useProgressContext } from '@/hooks/useProgress'
import { HIRAGANA_UNIT } from '@/data/curriculum'
import { PASS_PERCENT } from '@/lib/parcours'

// ── Phrase du jour ──────────────────────────────────────────────
const PHRASES = [
  { jp: '少しずつ上手になっています。', romaji: 'Sukoshi zutsu jōzu ni natte imasu.', fr: 'Tu progresses petit à petit.' },
  { jp: '継続は力なり。', romaji: 'Keizoku wa chikara nari.', fr: 'La persévérance, c\'est la force.' },
  { jp: '頑張ってください！', romaji: 'Ganbatte kudasai !', fr: 'Fais de ton mieux !' },
  { jp: 'できる！', romaji: 'Dekiru !', fr: 'Tu en es capable !' },
  { jp: '失敗しても大丈夫。', romaji: 'Shippai shite mo daijōbu.', fr: 'Ce n\'est pas grave de faire des erreurs.' },
  { jp: '一歩一歩進もう。', romaji: 'Ippo ippo susumō.', fr: 'Avançons pas à pas.' },
  { jp: '毎日練習しましょう。', romaji: 'Mainichi renshū shimashō.', fr: 'Pratiquons chaque jour.' },
  { jp: '自信を持って！', romaji: 'Jishin wo motte !', fr: 'Aie confiance en toi !' },
  { jp: '日本語は難しいけど面白い。', romaji: 'Nihongo wa muzukashii kedo omoshiroi.', fr: 'Le japonais est difficile mais passionnant.' },
  { jp: 'やればできる。', romaji: 'Yareba dekiru.', fr: 'Si tu fais l\'effort, tu y arrives.' },
  { jp: 'ゆっくりでいいです。', romaji: 'Yukkuri de ii desu.', fr: 'Prends ton temps, c\'est bien.' },
  { jp: '今日も一緒に勉強しましょう。', romaji: 'Kyō mo issho ni benkyō shimashō.', fr: 'Étudions ensemble aujourd\'hui encore.' },
  { jp: '一日一日が大切。', romaji: 'Ichinichi ichinichi ga taisetsu.', fr: 'Chaque journée compte.' },
  { jp: 'どんどん上手になっているよ。', romaji: 'Dondon jōzu ni natte iru yo.', fr: 'Tu t\'améliores de plus en plus.' },
]

const KANJI_DU_JOUR = [
  { char: '一', reading: 'ichi / hitotsu', meaning: 'un' },
  { char: '日', reading: 'nichi / hi',     meaning: 'jour, soleil' },
  { char: '山', reading: 'san / yama',     meaning: 'montagne' },
  { char: '川', reading: 'sen / kawa',     meaning: 'rivière' },
  { char: '人', reading: 'jin / hito',     meaning: 'personne' },
  { char: '水', reading: 'sui / mizu',     meaning: 'eau' },
  { char: '火', reading: 'ka / hi',        meaning: 'feu' },
  { char: '月', reading: 'getsu / tsuki',  meaning: 'lune, mois' },
  { char: '木', reading: 'moku / ki',      meaning: 'arbre' },
  { char: '金', reading: 'kin / kane',     meaning: 'or, argent' },
  { char: '土', reading: 'do / tsuchi',    meaning: 'terre, sol' },
  { char: '大', reading: 'dai / ōki',      meaning: 'grand' },
  { char: '小', reading: 'shō / chiisa',   meaning: 'petit' },
  { char: '本', reading: 'hon',            meaning: 'livre, origine' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)  return { jp: 'おはようございます', fr: 'Bonjour' }
  if (h >= 12 && h < 18) return { jp: 'こんにちは', fr: 'Bonne après-midi' }
  return { jp: 'こんばんは', fr: 'Bonsoir' }
}

// ── Barre de progression mini ────────────────────────────────────
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function HomePage() {
  const { progress, getTodayDueCount } = useProgressContext()
  const dueCount = getTodayDueCount()
  // Première leçon du parcours pas encore validée (undefined = unité terminée)
  const nextLesson = HIRAGANA_UNIT.lessons.find(l => (progress.parcours[l.id]?.best ?? 0) < PASS_PERCENT)
  const lessonsDone = HIRAGANA_UNIT.lessons.filter(l => (progress.parcours[l.id]?.best ?? 0) >= PASS_PERCENT).length

  const hiraganaBase = ALL_HIRAGANA.slice(0, 46)
  const totalVocab = ALL_THEMES.reduce((s, t) => s + t.items.length, 0)
  const seenVocab  = ALL_THEMES.reduce((s, t) => s + t.items.filter(i => !!progress.vocabulary[i.id]?.seen).length, 0)

  const hiraStats = { done: progress.hiragana.mastered.length, total: hiraganaBase.length }
  const kataStats = { done: progress.katakana.mastered.length, total: ALL_KATAKANA.length }
  const hiraPct   = hiraStats.total > 0 ? Math.round((hiraStats.done / hiraStats.total) * 100) : 0
  const kataPct   = kataStats.total > 0 ? Math.round((kataStats.done / kataStats.total) * 100) : 0
  const kanjiPct  = KANJI_N5.length > 0 ? Math.round((Object.keys(progress.kanji).length / KANJI_N5.length) * 100) : 0
  const vocabPct  = totalVocab > 0 ? Math.round((seenVocab / totalVocab) * 100) : 0

  const overallPct = Math.round((hiraPct + kataPct + kanjiPct + vocabPct) / 4)

  const isNew = overallPct === 0
  const greeting = getGreeting()
  const dayIdx  = Math.floor(Date.now() / 86400000)
  const phrase  = PHRASES[dayIdx % PHRASES.length]
  const kanji   = KANJI_DU_JOUR[dayIdx % KANJI_DU_JOUR.length]

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative -mx-4 -mt-4 md:-mx-6 md:-mt-6 overflow-hidden mb-8" style={{ minHeight: '42dvh' }}>
        <img
          src="/images/hero-tokyo.jpg"
          alt="Tokyo"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.72) 100%)' }} />

        {/* Watermarks kanji */}
        <span className="absolute right-4 top-4 font-jp-serif text-[110px] leading-none text-white/6 select-none pointer-events-none" aria-hidden>語</span>
        <span className="absolute left-3 bottom-20 font-jp-serif text-[52px] leading-none text-white/6 select-none pointer-events-none" aria-hidden>日</span>

        <div className="relative z-10 flex flex-col justify-end h-full px-5 md:px-7 pb-7 pt-16" style={{ minHeight: '42dvh' }}>
          {/* Greeting */}
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-7 bg-white/35" />
            <p className="font-jp text-white/70 text-[11px] tracking-[0.28em] uppercase">{greeting.jp}</p>
          </div>
          <h1 className="font-display text-[3.25rem] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-3">
            {greeting.fr}.
          </h1>
          <p className="text-white/60 text-sm leading-snug mb-5 max-w-[22rem]">
            {isNew
              ? 'Commence par les hiragana — la fondation de tout le japonais.'
              : overallPct < 40
              ? 'Tu construis de bonnes bases. Chaque session compte.'
              : overallPct < 75
              ? 'Tu progresses bien. Continue sur ta lancée.'
              : 'Tu maîtrises déjà beaucoup. Les flashcards vont consolider ça.'}
          </p>

          {/* Ligne stats + CTA */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {progress.streak > 0 && (
              <span className="flex items-center gap-1.5 bg-white/12 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
                <Flame size={12} className="text-amber-300" />
                {progress.streak} j de suite
              </span>
            )}
            {!isNew && (
              <span className="bg-white/10 backdrop-blur-sm border border-white/12 rounded-full px-3 py-1.5 text-xs font-medium text-white/80">
                {overallPct} % du parcours
              </span>
            )}
            <Link
              to="/session"
              className="ml-auto flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'oklch(0.51 0.205 28)', boxShadow: '0 4px 20px oklch(0.51 0.205 28 / 0.55)' }}
            >
              {isNew ? 'Commencer' : 'Continuer'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <div className="space-y-8">

        {/* ── SESSION DU JOUR ─────────────────────────────────────── */}
        <Link
          to="/session"
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl p-5 border border-primary/25 bg-primary/[0.06] hover:bg-primary/[0.1] transition-colors"
        >
          <span className="absolute -right-3 -top-5 font-jp-serif font-black text-[120px] leading-none text-primary/[0.07] select-none pointer-events-none" aria-hidden>今</span>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
            <Sparkles size={22} className="text-primary-foreground" />
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70 mb-0.5">Ton rendez-vous quotidien</p>
            <p className="text-lg font-bold text-foreground leading-tight">Session du jour</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {dueCount > 0
                ? `${dueCount} révision${dueCount > 1 ? 's' : ''} + nouveautés, en quelques minutes`
                : 'Découvre de nouvelles cartes et entretiens ta série'}
            </p>
          </div>
          {progress.streak > 0 && (
            <span className="relative z-10 hidden sm:flex items-center gap-1.5 bg-background/70 border border-border rounded-full px-3 py-1.5 text-xs font-semibold text-foreground shrink-0">
              <Flame size={13} className="text-amber-500" />
              {progress.streak} j
            </span>
          )}
          <ArrowRight size={18} className="relative z-10 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        {/* ── PARCOURS ────────────────────────────────────────────── */}
        <Link
          to="/parcours"
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl p-5 border border-border bg-card hover:bg-muted/50 transition-colors -mt-4"
        >
          <span className="absolute -right-3 -top-5 font-jp-serif font-black text-[120px] leading-none text-foreground/[0.05] select-none pointer-events-none" aria-hidden>道</span>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <RouteIcon size={22} className="text-primary" />
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-0.5">Unité 1 · Hiragana</p>
            <p className="text-lg font-bold text-foreground leading-tight">Parcours</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {nextLesson
                ? `${lessonsDone === 0 ? 'Première leçon' : 'Prochaine leçon'} : ${nextLesson.title}`
                : 'Unité terminée, tous les hiragana sont validés'}
            </p>
          </div>
          <span className="relative z-10 hidden sm:inline text-xs font-semibold tabular-nums text-muted-foreground shrink-0">
            {lessonsDone} / {HIRAGANA_UNIT.lessons.length}
          </span>
          <ArrowRight size={18} className="relative z-10 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        {/* ── PHRASE DU JOUR ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 pt-4 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Phrase du jour</span>
            <span className="text-[10px] text-muted-foreground">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="px-5 pb-5 pt-3 space-y-2">
            <p className="font-jp text-2xl leading-snug text-foreground">{phrase.jp}</p>
            <p className="text-xs font-mono text-muted-foreground">{phrase.romaji}</p>
            <p className="text-sm font-medium text-foreground/75 pt-1 border-t border-border">{phrase.fr}</p>
          </div>
        </div>

        {/* ── 4 GRANDES ENTRÉES ───────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Explorer</h2>

          {/* Kana — pleine largeur */}
          <Link
            to="/hiragana"
            className="group relative flex flex-col justify-end overflow-hidden rounded-2xl p-5"
            style={{ minHeight: '140px', background: 'linear-gradient(135deg, oklch(0.38 0.17 25 / 0.9), oklch(0.28 0.14 25 / 0.95))' }}
          >
            <span className="absolute right-3 top-0 font-jp-serif font-black text-[130px] leading-none text-white/10 select-none pointer-events-none transition-transform duration-500 group-hover:scale-105" aria-hidden>あ</span>
            <span className="absolute right-20 top-4 font-jp-serif font-black text-[70px] leading-none text-white/6 select-none pointer-events-none" aria-hidden>ア</span>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Écriture · 書き方</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-white leading-tight">Hiragana & Katakana</p>
                  <p className="text-white/60 text-sm mt-0.5">92 kana · la fondation du japonais</p>
                </div>
                <ArrowRight size={18} className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mb-0.5" />
              </div>
              {(hiraPct > 0 || kataPct > 0) && (
                <div className="mt-3 h-1 rounded-full overflow-hidden bg-white/15">
                  <div className="h-full bg-white/60 rounded-full transition-all duration-700" style={{ width: `${Math.round((hiraPct + kataPct) / 2)}%` }} />
                </div>
              )}
            </div>
          </Link>

          {/* Kanji + Vocab — 2 demi-colonnes */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/kanji"
              className="group relative flex flex-col justify-end overflow-hidden rounded-2xl p-4"
              style={{ minHeight: '130px', background: 'linear-gradient(135deg, oklch(0.42 0.15 65 / 0.85), oklch(0.32 0.12 65 / 0.92))' }}
            >
              <span className="absolute right-1 top-0 font-jp-serif font-black text-[100px] leading-none text-white/10 select-none pointer-events-none" aria-hidden>漢</span>
              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1">N5 · N4</p>
                <p className="text-base font-bold text-white leading-tight">Kanji</p>
                <p className="text-white/55 text-xs mt-0.5">103 caractères</p>
                {kanjiPct > 0 && (
                  <div className="mt-2 h-1 rounded-full overflow-hidden bg-white/15">
                    <div className="h-full bg-white/55 rounded-full" style={{ width: `${kanjiPct}%` }} />
                  </div>
                )}
              </div>
            </Link>

            <Link
              to="/vocabulaire"
              className="group relative flex flex-col justify-end overflow-hidden rounded-2xl p-4"
              style={{ minHeight: '130px', background: 'linear-gradient(135deg, oklch(0.42 0.14 180 / 0.85), oklch(0.30 0.12 180 / 0.92))' }}
            >
              <span className="absolute right-1 top-0 font-jp-serif font-black text-[100px] leading-none text-white/10 select-none pointer-events-none" aria-hidden>語</span>
              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1">8 thèmes</p>
                <p className="text-base font-bold text-white leading-tight">Vocabulaire</p>
                <p className="text-white/55 text-xs mt-0.5">{totalVocab} mots</p>
                {vocabPct > 0 && (
                  <div className="mt-2 h-1 rounded-full overflow-hidden bg-white/15">
                    <div className="h-full bg-white/55 rounded-full" style={{ width: `${vocabPct}%` }} />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Jeux — pleine largeur */}
          <Link
            to="/jeux"
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, oklch(0.35 0.13 160 / 0.85), oklch(0.28 0.11 160 / 0.92))' }}
          >
            <span className="absolute right-3 top-1 font-jp-serif font-black text-[110px] leading-none text-white/8 select-none pointer-events-none" aria-hidden>遊</span>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-white/12 flex items-center justify-center shrink-0">
              <Gamepad2 size={22} className="text-white" />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-0.5">Pratique ludique</p>
              <p className="text-base font-bold text-white">Jeux</p>
              <p className="text-white/55 text-xs">Mémoire · Blitz · Pluie de kana · Ordre des mots</p>
            </div>
            <ArrowRight size={16} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          {/* Production — pleine largeur */}
          <Link
            to="/production"
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, oklch(0.36 0.13 285 / 0.88), oklch(0.28 0.11 285 / 0.94))' }}
          >
            <span className="absolute right-3 top-1 font-jp-serif font-black text-[110px] leading-none text-white/8 select-none pointer-events-none" aria-hidden>産</span>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-white/12 flex items-center justify-center shrink-0">
              <PenTool size={22} className="text-white" />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-0.5">Du français au japonais</p>
              <p className="text-base font-bold text-white">Production</p>
              <p className="text-white/55 text-xs">Écris la lecture · Tape en kana · Compose une phrase</p>
            </div>
            <ArrowRight size={16} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </section>

        {/* ── KANJI DU JOUR ───────────────────────────────────────── */}
        <Link
          to="/kanji"
          className="group flex items-center gap-5 bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all"
        >
          <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-primary/6 border border-primary/15 rounded-xl group-hover:bg-primary/10 transition-colors">
            <span className="font-jp-serif text-4xl font-bold text-primary leading-none">{kanji.char}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Kanji du jour</p>
            <p className="font-bold text-lg leading-tight">{kanji.meaning}</p>
            <p className="text-sm text-muted-foreground mt-0.5 font-jp">{kanji.reading}</p>
          </div>
          <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* ── MINI PROGRESSION ────────────────────────────────────── */}
        <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Ma progression</h2>
            <Link to="/progression" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <BarChart2 size={12} />
              Tout voir
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Hiragana', kana: 'ひ', pct: hiraPct, done: hiraStats.done, total: hiraStats.total, color: 'bg-primary' },
              { label: 'Katakana', kana: 'カ', pct: kataPct, done: kataStats.done, total: kataStats.total, color: 'bg-amber-500' },
              { label: 'Kanji N5', kana: '漢', pct: kanjiPct, done: Object.keys(progress.kanji).length, total: KANJI_N5.length, color: 'bg-teal-500' },
            ].map(row => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-jp text-xs text-muted-foreground w-4 text-center">{row.kana}</span>
                    <span className="text-xs font-medium text-foreground">{row.label}</span>
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{row.done}/{row.total}</span>
                </div>
                <MiniBar pct={row.pct} color={row.color} />
              </div>
            ))}
          </div>

          {dueCount > 0 && (
            <Link
              to="/flashcards"
              className="flex items-center justify-between w-full mt-1 px-4 py-3 rounded-xl bg-primary/8 border border-primary/20 hover:bg-primary/12 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{dueCount} carte{dueCount > 1 ? 's' : ''} à réviser</span>
              </div>
              <ArrowRight size={13} className="text-primary" />
            </Link>
          )}
        </section>

      </div>
    </div>
  )
}
