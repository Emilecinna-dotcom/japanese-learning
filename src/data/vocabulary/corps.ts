import type { VocabTheme } from '@/types/vocabulary'

export const CORPS_THEME: VocabTheme = {
  id: 'corps',
  labelFR: 'Le corps humain',
  icon: 'person-standing',
  description: 'Parties du corps',
  colorClass: 'text-red-400',
  items: [
    { id: 'co1',  japanese: '頭', kana: 'あたま', romaji: 'atama', frenchTranslation: 'tête', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co2',  japanese: '顔', kana: 'かお', romaji: 'kao', frenchTranslation: 'visage', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co3',  japanese: '目', kana: 'め', romaji: 'me', frenchTranslation: 'œil / yeux', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co4',  japanese: '耳', kana: 'みみ', romaji: 'mimi', frenchTranslation: 'oreille', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co5',  japanese: '鼻', kana: 'はな', romaji: 'hana', frenchTranslation: 'nez', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co6',  japanese: '口', kana: 'くち', romaji: 'kuchi', frenchTranslation: 'bouche', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co7',  japanese: '歯', kana: 'は', romaji: 'ha', frenchTranslation: 'dent', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co8',  japanese: '髪', kana: 'かみ', romaji: 'kami', frenchTranslation: 'cheveux', category: 'tête', level: 'débutant', tags: ['corps'] },
    { id: 'co9',  japanese: '首', kana: 'くび', romaji: 'kubi', frenchTranslation: 'cou', category: 'tronc', level: 'débutant', tags: ['corps'] },
    { id: 'co10', japanese: '肩', kana: 'かた', romaji: 'kata', frenchTranslation: 'épaule', category: 'tronc', level: 'débutant', tags: ['corps'] },
    { id: 'co11', japanese: '胸', kana: 'むね', romaji: 'mune', frenchTranslation: 'poitrine', category: 'tronc', level: 'débutant', tags: ['corps'] },
    { id: 'co12', japanese: 'お腹', kana: 'おなか', romaji: 'onaka', frenchTranslation: 'ventre', category: 'tronc', level: 'débutant', tags: ['corps'] },
    { id: 'co13', japanese: '背中', kana: 'せなか', romaji: 'senaka', frenchTranslation: 'dos', category: 'tronc', level: 'débutant', tags: ['corps'] },
    { id: 'co14', japanese: '腕', kana: 'うで', romaji: 'ude', frenchTranslation: 'bras', category: 'membres', level: 'débutant', tags: ['corps'] },
    { id: 'co15', japanese: '手', kana: 'て', romaji: 'te', frenchTranslation: 'main', category: 'membres', level: 'débutant', tags: ['corps'] },
    { id: 'co16', japanese: '指', kana: 'ゆび', romaji: 'yubi', frenchTranslation: 'doigt', category: 'membres', level: 'débutant', tags: ['corps'] },
    { id: 'co17', japanese: '足', kana: 'あし', romaji: 'ashi', frenchTranslation: 'jambe / pied', category: 'membres', level: 'débutant', tags: ['corps'] },
    { id: 'co18', japanese: '膝', kana: 'ひざ', romaji: 'hiza', frenchTranslation: 'genou', category: 'membres', level: 'intermédiaire', tags: ['corps'] },
  ],
}
