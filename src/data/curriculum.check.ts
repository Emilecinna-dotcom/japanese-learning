// Contrôle du parcours. Lancer : node src/data/curriculum.check.ts
import { HIRAGANA_UNIT, FINAL_TEST_SIZE } from './curriculum.ts'
import { HIRAGANA_ROWS } from './hiragana.ts'

function eq<T>(actual: T, expected: T, label: string) {
  if (actual !== expected) throw new Error(`${label} : attendu ${String(expected)}, obtenu ${String(actual)}`)
}

const lessons = HIRAGANA_UNIT.lessons.filter(l => l.kind === 'lesson')
const final = HIRAGANA_UNIT.lessons.filter(l => l.kind === 'final')
const allBasic = HIRAGANA_ROWS.flatMap(r => r.characters).map(c => c.id)

eq(lessons.length, 10, 'nombre de leçons')
eq(final.length, 1, 'un seul test final')
eq(HIRAGANA_UNIT.lessons[HIRAGANA_UNIT.lessons.length - 1].kind, 'final', 'le test final est en dernier')

// Identifiants uniques (ils servent de clé de progression et d'adresse)
const ids = HIRAGANA_UNIT.lessons.map(l => l.id)
eq(new Set(ids).size, ids.length, 'identifiants de leçon uniques')

// Chaque kana de base apparaît dans exactement une leçon
const inLessons = lessons.flatMap(l => l.characters.map(c => c.id))
eq(inLessons.length, allBasic.length, 'aucun kana en double ou manquant (nombre)')
eq([...inLessons].sort().join(','), [...allBasic].sort().join(','), 'mêmes kana que HIRAGANA_ROWS')

// Chaque leçon a assez de kana pour un seuil de 80 % qui ait du sens
for (const l of lessons) if (l.characters.length < 3) throw new Error(`${l.id} : moins de 3 kana`)

// Le test final couvre tous les kana, on en tire FINAL_TEST_SIZE
eq(final[0].characters.length, allBasic.length, 'le test final couvre tous les kana')
eq(FINAL_TEST_SIZE <= allBasic.length && FINAL_TEST_SIZE >= 10, true, 'taille du test final raisonnable')
