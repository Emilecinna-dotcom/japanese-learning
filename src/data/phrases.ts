export type PhraseCategory = 'restaurant' | 'transports' | 'shopping' | 'urgences' | 'presentation'

export interface Phrase {
  id: string
  japanese: string
  kana: string
  romaji: string
  frenchTranslation: string
  notes?: string
  category: PhraseCategory
}

export const PHRASES: Phrase[] = [
  // Restaurant
  { id: 'r1',  category: 'restaurant',   japanese: 'これをください',         kana: 'これをください',             romaji: 'kore wo kudasai',               frenchTranslation: 'Je voudrais ça' },
  { id: 'r2',  category: 'restaurant',   japanese: 'おすすめは何ですか？',   kana: 'おすすめはなんですか？',      romaji: 'osusume wa nan desu ka?',       frenchTranslation: 'Qu\'est-ce que vous recommandez ?' },
  { id: 'r3',  category: 'restaurant',   japanese: 'おいしい！',             kana: 'おいしい！',                  romaji: 'oishii!',                       frenchTranslation: 'C\'est délicieux !' },
  { id: 'r4',  category: 'restaurant',   japanese: 'お会計お願いします',     kana: 'おかいけいおねがいします',    romaji: 'okaikei onegaishimasu',         frenchTranslation: 'L\'addition, s\'il vous plaît' },
  { id: 'r5',  category: 'restaurant',   japanese: '一つください',            kana: 'ひとつください',              romaji: 'hitotsu kudasai',               frenchTranslation: 'Un, s\'il vous plaît', notes: 'Remplacer ひとつ par ふたつ (deux), みっつ (trois)...' },
  { id: 'r6',  category: 'restaurant',   japanese: 'アレルギーがあります',   kana: 'アレルギーがあります',        romaji: 'arerugii ga arimasu',           frenchTranslation: 'J\'ai une allergie' },
  { id: 'r7',  category: 'restaurant',   japanese: '辛くないものをください', kana: 'からくないものをください',    romaji: 'karakunai mono wo kudasai',     frenchTranslation: 'Quelque chose qui n\'est pas épicé, s\'il vous plaît' },

  // Transports
  { id: 't1',  category: 'transports',   japanese: '〜はどこですか？',       kana: '〜はどこですか？',            romaji: '~ wa doko desu ka?',            frenchTranslation: 'Où est ~ ?', notes: 'Remplacer ～ par le lieu' },
  { id: 't2',  category: 'transports',   japanese: '〜まで一枚ください',      kana: '〜までいちまいください',      romaji: '~ made ichimai kudasai',        frenchTranslation: 'Un billet pour ~, s\'il vous plaît' },
  { id: 't3',  category: 'transports',   japanese: '次は〜です',             kana: 'つぎは〜です',                romaji: 'tsugi wa ~ desu',               frenchTranslation: 'Prochain arrêt : ~', notes: 'Annonce dans les trains' },
  { id: 't4',  category: 'transports',   japanese: '乗り換えはどこですか？', kana: 'のりかえはどこですか？',      romaji: 'norikae wa doko desu ka?',      frenchTranslation: 'Où est la correspondance ?' },
  { id: 't5',  category: 'transports',   japanese: 'この電車は〜に止まりますか？', kana: 'このでんしゃは〜にとまりますか？', romaji: 'kono densha wa ~ ni tomarimasu ka?', frenchTranslation: 'Ce train s\'arrête-t-il à ~ ?' },
  { id: 't6',  category: 'transports',   japanese: 'タクシーを呼んでください', kana: 'タクシーをよんでください',   romaji: 'takushii wo yonde kudasai',     frenchTranslation: 'Appelez-moi un taxi, s\'il vous plaît' },

  // Shopping
  { id: 's1',  category: 'shopping',     japanese: 'いくらですか？',         kana: 'いくらですか？',              romaji: 'ikura desu ka?',                frenchTranslation: 'C\'est combien ?' },
  { id: 's2',  category: 'shopping',     japanese: '試着できますか？',       kana: 'しちゃくできますか？',        romaji: 'shichaku dekimasu ka?',         frenchTranslation: 'Puis-je l\'essayer ?' },
  { id: 's3',  category: 'shopping',     japanese: 'カードで払えますか？',   kana: 'カードではらえますか？',      romaji: 'kaado de haraemasu ka?',        frenchTranslation: 'Puis-je payer par carte ?' },
  { id: 's4',  category: 'shopping',     japanese: 'これください',           kana: 'これください',                romaji: 'kore kudasai',                  frenchTranslation: 'Je prends ça' },
  { id: 's5',  category: 'shopping',     japanese: '袋はいりません',         kana: 'ふくろはいりません',          romaji: 'fukuro wa irimasen',            frenchTranslation: 'Je n\'ai pas besoin de sac', notes: 'Important en Japan — plastic bag fee' },
  { id: 's6',  category: 'shopping',     japanese: '別々に包んでください',   kana: 'べつべつにつつんでください',  romaji: 'betsube tsu ni tsutsunde kudasai', frenchTranslation: 'Emballez séparément, s\'il vous plaît', notes: 'Utile pour les cadeaux' },

  // Urgences
  { id: 'u1',  category: 'urgences',     japanese: 'すみません',             kana: 'すみません',                  romaji: 'sumimasen',                     frenchTranslation: 'Excusez-moi / Pardon' },
  { id: 'u2',  category: 'urgences',     japanese: 'わかりません',           kana: 'わかりません',                romaji: 'wakarimasen',                   frenchTranslation: 'Je ne comprends pas' },
  { id: 'u3',  category: 'urgences',     japanese: 'もう一度お願いします',   kana: 'もういちどおねがいします',    romaji: 'mou ichido onegaishimasu',      frenchTranslation: 'Répétez, s\'il vous plaît' },
  { id: 'u4',  category: 'urgences',     japanese: 'ゆっくり話してください', kana: 'ゆっくりはなしてください',   romaji: 'yukkuri hanashite kudasai',     frenchTranslation: 'Parlez plus lentement, s\'il vous plaît' },
  { id: 'u5',  category: 'urgences',     japanese: '英語を話せますか？',     kana: 'えいごをはなせますか？',      romaji: 'eigo wo hanasemasu ka?',        frenchTranslation: 'Parlez-vous anglais ?' },
  { id: 'u6',  category: 'urgences',     japanese: '助けてください',         kana: 'たすけてください',            romaji: 'tasukete kudasai',              frenchTranslation: 'Aidez-moi !' },
  { id: 'u7',  category: 'urgences',     japanese: '病院はどこですか？',     kana: 'びょういんはどこですか？',    romaji: 'byouin wa doko desu ka?',       frenchTranslation: 'Où est l\'hôpital ?' },
  { id: 'u8',  category: 'urgences',     japanese: '警察を呼んでください',   kana: 'けいさつをよんでください',    romaji: 'keisatsu wo yonde kudasai',     frenchTranslation: 'Appelez la police, s\'il vous plaît' },

  // Présentation
  { id: 'p1',  category: 'presentation', japanese: 'はじめまして',           kana: 'はじめまして',                romaji: 'hajimemashite',                 frenchTranslation: 'Enchanté(e)' },
  { id: 'p2',  category: 'presentation', japanese: '私は〜です',             kana: 'わたしは〜です',              romaji: 'watashi wa ~ desu',             frenchTranslation: 'Je suis ~', notes: 'Remplacer ～ par votre prénom' },
  { id: 'p3',  category: 'presentation', japanese: 'フランスから来ました',   kana: 'フランスからきました',        romaji: 'furansu kara kimashita',        frenchTranslation: 'Je viens de France' },
  { id: 'p4',  category: 'presentation', japanese: 'よろしくお願いします',   kana: 'よろしくおねがいします',      romaji: 'yoroshiku onegaishimasu',       frenchTranslation: 'Ravi de vous rencontrer', notes: 'Formule de politesse essentielle' },
  { id: 'p5',  category: 'presentation', japanese: '日本語が少しわかります', kana: 'にほんごがすこしわかります', romaji: 'nihongo ga sukoshi wakarimasu', frenchTranslation: 'Je comprends un peu le japonais' },
  { id: 'p6',  category: 'presentation', japanese: '日本語を勉強しています', kana: 'にほんごをべんきょうしています', romaji: 'nihongo wo benkyou shite imasu', frenchTranslation: 'J\'étudie le japonais' },
]

export const PHRASE_CATEGORIES: { id: PhraseCategory; label: string; labelJP: string; color: string }[] = [
  { id: 'restaurant',   label: 'Restaurant',   labelJP: 'レストラン', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-900/50' },
  { id: 'transports',   label: 'Transports',   labelJP: '交通',       color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/50' },
  { id: 'shopping',     label: 'Shopping',     labelJP: '買い物',     color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-900/50' },
  { id: 'urgences',     label: 'Urgences',     labelJP: '緊急',       color: 'text-red-600 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900/50' },
  { id: 'presentation', label: 'Se présenter', labelJP: '自己紹介',   color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/50' },
]
