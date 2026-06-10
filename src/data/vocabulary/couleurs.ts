import type { VocabTheme } from '@/types/vocabulary'

export const COULEURS_THEME: VocabTheme = {
  id: 'couleurs',
  labelFR: 'Les couleurs',
  icon: 'palette',
  description: 'Toutes les couleurs',
  colorClass: 'text-purple-500',
  items: [
    { id: 'col1',  japanese: '赤', kana: 'あか', romaji: 'aka', frenchTranslation: 'rouge', category: 'base', level: 'débutant', tags: ['couleur'],
      exampleSentence: { japanese: '赤いりんごが好きです。', kana: 'あかいりんごがすきです。', frenchTranslation: "J'aime les pommes rouges." } },
    { id: 'col2',  japanese: '青', kana: 'あお', romaji: 'ao', frenchTranslation: 'bleu / vert (ciel, mer)', category: 'base', level: 'débutant', tags: ['couleur'] },
    { id: 'col3',  japanese: '白', kana: 'しろ', romaji: 'shiro', frenchTranslation: 'blanc', category: 'base', level: 'débutant', tags: ['couleur'] },
    { id: 'col4',  japanese: '黒', kana: 'くろ', romaji: 'kuro', frenchTranslation: 'noir', category: 'base', level: 'débutant', tags: ['couleur'] },
    { id: 'col5',  japanese: '黄色', kana: 'きいろ', romaji: 'kiiro', frenchTranslation: 'jaune', category: 'base', level: 'débutant', tags: ['couleur'] },
    { id: 'col6',  japanese: '緑', kana: 'みどり', romaji: 'midori', frenchTranslation: 'vert', category: 'base', level: 'débutant', tags: ['couleur'] },
    { id: 'col7',  japanese: 'オレンジ', kana: 'オレンジ', romaji: 'orenji', frenchTranslation: 'orange', category: 'base', level: 'débutant', tags: ['couleur', 'katakana'] },
    { id: 'col8',  japanese: 'ピンク', kana: 'ピンク', romaji: 'pinku', frenchTranslation: 'rose', category: 'base', level: 'débutant', tags: ['couleur', 'katakana'] },
    { id: 'col9',  japanese: '紫', kana: 'むらさき', romaji: 'murasaki', frenchTranslation: 'violet / mauve', category: 'base', level: 'intermédiaire', tags: ['couleur'] },
    { id: 'col10', japanese: '茶色', kana: 'ちゃいろ', romaji: 'chairo', frenchTranslation: 'marron', category: 'base', level: 'débutant', tags: ['couleur'] },
    { id: 'col11', japanese: '灰色', kana: 'はいいろ', romaji: 'haiiro', frenchTranslation: 'gris', category: 'base', level: 'intermédiaire', tags: ['couleur'] },
    { id: 'col12', japanese: '金色', kana: 'きんいろ', romaji: 'kin\'iro', frenchTranslation: 'doré', category: 'étendu', level: 'intermédiaire', tags: ['couleur'] },
    { id: 'col13', japanese: '銀色', kana: 'ぎんいろ', romaji: 'gin\'iro', frenchTranslation: 'argenté', category: 'étendu', level: 'intermédiaire', tags: ['couleur'] },
  ],
}
