# Journal des sessions

## Construction

**Objectif** : apprendre le japonais depuis le français, tout le socle N5, avec une révision qui fait retenir.

**Ce qu'on a construit** :
- Hiragana (46 + dakuten) et Katakana (46) : leçons + quiz 4 choix avec raccourcis clavier.
- Kanji JLPT N5 (50) : quiz + recherche.
- Vocabulaire : 8 thèmes, quiz par thème.
- Grammaire : 10 points N5.
- Flashcards : répétition espacée SM-2, decks kana/kanji/vocab/tout, flip 3D.
- Progression : heatmap, série, barres par module.

**Comment ça marche** : progression partagée via `ProgressContext`, sauvegardée en localStorage (`nihon-app-v1`), pas de compte. SM-2 dans `src/lib/srs.ts` planifie les révisions.

**Décisions de design** : couleur rouge vermillon (朱色), fond crème, ambiance japonaise. Dark mode corrigé (cartes trop claires → `oklch(0.16 0.01 30)`).

## 2026-07-21

- Documentation passée au **format complet** (modèle remote_ctrl) : vue d'ensemble, architecture, modules, flashcards/SRS, journal, glossaire, workflows Mermaid, diagnostic, lancer/déployer. Pas de changement de code.

## 2026-10-01

- Idée d'Audric : une partie du site façon Duolingo. Passée au feu (grill-me) : l'hypothèse fragile était « il manque de la motivation », alors que le vrai manque est un parcours ordonné. Choix : **parcours de leçons** (pas seulement XP), **une seule unité d'abord (hiragana)**, sans vies. Design validé, voir [10-parcours-design.md](10-parcours-design.md).
- **Parcours hiragana codé et testé** le même jour (TDD sur la logique, build, lint, test Playwright complet). Détail des fichiers et écarts avec le design dans la doc 10. Corrections du même jour : QCM « Retrouver » ajouté (3 quiz par leçon), mode « Refaire les kana ratés » (entraînement non enregistré), carte « Parcours » sur l'accueil, barre de progression visible en mode sombre, test final ramené à 10 kana. Reste à voir à l'usage : le ressenti du chemin sur un vrai téléphone.
- Constat de départ : 34 fichiers modifiés (8 248 lignes ajoutées) jamais commités, 2 commits seulement. Tout a été commité le soir même sur la branche `feat/parcours-hiragana` (commit `feat: parcours de leçons hiragana et modules d'apprentissage N5/N4`), pas encore poussé ni fusionné dans `main`. Build OK. Docs 05 et 08 en retard sur les modules ajoutés depuis juillet (production, lecture, écriture, prononciation, Mes mots).

## Suite (roadmap)

Voir la note de roadmap : session du jour (fait), puis production active, puis lecture graduée. Ajouter du contenu = éditer `src/data/`.
