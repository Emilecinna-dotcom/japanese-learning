# Vue d'ensemble

## Ce que c'est

**Apprendre le Japonais** : un site pour apprendre le japonais **depuis le français**, couvrant tout le socle **JLPT N5** — les deux syllabaires, les kanji, le vocabulaire, la grammaire — avec un système de **révision qui fait retenir** (flashcards à répétition espacée) et un suivi de progression.

**En ligne :** https://japanese-learning-five.vercel.app
**Sans compte** : toute la progression est locale au navigateur.

## Modules

- **Hiragana** (46 + dakuten) et **Katakana** (46) : apprentissage + quiz 4 choix (raccourcis clavier 1-4, Entrée/Espace).
- **Kanji JLPT N5** (50) : quiz + recherche.
- **Vocabulaire** : 8 thèmes (salutations, chiffres, couleurs, famille, nourriture, transport, corps, temps), quiz par thème.
- **Grammaire** : 10 points N5 (です/ます, particules は が を に で, adjectifs い/な, forme て, questions か).
- **Flashcards** : répétition espacée **SM-2**, decks kana/kanji/vocab/tout, flip 3D.
- **Progression** : heatmap, série (streak), barres par module.

## Stack

Vite · React 19 · TypeScript · **shadcn/ui** · Tailwind CSS 4 · react-router-dom · @fontsource/noto-sans-jp. Hébergé sur **Vercel**.

## Ambiance

Couleur primaire **rouge vermillon** (朱色 *shu-iro*), fond crème en clair, dark mode ajusté.

Détail dans [02-architecture.md](02-architecture.md) et [04-flashcards-srs.md](04-flashcards-srs.md).
