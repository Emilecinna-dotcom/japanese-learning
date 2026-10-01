export type VocabThemeId =
  | 'chiffres'
  | 'couleurs'
  | 'famille'
  | 'nourriture'
  | 'transport'
  | 'corps'
  | 'temps'
  | 'salutations'
  | 'travail'
  | 'ville'
  | 'emotions'
  | 'ecole'
  | 'maison'
  | 'activites'
  | 'meteo'
  | 'vetements'

export interface VocabItem {
  id: string
  japanese: string
  kana: string
  romaji: string
  frenchTranslation: string
  category: string
  level: 'débutant' | 'intermédiaire' | 'avancé'
  tags: string[]
  exampleSentence?: {
    japanese: string
    kana: string
    frenchTranslation: string
  }
}

export interface VocabTheme {
  id: VocabThemeId
  labelFR: string
  icon: string
  description: string
  colorClass: string
  items: VocabItem[]
}
