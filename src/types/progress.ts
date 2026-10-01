export interface QuizScore {
  date: string
  score: number
  total: number
  durationSeconds: number
}

export interface KanaProgress {
  learned: string[]
  mastered: string[]
  quizScores: QuizScore[]
}

export interface ItemProgress {
  seen: boolean
  correct: number
  incorrect: number
  lastSeen: string | null
}

export interface FlashcardSRS {
  id: string
  type: 'kana' | 'kanji' | 'vocab' | 'grammaire'
  interval: number
  repetitions: number
  easeFactor: number
  dueDate: string
  lastRating: 0 | 1 | 2 | 3
}

export interface JLPTAttempt {
  level: string
  category: string
  score: number
  total: number
  date: string
}

export interface ProgressState {
  version: number
  lastStudied: string | null
  streak: number
  studyDates: string[]
  hiragana: KanaProgress
  katakana: KanaProgress
  kanji: Record<string, ItemProgress>
  vocabulary: Record<string, ItemProgress>
  grammar: Record<string, ItemProgress>
  flashcards: Record<string, FlashcardSRS>
  ecriture: Record<string, boolean>
  conjugaison: Record<string, boolean>
  compteurs: Record<string, boolean>
  particules: { correct: number; incorrect: number; seen: string[] }
  lecture: Record<string, boolean>
  ecoute: { correct: number; total: number }
  production: { correct: number; total: number }
  savedWords: Record<string, SavedWord>
  ecritureSrs: Record<string, FlashcardSRS>
  jlpt: JLPTAttempt[]
  // Parcours de leçons : meilleur score (pourcentage entier) par identifiant de leçon
  parcours: Record<string, { best: number }>
}

export interface SavedWord {
  front: string
  back: string
  reading?: string
  addedAt: string
}
