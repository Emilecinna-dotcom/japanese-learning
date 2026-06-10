import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import type { ProgressState, QuizScore, FlashcardSRS } from '@/types/progress'
import { loadProgress, saveProgress } from '@/lib/storage'
import { computeNextReview, createFlashcard } from '@/lib/srs'

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSave = useCallback((state: ProgressState) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveProgress(state), 300)
  }, [])

  useEffect(() => {
    debouncedSave(progress)
  }, [progress, debouncedSave])

  const updateStudyStreak = useCallback((state: ProgressState): ProgressState => {
    const today = new Date().toISOString().split('T')[0]
    if (state.studyDates.includes(today)) return state
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const streak = state.studyDates.includes(yesterday) ? state.streak + 1 : 1
    return { ...state, lastStudied: today, streak, studyDates: [...state.studyDates, today] }
  }, [])

  const markKanaLearned = useCallback((id: string, type: 'hiragana' | 'katakana') => {
    setProgress(prev => {
      const kana = prev[type]
      if (kana.learned.includes(id)) return prev
      const updated = { ...prev, [type]: { ...kana, learned: [...kana.learned, id] } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const markKanaMastered = useCallback((id: string, type: 'hiragana' | 'katakana') => {
    setProgress(prev => {
      const kana = prev[type]
      if (kana.mastered.includes(id)) return prev
      const learned = kana.learned.includes(id) ? kana.learned : [...kana.learned, id]
      return { ...prev, [type]: { ...kana, learned, mastered: [...kana.mastered, id] } }
    })
  }, [])

  const recordQuizScore = useCallback((type: 'hiragana' | 'katakana', score: QuizScore) => {
    setProgress(prev => {
      const kana = prev[type]
      const updated = { ...prev, [type]: { ...kana, quizScores: [...kana.quizScores, score] } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const markItemSeen = useCallback((type: 'kanji' | 'vocabulary' | 'grammar', id: string) => {
    setProgress(prev => {
      const section = prev[type]
      const item = section[id] ?? { seen: false, correct: 0, incorrect: 0, lastSeen: null }
      if (item.seen) return prev
      const updated = { ...prev, [type]: { ...section, [id]: { ...item, seen: true, lastSeen: new Date().toISOString() } } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const rateFlashcard = useCallback((cardId: string, type: FlashcardSRS['type'], rating: 0 | 1 | 2 | 3) => {
    setProgress(prev => {
      const existing = prev.flashcards[cardId] ?? createFlashcard(cardId, type)
      const updated = computeNextReview(existing, rating)
      return updateStudyStreak({ ...prev, flashcards: { ...prev.flashcards, [cardId]: updated } })
    })
  }, [updateStudyStreak])

  const getModuleCompletion = useCallback((module: 'hiragana' | 'katakana', total: number): number => {
    if (total === 0) return 0
    return Math.round((progress[module].mastered.length / total) * 100)
  }, [progress])

  const getTodayDueCount = useCallback((): number => {
    const now = new Date()
    return Object.values(progress.flashcards).filter(card => new Date(card.dueDate) <= now).length
  }, [progress])

  return {
    progress,
    markKanaLearned,
    markKanaMastered,
    recordQuizScore,
    markItemSeen,
    rateFlashcard,
    getModuleCompletion,
    getTodayDueCount,
  }
}

export type UseProgressReturn = ReturnType<typeof useProgress>

export const ProgressContext = createContext<UseProgressReturn | null>(null)

export function useProgressContext(): UseProgressReturn {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressContext must be used inside ProgressProvider')
  return ctx
}
