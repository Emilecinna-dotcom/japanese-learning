# Flashcards et répétition espacée (SM-2)

C'est le cœur du site : ce qui transforme « avoir vu » en « avoir retenu ».

## Le principe

Une **flashcard** montre une question (un kana, un kanji, un mot), on essaie de répondre, on retourne la carte (flip 3D), puis on **note sa propre difficulté**. L'app décide alors **quand** re-présenter cette carte.

## L'algorithme SM-2 — `src/lib/srs.ts`

SM-2 (SuperMemo 2) est l'algorithme classique de répétition espacée :
- Chaque carte a un **facteur de facilité** et un **intervalle** (nombre de jours avant la prochaine révision).
- **Bien réussie** → l'intervalle s'allonge (on la revoit plus tard).
- **Ratée** → l'intervalle retombe (on la revoit bientôt).
- Résultat : on passe du temps sur ce qu'on maîtrise mal, et peu sur ce qu'on sait déjà.

## Interface

- **Decks** : kana, kanji, vocab, ou « tout ».
- **Flip 3D** de la carte, **raccourcis clavier** : Espace/Entrée pour retourner, 1-4 pour noter la difficulté.
- Les cartes à réviser sont agrégées par `src/lib/flashItems.ts`.

## Persistance

L'état de chaque carte (facteur, intervalle, prochaine échéance) est gardé avec la progression en **localStorage** (`nihon-app-v1`), donc les révisions reprennent d'une session à l'autre.
