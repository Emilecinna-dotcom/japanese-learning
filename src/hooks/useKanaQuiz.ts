import { useState, useCallback, useMemo, useEffect } from 'react'
import type { KanaCharacter } from '@/types/kana'

interface QuizState {
  deck: KanaCharacter[]
  currentIndex: number
  choices: KanaCharacter[]
  selected: string | null
  score: number
  phase: 'question' | 'feedback' | 'complete'
  startTime: number
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function generateChoices(correct: KanaCharacter, all: KanaCharacter[], count = 4): KanaCharacter[] {
  const distractors = shuffle(all.filter(c => c.id !== correct.id)).slice(0, count - 1)
  return shuffle([correct, ...distractors])
}

export function useKanaQuiz(allKana: KanaCharacter[], subset?: KanaCharacter[]) {
  const deckSource = subset ?? allKana

  const initialState = useMemo((): QuizState => {
    const deck = shuffle(deckSource)
    return {
      deck,
      currentIndex: 0,
      choices: deck.length > 0 ? generateChoices(deck[0], allKana) : [],
      selected: null,
      score: 0,
      phase: 'question',
      startTime: Date.now(),
    }
  }, [deckSource, allKana])

  const [state, setState] = useState<QuizState>(initialState)

  useEffect(() => {
    setState(initialState)
  }, [deckSource.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentCard = state.deck[state.currentIndex] as KanaCharacter | undefined

  const answer = useCallback((choiceId: string) => {
    if (state.phase !== 'question' || !currentCard) return
    setState(prev => ({
      ...prev,
      selected: choiceId,
      score: choiceId === currentCard.id ? prev.score + 1 : prev.score,
      phase: 'feedback',
    }))
  }, [state.phase, currentCard])

  const next = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1
      if (nextIndex >= prev.deck.length) {
        return { ...prev, phase: 'complete' }
      }
      const nextCard = prev.deck[nextIndex]
      return {
        ...prev,
        currentIndex: nextIndex,
        choices: generateChoices(nextCard, allKana),
        selected: null,
        phase: 'question',
      }
    })
  }, [allKana])

  const restart = useCallback(() => {
    setState({
      deck: shuffle(deckSource),
      currentIndex: 0,
      choices: deckSource.length > 0 ? generateChoices(shuffle(deckSource)[0], allKana) : [],
      selected: null,
      score: 0,
      phase: 'question',
      startTime: Date.now(),
    })
  }, [deckSource, allKana])

  const durationSeconds = Math.round((Date.now() - state.startTime) / 1000)

  return {
    currentCard,
    choices: state.choices,
    selected: state.selected,
    score: state.score,
    phase: state.phase,
    currentIndex: state.currentIndex,
    total: state.deck.length,
    durationSeconds,
    answer,
    next,
    restart,
  }
}
