# Glossaire

**Règle d'entretien** : chaque nouveau terme est ajouté ici au moment où il apparaît.

## Technique

- **React Context (`ProgressContext`)** : partage une donnée (la progression) à toute l'app sans la passer de composant en composant.
- **localStorage** : stockage du navigateur ; la clé `nihon-app-v1` garde la progression.
- **SM-2 (répétition espacée)** : algorithme qui décide quand faire réviser une carte. Réussie → plus tard ; ratée → bientôt. Pour mémoriser durablement.
- **oklch** : façon moderne de définir une couleur en CSS (luminosité, chroma, teinte), plus prévisible que le RGB.
- **Furigana / RubyText** : petite lecture affichée au-dessus d'un kanji.
- **shadcn/ui**, **Vite**, **Tailwind**, **react-router-dom** : composants prêts, outil de build, styles utilitaires, gestion des pages.
- **Route paramétrée (`/parcours/:lessonId`)** : une même page qui change de contenu selon un morceau de l'adresse (ici l'identifiant de la leçon).
- **Hook (`useKanaQuiz`)** : fonction React réutilisable qui garde un état et sa logique (ici le déroulé d'un quiz), pour la partager entre plusieurs pages.
- **Logique pure** : fonction qui donne toujours le même résultat pour les mêmes entrées, sans React ni navigateur. Facile à vérifier avec quelques lignes dans le terminal.
- **Fusion avec les valeurs par défaut** : au chargement, on complète la progression sauvegardée avec les champs nouveaux, sans rien effacer. Évite de migrer les données à chaque ajout.
- **XP (points d'expérience)** : points gagnés en étudiant, dans les applis façon Duolingo. Pas dans la version 1 du parcours.

## Japonais (le contenu)

- **Hiragana** : syllabaire de base (mots japonais).
- **Katakana** : syllabaire pour les mots étrangers.
- **Kanji** : caractères d'origine chinoise (idées/mots).
- **JLPT N5** : premier niveau (le plus accessible) du test officiel de japonais.
- **Dakuten** : petit signe (゛) qui change le son d'un kana (ka→ga).
- **Particules (は が を に で)** : petits mots qui marquent le rôle des mots dans la phrase.
- **Forme て** : forme verbale servant à enchaîner des actions, demander, etc.
