// Logique pure du parcours de leçons (pas de React). Contrôle : parcours.check.ts
// Les scores sont des pourcentages entiers : évite les erreurs de flottants (15 * 0.8 !== 12).
export const PASS_PERCENT = 80

export type ParcoursProgress = Record<string, { best: number }>

export function scorePercent(score: number, total: number): number {
  return total <= 0 ? 0 : Math.floor((score * 100) / total)
}

export function isLessonPassed(score: number, total: number): boolean {
  return scorePercent(score, total) >= PASS_PERCENT
}

// Le meilleur score ne baisse jamais, même si on rejoue une leçon moins bien.
export function nextBest(previous: number | undefined, score: number, total: number): number {
  return Math.max(previous ?? 0, scorePercent(score, total))
}

// La première leçon est toujours ouverte, les autres demandent la précédente validée.
export function isLessonUnlocked(index: number, lessonIds: string[], parcours: ParcoursProgress): boolean {
  if (index < 0 || index >= lessonIds.length) return false
  if (index === 0) return true
  return (parcours[lessonIds[index - 1]]?.best ?? 0) >= PASS_PERCENT
}
