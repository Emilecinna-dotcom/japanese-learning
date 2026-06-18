export type PhoneCategory = 'système' | 'navigation' | 'médias' | 'actions' | 'réseau'

export interface PhoneItem {
  id: string
  kanji: string
  kana: string
  romaji: string
  fr: string
  category: PhoneCategory
  emoji: string
}

export const PHONE_ITEMS: PhoneItem[] = [
  // ── Système ──
  { id: 'settei',    kanji: '設定',       kana: 'せってい',     romaji: 'settei',    fr: 'Paramètres',    category: 'système',    emoji: '⚙️' },
  { id: 'gengo',     kanji: '言語',       kana: 'げんご',       romaji: 'gengo',     fr: 'Langue',        category: 'système',    emoji: '🌐' },
  { id: 'juden',     kanji: '充電',       kana: 'じゅうでん',   romaji: 'jūden',     fr: 'Charge',        category: 'système',    emoji: '🔋' },
  { id: 'gamen',     kanji: '画面',       kana: 'がめん',       romaji: 'gamen',     fr: 'Écran',         category: 'système',    emoji: '📱' },
  { id: 'pasuwado',  kanji: 'パスワード', kana: 'パスワード',   romaji: 'pasuwādo',  fr: 'Mot de passe',  category: 'système',    emoji: '🔑' },
  { id: 'akikome',   kanji: '空き容量',   kana: 'あきようりょう', romaji: 'aki yōryō', fr: 'Espace libre',  category: 'système',    emoji: '💿' },

  // ── Navigation ──
  { id: 'modoru',    kanji: '戻る',       kana: 'もどる',       romaji: 'modoru',    fr: 'Retour',        category: 'navigation', emoji: '←' },
  { id: 'home',      kanji: 'ホーム',     kana: 'ホーム',       romaji: 'hōmu',      fr: 'Accueil',       category: 'navigation', emoji: '🏠' },
  { id: 'kensaku',   kanji: '検索',       kana: 'けんさく',     romaji: 'kensaku',   fr: 'Rechercher',    category: 'navigation', emoji: '🔍' },
  { id: 'kanryo',    kanji: '完了',       kana: 'かんりょう',   romaji: 'kanryō',    fr: 'Terminé',       category: 'navigation', emoji: '✓' },
  { id: 'kakunin',   kanji: '確認',       kana: 'かくにん',     romaji: 'kakunin',   fr: 'Confirmer',     category: 'navigation', emoji: '✔️' },
  { id: 'tojiру',    kanji: '閉じる',     kana: 'とじる',       romaji: 'tojiru',    fr: 'Fermer',        category: 'navigation', emoji: '✕' },

  // ── Médias ──
  { id: 'shashin',   kanji: '写真',       kana: 'しゃしん',     romaji: 'shashin',   fr: 'Photos',        category: 'médias',     emoji: '📷' },
  { id: 'denwa',     kanji: '電話',       kana: 'でんわ',       romaji: 'denwa',     fr: 'Téléphone',     category: 'médias',     emoji: '📞' },
  { id: 'kamera',    kanji: 'カメラ',     kana: 'カメラ',       romaji: 'kamera',    fr: 'Caméra',        category: 'médias',     emoji: '📸' },
  { id: 'ongaku',    kanji: '音楽',       kana: 'おんがく',     romaji: 'ongaku',    fr: 'Musique',       category: 'médias',     emoji: '🎵' },
  { id: 'tsuchi',    kanji: '通知',       kana: 'つうち',       romaji: 'tsūchi',    fr: 'Notifications', category: 'médias',     emoji: '🔔' },
  { id: 'onryo',     kanji: '音量',       kana: 'おんりょう',   romaji: 'onryō',     fr: 'Volume',        category: 'médias',     emoji: '🔊' },
  { id: 'akarusa',   kanji: '明るさ',     kana: 'あかるさ',     romaji: 'akarusa',   fr: 'Luminosité',    category: 'médias',     emoji: '☀️' },

  // ── Actions ──
  { id: 'sakujo',    kanji: '削除',       kana: 'さくじょ',     romaji: 'sakujo',    fr: 'Supprimer',     category: 'actions',    emoji: '🗑️' },
  { id: 'hozon',     kanji: '保存',       kana: 'ほぞん',       romaji: 'hozon',     fr: 'Enregistrer',   category: 'actions',    emoji: '💾' },
  { id: 'soshin',    kanji: '送信',       kana: 'そうしん',     romaji: 'sōshin',    fr: 'Envoyer',       category: 'actions',    emoji: '📤' },
  { id: 'kyoyu',     kanji: '共有',       kana: 'きょうゆう',   romaji: 'kyōyū',     fr: 'Partager',      category: 'actions',    emoji: '↗️' },
  { id: 'henshu',    kanji: '編集',       kana: 'へんしゅう',   romaji: 'henshū',    fr: 'Modifier',      category: 'actions',    emoji: '✏️' },
  { id: 'copy',      kanji: 'コピー',     kana: 'コピー',       romaji: 'kopī',      fr: 'Copier',        category: 'actions',    emoji: '📋' },

  // ── Réseau ──
  { id: 'wifi',      kanji: 'Wi-Fi',      kana: 'ワイファイ',   romaji: 'waifai',    fr: 'Wi-Fi',         category: 'réseau',     emoji: '📶' },
  { id: 'bt',        kanji: 'Bluetooth',  kana: 'ブルートゥース', romaji: 'burūtūsu', fr: 'Bluetooth',     category: 'réseau',     emoji: '🔵' },
  { id: 'data',      kanji: 'データ通信', kana: 'データつうしん', romaji: 'dēta tsūshin', fr: 'Données mobiles', category: 'réseau', emoji: '📊' },
  { id: 'kinai',     kanji: '機内モード', kana: 'きないモード', romaji: 'kinai mōdo', fr: 'Mode avion',   category: 'réseau',     emoji: '✈️' },
]

export const PHONE_CATEGORIES: PhoneCategory[] = ['système', 'navigation', 'médias', 'actions', 'réseau']

export const CATEGORY_COLORS: Record<PhoneCategory, string> = {
  système:    'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  navigation: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  médias:     'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  actions:    'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  réseau:     'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
}

export const CATEGORY_DOT: Record<PhoneCategory, string> = {
  système:    'bg-violet-500',
  navigation: 'bg-blue-500',
  médias:     'bg-rose-500',
  actions:    'bg-amber-500',
  réseau:     'bg-emerald-500',
}
