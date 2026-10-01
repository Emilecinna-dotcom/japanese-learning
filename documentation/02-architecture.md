# Architecture

App React/Vite organisée autour d'un **contexte de progression** partagé et d'un **contenu séparé de la logique**, pour ajouter des leçons sans toucher au code.

## Principe

- **Contenu** dans `src/data/` (kana, kanji-n5, particules, conjugaison…) → **pour ajouter du contenu, on édite ces fichiers**, pas les composants.
- **Types** dans `src/types/` (kana, kanji, vocabulary, grammar, progress) → le contrat de chaque type de contenu.
- **Logique** dans `src/lib/` : `srs.ts` (répétition espacée SM-2), `storage.ts` (localStorage), `flashItems.ts` (agrégation des cartes), `romajiKana.ts`, `utils.ts`.
- **Hooks** dans `src/hooks/` : `useProgress` (progression), `useKanaQuiz`/`useVocabQuiz` (moteurs de quiz), `useSpeech` (synthèse vocale), `useTilt` (effet 3D).
- **Composants** dans `src/components/` : `WelcomeScreen`, `SearchModal`, `RubyText` (furigana), `SpeakButton`, `SystemeEcritureInfo`.

## Progression partagée

- Un **`ProgressContext`** (React Context) porte la progression, consommé via `useProgressContext()` dans chaque page.
- Persistée en **localStorage** sous la clé `nihon-app-v1` → pas de compte, tout reste sur l'appareil.

## Routing

- Le router (react-router-dom) est créé **une seule fois** au niveau module dans `App.tsx` (pas à chaque rendu).

## Cœur : la répétition espacée

L'algorithme **SM-2** (`src/lib/srs.ts`) planifie la prochaine révision de chaque carte selon la difficulté ressentie. C'est ce qui fait la valeur du site (mémorisation durable). Voir [04-flashcards-srs.md](04-flashcards-srs.md).
