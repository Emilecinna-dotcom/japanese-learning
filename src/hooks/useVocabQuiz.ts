import { useState, useCallback, useEffect } from 'react'
import type { VocabItem } from '@/types/vocabulary'

interface VocabQuizState {
  deck: VocabItem[]
  currentIndex: number
  choices: VocabItem[]
  selected: string | null
  score: number
  phase: 'question' | 'feedback' | 'complete'
  startTime: number
  quizMode: 'jp-to-fr' | 'fr-to-jp'
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function generateChoices(correct: VocabItem, all: VocabItem[], count = 4): VocabItem[] {
  const distractors = shuffle(all.filter(v => v.id !== correct.id)).slice(0, count - 1)
  return shuffle([correct, ...distractors])
}

export function useVocabQuiz(items: VocabItem[], mode: 'jp-to-fr' | 'fr-to-jp' = 'jp-to-fr') {
  const initState = (): VocabQuizState => {
    const deck = shuffle(items)
    return {
      deck,
      currentIndex: 0,
      choices: deck.length > 0 ? generateChoices(deck[0], items) : [],
      selected: null,
      score: 0,
      phase: 'question',
      startTime: Date.now(),
      quizMode: mode,
    }
  }

  const [state, setState] = useState<VocabQuizState>(initState)

  useEffect(() => {
    setState(initState())
  }, [items]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentItem = state.deck[state.currentIndex] as VocabItem | undefined

  const answer = useCallback((choiceId: string) => {
    if (state.phase !== 'question' || !currentItem) return
    setState(prev => ({
      ...prev,
      selected: choiceId,
      score: choiceId === currentItem.id ? prev.score + 1 : prev.score,
      phase: 'feedback',
    }))
  }, [state.phase, currentItem])

  const next = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1
      if (nextIndex >= prev.deck.length) return { ...prev, phase: 'complete' }
      const nextItem = prev.deck[nextIndex]
      return {
        ...prev,
        currentIndex: nextIndex,
        choices: generateChoices(nextItem, items),
        selected: null,
        phase: 'question',
      }
    })
  }, [items])

  const restart = useCallback(() => setState(initState()), [items, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentItem,
    choices: state.choices,
    selected: state.selected,
    score: state.score,
    phase: state.phase,
    currentIndex: state.currentIndex,
    total: state.deck.length,
    quizMode: state.quizMode,
    durationSeconds: Math.round((Date.now() - state.startTime) / 1000),
    answer,
    next,
    restart,
  }
}
