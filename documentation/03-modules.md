# Les modules d'apprentissage

Chaque module = une leçon + un quiz. Le contenu vit dans `src/data/`.

## Hiragana / Katakana
- Les **46 caractères** de chaque syllabaire (+ dakuten pour l'hiragana).
- **Quiz 4 choix** avec raccourcis clavier (1-4 pour répondre, Entrée/Espace pour valider/continuer) → révision rapide.

## Kanji JLPT N5
- **50 kanji** du premier niveau du test officiel.
- Quiz + **recherche** (`SearchModal`).

## Vocabulaire
- **8 thèmes** : salutations, chiffres, couleurs, famille, nourriture, transport, corps, temps.
- Quiz par thème (`useVocabQuiz`).

## Grammaire
- **10 points N5** : です/ます, les particules は が を に で, les adjectifs い/な, la forme て, les questions avec か.

## Progression
- **Heatmap** d'activité, **série (streak)**, **barres par module** — vue d'ensemble de l'avancement, alimentée par le `ProgressContext`.

## Aides à l'apprentissage
- **RubyText** : affiche les furigana (lecture au-dessus des kanji).
- **SpeakButton** / `useSpeech` : prononciation par synthèse vocale.

Pour ajouter du contenu (un thème de vocabulaire, des kanji…), éditer le fichier correspondant dans `src/data/`.
