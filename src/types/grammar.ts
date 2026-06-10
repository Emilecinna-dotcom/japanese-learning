export type GrammarLevel = 'N5' | 'N4' | 'N3'
export type GrammarCategory = 'verbes' | 'particules' | 'adjectifs' | 'phrases' | 'temps-et-aspect'

export interface GrammarExample {
  japanese: string
  kana: string
  frenchTranslation: string
  note?: string
}

export interface ConjugationRow {
  form: string
  japanese: string
  kana: string
  frenchTranslation: string
}

export interface GrammarPoint {
  id: string
  titleFR: string
  titleJP: string
  level: GrammarLevel
  category: GrammarCategory
  shortExplanationFR: string
  fullExplanationFR: string
  structure: string
  examples: GrammarExample[]
  conjugationTable?: ConjugationRow[]
  relatedPointIds: string[]
}
