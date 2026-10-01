export type KeigoType = 'sonkeigo' | 'kenjoogo' | 'teineigo'

export interface KeigoEntry {
  id: string
  type: KeigoType
  plain: string
  plainReading: string
  polite: string
  politeReading: string
  honorific?: string
  honorificReading?: string
  humble?: string
  humbleReading?: string
  meaningFR: string
  usageNote: string
  example: {
    plain: string
    plainReading: string
    polite: string
    politeReading: string
    frenchTranslation: string
  }
}

export interface KeigoRule {
  id: string
  title: string
  descriptionFR: string
  pattern: string
  examples: string[]
}

export const KEIGO_TYPES: Record<KeigoType, { label: string; labelJP: string; description: string; color: string }> = {
  sonkeigo:  { label: 'Sonkeigo — Honorifique', labelJP: '尊敬語', description: "Élève les actions de l'interlocuteur ou d'un tiers", color: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' },
  kenjoogo:  { label: "Kenjoogo — Modeste",     labelJP: '謙譲語', description: "Abaisse vos propres actions pour montrer du respect", color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
  teineigo:  { label: 'Teineigo — Poli',        labelJP: '丁寧語', description: "Niveau de politesse général (～ます、～です)", color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
}

export const KEIGO_VERBS: KeigoEntry[] = [
  {
    id: 'kg01', type: 'sonkeigo',
    plain: 'いる', plainReading: 'いる', polite: 'います', politeReading: 'います',
    honorific: 'いらっしゃる', honorificReading: 'いらっしゃる',
    meaningFR: 'être (personnes)',
    usageNote: "いらっしゃる s'utilise pour parler de l'endroit où se trouve votre interlocuteur ou supérieur.",
    example: {
      plain: '先生はここにいる。', plainReading: 'せんせいはここにいる。',
      polite: '先生はいらっしゃいますか？', politeReading: 'せんせいはいらっしゃいますか？',
      frenchTranslation: 'Le professeur est-il là ?',
    },
  },
  {
    id: 'kg02', type: 'sonkeigo',
    plain: '言う', plainReading: 'いう', polite: '言います', politeReading: 'いいます',
    honorific: 'おっしゃる', honorificReading: 'おっしゃる',
    meaningFR: 'dire',
    usageNote: "おっしゃる est utilisé pour les paroles d'une personne de rang supérieur.",
    example: {
      plain: '先生が言った。', plainReading: 'せんせいがいった。',
      polite: '先生がおっしゃいました。', politeReading: 'せんせいがおっしゃいました。',
      frenchTranslation: 'Le professeur a dit.',
    },
  },
  {
    id: 'kg03', type: 'sonkeigo',
    plain: 'する', plainReading: 'する', polite: 'します', politeReading: 'します',
    honorific: 'なさる', honorificReading: 'なさる',
    meaningFR: 'faire',
    usageNote: "なさる élève l'action de l'interlocuteur ou d'un supérieur.",
    example: {
      plain: '何をする？', plainReading: 'なにをする？',
      polite: '何をなさいますか？', politeReading: 'なにをなさいますか？',
      frenchTranslation: 'Que faites-vous ?',
    },
  },
  {
    id: 'kg04', type: 'sonkeigo',
    plain: '食べる・飲む', plainReading: 'たべる・のむ', polite: '食べます・飲みます', politeReading: 'たべます・のみます',
    honorific: 'めしあがる', honorificReading: 'めしあがる',
    meaningFR: 'manger / boire',
    usageNote: "めしあがる est la forme honorifique pour manger ou boire.",
    example: {
      plain: 'もう食べた？', plainReading: 'もうたべた？',
      polite: 'もうめしあがりましたか？', politeReading: 'もうめしあがりましたか？',
      frenchTranslation: 'Avez-vous déjà mangé ?',
    },
  },
  {
    id: 'kg05', type: 'sonkeigo',
    plain: 'くれる', plainReading: 'くれる', polite: 'くれます', politeReading: 'くれます',
    honorific: 'くださる', honorificReading: 'くださる',
    meaningFR: 'donner (à moi)',
    usageNote: "くださる est la forme honorifique de くれる (quelqu'un vous donne quelque chose).",
    example: {
      plain: '先生が本をくれた。', plainReading: 'せんせいがほんをくれた。',
      polite: '先生が本をくださいました。', politeReading: 'せんせいがほんをくださいました。',
      frenchTranslation: 'Le professeur m\'a donné un livre.',
    },
  },
  {
    id: 'kg06', type: 'kenjoogo',
    plain: '行く・来る', plainReading: 'いく・くる', polite: '行きます・来ます', politeReading: 'いきます・きます',
    humble: '参る', humbleReading: 'まいる',
    meaningFR: 'aller / venir (soi-même)',
    usageNote: "参る abaisse vos propres déplacements pour montrer du respect à l'interlocuteur.",
    example: {
      plain: '明日行く。', plainReading: 'あしたいく。',
      polite: '明日参ります。', politeReading: 'あしたまいります。',
      frenchTranslation: "J'irai demain.",
    },
  },
  {
    id: 'kg07', type: 'kenjoogo',
    plain: 'いる', plainReading: 'いる', polite: 'います', politeReading: 'います',
    humble: 'おる', humbleReading: 'おる',
    meaningFR: 'être (soi-même)',
    usageNote: "おる est utilisé pour parler de sa propre présence en position modeste.",
    example: {
      plain: '今、ここにいる。', plainReading: 'いま、ここにいる。',
      polite: '今、こちらにおります。', politeReading: 'いま、こちらにおります。',
      frenchTranslation: 'Je suis ici en ce moment.',
    },
  },
  {
    id: 'kg08', type: 'kenjoogo',
    plain: '言う', plainReading: 'いう', polite: '言います', politeReading: 'いいます',
    humble: '申す', humbleReading: 'もうす',
    meaningFR: 'dire (soi-même)',
    usageNote: "申す est la forme modeste de 言う — utilisé pour parler de ses propres paroles.",
    example: {
      plain: '田中と言います。', plainReading: 'たなかといいます。',
      polite: '田中と申します。', politeReading: 'たなかともうします。',
      frenchTranslation: 'Je m\'appelle Tanaka.',
    },
  },
  {
    id: 'kg09', type: 'kenjoogo',
    plain: 'する', plainReading: 'する', polite: 'します', politeReading: 'します',
    humble: 'いたす', humbleReading: 'いたす',
    meaningFR: 'faire (soi-même)',
    usageNote: "いたす est la forme humble de する — très courant dans le langage professionnel.",
    example: {
      plain: '確認する。', plainReading: 'かくにんする。',
      polite: 'ご確認いたします。', politeReading: 'ごかくにんいたします。',
      frenchTranslation: 'Je vais vérifier.',
    },
  },
  {
    id: 'kg10', type: 'kenjoogo',
    plain: 'もらう', plainReading: 'もらう', polite: 'もらいます', politeReading: 'もらいます',
    humble: 'いただく', humbleReading: 'いただく',
    meaningFR: 'recevoir (soi-même)',
    usageNote: "いただく est la forme humble de もらう. Aussi utilisé avant les repas : いただきます.",
    example: {
      plain: '本をもらった。', plainReading: 'ほんをもらった。',
      polite: '本をいただきました。', politeReading: 'ほんをいただきました。',
      frenchTranslation: "J'ai reçu un livre.",
    },
  },
  {
    id: 'kg11', type: 'kenjoogo',
    plain: '見る', plainReading: 'みる', polite: '見ます', politeReading: 'みます',
    humble: '拝見する', humbleReading: 'はいけんする',
    meaningFR: 'voir, regarder (soi-même)',
    usageNote: "拝見する est utilisé pour parler de ce que vous regardez/lisez avec humilité.",
    example: {
      plain: '資料を見ます。', plainReading: 'しりょうをみます。',
      polite: '資料を拝見いたします。', politeReading: 'しりょうをはいけんいたします。',
      frenchTranslation: 'Je vais regarder les documents.',
    },
  },
  {
    id: 'kg12', type: 'teineigo',
    plain: 'です', plainReading: 'だ', polite: 'です', politeReading: 'です',
    meaningFR: 'être (copule polie)',
    usageNote: "です est la copule polie. Toujours utilisé à la fin des phrases en registre poli.",
    example: {
      plain: '学生だ。', plainReading: 'がくせいだ。',
      polite: '学生です。', politeReading: 'がくせいです。',
      frenchTranslation: 'Je suis étudiant(e).',
    },
  },
]

export const KEIGO_RULES: KeigoRule[] = [
  {
    id: 'rule01',
    title: 'O/GO + Verbe + になる',
    descriptionFR: "Pour honorer l'action de quelqu'un, préfixez avec お ou ご et ajoutez になる.",
    pattern: 'お/ご + [Verbe (base)] + になる',
    examples: ['お帰りになる (rentrer)', 'ご出発になる (partir)', 'お使いになる (utiliser)'],
  },
  {
    id: 'rule02',
    title: 'O/GO + Verbe + する (humble)',
    descriptionFR: "Pour abaisser vos propres actions, préfixez avec お/ご et ajoutez する.",
    pattern: 'お/ご + [Verbe (base)] + する',
    examples: ['お持ちする (porter pour vous)', 'ご説明する (expliquer)', 'お電話する (téléphoner)'],
  },
  {
    id: 'rule03',
    title: 'Préfixes O et GO',
    descriptionFR: "お (o) s'utilise avec les mots japonais (和語), ご (go) avec les mots sino-japonais (漢語).",
    pattern: 'お + [Mot japonais] / ご + [Mot sino-japonais]',
    examples: ['お名前 (votre nom)', 'ご住所 (votre adresse)', 'お仕事 (votre travail)', 'ご家族 (votre famille)'],
  },
  {
    id: 'rule04',
    title: 'Terminer par ～でしょうか',
    descriptionFR: "Pour poser une question polie (plus doux que ～ですか), utilisez ～でしょうか.",
    pattern: '[Question] + でしょうか',
    examples: ['よろしいでしょうか？ (Est-ce que ça convient ?)', 'お名前は何でしょうか？ (Quel est votre nom ?)'],
  },
]
