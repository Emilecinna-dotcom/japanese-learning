import type { KanaCharacter, KanaRow } from '@/types/kana'

export const HIRAGANA_ROWS: KanaRow[] = [
  {
    id: 'vowels',
    label: 'Voyelles (母音)',
    characters: [
      { id: 'a',  kana: 'あ', romaji: 'a',  frenchPhonetic: "'a' comme dans 'patte'",    row: 'vowels', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'i',  kana: 'い', romaji: 'i',  frenchPhonetic: "'i' comme dans 'vie'",      row: 'vowels', column: 1, isDigraph: false, strokeCount: 2 },
      { id: 'u',  kana: 'う', romaji: 'u',  frenchPhonetic: "'ou' court, lèvres plates", row: 'vowels', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'e',  kana: 'え', romaji: 'e',  frenchPhonetic: "'é' comme dans 'été'",      row: 'vowels', column: 3, isDigraph: false, strokeCount: 2 },
      { id: 'o',  kana: 'お', romaji: 'o',  frenchPhonetic: "'o' comme dans 'eau'",      row: 'vowels', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'k-row',
    label: 'Ligne K (か行)',
    characters: [
      { id: 'ka', kana: 'か', romaji: 'ka', frenchPhonetic: "'ka' comme dans 'cabane'",  row: 'k-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'ki', kana: 'き', romaji: 'ki', frenchPhonetic: "'ki' comme dans 'kimono'",  row: 'k-row', column: 1, isDigraph: false, strokeCount: 4 },
      { id: 'ku', kana: 'く', romaji: 'ku', frenchPhonetic: "'kou' très bref",           row: 'k-row', column: 2, isDigraph: false, strokeCount: 1 },
      { id: 'ke', kana: 'け', romaji: 'ke', frenchPhonetic: "'ké' comme dans 'képi'",   row: 'k-row', column: 3, isDigraph: false, strokeCount: 3 },
      { id: 'ko', kana: 'こ', romaji: 'ko', frenchPhonetic: "'ko' comme dans 'cobra'",  row: 'k-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 's-row',
    label: 'Ligne S (さ行)',
    characters: [
      { id: 'sa',  kana: 'さ', romaji: 'sa',  frenchPhonetic: "'sa' comme dans 'salade'", row: 's-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'shi', kana: 'し', romaji: 'shi', frenchPhonetic: "'chi' comme dans 'chien'", row: 's-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'su',  kana: 'す', romaji: 'su',  frenchPhonetic: "'sou' très bref",          row: 's-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'se',  kana: 'せ', romaji: 'se',  frenchPhonetic: "'sé' comme dans 'sécher'", row: 's-row', column: 3, isDigraph: false, strokeCount: 3 },
      { id: 'so',  kana: 'そ', romaji: 'so',  frenchPhonetic: "'so' comme dans 'soleil'", row: 's-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 't-row',
    label: 'Ligne T (た行)',
    characters: [
      { id: 'ta',  kana: 'た', romaji: 'ta',  frenchPhonetic: "'ta' comme dans 'tarte'",  row: 't-row', column: 0, isDigraph: false, strokeCount: 4 },
      { id: 'chi', kana: 'ち', romaji: 'chi', frenchPhonetic: "'tchi' comme dans 'tchin'", row: 't-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'tsu', kana: 'つ', romaji: 'tsu', frenchPhonetic: "'tsou' (ts + ou)",          row: 't-row', column: 2, isDigraph: false, strokeCount: 3 },
      { id: 'te',  kana: 'て', romaji: 'te',  frenchPhonetic: "'té' comme dans 'téléphone'", row: 't-row', column: 3, isDigraph: false, strokeCount: 2 },
      { id: 'to',  kana: 'と', romaji: 'to',  frenchPhonetic: "'to' comme dans 'total'",  row: 't-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 'n-row',
    label: 'Ligne N (な行)',
    characters: [
      { id: 'na', kana: 'な', romaji: 'na', frenchPhonetic: "'na' comme dans 'nature'",   row: 'n-row', column: 0, isDigraph: false, strokeCount: 4 },
      { id: 'ni', kana: 'に', romaji: 'ni', frenchPhonetic: "'ni' comme dans 'niveau'",   row: 'n-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'nu', kana: 'ぬ', romaji: 'nu', frenchPhonetic: "'nou' comme dans 'nouvel'",  row: 'n-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'ne', kana: 'ね', romaji: 'ne', frenchPhonetic: "'né' comme dans 'nébuleux'", row: 'n-row', column: 3, isDigraph: false, strokeCount: 3 },
      { id: 'no', kana: 'の', romaji: 'no', frenchPhonetic: "'no' comme dans 'noctule'",  row: 'n-row', column: 4, isDigraph: false, strokeCount: 1 },
    ],
  },
  {
    id: 'h-row',
    label: 'Ligne H (は行)',
    characters: [
      { id: 'ha', kana: 'は', romaji: 'ha', frenchPhonetic: "'ha' aspiré, comme 'haha'",  row: 'h-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'hi', kana: 'ひ', romaji: 'hi', frenchPhonetic: "'hi' comme dans 'hibou'",    row: 'h-row', column: 1, isDigraph: false, strokeCount: 2 },
      { id: 'fu', kana: 'ふ', romaji: 'fu', frenchPhonetic: "'fou' soufflé entre les lèvres", row: 'h-row', column: 2, isDigraph: false, strokeCount: 4 },
      { id: 'he', kana: 'へ', romaji: 'he', frenchPhonetic: "'hé' aspiré légèrement",     row: 'h-row', column: 3, isDigraph: false, strokeCount: 1 },
      { id: 'ho', kana: 'ほ', romaji: 'ho', frenchPhonetic: "'ho' aspiré, comme 'hôtel'", row: 'h-row', column: 4, isDigraph: false, strokeCount: 4 },
    ],
  },
  {
    id: 'm-row',
    label: 'Ligne M (ま行)',
    characters: [
      { id: 'ma', kana: 'ま', romaji: 'ma', frenchPhonetic: "'ma' comme dans 'maman'",    row: 'm-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'mi', kana: 'み', romaji: 'mi', frenchPhonetic: "'mi' comme dans 'miel'",     row: 'm-row', column: 1, isDigraph: false, strokeCount: 3 },
      { id: 'mu', kana: 'む', romaji: 'mu', frenchPhonetic: "'mou' comme dans 'mouton'",  row: 'm-row', column: 2, isDigraph: false, strokeCount: 3 },
      { id: 'me', kana: 'め', romaji: 'me', frenchPhonetic: "'mé' comme dans 'médecin'",  row: 'm-row', column: 3, isDigraph: false, strokeCount: 2 },
      { id: 'mo', kana: 'も', romaji: 'mo', frenchPhonetic: "'mo' comme dans 'moto'",     row: 'm-row', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'y-row',
    label: 'Ligne Y (や行)',
    characters: [
      { id: 'ya', kana: 'や', romaji: 'ya', frenchPhonetic: "'ya' comme dans 'yaourt'",   row: 'y-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'yu', kana: 'ゆ', romaji: 'yu', frenchPhonetic: "'you' comme dans 'youpi'",   row: 'y-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 'yo', kana: 'よ', romaji: 'yo', frenchPhonetic: "'yo' comme dans 'yoga'",     row: 'y-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 'r-row',
    label: 'Ligne R (ら行)',
    characters: [
      { id: 'ra', kana: 'ら', romaji: 'ra', frenchPhonetic: "'la' (r très léger, entre r et l)", row: 'r-row', column: 0, isDigraph: false, strokeCount: 2 },
      { id: 'ri', kana: 'り', romaji: 'ri', frenchPhonetic: "'ri' (r léger)",              row: 'r-row', column: 1, isDigraph: false, strokeCount: 2 },
      { id: 'ru', kana: 'る', romaji: 'ru', frenchPhonetic: "'rou' (r léger)",             row: 'r-row', column: 2, isDigraph: false, strokeCount: 2 },
      { id: 're', kana: 'れ', romaji: 're', frenchPhonetic: "'ré' (r léger)",              row: 'r-row', column: 3, isDigraph: false, strokeCount: 3 },
      { id: 'ro', kana: 'ろ', romaji: 'ro', frenchPhonetic: "'ro' (r léger)",              row: 'r-row', column: 4, isDigraph: false, strokeCount: 2 },
    ],
  },
  {
    id: 'w-row',
    label: 'Ligne W (わ行)',
    characters: [
      { id: 'wa', kana: 'わ', romaji: 'wa', frenchPhonetic: "'oua' comme dans 'ouate'",   row: 'w-row', column: 0, isDigraph: false, strokeCount: 3 },
      { id: 'wo', kana: 'を', romaji: 'wo', frenchPhonetic: "'o' (particule uniquement)",  row: 'w-row', column: 4, isDigraph: false, strokeCount: 3 },
    ],
  },
  {
    id: 'n-standalone',
    label: 'N solitaire (ん)',
    characters: [
      { id: 'n', kana: 'ん', romaji: 'n', frenchPhonetic: "'n' nasalisé, comme dans 'bon'", row: 'n-standalone', column: 0, isDigraph: false, strokeCount: 2 },
    ],
  },
]

export const HIRAGANA_DAKUTEN: KanaCharacter[] = [
  { id: 'ga', kana: 'が', romaji: 'ga', frenchPhonetic: "'ga' comme dans 'gare'",   row: 'g-row', column: 0, isDigraph: false, strokeCount: 5 },
  { id: 'gi', kana: 'ぎ', romaji: 'gi', frenchPhonetic: "'gi' comme dans 'gilet'",  row: 'g-row', column: 1, isDigraph: false, strokeCount: 6 },
  { id: 'gu', kana: 'ぐ', romaji: 'gu', frenchPhonetic: "'gou' comme dans 'goût'",  row: 'g-row', column: 2, isDigraph: false, strokeCount: 3 },
  { id: 'ge', kana: 'げ', romaji: 'ge', frenchPhonetic: "'gué' comme dans 'guérir'", row: 'g-row', column: 3, isDigraph: false, strokeCount: 5 },
  { id: 'go', kana: 'ご', romaji: 'go', frenchPhonetic: "'go' comme dans 'golf'",   row: 'g-row', column: 4, isDigraph: false, strokeCount: 4 },
  { id: 'za', kana: 'ざ', romaji: 'za', frenchPhonetic: "'za' comme dans 'zapper'", row: 'z-row', column: 0, isDigraph: false, strokeCount: 5 },
  { id: 'ji', kana: 'じ', romaji: 'ji', frenchPhonetic: "'dji' comme dans 'djinn'", row: 'z-row', column: 1, isDigraph: false, strokeCount: 5 },
  { id: 'zu', kana: 'ず', romaji: 'zu', frenchPhonetic: "'zou' comme dans 'zoom'",  row: 'z-row', column: 2, isDigraph: false, strokeCount: 4 },
  { id: 'ze', kana: 'ぜ', romaji: 'ze', frenchPhonetic: "'zé' comme dans 'zèbre'",  row: 'z-row', column: 3, isDigraph: false, strokeCount: 5 },
  { id: 'zo', kana: 'ぞ', romaji: 'zo', frenchPhonetic: "'zo' comme dans 'zone'",   row: 'z-row', column: 4, isDigraph: false, strokeCount: 4 },
  { id: 'da', kana: 'だ', romaji: 'da', frenchPhonetic: "'da' comme dans 'dame'",   row: 'd-row', column: 0, isDigraph: false, strokeCount: 6 },
  { id: 'di', kana: 'ぢ', romaji: 'di', frenchPhonetic: "'dji' (rare, ≈ ji)",       row: 'd-row', column: 1, isDigraph: false, strokeCount: 5 },
  { id: 'du', kana: 'づ', romaji: 'du', frenchPhonetic: "'dzou' (rare, ≈ zu)",      row: 'd-row', column: 2, isDigraph: false, strokeCount: 5 },
  { id: 'de', kana: 'で', romaji: 'de', frenchPhonetic: "'de' comme dans 'deux'",   row: 'd-row', column: 3, isDigraph: false, strokeCount: 4 },
  { id: 'do', kana: 'ど', romaji: 'do', frenchPhonetic: "'do' comme dans 'docteur'", row: 'd-row', column: 4, isDigraph: false, strokeCount: 4 },
  { id: 'ba', kana: 'ば', romaji: 'ba', frenchPhonetic: "'ba' comme dans 'ballon'", row: 'b-row', column: 0, isDigraph: false, strokeCount: 5 },
  { id: 'bi', kana: 'び', romaji: 'bi', frenchPhonetic: "'bi' comme dans 'bijou'",  row: 'b-row', column: 1, isDigraph: false, strokeCount: 4 },
  { id: 'bu', kana: 'ぶ', romaji: 'bu', frenchPhonetic: "'bou' comme dans 'bouche'", row: 'b-row', column: 2, isDigraph: false, strokeCount: 6 },
  { id: 'be', kana: 'べ', romaji: 'be', frenchPhonetic: "'bé' comme dans 'bébé'",   row: 'b-row', column: 3, isDigraph: false, strokeCount: 3 },
  { id: 'bo', kana: 'ぼ', romaji: 'bo', frenchPhonetic: "'bo' comme dans 'botte'",  row: 'b-row', column: 4, isDigraph: false, strokeCount: 6 },
  { id: 'pa', kana: 'ぱ', romaji: 'pa', frenchPhonetic: "'pa' comme dans 'papa'",   row: 'p-row', column: 0, isDigraph: false, strokeCount: 5 },
  { id: 'pi', kana: 'ぴ', romaji: 'pi', frenchPhonetic: "'pi' comme dans 'pirate'", row: 'p-row', column: 1, isDigraph: false, strokeCount: 4 },
  { id: 'pu', kana: 'ぷ', romaji: 'pu', frenchPhonetic: "'pou' comme dans 'poulet'", row: 'p-row', column: 2, isDigraph: false, strokeCount: 6 },
  { id: 'pe', kana: 'ぺ', romaji: 'pe', frenchPhonetic: "'pé' comme dans 'pépite'", row: 'p-row', column: 3, isDigraph: false, strokeCount: 3 },
  { id: 'po', kana: 'ぽ', romaji: 'po', frenchPhonetic: "'po' comme dans 'police'", row: 'p-row', column: 4, isDigraph: false, strokeCount: 6 },
]

export const HIRAGANA_YOUON: KanaCharacter[] = [
  { id: 'kya', kana: 'きゃ', romaji: 'kya', frenchPhonetic: "'kya'", row: 'k-youon',  column: 0, isDigraph: true, strokeCount: 7 },
  { id: 'kyu', kana: 'きゅ', romaji: 'kyu', frenchPhonetic: "'kyou'", row: 'k-youon', column: 1, isDigraph: true, strokeCount: 6 },
  { id: 'kyo', kana: 'きょ', romaji: 'kyo', frenchPhonetic: "'kyo'",  row: 'k-youon', column: 2, isDigraph: true, strokeCount: 6 },
  { id: 'sha', kana: 'しゃ', romaji: 'sha', frenchPhonetic: "'cha'",  row: 'sh-youon', column: 0, isDigraph: true, strokeCount: 6 },
  { id: 'shu', kana: 'しゅ', romaji: 'shu', frenchPhonetic: "'chou'", row: 'sh-youon', column: 1, isDigraph: true, strokeCount: 5 },
  { id: 'sho', kana: 'しょ', romaji: 'sho', frenchPhonetic: "'cho'",  row: 'sh-youon', column: 2, isDigraph: true, strokeCount: 5 },
  { id: 'cha', kana: 'ちゃ', romaji: 'cha', frenchPhonetic: "'cha'",  row: 'ch-youon', column: 0, isDigraph: true, strokeCount: 6 },
  { id: 'chu', kana: 'ちゅ', romaji: 'chu', frenchPhonetic: "'tchou'",row: 'ch-youon', column: 1, isDigraph: true, strokeCount: 5 },
  { id: 'cho', kana: 'ちょ', romaji: 'cho', frenchPhonetic: "'cho'",  row: 'ch-youon', column: 2, isDigraph: true, strokeCount: 5 },
  { id: 'nya', kana: 'にゃ', romaji: 'nya', frenchPhonetic: "'nya'",  row: 'ny-youon', column: 0, isDigraph: true, strokeCount: 7 },
  { id: 'nyu', kana: 'にゅ', romaji: 'nyu', frenchPhonetic: "'nyou'", row: 'ny-youon', column: 1, isDigraph: true, strokeCount: 6 },
  { id: 'nyo', kana: 'にょ', romaji: 'nyo', frenchPhonetic: "'nyo'",  row: 'ny-youon', column: 2, isDigraph: true, strokeCount: 6 },
  { id: 'hya', kana: 'ひゃ', romaji: 'hya', frenchPhonetic: "'hya'",  row: 'hy-youon', column: 0, isDigraph: true, strokeCount: 5 },
  { id: 'hyu', kana: 'ひゅ', romaji: 'hyu', frenchPhonetic: "'hyou'", row: 'hy-youon', column: 1, isDigraph: true, strokeCount: 4 },
  { id: 'hyo', kana: 'ひょ', romaji: 'hyo', frenchPhonetic: "'hyo'",  row: 'hy-youon', column: 2, isDigraph: true, strokeCount: 4 },
  { id: 'mya', kana: 'みゃ', romaji: 'mya', frenchPhonetic: "'mya'",  row: 'my-youon', column: 0, isDigraph: true, strokeCount: 6 },
  { id: 'myu', kana: 'みゅ', romaji: 'myu', frenchPhonetic: "'myou'", row: 'my-youon', column: 1, isDigraph: true, strokeCount: 5 },
  { id: 'myo', kana: 'みょ', romaji: 'myo', frenchPhonetic: "'myo'",  row: 'my-youon', column: 2, isDigraph: true, strokeCount: 5 },
  { id: 'rya', kana: 'りゃ', romaji: 'rya', frenchPhonetic: "'rya'",  row: 'ry-youon', column: 0, isDigraph: true, strokeCount: 5 },
  { id: 'ryu', kana: 'りゅ', romaji: 'ryu', frenchPhonetic: "'ryou'", row: 'ry-youon', column: 1, isDigraph: true, strokeCount: 4 },
  { id: 'ryo', kana: 'りょ', romaji: 'ryo', frenchPhonetic: "'ryo'",  row: 'ry-youon', column: 2, isDigraph: true, strokeCount: 4 },
  { id: 'gya', kana: 'ぎゃ', romaji: 'gya', frenchPhonetic: "'gya'",  row: 'gy-youon', column: 0, isDigraph: true, strokeCount: 9 },
  { id: 'gyu', kana: 'ぎゅ', romaji: 'gyu', frenchPhonetic: "'gyou'", row: 'gy-youon', column: 1, isDigraph: true, strokeCount: 8 },
  { id: 'gyo', kana: 'ぎょ', romaji: 'gyo', frenchPhonetic: "'gyo'",  row: 'gy-youon', column: 2, isDigraph: true, strokeCount: 8 },
  { id: 'ja',  kana: 'じゃ', romaji: 'ja',  frenchPhonetic: "'dja'",  row: 'j-youon',  column: 0, isDigraph: true, strokeCount: 8 },
  { id: 'ju',  kana: 'じゅ', romaji: 'ju',  frenchPhonetic: "'djou'", row: 'j-youon',  column: 1, isDigraph: true, strokeCount: 7 },
  { id: 'jo',  kana: 'じょ', romaji: 'jo',  frenchPhonetic: "'djo'",  row: 'j-youon',  column: 2, isDigraph: true, strokeCount: 7 },
  { id: 'bya', kana: 'びゃ', romaji: 'bya', frenchPhonetic: "'bya'",  row: 'by-youon', column: 0, isDigraph: true, strokeCount: 7 },
  { id: 'byu', kana: 'びゅ', romaji: 'byu', frenchPhonetic: "'byou'", row: 'by-youon', column: 1, isDigraph: true, strokeCount: 6 },
  { id: 'byo', kana: 'びょ', romaji: 'byo', frenchPhonetic: "'byo'",  row: 'by-youon', column: 2, isDigraph: true, strokeCount: 6 },
  { id: 'pya', kana: 'ぴゃ', romaji: 'pya', frenchPhonetic: "'pya'",  row: 'py-youon', column: 0, isDigraph: true, strokeCount: 7 },
  { id: 'pyu', kana: 'ぴゅ', romaji: 'pyu', frenchPhonetic: "'pyou'", row: 'py-youon', column: 1, isDigraph: true, strokeCount: 6 },
  { id: 'pyo', kana: 'ぴょ', romaji: 'pyo', frenchPhonetic: "'pyo'",  row: 'py-youon', column: 2, isDigraph: true, strokeCount: 6 },
]

export const ALL_HIRAGANA: KanaCharacter[] = [
  ...HIRAGANA_ROWS.flatMap(r => r.characters),
  ...HIRAGANA_DAKUTEN,
]

export const HIRAGANA_MAP: Record<string, KanaCharacter> = Object.fromEntries(
  ALL_HIRAGANA.map(c => [c.id, c])
)
