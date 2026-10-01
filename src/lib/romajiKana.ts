// Convertisseur romaji → kana, façon clavier japonais (IME léger).
// Couvre les syllabes de base, digraphes (kya, sha…), sokuon (double consonne → っ)
// et le ん final/devant consonne.

const ROMAJI_TO_HIRA: Record<string, string> = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  sa: 'さ', shi: 'し', si: 'し', su: 'す', se: 'せ', so: 'そ',
  za: 'ざ', ji: 'じ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  ta: 'た', chi: 'ち', ti: 'ち', tsu: 'つ', tu: 'つ', te: 'て', to: 'と',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', hu: 'ふ', he: 'へ', ho: 'ほ',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', wi: 'ゐ', we: 'ゑ',
  // Digraphes
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  // petits kana isolés
  xtsu: 'っ', xtu: 'っ', xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ',
}

const VOWELS = new Set(['a', 'i', 'u', 'e', 'o'])

function hiraToKata(s: string): string {
  let out = ''
  for (const ch of s) {
    const code = ch.charCodeAt(0)
    // Plage hiragana 0x3041–0x3096 → katakana +0x60
    if (code >= 0x3041 && code <= 0x3096) out += String.fromCharCode(code + 0x60)
    else out += ch
  }
  return out
}

/** Convertit du romaji en kana (hiragana par défaut, ou katakana). */
export function romajiToKana(input: string, script: 'hiragana' | 'katakana' = 'hiragana'): string {
  const s = input.toLowerCase()
  let out = ''
  let i = 0

  while (i < s.length) {
    const c = s[i]
    const next = s[i + 1]

    // ん : "n" en fin de mot, ou devant une consonne (y compris un second n → んに).
    // On ne consomme qu'un seul n : le suivant repart sur la syllabe d'après.
    if (c === 'n' && (next === undefined || (!VOWELS.has(next) && next !== 'y'))) {
      out += 'ん'; i += 1; continue
    }

    // sokuon : consonne doublée → っ
    if (c === next && !VOWELS.has(c) && c !== 'n') {
      out += 'っ'; i += 1; continue
    }

    // match glouton sur 3, 2, puis 1 caractère
    let matched = false
    for (let len = 3; len >= 1; len--) {
      const chunk = s.slice(i, i + len)
      if (ROMAJI_TO_HIRA[chunk]) {
        out += ROMAJI_TO_HIRA[chunk]
        i += len
        matched = true
        break
      }
    }
    if (!matched) { out += c; i += 1 }
  }

  return script === 'katakana' ? hiraToKata(out) : out
}

/** Le romaji se convertit-il exactement vers ce kana cible ? (filtre les items résolubles) */
export function romajiRoundTrips(romaji: string, targetKana: string): boolean {
  const isKata = [...targetKana].some(ch => ch.charCodeAt(0) >= 0x30a0 && ch.charCodeAt(0) <= 0x30ff)
  const clean = romaji.toLowerCase().replace(/[^a-z]/g, '')
  return romajiToKana(clean, isKata ? 'katakana' : 'hiragana') === targetKana
}

/** Normalise une lecture romaji pour comparaison tolérante (Lecture). */
export function normalizeRomaji(s: string): string {
  return s
    .toLowerCase()
    .replace(/[āâ]/g, 'a').replace(/[īî]/g, 'i').replace(/[ūû]/g, 'u')
    .replace(/[ēê]/g, 'e').replace(/[ōô]/g, 'o')
    .replace(/[^a-z]/g, '')
}

/** Comparaison tolérante : exacte, ou voyelles longues réduites des deux côtés. */
export function readingMatches(userInput: string, target: string): boolean {
  const a = normalizeRomaji(userInput)
  const b = normalizeRomaji(target)
  if (!a) return false
  if (a === b) return true
  const collapse = (x: string) => x.replace(/(.)\1+/g, '$1').replace(/ou/g, 'o').replace(/uu/g, 'u')
  return collapse(a) === collapse(b)
}
