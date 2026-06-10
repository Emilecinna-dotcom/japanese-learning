import type { GrammarPoint } from '@/types/grammar'

export const GRAMMAR_POINTS: GrammarPoint[] = [
  {
    id: 'desu-masu',
    titleFR: 'La forme polie です・ます',
    titleJP: 'です・ます形',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: 'La forme de base pour parler poliment au présent.',
    fullExplanationFR: `En japonais, la politesse se marque par la terminaison des verbes et des phrases.

**です (desu)** s'utilise avec des noms et des adjectifs pour dire "c'est...".
**～ます (masu)** est la terminaison polie des verbes.

Ces formes s'utilisent dans les conversations formelles, avec des inconnus, au travail, etc.`,
    structure: '[Nom / Adjectif-na] + です   |   [Radical verbal] + ます',
    examples: [
      { japanese: '私は学生です。', kana: 'わたしはがくせいです。', frenchTranslation: 'Je suis étudiant(e).', note: 'Nom + です' },
      { japanese: '日本語を勉強します。', kana: 'にほんごをべんきょうします。', frenchTranslation: "J'étudie le japonais.", note: 'Verbe + ます' },
      { japanese: '東京に住んでいます。', kana: 'とうきょうにすんでいます。', frenchTranslation: "J'habite à Tokyo." },
    ],
    conjugationTable: [
      { form: 'Affirmatif présent', japanese: '食べます', kana: 'たべます', frenchTranslation: 'je mange (poli)' },
      { form: 'Négatif présent', japanese: '食べません', kana: 'たべません', frenchTranslation: 'je ne mange pas (poli)' },
      { form: 'Affirmatif passé', japanese: '食べました', kana: 'たべました', frenchTranslation: "j'ai mangé (poli)" },
      { form: 'Négatif passé', japanese: '食べませんでした', kana: 'たべませんでした', frenchTranslation: "je n'ai pas mangé (poli)" },
    ],
    relatedPointIds: ['plain-form', 'negation'],
  },
  {
    id: 'wa-particle',
    titleFR: 'La particule は (wa) — sujet du discours',
    titleJP: '助詞「は」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: 'Marque le thème ou sujet du discours.',
    fullExplanationFR: `**は (wa)** est la particule de thème, l'une des plus importantes du japonais.

Elle se prononce "wa" (même si elle s'écrit avec le hiragana "ha" は).

Elle indique **de quoi on parle** — le sujet de la phrase. Elle peut aussi marquer un **contraste** entre deux éléments.`,
    structure: '[Sujet/Thème] + は + [Reste de la phrase]',
    examples: [
      { japanese: '私は田中です。', kana: 'わたしはたなかです。', frenchTranslation: 'Je suis Tanaka.' },
      { japanese: 'これは本です。', kana: 'これはほんです。', frenchTranslation: "C'est un livre." },
      { japanese: '猫は好きですが、犬は好きじゃないです。', kana: 'ねこはすきですが、いぬはすきじゃないです。', frenchTranslation: "J'aime les chats mais pas les chiens.", note: 'Contraste avec は' },
    ],
    relatedPointIds: ['ga-particle', 'wa-vs-ga'],
  },
  {
    id: 'ga-particle',
    titleFR: 'La particule が (ga) — sujet grammatical',
    titleJP: '助詞「が」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: 'Marque le sujet grammatical ou met en valeur un élément.',
    fullExplanationFR: `**が (ga)** marque le sujet **grammatical** de la phrase.

La différence avec は :
- **は** : "en ce qui concerne..."  (thème général)
- **が** : "c'est X qui..." (mise en valeur, information nouvelle)

が est aussi obligatoire après certains adjectifs comme 好き (suki = aimer) et 欲しい (hoshii = vouloir).`,
    structure: '[Sujet] + が + [Verbe/Adjectif]',
    examples: [
      { japanese: '誰が来ますか？', kana: 'だれがきますか？', frenchTranslation: 'Qui vient ?', note: 'Question sur le sujet' },
      { japanese: '猫が好きです。', kana: 'ねこがすきです。', frenchTranslation: "J'aime les chats.", note: 'Obligatoire avec 好き' },
      { japanese: '雨が降っています。', kana: 'あめがふっています。', frenchTranslation: 'Il pleut.' },
    ],
    relatedPointIds: ['wa-particle', 'wa-vs-ga'],
  },
  {
    id: 'wo-particle',
    titleFR: 'La particule を (wo) — complément d\'objet',
    titleJP: '助詞「を」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: 'Marque le complément d\'objet direct du verbe.',
    fullExplanationFR: `**を (wo)** — se prononce "o" en japonais moderne — marque le **complément d'objet direct**, c'est-à-dire ce sur quoi porte l'action du verbe.

C'est l'équivalent du COD français : "je mange **du riz**", "je lis **un livre**"`,
    structure: '[Objet] + を + [Verbe]',
    examples: [
      { japanese: 'ご飯を食べます。', kana: 'ごはんをたべます。', frenchTranslation: 'Je mange du riz.' },
      { japanese: '本を読みます。', kana: 'ほんをよみます。', frenchTranslation: 'Je lis un livre.' },
      { japanese: '日本語を勉強します。', kana: 'にほんごをべんきょうします。', frenchTranslation: "J'étudie le japonais." },
    ],
    relatedPointIds: ['wa-particle', 'ni-particle'],
  },
  {
    id: 'ni-particle',
    titleFR: 'La particule に (ni) — lieu, direction, moment',
    titleJP: '助詞「に」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: 'Indique la destination, le lieu d\'existence, ou le moment.',
    fullExplanationFR: `**に (ni)** a plusieurs emplois :

1. **Destination** : avec les verbes de déplacement (行く aller, 来る venir, 帰る rentrer)
2. **Lieu d'existence** : avec います (être, animé) et あります (être, inanimé)
3. **Moment précis** : pour les heures, jours, mois (mais pas pour 今日, 昨日, 明日...)`,
    structure: '[Lieu/Temps/Destination] + に',
    examples: [
      { japanese: '東京に行きます。', kana: 'とうきょうにいきます。', frenchTranslation: 'Je vais à Tokyo.', note: 'Direction' },
      { japanese: '駅にいます。', kana: 'えきにいます。', frenchTranslation: 'Je suis à la gare.', note: 'Lieu d\'existence' },
      { japanese: '三時に来てください。', kana: 'さんじにきてください。', frenchTranslation: 'Venez à 3 heures.', note: 'Moment précis' },
    ],
    relatedPointIds: ['de-particle', 'wo-particle'],
  },
  {
    id: 'de-particle',
    titleFR: 'La particule で (de) — lieu d\'action, moyen',
    titleJP: '助詞「で」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: 'Indique le lieu d\'une action ou le moyen utilisé.',
    fullExplanationFR: `**で (de)** a deux grands emplois :

1. **Lieu d'action** : là où se déroule une activité (différent de に qui indique l'existence)
2. **Moyen / instrument** : comment quelque chose est fait`,
    structure: '[Lieu d\'action] + で + [Verbe d\'action]   |   [Moyen] + で',
    examples: [
      { japanese: '図書館で勉強します。', kana: 'としょかんでべんきょうします。', frenchTranslation: "J'étudie à la bibliothèque.", note: 'Lieu d\'action' },
      { japanese: '電車で行きます。', kana: 'でんしゃでいきます。', frenchTranslation: "J'y vais en train.", note: 'Moyen de transport' },
      { japanese: '箸で食べます。', kana: 'はしでたべます。', frenchTranslation: 'Je mange avec des baguettes.', note: 'Instrument' },
    ],
    relatedPointIds: ['ni-particle'],
  },
  {
    id: 'i-adjectives',
    titleFR: 'Les adjectifs en い (i-keiyoushi)',
    titleJP: 'い形容詞',
    level: 'N5',
    category: 'adjectifs',
    shortExplanationFR: 'Les adjectifs japonais qui se terminent par い et se conjuguent.',
    fullExplanationFR: `En japonais, il existe deux types d'adjectifs. Les **adjectifs en い** (い形容詞) se terminent toujours par い et se **conjuguent comme des verbes**.

Pour le négatif, on remplace い par **くない**.
Pour le passé, on remplace い par **かった**.`,
    structure: '[Adjectif]-い + [Nom]  |  [Nom] は [Adjectif]-い + です',
    examples: [
      { japanese: '大きい猫です。', kana: 'おおきいねこです。', frenchTranslation: 'C\'est un grand chat.', note: 'Attributif' },
      { japanese: 'このケーキはおいしいです。', kana: 'このケーキはおいしいです。', frenchTranslation: 'Ce gâteau est délicieux.' },
      { japanese: '今日は寒くないです。', kana: 'きょうはさむくないです。', frenchTranslation: "Il ne fait pas froid aujourd'hui.", note: 'Forme négative' },
    ],
    conjugationTable: [
      { form: 'Affirmatif présent', japanese: '大きいです', kana: 'おおきいです', frenchTranslation: 'c\'est grand' },
      { form: 'Négatif présent', japanese: '大きくないです', kana: 'おおきくないです', frenchTranslation: 'ce n\'est pas grand' },
      { form: 'Affirmatif passé', japanese: '大きかったです', kana: 'おおきかったです', frenchTranslation: 'c\'était grand' },
      { form: 'Négatif passé', japanese: '大きくなかったです', kana: 'おおきくなかったです', frenchTranslation: 'ce n\'était pas grand' },
    ],
    relatedPointIds: ['na-adjectives'],
  },
  {
    id: 'na-adjectives',
    titleFR: 'Les adjectifs en な (na-keiyoushi)',
    titleJP: 'な形容詞',
    level: 'N5',
    category: 'adjectifs',
    shortExplanationFR: 'Les adjectifs japonais qui utilisent な devant un nom.',
    fullExplanationFR: `Les **adjectifs en な** (な形容詞) se comportent davantage comme des noms. Devant un nom, on ajoute **な**. Seuls, ils s'utilisent avec **です**.

Exemples courants : 好き (aimé), 嫌い (détesté), 綺麗 (beau/propre), 静か (calme), 便利 (pratique), 有名 (célèbre)`,
    structure: '[Adjectif-na] + な + [Nom]  |  [Nom] は [Adjectif-na] + です',
    examples: [
      { japanese: '静かな部屋です。', kana: 'しずかなへやです。', frenchTranslation: "C'est une chambre calme.", note: 'な devant le nom' },
      { japanese: '彼女は親切です。', kana: 'かのじょはしんせつです。', frenchTranslation: 'Elle est gentille.', note: 'Pas de な en fin de phrase' },
      { japanese: 'ピザが好きです。', kana: 'ピザがすきです。', frenchTranslation: "J'aime la pizza." },
    ],
    relatedPointIds: ['i-adjectives'],
  },
  {
    id: 'te-form',
    titleFR: 'La forme en て (te-form)',
    titleJP: 'て形',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: 'Forme de connexion essentielle pour enchaîner des actions et former des temps composés.',
    fullExplanationFR: `La **forme en て** est l'une des formes verbales les plus utiles. Elle sert à :
1. **Enchaîner des actions** : "je fais X, puis Y"
2. **Forme progressive** : てい + ます = "être en train de"
3. **Demandes polies** : てください = "s'il vous plaît, faites..."

La construction de la forme て dépend du groupe du verbe.`,
    structure: '～て + います (en train de)  |  ～て + ください (s\'il vous plaît)',
    examples: [
      { japanese: '起きて、朝ご飯を食べました。', kana: 'おきて、あさごはんをたべました。', frenchTranslation: 'Je me suis levé(e) et j\'ai mangé le petit-déjeuner.', note: 'Enchaînement' },
      { japanese: '日本語を勉強しています。', kana: 'にほんごをべんきょうしています。', frenchTranslation: "J'étudie le japonais (en ce moment).", note: 'Progressif' },
      { japanese: 'ここに座ってください。', kana: 'ここにすわってください。', frenchTranslation: 'Asseyez-vous ici, s\'il vous plaît.', note: 'Requête polie' },
    ],
    relatedPointIds: ['desu-masu', 'plain-form'],
  },
  {
    id: 'ka-question',
    titleFR: 'Poser des questions avec か',
    titleJP: '疑問文「か」',
    level: 'N5',
    category: 'phrases',
    shortExplanationFR: 'Transformer n\'importe quelle phrase en question en ajoutant か à la fin.',
    fullExplanationFR: `En japonais, il suffit d'ajouter la particule **か (ka)** à la fin d'une phrase pour la transformer en question. Il n'y a pas d'inversion sujet-verbe comme en français.

On peut aussi poser des questions avec des mots interrogatifs :
- 何 (nani/nan) = quoi
- どこ (doko) = où
- いつ (itsu) = quand
- だれ (dare) = qui
- どう (dou) = comment
- なぜ / どうして = pourquoi`,
    structure: '[Phrase] + か？',
    examples: [
      { japanese: 'これは本ですか？', kana: 'これはほんですか？', frenchTranslation: 'Est-ce un livre ?', note: 'Oui/Non question' },
      { japanese: 'どこに行きますか？', kana: 'どこにいきますか？', frenchTranslation: 'Où allez-vous ?', note: 'Avec mot interrogatif' },
      { japanese: '何時に来ますか？', kana: 'なんじにきますか？', frenchTranslation: 'À quelle heure venez-vous ?' },
    ],
    relatedPointIds: ['wa-particle', 'desu-masu'],
  },
]
