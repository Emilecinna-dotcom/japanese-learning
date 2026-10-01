# Lancer et déployer

## Développement

```bash
npm install
npm run dev      # serveur de dev Vite
```

## Build / vérification

```bash
npm run lint
npm run build    # sortie dans dist/
npm run preview
```

## Déploiement

- Hébergé sur **Vercel** : https://japanese-learning-five.vercel.app
- Build automatique via `npm run build`. Push sur la branche connectée → redéploiement.

## Ajouter du contenu

Éditer les fichiers de `src/data/` (kana, kanji-n5, particules, conjugaison, vocabulaire…). Les types correspondants sont dans `src/types/`. Aucun composant à modifier pour ajouter une leçon.
