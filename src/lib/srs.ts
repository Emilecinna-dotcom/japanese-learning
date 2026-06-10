import type { FlashcardSRS } from '@/types/progress'

export function computeNextReview(card: FlashcardSRS, rating: 0 | 1 | 2 | 3): FlashcardSRS {
  let { interval, repetitions, easeFactor } = card

  if (rating === 0) {
    interval = 1
    repetitions = 0
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)

    easeFactor = Math.max(1.3, easeFactor + 0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02))
    repetitions += 1
  }

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    dueDate: dueDate.toISOString(),
    lastRating: rating,
  }
}

export function createFlashcard(
  id: string,
  type: FlashcardSRS['type']
): FlashcardSRS {
  return {
    id,
    type,
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
    lastRating: 0,
  }
}

export function isDue(card: FlashcardSRS): boolean {
  return new Date(card.dueDate) <= new Date()
}
