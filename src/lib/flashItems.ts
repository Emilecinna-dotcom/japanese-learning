import { ALL_HIRAGANA } from '@/data/hiragana'
import { ALL_KATAKANA } from '@/data/katakana'
import { KANJI_N5 } from '@/data/kanji-n5'
import { ALL_THEMES } from '@/data/vocabulary'
import type { SavedWord } from '@/types/progress'

export interface FlashItem {
  id: string
  front: string
  back: string
  reading?: string
  type: 'kana' | 'kanji' | 'vocab'
}

export const TYPE_LABELS: Record<FlashItem['type'], string> = {
  kana: 'Kana',
  kanji: 'Kanji',
  vocab: 'Vocabulaire',
}

export const TYPE_COLORS: Record<FlashItem['type'], string> = {
  kana:  'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  kanji: 'bg-amber-100  text-amber-700  dark:bg-amber-950/60  dark:text-amber-300',
  vocab: 'bg-teal-100   text-teal-700   dark:bg-teal-950/60   dark:text-teal-300',
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildAllFlashItems(): FlashItem[] {
  const items: FlashItem[] = []

  ALL_HIRAGANA.filter(k => !k.isDigraph).forEach(k => {
    items.push({ id: `hira-${k.id}`, front: k.kana, back: k.romaji, type: 'kana' })
  })
  ALL_KATAKANA.filter(k => !k.isDigraph).forEach(k => {
    items.push({ id: `kata-${k.id}`, front: k.kana, back: k.romaji, type: 'kana' })
  })
  KANJI_N5.forEach(k => {
    items.push({
      id: `kanji-${k.id}`,
      front: k.character,
      back: k.meaningFR.join(', '),
      reading: k.kunyomi[0] ?? k.onyomi[0],
      type: 'kanji',
    })
  })
  ALL_THEMES.forEach(theme => {
    theme.items.forEach(v => {
      items.push({
        id: `vocab-${v.id}`,
        front: v.japanese,
        back: v.frenchTranslation,
        reading: v.kana !== v.japanese ? v.kana : undefined,
        type: 'vocab',
      })
    })
  })

  return items
}

export const ALL_FLASH_ITEMS = buildAllFlashItems()

/** Mots mis de côté depuis la lecture, transformés en cartes (type vocab). */
export function savedWordsToItems(saved: Record<string, SavedWord>): FlashItem[] {
  return Object.entries(saved).map(([key, w]) => ({
    id: `saved-${key}`,
    front: w.front,
    back: w.back,
    reading: w.reading,
    type: 'vocab' as const,
  }))
}
