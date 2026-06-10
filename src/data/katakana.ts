import type { KanaCharacter, KanaRow } from '@/types/kana'

export const KATAKANA_ROWS: KanaRow[] = [
  {
    id: 'vowels',
    label: 'Voyelles (母音)',
    characters: [
      { id: 'A',  kana: 'ア', romaji: 'a',  frenchPhonetic: "'a' comme dans 'patte'",    row: 'vowels', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'I',  kana: 'イ', romaji: 'i',  frenchPhonetic: "'i' comme dans 'vie'",      row: 'vowels', column: 1, isDigraph: false, strokeCount: 2 },
      { id: 'U',  kana: 'ウ', romaji: 'u',  frenchPhonetic: "'ou' court, lèvres plates", row: 'vowels', column: 2, isDigraph: false, strokeCount: 3 },
      { id: 'E',  kana: 'エ', romaji: 'e',  frenchPhonetic: "'é' comme dans 'été'",      row: 'vowels', column: 3, isDigraph: false, strokeCount: 3 },
      { id: 'O',  kana: 'オ', romaji: 'o',  frenchPhonetic: "'o' comme dans 'eau'",      row: 'vowels', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'k-row',
    label: 'Ligne K (カ行)',
    characters: [
      { id: 'KA', kana: 'カ', romaji: 'ka', frenchPhonetic: "'ka' comme dans 'cabane'",  row: 'k-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'KI', kana: 'キ', romaji: 'ki', frenchPhonetic: "'ki' comme dans 'kimono'",  row: 'k-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'KU', kana: 'ク', romaji: 'ku', frenchPhonetic: "'kou' très bref",           row: 'k-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'KE', kana: 'ケ', romaji: 'ke', frenchPhonetic: "'ké' comme dans 'képi'",   row: 'k-row', column: 3, isDigraph: false, strokeCount: 3 },
      { id: 'KO', kana: 'コ', romaji: 'ko', frenchPhonetic: "'ko' comme dans 'cobra'",  row: 'k-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 's-row',
    label: 'Ligne S (サ行)',
    characters: [
      { id: 'SA',  kana: 'サ', romaji: 'sa',  frenchPhonetic: "'sa' comme dans 'salade'", row: 's-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'SHI', kana: 'シ', romaji: 'shi', frenchPhonetic: "'chi' comme dans 'chien'", row: 's-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'SU',  kana: 'ス', romaji: 'su',  frenchPhonetic: "'sou' très bref",          row: 's-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'SE',  kana: 'セ', romaji: 'se',  frenchPhonetic: "'sé' comme dans 'sécher'", row: 's-row', column: 3, isDigraph: false, strokeCount: 2 },
      { id: 'SO',  kana: 'ソ', romaji: 'so',  frenchPhonetic: "'so' comme dans 'soleil'", row: 's-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 't-row',
    label: 'Ligne T (タ行)',
    characters: [
      { id: 'TA',  kana: 'タ', romaji: 'ta',  frenchPhonetic: "'ta' comme dans 'tarte'",    row: 't-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'CHI', kana: 'チ', romaji: 'chi', frenchPhonetic: "'tchi' comme dans 'tchin'",  row: 't-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'TSU', kana: 'ツ', romaji: 'tsu', frenchPhonetic: "'tsou' (ts + ou)",            row: 't-row', column: 2, isDigraph: false, strokeCount: 3 },
      { id: 'TE',  kana: 'テ', romaji: 'te',  frenchPhonetic: "'té' comme dans 'téléphone'", row: 't-row', column: 3, isDigraph: false, strokeCount: 3 },
      { id: 'TO',  kana: 'ト', romaji: 'to',  frenchPhonetic: "'to' comme dans 'total'",    row: 't-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 'n-row',
    label: 'Ligne N (ナ行)',
    characters: [
      { id: 'NA', kana: 'ナ', romaji: 'na', frenchPhonetic: "'na' comme dans 'nature'",   row: 'n-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'NI', kana: 'ニ', romaji: 'ni', frenchPhonetic: "'ni' comme dans 'niveau'",   row: 'n-row', column: 1, isDigraph: false, strokeCount: 2 },
      { id: 'NU', kana: 'ヌ', romaji: 'nu', frenchPhonetic: "'nou' comme dans 'nouvel'",  row: 'n-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'NE', kana: 'ネ', romaji: 'ne', frenchPhonetic: "'né' comme dans 'nébuleux'", row: 'n-row', column: 3, isDigraph: false, strokeCount: 4 },
      { id: 'NO', kana: 'ノ', romaji: 'no', frenchPhonetic: "'no' comme dans 'noctule'",  row: 'n-row', column: 4, isDigraph: false, strokeCount: 1 },
    ],
  },
  {
    id: 'h-row',
    label: 'Ligne H (ハ行)',
    characters: [
      { id: 'HA', kana: 'ハ', romaji: 'ha', frenchPhonetic: "'ha' aspiré",               row: 'h-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'HI', kana: 'ヒ', romaji: 'hi', frenchPhonetic: "'hi' comme dans 'hibou'",   row: 'h-row', column: 1, isDigraph: false, strokeCount: 2 },
      { id: 'FU', kana: 'フ', romaji: 'fu', frenchPhonetic: "'fou' soufflé",             row: 'h-row', column: 2, isDigraph: false, strokeCount: 1 },
      { id: 'HE', kana: 'ヘ', romaji: 'he', frenchPhonetic: "'hé' aspiré légèrement",    row: 'h-row', column: 3, isDigraph: false, strokeCount: 1 },
      { id: 'HO', kana: 'ホ', romaji: 'ho', frenchPhonetic: "'ho' aspiré",              row: 'h-row', column: 4, isDigraph: false, strokeCount: 4 },
    ],
  },
  {
    id: 'm-row',
    label: 'Ligne M (マ行)',
    characters: [
      { id: 'MA', kana: 'マ', romaji: 'ma', frenchPhonetic: "'ma' comme dans 'maman'",   row: 'm-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'MI', kana: 'ミ', romaji: 'mi', frenchPhonetic: "'mi' comme dans 'miel'",    row: 'm-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'MU', kana: 'ム', romaji: 'mu', frenchPhonetic: "'mou' comme dans 'mouton'", row: 'm-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'ME', kana: 'メ', romaji: 'me', frenchPhonetic: "'mé' comme dans 'médecin'", row: 'm-row', column: 3, isDigraph: false, strokeCount: 2 },
      { id: 'MO', kana: 'モ', romaji: 'mo', frenchPhonetic: "'mo' comme dans 'moto'",    row: 'm-row', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'y-row',
    label: 'Ligne Y (ヤ行)',
    characters: [
      { id: 'YA', kana: 'ヤ', romaji: 'ya', frenchPhonetic: "'ya' comme dans 'yaourt'",  row: 'y-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'YU', kana: 'ユ', romaji: 'yu', frenchPhonetic: "'you' comme dans 'youpi'",  row: 'y-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'YO', kana: 'ヨ', romaji: 'yo', frenchPhonetic: "'yo' comme dans 'yoga'",    row: 'y-row', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'r-row',
    label: 'Ligne R (ラ行)',
    characters: [
      { id: 'RA', kana: 'ラ', romaji: 'ra', frenchPhonetic: "'la' (r très léger)", row: 'r-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'RI', kana: 'リ', romaji: 'ri', frenchPhonetic: "'ri' (r léger)",      row: 'r-row', column: 1, isDigraph: false, strokeCount: 2 },
      { id: 'RU', kana: 'ル', romaji: 'ru', frenchPhonetic: "'rou' (r léger)",     row: 'r-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'RE', kana: 'レ', romaji: 're', frenchPhonetic: "'ré' (r léger)",      row: 'r-row', column: 3, isDigraph: false, strokeCount: 1 },
      { id: 'RO', kana: 'ロ', romaji: 'ro', frenchPhonetic: "'ro' (r léger)",      row: 'r-row', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'w-row',
    label: 'Ligne W (ワ行)',
    characters: [
      { id: 'WA', kana: 'ワ', romaji: 'wa', frenchPhonetic: "'oua' comme dans 'ouate'",   row: 'w-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'WO', kana: 'ヲ', romaji: 'wo', frenchPhonetic: "'o' (particule uniquement)", row: 'w-row', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'n-standalone',
    label: 'N solitaire (ン)',
    characters: [
      { id: 'N', kana: 'ン', romaji: 'n', frenchPhonetic: "'n' nasalisé, comme dans 'bon'", row: 'n-standalone', column: 0, isDigraph: false, strokeCount: 2 },
    ],
  },
]

export const ALL_KATAKANA: KanaCharacter[] = KATAKANA_ROWS.flatMap(r => r.characters)

export const KATAKANA_MAP: Record<string, KanaCharacter> = Object.fromEntries(
  ALL_KATAKANA.map(c => [c.id, c])
)
