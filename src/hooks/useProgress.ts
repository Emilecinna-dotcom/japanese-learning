import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import type { ProgressState, QuizScore, FlashcardSRS, JLPTAttempt, SavedWord } from '@/types/progress'
import { loadProgress, saveProgress } from '@/lib/storage'
import { computeNextReview, createFlashcard } from '@/lib/srs'
import { nextBest, isLessonPassed } from '@/lib/parcours'

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

  const markEcritureSuccess = useCallback((kanaId: string) => {
    setProgress(prev => {
      if (prev.ecriture?.[kanaId]) return prev
      const updated = { ...prev, ecriture: { ...(prev.ecriture ?? {}), [kanaId]: true } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  // Écriture en répétition espacée. La clé est le glyphe (unique, évite la collision
  // d'ids entre hiragana et katakana). Le nombre d'erreurs module l'intervalle.
  const recordWriting = useCallback((glyph: string, type: FlashcardSRS['type'], mistakes: number) => {
    const rating: 0 | 1 | 2 | 3 = mistakes === 0 ? 3 : mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1
    setProgress(prev => {
      const existing = prev.ecritureSrs?.[glyph] ?? createFlashcard(glyph, type)
      const updated = computeNextReview(existing, rating)
      const next = {
        ...prev,
        ecritureSrs: { ...(prev.ecritureSrs ?? {}), [glyph]: updated },
        ecriture: { ...(prev.ecriture ?? {}), [glyph]: true },
      }
      return updateStudyStreak(next)
    })
  }, [updateStudyStreak])

  const getDueWritingCount = useCallback((): number => {
    const now = new Date()
    return Object.values(progress.ecritureSrs ?? {}).filter(c => new Date(c.dueDate) <= now).length
  }, [progress])

  const markConjugaisonDone = useCallback((key: string) => {
    setProgress(prev => {
      if (prev.conjugaison?.[key]) return prev
      const updated = { ...prev, conjugaison: { ...(prev.conjugaison ?? {}), [key]: true } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const markCompteurSeen = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.compteurs?.[id]) return prev
      const updated = { ...prev, compteurs: { ...(prev.compteurs ?? {}), [id]: true } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const recordParticulesResult = useCallback((exerciseId: string, correct: boolean) => {
    setProgress(prev => {
      const p = prev.particules ?? { correct: 0, incorrect: 0, seen: [] }
      const updated = {
        ...prev,
        particules: {
          correct: correct ? p.correct + 1 : p.correct,
          incorrect: correct ? p.incorrect : p.incorrect + 1,
          seen: p.seen.includes(exerciseId) ? p.seen : [...p.seen, exerciseId],
        },
      }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const markLectureComplete = useCallback((textId: string) => {
    setProgress(prev => {
      if (prev.lecture?.[textId]) return prev
      const updated = { ...prev, lecture: { ...(prev.lecture ?? {}), [textId]: true } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const recordEcouteResult = useCallback((correct: boolean) => {
    setProgress(prev => {
      const e = prev.ecoute ?? { correct: 0, total: 0 }
      const updated = { ...prev, ecoute: { correct: correct ? e.correct + 1 : e.correct, total: e.total + 1 } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  // Mot mis de côté depuis la lecture → carte de révision immédiate (SRS).
  const saveWord = useCallback((key: string, word: Omit<SavedWord, 'addedAt'>) => {
    setProgress(prev => {
      if (prev.savedWords?.[key]) return prev
      const id = `saved-${key}`
      const card = createFlashcard(id, 'vocab')
      return {
        ...prev,
        savedWords: { ...(prev.savedWords ?? {}), [key]: { ...word, addedAt: new Date().toISOString() } },
        flashcards: { ...prev.flashcards, [id]: card },
      }
    })
  }, [])

  const removeWord = useCallback((key: string) => {
    setProgress(prev => {
      if (!prev.savedWords?.[key]) return prev
      const savedWords = { ...prev.savedWords }
      delete savedWords[key]
      const flashcards = { ...prev.flashcards }
      delete flashcards[`saved-${key}`]
      return { ...prev, savedWords, flashcards }
    })
  }, [])

  const recordProductionResult = useCallback((correct: boolean) => {
    setProgress(prev => {
      const p = prev.production ?? { correct: 0, total: 0 }
      const updated = { ...prev, production: { correct: correct ? p.correct + 1 : p.correct, total: p.total + 1 } }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  // Enregistre une leçon du parcours. Validée (>= 80 %) : les kana passent en « appris » et leur
  // première révision est planifiée, sans écraser une carte qui a déjà un historique.
  const completeLesson = useCallback((lessonId: string, kanaIds: string[], score: number, total: number) => {
    setProgress(prev => {
      const parcours = { ...prev.parcours, [lessonId]: { best: nextBest(prev.parcours?.[lessonId]?.best, score, total) } }
      let updated: ProgressState = { ...prev, parcours }
      if (isLessonPassed(score, total)) {
        const learned = [...new Set([...prev.hiragana.learned, ...kanaIds])]
        const flashcards = { ...prev.flashcards }
        for (const id of kanaIds) {
          const cardId = `hira-${id}`
          if (!flashcards[cardId]) flashcards[cardId] = computeNextReview(createFlashcard(cardId, 'kana'), 2)
        }
        updated = { ...updated, hiragana: { ...prev.hiragana, learned }, flashcards }
      }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  const recordJLPTAttempt = useCallback((attempt: JLPTAttempt) => {
    setProgress(prev => {
      const updated = { ...prev, jlpt: [...(prev.jlpt ?? []), attempt] }
      return updateStudyStreak(updated)
    })
  }, [updateStudyStreak])

  return {
    progress,
    markKanaLearned,
    markKanaMastered,
    recordQuizScore,
    markItemSeen,
    rateFlashcard,
    getModuleCompletion,
    getTodayDueCount,
    markEcritureSuccess,
    markConjugaisonDone,
    markCompteurSeen,
    recordParticulesResult,
    markLectureComplete,
    recordEcouteResult,
    recordProductionResult,
    saveWord,
    removeWord,
    recordWriting,
    getDueWritingCount,
    recordJLPTAttempt,
    completeLesson,
  }
}

export type UseProgressReturn = ReturnType<typeof useProgress>

export const ProgressContext = createContext<UseProgressReturn | null>(null)

export function useProgressContext(): UseProgressReturn {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressContext must be used inside ProgressProvider')
  return ctx
}
