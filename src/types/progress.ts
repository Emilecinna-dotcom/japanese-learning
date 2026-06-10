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
  type: 'kana' | 'kanji' | 'vocab'
  interval: number
  repetitions: number
  easeFactor: number
  dueDate: string
  lastRating: 0 | 1 | 2 | 3
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
}
