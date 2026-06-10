import type { VocabTheme } from '@/types/vocabulary'

export const TRANSPORT_THEME: VocabTheme = {
  id: 'transport',
  labelFR: 'Les transports',
  icon: 'train',
  description: 'Se déplacer au Japon',
  colorClass: 'text-green-500',
  items: [
    { id: 't1',  japanese: '電車', kana: 'でんしゃ', romaji: 'densha', frenchTranslation: 'train / métro', category: 'véhicules', level: 'débutant', tags: ['transport'] },
    { id: 't2',  japanese: 'バス', kana: 'バス', romaji: 'basu', frenchTranslation: 'bus', category: 'véhicules', level: 'débutant', tags: ['transport', 'katakana'] },
    { id: 't3',  japanese: 'タクシー', kana: 'タクシー', romaji: 'takushii', frenchTranslation: 'taxi', category: 'véhicules', level: 'débutant', tags: ['transport', 'katakana'] },
    { id: 't4',  japanese: '自転車', kana: 'じてんしゃ', romaji: 'jitensha', frenchTranslation: 'vélo', category: 'véhicules', level: 'débutant', tags: ['transport'] },
    { id: 't5',  japanese: '車', kana: 'くるま', romaji: 'kuruma', frenchTranslation: 'voiture', category: 'véhicules', level: 'débutant', tags: ['transport'] },
    { id: 't6',  japanese: '飛行機', kana: 'ひこうき', romaji: 'hikouki', frenchTranslation: 'avion', category: 'véhicules', level: 'débutant', tags: ['transport'] },
    { id: 't7',  japanese: '船', kana: 'ふね', romaji: 'fune', frenchTranslation: 'bateau', category: 'véhicules', level: 'débutant', tags: ['transport'] },
    { id: 't8',  japanese: '地下鉄', kana: 'ちかてつ', romaji: 'chikatetsu', frenchTranslation: 'métro (souterrain)', category: 'véhicules', level: 'débutant', tags: ['transport'] },
    { id: 't9',  japanese: '駅', kana: 'えき', romaji: 'eki', frenchTranslation: 'gare', category: 'lieux', level: 'débutant', tags: ['transport', 'lieu'] },
    { id: 't10', japanese: '空港', kana: 'くうこう', romaji: 'kuukou', frenchTranslation: 'aéroport', category: 'lieux', level: 'débutant', tags: ['transport', 'lieu'] },
    { id: 't11', japanese: 'バス停', kana: 'バスてい', romaji: 'basu tei', frenchTranslation: 'arrêt de bus', category: 'lieux', level: 'débutant', tags: ['transport', 'lieu'] },
    { id: 't12', japanese: '切符', kana: 'きっぷ', romaji: 'kippu', frenchTranslation: 'billet', category: 'actions', level: 'débutant', tags: ['transport'] },
    { id: 't13', japanese: '乗る', kana: 'のる', romaji: 'noru', frenchTranslation: 'monter dans (véhicule)', category: 'actions', level: 'débutant', tags: ['verbe', 'transport'] },
    { id: 't14', japanese: '降りる', kana: 'おりる', romaji: 'oriru', frenchTranslation: 'descendre de (véhicule)', category: 'actions', level: 'débutant', tags: ['verbe', 'transport'] },
  ],
}
