import { useState, useMemo, useCallback } from 'react'
import { PenLine, ChevronLeft, Check, Sparkles, ArrowRight, Gift, RotateCcw } from 'lucide-react'
import { SystemeEcritureInfo, ECRITURE_INFO } from '@/components/SystemeEcritureInfo'
import { StrokeCalligraphy } from '@/components/drawing/StrokeCalligraphy'
import { SpeakButton } from '@/components/SpeakButton'
import { HIRAGANA_ROWS } from '@/data/hiragana'
import { KATAKANA_ROWS } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { KANJI_N4 } from '@/data/kanji-n4'
import { useProgressContext } from '@/hooks/useProgress'
import { cn } from '@/lib/utils'
import type { KanaCharacter } from '@/types/kana'

type Script = 'hiragana' | 'katakana' | 'kanji'
type KanjiLevel = 'N5' | 'N4'

interface Step {
  glyph: string
  mode: 'guide' | 'memo'
  banner: string
  recordType?: 'kana' | 'kanji'
  save?: { front: string; back: string }
}

// Mot bonus par ligne (cumulatif : n'utilise que des kana déjà appris)
const HIRA_WORDS: Record<string, { w: string; m: string }> = {
  vowels: { w: 'いえ', m: 'maison' },
  'k-row': { w: 'かお', m: 'visage' },
  's-row': { w: 'すし', m: 'sushi' },
  't-row': { w: 'そと', m: 'dehors' },
  'n-row': { w: 'ねこ', m: 'chat' },
  'h-row': { w: 'はな', m: 'fleur' },
  'm-row': { w: 'みみ', m: 'oreille' },
  'y-row': { w: 'ゆき', m: 'neige' },
  'r-row': { w: 'さくら', m: 'cerisier' },
  'w-row': { w: 'かわ', m: 'rivière' },
}
const KATA_WORDS: Record<string, { w: string; m: string }> = {
  'k-row': { w: 'ココア', m: 'cacao' },
  's-row': { w: 'スイカ', m: 'pastèque' },
  'm-row': { w: 'マメ', m: 'haricot' },
  'r-row': { w: 'カメラ', m: 'caméra' },
}

interface Lot { id: string; label: string; chars: KanaCharacter[]; word?: { w: string; m: string } }

function buildLots(script: 'hiragana' | 'katakana'): Lot[] {
  const rows = script === 'hiragana' ? HIRAGANA_ROWS : KATAKANA_ROWS
  const words = script === 'hiragana' ? HIRA_WORDS : KATA_WORDS
  return rows
    .map(r => ({ id: r.id, label: r.label, chars: r.characters.filter(c => !c.isDigraph), word: words[r.id] }))
    .filter(l => l.chars.length > 0)
}

// Index glyphe → lecture/sens, pour la révision
const ALL_KANA = [...HIRAGANA_ROWS, ...KATAKANA_ROWS].flatMap(r => r.characters)
const GLYPH_INFO = new Map<string, { reading: string; sub: string; type: 'kana' | 'kanji' }>()
ALL_KANA.forEach(c => GLYPH_INFO.set(c.kana, { reading: c.romaji, sub: c.frenchPhonetic, type: 'kana' }))
;[...KANJI_N5, ...KANJI_N4].forEach(k => GLYPH_INFO.set(k.character, {
  reading: [k.onyomi[0], k.kunyomi[0]].filter(Boolean).join(' ・ '),
  sub: k.meaningFR.join(', '),
  type: 'kanji',
}))

