import type { KanaCharacter } from '@/types/kana'
import { HIRAGANA_ROWS } from './hiragana.ts' // extension .ts : permet de lancer curriculum.check.ts avec Node

export interface Lesson {
  id: string
  title: string
  kind: 'lesson' | 'final'
  characters: KanaCharacter[]
}

export interface Unit {
  id: string
  title: string
  lessons: Lesson[]
}

// Le test final tire ce nombre de kana au hasard parmi les 46 (10 x 3 quiz = 30 questions).
export const FINAL_TEST_SIZE = 10

const rowChars = (rowIds: string[]) =>
  HIRAGANA_ROWS.filter(r => rowIds.includes(r.id)).flatMap(r => r.characters)

// Une leçon par ligne du tableau. W et ん sont réunis (2 + 1 kana : trop peu pour une leçon seule).
const LESSON_DEFS = [
  { id: 'hira-1', title: 'Les voyelles', rows: ['vowels'] },
  { id: 'hira-2', title: 'Ligne K', rows: ['k-row'] },
  { id: 'hira-3', title: 'Ligne S', rows: ['s-row'] },
  { id: 'hira-4', title: 'Ligne T', rows: ['t-row'] },
  { id: 'hira-5', title: 'Ligne N', rows: ['n-row'] },
  { id: 'hira-6', title: 'Ligne H', rows: ['h-row'] },
  { id: 'hira-7', title: 'Ligne M', rows: ['m-row'] },
  { id: 'hira-8', title: 'Ligne Y', rows: ['y-row'] },
  { id: 'hira-9', title: 'Ligne R', rows: ['r-row'] },
  { id: 'hira-10', title: 'Ligne W et ん', rows: ['w-row', 'n-standalone'] },
]

// Les 46 hiragana de base : réserve des mauvaises réponses proposées dans les QCM.
export const BASIC_HIRAGANA = HIRAGANA_ROWS.flatMap(r => r.characters)

export const HIRAGANA_UNIT: Unit = {
  id: 'hiragana',
  title: 'Hiragana',
  lessons: [
    ...LESSON_DEFS.map(d => ({
      id: d.id,
      title: d.title,
      kind: 'lesson' as const,
      characters: rowChars(d.rows),
    })),
    {
      id: 'hira-final',
      title: 'Test final',
      kind: 'final' as const,
      characters: BASIC_HIRAGANA,
    },
  ],
}

export const LESSON_IDS = HIRAGANA_UNIT.lessons.map(l => l.id)
