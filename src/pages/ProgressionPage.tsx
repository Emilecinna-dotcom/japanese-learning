import { Download } from 'lucide-react'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { GRAMMAR_POINTS } from '@/data/grammaire'
import { VERBS } from '@/data/conjugaison'
import { COUNTERS } from '@/data/compteurs'
import { EXERCISES } from '@/data/particules'
import { useProgressContext } from '@/hooks/useProgress'

interface ModuleProgressProps {
  label: string
  done: number
  total: number
  colorClass?: string
}

function ModuleProgress({ label, done, total, colorClass = 'bg-primary' }: ModuleProgressProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{done}/{total}</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-0.5 text-right">{pct}%</p>
    </div>
  )
}

function HeatmapCalendar({ studyDates }: { studyDates: string[] }) {
  const dateSet = new Set(studyDates)
  const today = new Date()
  const weeks: string[][] = []
  for (let w = 11; w >= 0; w--) {
    const week: string[] = []
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today)
      date.setDate(date.getDate() - w * 7 - d)
      week.push(date.toISOString().split('T')[0])
    }
    weeks.push(week)
  }
  const todayStr = today.toISOString().split('T')[0]
  return (
    <div>
      <p className="text-sm font-medium mb-3">Activité des 12 dernières semaines</p>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map(date => (
              <div
                key={date}
                className={`w-3 h-3 rounded-sm transition-colors ${
                  dateSet.has(date) ? 'bg-primary' :
                  date === todayStr ? 'bg-muted-foreground/30 ring-1 ring-primary/50' : 'bg-muted'
                }`}
                title={date}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
        <div className="w-3 h-3 rounded-sm bg-muted" />
        <span>Non étudié</span>
        <div className="w-3 h-3 rounded-sm bg-primary ml-2" />
        <span>Étudié</span>
      </div>
    </div>
  )
}

function QuizHistory({ scores, label, color = 'bg-primary' }: { scores: { date: string; score: number; total: number }[]; label: string; color?: string }) {
  if (scores.length === 0) return null
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">{label}</h3>
      <div className="space-y-2">
        {scores.slice(-5).reverse().map((s, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground w-20 shrink-0">{new Date(s.date).toLocaleDateString('fr-FR')}</span>
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${(s.score / s.total) * 100}%` }} />
              </div>
              <span className="font-medium tabular-nums w-12 text-right">{s.score}/{s.total}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">{Math.round((s.score / s.total) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function exportProgress(progress: object) {
  const json = JSON.stringify(progress, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nihongo-progression-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ProgressionPage() {
  const { progress } = useProgressContext()
  const { hiragana, katakana, kanji, vocabulary, grammar, streak, studyDates } = progress

  const totalVocab = ALL_THEMES.reduce((sum, t) => sum + t.items.length, 0)
  const seenVocab = ALL_THEMES.reduce((sum, t) => sum + t.items.filter(i => !!vocabulary[i.id]?.seen).length, 0)

  const totalEcriture = ALL_HIRAGANA.length + ALL_KATAKANA.length
  const doneEcriture = Object.keys(progress.ecriture ?? {}).length

  const doneConjugaison = Object.keys(progress.conjugaison ?? {}).length
  const doneCompteurs = Object.keys(progress.compteurs ?? {}).length
  const particulesCorrect = progress.particules?.correct ?? 0

  const totalLearned =
    hiragana.mastered.length +
    katakana.mastered.length +
    Object.keys(kanji).length +
    seenVocab +
    Object.keys(grammar).length +
    doneEcriture +
    doneConjugaison +
    doneCompteurs

  const hasQuizHistory = hiragana.quizScores.length > 0 || katakana.quizScores.length > 0

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progression <span className="font-jp">進歩</span></h1>
          <p className="text-muted-foreground mt-1">Ton avancement dans l'apprentissage du japonais</p>
        </div>
        <button
          onClick={() => exportProgress(progress)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-sm font-medium transition-colors shrink-0"
          title="Exporter la progression en JSON"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Exporter</span>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Série actuelle', value: streak, unit: 'jours', icon: '🔥', color: 'text-orange-500' },
          { label: 'Total appris', value: totalLearned, unit: 'éléments', icon: '📚', color: 'text-blue-500' },
          { label: 'Écriture', value: doneEcriture, unit: `/${totalEcriture} maîtrisés`, icon: '✍️', color: 'text-emerald-600' },
          { label: 'Kanji N5', value: Object.keys(kanji).length, unit: `/${KANJI_N5.length} vus`, icon: '漢', color: 'text-orange-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl mb-1 font-jp">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label} {stat.unit}</div>
          </div>
        ))}
      </div>

      {/* Module progress */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
        <h2 className="font-semibold text-base">Progression par module</h2>
        <p className="text-xs text-muted-foreground -mt-2 font-medium uppercase tracking-wider">Écriture</p>
        <ModuleProgress label="Hiragana — Maîtrisés" done={hiragana.mastered.length} total={ALL_HIRAGANA.length} />
        <ModuleProgress label="Katakana — Maîtrisés" done={katakana.mastered.length} total={ALL_KATAKANA.length} />
        <ModuleProgress label="Écriture — Maîtrisés" done={doneEcriture} total={totalEcriture} colorClass="bg-emerald-500" />
        <p className="text-xs text-muted-foreground pt-1 font-medium uppercase tracking-wider">Langue</p>
        <ModuleProgress label="Kanji N5 — Vus" done={Object.keys(kanji).length} total={KANJI_N5.length} colorClass="bg-orange-500" />
        <ModuleProgress label="Vocabulaire — Vus" done={seenVocab} total={totalVocab} colorClass="bg-blue-500" />
        <ModuleProgress label="Grammaire — Vue" done={Object.keys(grammar).length} total={GRAMMAR_POINTS.length} colorClass="bg-purple-500" />
        <ModuleProgress label="Conjugaison — Verbes vus" done={doneConjugaison} total={VERBS.length} colorClass="bg-violet-500" />
        <ModuleProgress label="Compteurs — Vus" done={doneCompteurs} total={COUNTERS.length} colorClass="bg-pink-500" />
        <ModuleProgress label="Particules — Réponses correctes" done={particulesCorrect} total={EXERCISES.length} colorClass="bg-teal-500" />
      </div>

      {/* Heatmap */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <HeatmapCalendar studyDates={studyDates} />
      </div>

      {/* Quiz history */}
      {hasQuizHistory && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
          <h2 className="font-semibold text-base">Historique des quiz</h2>
          <QuizHistory scores={hiragana.quizScores} label="Hiragana" color="bg-primary" />
          <QuizHistory scores={katakana.quizScores} label="Katakana" color="bg-violet-500" />
        </div>
      )}
    </div>
  )
}
