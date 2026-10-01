import { useEffect, useRef, useState } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { KANJI_N4 } from '@/data/kanji-n4'
import { ALL_THEMES } from '@/data/vocabulary'
import { GRAMMAR_POINTS } from '@/data/grammaire'
import { KEIGO_VERBS } from '@/data/keigo'
import { ONOMATOPEES } from '@/data/onomatopees'

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Auto-focus + reset on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const q = query.trim().toLowerCase()

  // ── Search logic ──────────────────────────────────────────────
  const hiraganaResults = q
    ? ALL_HIRAGANA.filter(
        c =>
          c.kana.includes(q) ||
          c.romaji.toLowerCase().includes(q) ||
          (c.frenchPhonetic ?? '').toLowerCase().includes(q)
      )
    : []

  const katakanaResults = q
    ? ALL_KATAKANA.filter(
        c =>
          c.kana.includes(q) ||
          c.romaji.toLowerCase().includes(q) ||
          (c.frenchPhonetic ?? '').toLowerCase().includes(q)
      )
    : []

  const kanjiResults = q
    ? [...KANJI_N5, ...KANJI_N4].filter(
        k =>
          k.character.includes(q) ||
          k.onyomi.some(r => r.toLowerCase().includes(q)) ||
          k.kunyomi.some(r => r.toLowerCase().includes(q)) ||
          k.meaningFR.some(m => m.toLowerCase().includes(q))
      )
    : []

  const vocabItems = ALL_THEMES.flatMap(t =>
    t.items.map(item => ({ ...item, themeLabelFR: t.labelFR }))
  )
  const vocabResults = q
    ? vocabItems.filter(
        v =>
          v.japanese.includes(q) ||
          v.kana.includes(q) ||
          v.romaji.toLowerCase().includes(q) ||
          v.frenchTranslation.toLowerCase().includes(q) ||
          v.themeLabelFR.toLowerCase().includes(q)
      )
    : []

  const grammarResults = q
    ? GRAMMAR_POINTS.filter(
        g =>
          g.titleFR.toLowerCase().includes(q) ||
          g.titleJP.includes(q) ||
          g.structure.toLowerCase().includes(q) ||
          g.shortExplanationFR.toLowerCase().includes(q)
      )
    : []

  const keigoResults = q
    ? KEIGO_VERBS.filter(
        k =>
          k.plain.includes(q) ||
          k.polite.includes(q) ||
          (k.honorific ?? '').includes(q) ||
          (k.humble ?? '').includes(q) ||
          k.meaningFR.toLowerCase().includes(q)
      )
    : []

  const onomatopeeResults = q
    ? ONOMATOPEES.filter(
        o =>
          o.expression.includes(q) ||
          o.reading.includes(q) ||
          o.meaning.toLowerCase().includes(q)
      )
    : []

  const MAX = 3

  const navigate_and_close = (path: string) => {
    navigate(path)
    onClose()
  }

  const hasResults =
    hiraganaResults.length > 0 ||
    katakanaResults.length > 0 ||
    kanjiResults.length > 0 ||
    vocabResults.length > 0 ||
    grammarResults.length > 0 ||
    keigoResults.length > 0 ||
    onomatopeeResults.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-xl bg-card rounded-2xl shadow-2xl overflow-hidden"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher hiragana, kanji, vocabulaire…"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Effacer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors ml-1"
            aria-label="Fermer"
          >
            <kbd className="text-xs font-mono border border-border rounded px-1.5 py-0.5 text-muted-foreground">
              Esc
            </kbd>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Default state — popular modules */}
          {!q && (
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Modules populaires
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Hiragana', sub: '46 caractères de base', path: '/hiragana', jp: 'あ' },
                  { label: 'Katakana', sub: '46 caractères', path: '/katakana', jp: 'ア' },
                  { label: 'Kanji N5·N4', sub: '160 kanji', path: '/kanji', jp: '日' },
                  { label: 'Vocabulaire', sub: '14 thèmes', path: '/vocabulaire', jp: '語' },
                  { label: 'Grammaire', sub: 'Points clés N5', path: '/grammaire', jp: '文' },
                  { label: 'Flashcards', sub: 'Révision active', path: '/flashcards', jp: '🃏' },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => navigate_and_close(item.path)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-left group"
                  >
                    <span className="font-jp text-2xl w-8 text-center">{item.jp}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {q && !hasResults && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Aucun résultat pour «&nbsp;<span className="text-foreground">{query}</span>&nbsp;»
            </div>
          )}

          {q && hasResults && (
            <div className="divide-y divide-border">
              {/* Hiragana */}
              {hiraganaResults.length > 0 && (
                <ResultSection
                  title="Hiragana"
                  total={hiraganaResults.length}
                  onSeeAll={() => navigate_and_close('/hiragana')}
                >
                  {hiraganaResults.slice(0, MAX).map(c => (
                    <ResultRow
                      key={c.id}
                      character={c.kana}
                      reading={c.romaji}
                      meaning={c.frenchPhonetic ?? ''}
                      badge="Hiragana"
                      badgeClass="bg-pink-500/10 text-pink-600 dark:text-pink-400"
                      onClick={() => navigate_and_close('/hiragana')}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Katakana */}
              {katakanaResults.length > 0 && (
                <ResultSection
                  title="Katakana"
                  total={katakanaResults.length}
                  onSeeAll={() => navigate_and_close('/katakana')}
                >
                  {katakanaResults.slice(0, MAX).map(c => (
                    <ResultRow
                      key={c.id}
                      character={c.kana}
                      reading={c.romaji}
                      meaning={c.frenchPhonetic ?? ''}
                      badge="Katakana"
                      badgeClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      onClick={() => navigate_and_close('/katakana')}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Kanji */}
              {kanjiResults.length > 0 && (
                <ResultSection
                  title="Kanji"
                  total={kanjiResults.length}
                  onSeeAll={() => navigate_and_close('/kanji')}
                >
                  {kanjiResults.slice(0, MAX).map(k => (
                    <ResultRow
                      key={k.id}
                      character={k.character}
                      reading={[...k.onyomi, ...k.kunyomi].join('・')}
                      meaning={k.meaningFR.join(', ')}
                      badge="Kanji"
                      badgeClass="bg-red-500/10 text-red-600 dark:text-red-400"
                      onClick={() => navigate_and_close('/kanji')}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Vocabulaire */}
              {vocabResults.length > 0 && (
                <ResultSection
                  title="Vocabulaire"
                  total={vocabResults.length}
                  onSeeAll={() => navigate_and_close('/vocabulaire')}
                >
                  {vocabResults.slice(0, MAX).map(v => (
                    <ResultRow
                      key={v.id}
                      character={v.japanese}
                      reading={v.kana !== v.japanese ? v.kana : v.romaji}
                      meaning={v.frenchTranslation}
                      badge={v.themeLabelFR}
                      badgeClass="bg-green-500/10 text-green-600 dark:text-green-400"
                      onClick={() => navigate_and_close('/vocabulaire')}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Grammaire */}
              {grammarResults.length > 0 && (
                <ResultSection
                  title="Grammaire"
                  total={grammarResults.length}
                  onSeeAll={() => navigate_and_close('/grammaire')}
                >
                  {grammarResults.slice(0, MAX).map(g => (
                    <ResultRow
                      key={g.id}
                      character={g.titleJP}
                      reading={g.structure}
                      meaning={g.shortExplanationFR}
                      badge="Grammaire"
                      badgeClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      onClick={() => navigate_and_close('/grammaire')}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Keigo */}
              {keigoResults.length > 0 && (
                <ResultSection
                  title="Keigo"
                  total={keigoResults.length}
                  onSeeAll={() => navigate_and_close('/keigo')}
                >
                  {keigoResults.slice(0, MAX).map(k => (
                    <ResultRow
                      key={k.id}
                      character={k.honorific ?? k.humble ?? k.polite}
                      reading={k.plain}
                      meaning={k.meaningFR}
                      badge="敬語"
                      badgeClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      onClick={() => navigate_and_close('/keigo')}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Onomatopées */}
              {onomatopeeResults.length > 0 && (
                <ResultSection
                  title="Onomatopées"
                  total={onomatopeeResults.length}
                  onSeeAll={() => navigate_and_close('/onomatopees')}
                >
                  {onomatopeeResults.slice(0, MAX).map(o => (
                    <ResultRow
                      key={o.id}
                      character={o.expression}
                      reading={o.reading}
                      meaning={o.meaning}
                      badge={o.type}
                      badgeClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
                      onClick={() => navigate_and_close('/onomatopees')}
                    />
                  ))}
                </ResultSection>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function ResultSection({
  title,
  total,
  onSeeAll,
  children,
}: {
  title: string
  total: number
  onSeeAll: () => void
  children: React.ReactNode
}) {
  const MAX = 3
  return (
    <div className="p-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
      {total > MAX && (
        <button
          onClick={onSeeAll}
          className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline px-1"
        >
          Voir tous les {total} résultats
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

function ResultRow({
  character,
  reading,
  meaning,
  badge,
  badgeClass,
  onClick,
}: {
  character: string
  reading: string
  meaning: string
  badge: string
  badgeClass: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left group"
    >
      <span className="font-jp text-xl w-10 text-center shrink-0 text-foreground">
        {character}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{reading}</p>
        <p className="text-xs text-muted-foreground truncate">{meaning}</p>
      </div>
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badgeClass}`}
      >
        {badge}
      </span>
    </button>
  )
}
