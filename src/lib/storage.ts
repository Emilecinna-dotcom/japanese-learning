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
    ecriture: {},
    conjugaison: {},
    compteurs: {},
    particules: { correct: 0, incorrect: 0, seen: [] },
    lecture: {},
    ecoute: { correct: 0, total: 0 },
    production: { correct: 0, total: 0 },
    savedWords: {},
    ecritureSrs: {},
    jlpt: [],
    parcours: {},
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as ProgressState
    // Toujours fusionner avec les defaults : ajoute les nouveaux champs sans jamais
    // effacer la progression existante, même après une mise à jour du site.
    return { ...defaultProgress(), ...parsed, version: SCHEMA_VERSION }
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
