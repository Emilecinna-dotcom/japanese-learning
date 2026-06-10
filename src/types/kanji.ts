export interface KanjiExample {
  word: string
  reading: string
  meaningFR: string
}

export interface KanjiEntry {
  id: string
  character: string
  meaningFR: string[]
  onyomi: string[]
  kunyomi: string[]
  strokeCount: number
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  radicals: string[]
  examples: KanjiExample[]
  tags: string[]
}