// ── Runner : déroule une suite d'étapes ───────────────────────────
function Runner({ steps, title, onExit }: { steps: Step[]; title: string; onExit: () => void }) {
  const { recordWriting, saveWord } = useProgressContext()
  const [idx, setIdx] = useState(0)
  const [savedWord, setSavedWord] = useState(false)

  const step = steps[idx]

  const onComplete = useCallback((mistakes: number) => {
    if (step.recordType) recordWriting(step.glyph, step.recordType, mistakes)
    if (step.save) { saveWord(step.save.front, { front: step.save.front, back: step.save.back }); setSavedWord(true) }
    setTimeout(() => setIdx(i => i + 1), 1000)
  }, [step, recordWriting, saveWord])

  if (idx >= steps.length) {
    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto">
          <Check size={34} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Lot terminé !</h2>
          <p className="text-muted-foreground mt-1">Ces caractères reviendront en révision dans quelques jours.</p>
        </div>
        {savedWord && (
          <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
            <Gift size={14} className="text-primary" /> Le mot bonus a été ajouté à ton carnet « Mes mots ».
          </p>
        )}
        <button onClick={onExit} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          Continuer
        </button>
      </div>
    )
  }

  const isWord = !!step.save || step.banner.startsWith('Mot')
  return (
    <div className="max-w-md mx-auto py-2 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={20} /></button>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">{idx + 1} / {steps.length}</span>
        <div className="w-5" />
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(idx / steps.length) * 100}%` }} />
      </div>

      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-0.5">{title}</p>
        <p className={cn('font-medium', isWord ? 'text-base' : 'text-sm text-muted-foreground')}>{step.banner}</p>
        <div className="flex justify-center mt-1"><SpeakButton text={step.glyph} size="sm" /></div>
      </div>

      <StrokeCalligraphy key={`${step.glyph}-${idx}`} character={step.glyph} mode={step.mode} onComplete={onComplete} />
    </div>
  )
}

export function EcriturePage() {
  const { progress, getDueWritingCount } = useProgressContext()
  const [script, setScript] = useState<Script>('hiragana')
  const [kanjiLevel, setKanjiLevel] = useState<KanjiLevel>('N5')
  const [lesson, setLesson] = useState<{ steps: Step[]; title: string } | null>(null)

  const mastered = (glyph: string) => !!progress.ecriture?.[glyph]
  const dueWriting = getDueWritingCount()

  // Construit la révision (caractères dus)
  const startReview = () => {
    const now = new Date()
    const dueGlyphs = Object.entries(progress.ecritureSrs ?? {})
      .filter(([, c]) => new Date(c.dueDate) <= now)
      .map(([g]) => g)
    const steps: Step[] = dueGlyphs.map(g => {
      const info = GLYPH_INFO.get(g)
      return { glyph: g, mode: 'memo' as const, banner: info ? `De mémoire : ${info.reading}` : 'De mémoire', recordType: info?.type ?? 'kana' }
    })
    if (steps.length) setLesson({ steps, title: 'Révision' })
  }

  const startKanaLot = (lot: Lot) => {
    const steps: Step[] = []
    lot.chars.forEach(c => steps.push({ glyph: c.kana, mode: 'guide', banner: `Apprends ${c.kana} — ${c.romaji}` }))
    lot.chars.forEach(c => steps.push({ glyph: c.kana, mode: 'memo', banner: `De mémoire : ${c.romaji}`, recordType: 'kana' }))
    if (lot.word) {
      const arr = [...lot.word.w]
      arr.forEach((ch, i) => steps.push({
        glyph: ch, mode: 'guide',
        banner: `Mot bonus — ${lot.word!.w} (${lot.word!.m})`,
        save: i === arr.length - 1 ? { front: lot.word!.w, back: lot.word!.m } : undefined,
      }))
    }
    setLesson({ steps, title: lot.label })
  }

  const startKanji = (glyph: string, reading: string) => {
    setLesson({
      steps: [
        { glyph, mode: 'guide', banner: `Apprends ${glyph}` },
        { glyph, mode: 'memo', banner: `De mémoire : ${reading}`, recordType: 'kanji' },
      ],
      title: 'Kanji',
    })
  }

  const lots = useMemo(() => (script === 'kanji' ? [] : buildLots(script)), [script])
  const kanjiList = kanjiLevel === 'N5' ? KANJI_N5 : KANJI_N4

  if (lesson) return <Runner steps={lesson.steps} title={lesson.title} onExit={() => setLesson(null)} />

  return (
    <div className="max-w-lg mx-auto py-2 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <PenLine size={20} className="text-primary" /> Écriture <span className="font-jp text-lg text-muted-foreground">書き練習</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Apprends à tracer, lot par lot. Chaque lot débloque un mot, et tout revient en révision.</p>
      </div>

      <SystemeEcritureInfo {...ECRITURE_INFO} />

      {/* Révision due */}
      {dueWriting > 0 && (
        <button onClick={startReview} className="w-full flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/[0.06] hover:bg-primary/[0.1] p-4 transition-colors text-left">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <RotateCcw size={18} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">Révision d'écriture</p>
            <p className="text-xs text-muted-foreground">{dueWriting} caractère{dueWriting > 1 ? 's' : ''} à réécrire de mémoire</p>
          </div>
          <ArrowRight size={16} className="text-primary shrink-0" />
        </button>
      )}

      {/* Système */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl">
        {([['hiragana', 'Hiragana', 'あ'], ['katakana', 'Katakana', 'ア'], ['kanji', 'Kanji', '字']] as [Script, string, string][]).map(([s, label, glyph]) => (
          <button key={s} onClick={() => setScript(s)}
            className={cn('flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              script === s ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
            <span className="font-jp">{glyph}</span> {label}
          </button>
        ))}
      </div>

      {/* Parcours kana — lots */}
      {script !== 'kanji' && (
        <div className="space-y-3">
          {lots.map(lot => {
            const done = lot.chars.filter(c => mastered(c.kana)).length
            const complete = done === lot.chars.length
            return (
              <button key={lot.id} onClick={() => startKanaLot(lot)}
                className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/40 transition-all group">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-semibold text-sm flex items-center gap-2">
                    {lot.label}
                    {complete && <Check size={14} className="text-emerald-500" />}
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums">{done}/{lot.chars.length}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {lot.chars.map(c => (
                      <span key={c.id} className={cn('font-jp text-xl w-8 h-8 flex items-center justify-center rounded-lg',
                        mastered(c.kana) ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-foreground')}>
                        {c.kana}
                      </span>
                    ))}
                  </div>
                  {lot.word && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <Gift size={11} /> {lot.word.w}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Kanji — grille par niveau */}
      {script === 'kanji' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 p-1 bg-muted rounded-xl">
              {(['N5', 'N4'] as KanjiLevel[]).map(lv => (
                <button key={lv} onClick={() => setKanjiLevel(lv)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all',
                    kanjiLevel === lv ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                  {lv}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {kanjiList.filter(k => mastered(k.character)).length}/{kanjiList.length} appris
            </p>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {kanjiList.map(k => (
              <button key={k.id} title={k.meaningFR.join(', ')}
                onClick={() => startKanji(k.character, [k.onyomi[0], k.kunyomi[0]].filter(Boolean).join(' ・ '))}
                className={cn('aspect-square rounded-lg flex items-center justify-center font-jp text-lg transition-all relative',
                  mastered(k.character) ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/50' : 'bg-muted hover:bg-muted/70 text-foreground')}>
                {k.character}
                {mastered(k.character) && <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <Sparkles size={12} className="text-primary" /> Termine un lot pour débloquer son mot et l'ajouter à tes révisions.
      </p>
    </div>
  )
}
