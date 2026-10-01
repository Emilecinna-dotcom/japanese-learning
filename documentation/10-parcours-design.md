# Parcours de leçons (façon Duolingo), design

Validé avec Audric le 01/10/2026 et **implémenté le même jour**. Version 1 : **une seule unité, les hiragana**. Le but est de valider le principe (chemin, déblocage, ressenti) avant d'écrire le reste du N5.

## Ce qui a été construit (état réel)

| Fichier | Rôle |
|---|---|
| `src/lib/parcours.ts` + `parcours.check.ts` | logique pure (seuil 80 %, déblocage, meilleur score) |
| `src/data/curriculum.ts` + `curriculum.check.ts` | 10 leçons + test final, générés depuis `HIRAGANA_ROWS` |
| `src/pages/ParcoursPage.tsx` | le chemin (route `/parcours`) |
| `src/pages/ParcoursLessonPage.tsx` | une leçon (route `/parcours/:lessonId`) : découverte, QCM, saisie, résultat |
| `useProgress.ts` : `completeLesson` | enregistre le score, et si validé : kana « appris » + 1re révision planifiée |
| `types/progress.ts`, `lib/storage.ts` | champ `parcours` (défaut `{}`) |
| `App.tsx`, `Sidebar`, `AppLayout`, `BottomNav`, `HomePage` | route, entrées de navigation, carte « Parcours » sur l'accueil |

**Écarts avec le design de départ :** aucun à la fin de la journée. Trois écarts constatés au premier jet (pas de QCM romaji vers kana, pas de « refaire les kana ratés », pas de carte sur l'accueil) ont été corrigés le même jour. La barre de progression de l'en-tête était presque invisible en mode sombre, elle est maintenant sur `bg-foreground/15`.

**Vérifications faites le 01/10/2026 :** `node src/lib/parcours.check.ts` et `node src/data/curriculum.check.ts` passent, `tsc` propre, `eslint` propre sur les fichiers du parcours (le reste du projet a des erreurs existantes, dont `Date.now()` ligne 84 de `HomePage.tsx` pour la phrase du jour), `npm run build` OK. Test Playwright (mobile 390 px) : chemin affiché, leçon 1 réussie à 100 %, leçon 2 débloquée, progression conservée après rechargement, 5 hiragana « appris » et 5 cartes planifiées, adresse d'une leçon verrouillée redirigée vers `/parcours`, leçon ratée : « Pas encore », rien marqué « appris », leçon suivante fermée ; entraînement sur les kana ratés : 12 questions, aucun score enregistré ; leçon refaite à 100 % : validée, kana « appris », leçon suivante ouverte ; carte d'accueil « Prochaine leçon » à jour.

**Lancer les contrôles :** `node src/lib/parcours.check.ts && node src/data/curriculum.check.ts` (Node 24 exécute le TypeScript directement, rien à installer).

## Pourquoi

Le site a déjà le moteur de mémoire (SM-2), la série de jours et la session du jour. Ce qui manque, c'est un **ordre pédagogique** : le contenu est rangé par modules (kana, thèmes de vocabulaire), pas en leçons qui se débloquent. Le parcours ajoute cet ordre, il ne remplace rien.

Hors périmètre volontairement : points d'expérience (XP), vies, objectif du jour, dakuten et youon (unité 2).

## Ce que l'utilisateur voit

- Page `/parcours` : chemin vertical de pastilles en zigzag, unité « Hiragana » en haut. Trois états : verrouillée (grisée, cadenas), disponible (vermillon, légère pulsation), validée (✓ et meilleur score). Animation avec `framer-motion` (déjà installé). Entrées : accueil, Sidebar, BottomNav.
- 10 leçons : voyelles, K, S, T, N, H, M, Y, R, puis W et ん réunis. W et ん sont fusionnés car 2 puis 1 kana donnent trop peu d'exercices pour un seuil de 80 %. Une pastille de test final (mélange de tous les kana) suit, verrouillée tant que la leçon 10 n'est pas validée.
- Une leçon = 4 temps : découverte des kana de la ligne avec leur son, « Lire » (QCM kana vers romaji), « Retrouver » (QCM romaji vers kana), saisie du romaji. 15 exercices pour 5 kana. Le test final tire 10 kana au hasard, soit 30 questions.
- Validation à 80 % ou plus. Sinon : écran de résultat avec la liste « À revoir », « Réessayer » (toute la leçon, notée) et « Refaire les N kana ratés » (entraînement : mêmes 3 quiz sur les kana ratés seulement, sans découverte, **non noté et non enregistré**). Pas de vies, pas de pénalité.
- La leçon suivante se débloque à la validation. Les leçons validées restent rejouables, le meilleur score ne baisse jamais.

## Structure technique

- **Données** : `src/data/curriculum.ts`. Une unité contient des leçons, une leçon contient la liste des identifiants de kana qui renvoient à `HIRAGANA_ROWS`. Aucun kana copié.
- **Page de leçon** : `/parcours/:lessonId`. Réutilise trois fois `useKanaQuiz(allKana, subset)` : `QuizCard` pour « Lire », `QuizCard` avec le romaji en question et les kana en réponses pour « Retrouver », puis `TypingQuiz`. Le hook pose une question par kana, donc 5 kana donnent 15 exercices.
- **Logique pure** : `src/lib/parcours.ts`, sans React ni alias `@/`. Deux fonctions : leçon validée (score / total ≥ 0,8) et leçon débloquée (la précédente est validée). Un contrôle de quelques lignes se lance dans le terminal, sans bibliothèque de test.
- **Progression** : nouveau champ `parcours: Record<string, { best: number }>` dans `ProgressState`. `loadProgress` fusionne déjà avec `defaultProgress()`, donc les utilisateurs existants récupèrent `{}` sans migration. Ajouter `parcours: {}` dans `defaultProgress()`.
- **Lien avec la révision** : tous les hiragana sont déjà dans les flashcards (`buildAllFlashItems`), « appris » ne change donc rien à ce niveau. À la validation d'une leçon : `markKanaLearned` (visible sur la page Hiragana) et `rateFlashcard('hira-<id>', 'kana', 2)` pour planifier la première révision. À vérifier au moment du code : ces kana ne doivent plus apparaître en « nouveautés » dans la Session du jour.
- **Série de jours** : valider une leçon la fait avancer via `updateStudyStreak`, déjà appelé par `markKanaLearned`.

## Cas particuliers

- Quitter une leçon en cours : rien n'est sauvegardé, on recommence (choix volontairement simple).
- Adresse directe d'une leçon verrouillée : redirection vers `/parcours`.
- `localStorage` indisponible : déjà géré par `storage.ts` (`try/catch`).

## Vérifications prévues

1. Contrôle terminal de `parcours.ts` (seuil 80 %, déblocage).
2. `npm run build` et `npm run lint`.
3. Test de bout en bout avec Playwright : ouvrir `/parcours`, réussir la leçon 1, vérifier que la 2 se débloque et que la progression persiste après rechargement.

## Suite possible

Unité 2 (dakuten et youon), unité katakana, puis vocabulaire et grammaire N5. Ensuite seulement : XP et objectif du jour. Les vies sont écartées : elles bloquent la révision.
