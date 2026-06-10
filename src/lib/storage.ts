import type { ProgressState } from '@/types/progress'

const STORAGE_KEY = 'nihon-app-v1'
const SCHEMA_VERSION = 1

export function defaultProgress(): ProgressState {
  return {
    version: SCHEMA_VERSION,
    lastStudied: null,
    streak: 0,
    studyDates: [],
    hiragana: { learned: [], mastered: [], quizScores: [] },
    katakana: { learned: [], mastered: [], quizScores: [] },
    kanji: {},
    vocabulary: {},
    grammar: {},
    flashcards: {},
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as ProgressState
    if (parsed.version !== SCHEMA_VERSION) return defaultProgress()
    return parsed
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // silently ignore storage errors
  }
}
