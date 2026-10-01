// Contrôle de la logique du parcours. Lancer : node src/lib/parcours.check.ts
// Rien n'est affiché si tout passe, une erreur est levée au premier écart.
import { PASS_PERCENT, scorePercent, isLessonPassed, nextBest, isLessonUnlocked } from './parcours.ts'

function eq<T>(actual: T, expected: T, label: string) {
  if (actual !== expected) throw new Error(`${label} : attendu ${String(expected)}, obtenu ${String(actual)}`)
}

eq(PASS_PERCENT, 80, 'seuil')

// Validation à 80 % (calcul entier : 15 * 0.8 vaut 12.000000000000002 en flottant)
eq(isLessonPassed(8, 10), true, '8/10')
eq(isLessonPassed(7, 10), false, '7/10')
eq(isLessonPassed(4, 5), true, '4/5')
eq(isLessonPassed(12, 15), true, '12/15')
eq(isLessonPassed(3, 4), false, '3/4')
eq(isLessonPassed(0, 0), false, 'leçon vide')
eq(scorePercent(5, 6), 83, '5/6 arrondi vers le bas')
eq(scorePercent(2, 3), 66, '2/3 arrondi vers le bas')

// Le meilleur score ne baisse jamais
eq(nextBest(undefined, 6, 10), 60, 'premier essai')
eq(nextBest(90, 5, 10), 90, 'pire essai ignoré')
eq(nextBest(50, 10, 10), 100, 'meilleur essai retenu')

// Déblocage séquentiel
const ids = ['l1', 'l2', 'l3']
eq(isLessonUnlocked(0, ids, {}), true, 'leçon 1 toujours ouverte')
eq(isLessonUnlocked(1, ids, {}), false, 'leçon 2 fermée au départ')
eq(isLessonUnlocked(1, ids, { l1: { best: 70 } }), false, 'leçon 2 fermée si leçon 1 ratée')
eq(isLessonUnlocked(1, ids, { l1: { best: 80 } }), true, 'leçon 2 ouverte si leçon 1 validée')
eq(isLessonUnlocked(2, ids, { l1: { best: 100 } }), false, 'leçon 3 fermée si leçon 2 non faite')
eq(isLessonUnlocked(3, ids, { l1: { best: 100 }, l2: { best: 100 }, l3: { best: 100 } }), false, 'index hors liste')
eq(isLessonUnlocked(-1, ids, {}), false, 'index négatif')
