import type { VocabTheme } from '@/types/vocabulary'

export const FAMILLE_THEME: VocabTheme = {
  id: 'famille',
  labelFR: 'La famille',
  icon: 'users',
  description: 'Les membres de la famille',
  colorClass: 'text-pink-500',
  items: [
    { id: 'f1',  japanese: '父', kana: 'ちち', romaji: 'chichi', frenchTranslation: 'mon père', category: 'parents', level: 'débutant', tags: ['famille'],
      exampleSentence: { japanese: '父は医者です。', kana: 'ちちはいしゃです。', frenchTranslation: 'Mon père est médecin.' } },
    { id: 'f2',  japanese: 'お父さん', kana: 'おとうさん', romaji: 'otousan', frenchTranslation: 'votre/son père (poli)', category: 'parents', level: 'débutant', tags: ['famille'] },
    { id: 'f3',  japanese: '母', kana: 'はは', romaji: 'haha', frenchTranslation: 'ma mère', category: 'parents', level: 'débutant', tags: ['famille'] },
    { id: 'f4',  japanese: 'お母さん', kana: 'おかあさん', romaji: 'okaasan', frenchTranslation: 'votre/sa mère (poli)', category: 'parents', level: 'débutant', tags: ['famille'] },
    { id: 'f5',  japanese: '兄', kana: 'あに', romaji: 'ani', frenchTranslation: 'mon grand frère', category: 'frères-sœurs', level: 'débutant', tags: ['famille'] },
    { id: 'f6',  japanese: 'お兄さん', kana: 'おにいさん', romaji: 'oniisan', frenchTranslation: 'votre/son grand frère (poli)', category: 'frères-sœurs', level: 'débutant', tags: ['famille'] },
    { id: 'f7',  japanese: '姉', kana: 'あね', romaji: 'ane', frenchTranslation: 'ma grande sœur', category: 'frères-sœurs', level: 'débutant', tags: ['famille'] },
    { id: 'f8',  japanese: 'お姉さん', kana: 'おねえさん', romaji: 'oneesan', frenchTranslation: 'votre/sa grande sœur (poli)', category: 'frères-sœurs', level: 'débutant', tags: ['famille'] },
    { id: 'f9',  japanese: '弟', kana: 'おとうと', romaji: 'otouto', frenchTranslation: 'mon petit frère', category: 'frères-sœurs', level: 'débutant', tags: ['famille'] },
    { id: 'f10', japanese: '妹', kana: 'いもうと', romaji: 'imouto', frenchTranslation: 'ma petite sœur', category: 'frères-sœurs', level: 'débutant', tags: ['famille'] },
    { id: 'f11', japanese: '祖父', kana: 'そふ', romaji: 'sofu', frenchTranslation: 'mon grand-père', category: 'grands-parents', level: 'intermédiaire', tags: ['famille'] },
    { id: 'f12', japanese: 'おじいさん', kana: 'おじいさん', romaji: 'ojiisan', frenchTranslation: 'votre/son grand-père (poli)', category: 'grands-parents', level: 'débutant', tags: ['famille'] },
    { id: 'f13', japanese: '祖母', kana: 'そぼ', romaji: 'sobo', frenchTranslation: 'ma grand-mère', category: 'grands-parents', level: 'intermédiaire', tags: ['famille'] },
    { id: 'f14', japanese: 'おばあさん', kana: 'おばあさん', romaji: 'obaasan', frenchTranslation: 'votre/sa grand-mère (poli)', category: 'grands-parents', level: 'débutant', tags: ['famille'] },
    { id: 'f15', japanese: '家族', kana: 'かぞく', romaji: 'kazoku', frenchTranslation: 'famille', category: 'général', level: 'débutant', tags: ['famille'] },
    { id: 'f16', japanese: '夫', kana: 'おっと', romaji: 'otto', frenchTranslation: 'mon mari', category: 'couple', level: 'intermédiaire', tags: ['famille'] },
    { id: 'f17', japanese: '妻', kana: 'つま', romaji: 'tsuma', frenchTranslation: 'ma femme (épouse)', category: 'couple', level: 'intermédiaire', tags: ['famille'] },
  ],
}
