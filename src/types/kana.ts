export interface KanaCharacter {
  id: string
  kana: string
  romaji: string
  frenchPhonetic: string
  row: string
  column: number
  isDigraph: boolean
  strokeCount: number
  mnemonicFR?: string
}

export interface KanaRow {
  id: string
  label: string
  characters: KanaCharacter[]
}
