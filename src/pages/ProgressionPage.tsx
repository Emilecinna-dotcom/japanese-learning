import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import { GRAMMAR_POINTS } from '@/data/grammaire'
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

export function ProgressionPage() {
  const { progress } = useProgressContext()
  const { hiragana, katakana, kanji, vocabulary, grammar, streak, studyDates } = progress

  const hiraganaBase = ALL_HIRAGANA.slice(0, 46)
  const totalVocab = ALL_THEMES.reduce((sum, t) => sum + t.items.length, 0)
  const seenVocab = ALL_THEMES.reduce((sum, t) => sum + t.items.filter(i => !!vocabulary[i.id]?.seen).length, 0)
  const lastScore = hiragana.quizScores.at(-1)

  const totalLearned =
    hiragana.mastered.length +
    katakana.mastered.length +
    Object.keys(kanji).length +
    seenVocab +
    Object.keys(grammar).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progression <span className="font-jp">進歩</span></h1>
        <p className="text-muted-foreground mt-1">Ton avancement dans l'apprentissage du japonais</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Série', value: streak, unit: 'jours', icon: '🔥', color: 'text-orange-500' },
          { label: 'Total appris', value: totalLearned, unit: 'éléments', icon: '📚', color: 'text-blue-500' },
          { label: 'Hiragana', value: hiragana.mastered.length, unit: `/${hiraganaBase.length} maîtrisés`, icon: 'あ', color: 'text-primary' },
          { label: 'Dernier quiz', value: lastScore ? `${lastScore.score}/${lastScore.total}` : '—', unit: '', icon: '🎯', color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl mb-1 font-jp">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label} {stat.unit}</div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
        <h2 className="font-semibold text-base">Progression par module</h2>
        <ModuleProgress label="Hiragana — Maîtrisés" done={hiragana.mastered.length} total={hiraganaBase.length} />
        <ModuleProgress label="Katakana — Maîtrisés" done={katakana.mastered.length} total={ALL_KATAKANA.length} />
        <ModuleProgress label="Kanji N5 — Vus" done={Object.keys(kanji).length} total={KANJI_N5.length} colorClass="bg-orange-500" />
        <ModuleProgress label="Vocabulaire — Vus" done={seenVocab} total={totalVocab} colorClass="bg-blue-500" />
        <ModuleProgress label="Grammaire — Vus" done={Object.keys(grammar).length} total={GRAMMAR_POINTS.length} colorClass="bg-purple-500" />
      </div>
      <div className="bg-card border border-border rounded-2xl p-5">
        <HeatmapCalendar studyDates={studyDates} />
      </div>
      {hiragana.quizScores.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-base mb-3">Historique des quiz — Hiragana</h2>
          <div className="space-y-2">
            {hiragana.quizScores.slice(-5).reverse().map((score, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{new Date(score.date).toLocaleDateString('fr-FR')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(score.score / score.total) * 100}%` }} />
                  </div>
                  <span className="font-medium">{score.score}/{score.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
