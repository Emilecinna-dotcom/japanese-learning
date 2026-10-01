# Diagnostic, corrections et améliorations

Priorités : 🔴 critique, 🟠 important, 🟢 confort.

## État actuel

Site complet et déployé : 5 modules (kana, kanji, vocab, grammaire) + flashcards SM-2 + progression. Sans compte (localStorage).

## Corrections passées

- **Dark mode** : cartes/popover trop claires → corrigées en `oklch(0.16 0.01 30)`.

## Vigilance

- 🟠 **Progression locale uniquement** (localStorage `nihon-app-v1`) : vider le cache du navigateur ou changer d'appareil = progression perdue. Pas de synchronisation multi-appareils.
- 🟢 **Contenu N5** : le socle est là, mais l'app peut accueillir plus (N4 amorcé dans `src/data/kanji-n4.ts`, keigo, conjugaison).

## Améliorations possibles

- 🟢 **Production active** (écrire/composer, pas seulement reconnaître) — prochaine étape de la roadmap.
- 🟢 **Lecture graduée** (petits textes adaptés au niveau).
- 🟢 Export/import de la progression (pour changer d'appareil).
- 🟢 Étendre au **N4** (contenu déjà amorcé).
- 🟢 Tests unitaires sur `srs.ts` (algorithme pur, facile à couvrir).
