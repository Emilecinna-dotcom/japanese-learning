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
    titleFR: "La particule を (wo) — complément d'objet",
    titleJP: '助詞「を」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Marque le complément d'objet direct du verbe.",
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
    shortExplanationFR: "Indique la destination, le lieu d'existence, ou le moment.",
    fullExplanationFR: `**に (ni)** a plusieurs emplois :

1. **Destination** : avec les verbes de déplacement (行く aller, 来る venir, 帰る rentrer)
2. **Lieu d'existence** : avec います (être, animé) et あります (être, inanimé)
3. **Moment précis** : pour les heures, jours, mois (mais pas pour 今日, 昨日, 明日...)`,
    structure: '[Lieu/Temps/Destination] + に',
    examples: [
      { japanese: '東京に行きます。', kana: 'とうきょうにいきます。', frenchTranslation: 'Je vais à Tokyo.', note: 'Direction' },
      { japanese: '駅にいます。', kana: 'えきにいます。', frenchTranslation: 'Je suis à la gare.', note: "Lieu d'existence" },
      { japanese: '三時に来てください。', kana: 'さんじにきてください。', frenchTranslation: 'Venez à 3 heures.', note: 'Moment précis' },
    ],
    relatedPointIds: ['de-particle', 'wo-particle'],
  },
  {
    id: 'de-particle',
    titleFR: "La particule で (de) — lieu d'action, moyen",
    titleJP: '助詞「で」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Indique le lieu d'une action ou le moyen utilisé.",
    fullExplanationFR: `**で (de)** a deux grands emplois :

1. **Lieu d'action** : là où se déroule une activité (différent de に qui indique l'existence)
2. **Moyen / instrument** : comment quelque chose est fait`,
    structure: "[Lieu d'action] + で + [Verbe d'action]   |   [Moyen] + で",
    examples: [
      { japanese: '図書館で勉強します。', kana: 'としょかんでべんきょうします。', frenchTranslation: "J'étudie à la bibliothèque.", note: "Lieu d'action" },
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
      { japanese: '大きい猫です。', kana: 'おおきいねこです。', frenchTranslation: "C'est un grand chat.", note: 'Attributif' },
      { japanese: 'このケーキはおいしいです。', kana: 'このケーキはおいしいです。', frenchTranslation: 'Ce gâteau est délicieux.' },
      { japanese: '今日は寒くないです。', kana: 'きょうはさむくないです。', frenchTranslation: "Il ne fait pas froid aujourd'hui.", note: 'Forme négative' },
    ],
    conjugationTable: [
      { form: 'Affirmatif présent', japanese: '大きいです', kana: 'おおきいです', frenchTranslation: "c'est grand" },
      { form: 'Négatif présent', japanese: '大きくないです', kana: 'おおきくないです', frenchTranslation: "ce n'est pas grand" },
      { form: 'Affirmatif passé', japanese: '大きかったです', kana: 'おおきかったです', frenchTranslation: "c'était grand" },
      { form: 'Négatif passé', japanese: '大きくなかったです', kana: 'おおきくなかったです', frenchTranslation: "ce n'était pas grand" },
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
    shortExplanationFR: "Forme de connexion essentielle pour enchaîner des actions et former des temps composés.",
    fullExplanationFR: `La **forme en て** est l'une des formes verbales les plus utiles. Elle sert à :
1. **Enchaîner des actions** : "je fais X, puis Y"
2. **Forme progressive** : てい + ます = "être en train de"
3. **Demandes polies** : てください = "s'il vous plaît, faites..."

La construction de la forme て dépend du groupe du verbe.`,
    structure: "～て + います (en train de)  |  ～て + ください (s'il vous plaît)",
    examples: [
      { japanese: '起きて、朝ご飯を食べました。', kana: 'おきて、あさごはんをたべました。', frenchTranslation: "Je me suis levé(e) et j'ai mangé le petit-déjeuner.", note: 'Enchaînement' },
      { japanese: '日本語を勉強しています。', kana: 'にほんごをべんきょうしています。', frenchTranslation: "J'étudie le japonais (en ce moment).", note: 'Progressif' },
      { japanese: 'ここに座ってください。', kana: 'ここにすわってください。', frenchTranslation: "Asseyez-vous ici, s'il vous plaît.", note: 'Requête polie' },
    ],
    relatedPointIds: ['desu-masu', 'plain-form'],
  },
  {
    id: 'ka-question',
    titleFR: 'Poser des questions avec か',
    titleJP: '疑問文「か」',
    level: 'N5',
    category: 'phrases',
    shortExplanationFR: "Transformer n'importe quelle phrase en question en ajoutant か à la fin.",
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
  {
    id: 'mo-particle',
    titleFR: 'La particule も (mo) — aussi, moi aussi',
    titleJP: '助詞「も」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Exprime l'inclusion : \"aussi\", \"moi aussi\", \"ni... ni...\".",
    fullExplanationFR: `**も (mo)** remplace は ou が pour signifier **"aussi"** ou **"également"**. Elle s'utilise pour inclure un élément supplémentaire dans ce qui a déjà été dit.

Avec une négation, も prend le sens de **"non plus"** ou **"ni... ni..."**.`,
    structure: '[Sujet] + も + [Prédicat]',
    examples: [
      { japanese: '私も学生です。', kana: 'わたしもがくせいです。', frenchTranslation: "Moi aussi je suis étudiant(e).", note: 'Inclusion' },
      { japanese: '犬も猫も好きです。', kana: 'いぬもねこもすきです。', frenchTranslation: "J'aime les chiens et les chats.", note: 'Liste inclusive' },
      { japanese: '私も行きません。', kana: 'わたしもいきません。', frenchTranslation: "Moi non plus je n'y vais pas.", note: 'Négation' },
    ],
    relatedPointIds: ['wa-particle', 'ga-particle'],
  },
  {
    id: 'no-particle',
    titleFR: 'La particule の (no) — possession et connexion',
    titleJP: '助詞「の」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Relie deux noms : possession, appartenance, description.",
    fullExplanationFR: `**の (no)** est la particule de **possession** et de **connexion**.

Elle fonctionne comme le "de" en français, mais s'écrit entre les deux noms (dans l'ordre : possesseur の objet).

Elle peut aussi nominaliser un verbe ou un adjectif : 「食べるのが好き」 = "j'aime manger".`,
    structure: '[Possesseur] + の + [Objet possédé]',
    examples: [
      { japanese: 'これは私の本です。', kana: 'これはわたしのほんです。', frenchTranslation: "C'est mon livre.", note: 'Possession' },
      { japanese: '日本語の先生です。', kana: 'にほんごのせんせいです。', frenchTranslation: "C'est un professeur de japonais.", note: 'Appartenance' },
      { japanese: '赤いのをください。', kana: 'あかいのをください。', frenchTranslation: "Donnez-moi le rouge.", note: 'Nominalisation' },
    ],
    relatedPointIds: ['wa-particle'],
  },
  {
    id: 'to-particle',
    titleFR: 'La particule と (to) — et, avec, citation',
    titleJP: '助詞「と」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Signifie \"et\" (liste exhaustive) ou \"avec\" (accompagnement).",
    fullExplanationFR: `**と (to)** a deux emplois principaux :

1. **Conjonction "et"** : relie des noms de façon exhaustive (liste complète). Différent de や qui est non-exhaustif.
2. **"Avec"** : indique un accompagnement ou une action conjointe.
3. **Citation** : introduit ce que quelqu'un dit ou pense (と思う, と言う).`,
    structure: '[Nom A] + と + [Nom B]  |  [Verbe] + と思う',
    examples: [
      { japanese: 'パンとバターを買います。', kana: 'パンとバターをかいます。', frenchTranslation: "J'achète du pain et du beurre.", note: 'Liste exhaustive' },
      { japanese: '友達と行きます。', kana: 'ともだちといきます。', frenchTranslation: "J'y vais avec un(e) ami(e).", note: 'Accompagnement' },
      { japanese: '行きたいと思います。', kana: 'いきたいとおもいます。', frenchTranslation: "Je pense que je veux y aller.", note: 'Citation' },
    ],
    relatedPointIds: ['wa-particle', 'no-particle'],
  },
  {
    id: 'kara-particle',
    titleFR: 'La particule から (kara) — depuis, à partir de',
    titleJP: '助詞「から」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Indique le point de départ dans l'espace ou le temps.",
    fullExplanationFR: `**から (kara)** marque le **point de départ** :

- Dans l'espace : "de Tokyo" (depuis Tokyo)
- Dans le temps : "depuis 9h", "à partir de lundi"
- Cause : "parce que" (après un verbe/adjectif)`,
    structure: '[Lieu/Temps] + から  |  [Cause] + から + [Résultat]',
    examples: [
      { japanese: '東京から来ました。', kana: 'とうきょうからきました。', frenchTranslation: "Je viens de Tokyo.", note: 'Origine' },
      { japanese: '9時から始まります。', kana: 'くじからはじまります。', frenchTranslation: "Ça commence à 9h.", note: 'Départ temporel' },
      { japanese: '眠いから、寝ます。', kana: 'ねむいから、ねます。', frenchTranslation: "Je vais dormir parce que j'ai sommeil.", note: 'Cause' },
    ],
    relatedPointIds: ['made-particle', 'de-particle'],
  },
  {
    id: 'made-particle',
    titleFR: "La particule まで (made) — jusqu'à",
    titleJP: '助詞「まで」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Indique la limite finale dans l'espace ou le temps.",
    fullExplanationFR: `**まで (made)** marque la **limite**, la **fin** d'une action ou d'un déplacement.

Elle s'utilise avec から pour exprimer "de... à..." : 「月曜日から金曜日まで」 = "du lundi au vendredi".`,
    structure: '[Lieu/Temps] + まで',
    examples: [
      { japanese: '東京まで行きます。', kana: 'とうきょうまでいきます。', frenchTranslation: "Je vais jusqu'à Tokyo.", note: 'Destination limite' },
      { japanese: '5時まで働きます。', kana: 'ごじまではたらきます。', frenchTranslation: "Je travaille jusqu'à 17h.", note: 'Limite temporelle' },
      { japanese: '月曜から金曜まで仕事があります。', kana: 'げつようからきんようまでしごとがあります。', frenchTranslation: "J'ai du travail du lundi au vendredi.", note: 'から～まで' },
    ],
    relatedPointIds: ['kara-particle'],
  },
  {
    id: 'e-particle',
    titleFR: 'La particule へ (e) — direction',
    titleJP: '助詞「へ」',
    level: 'N5',
    category: 'particules',
    shortExplanationFR: "Indique la direction ou la destination d'un déplacement.",
    fullExplanationFR: `**へ (e)** — se prononce "e" malgré le hiragana "he" — marque la **direction** d'un mouvement. Elle est souvent interchangeable avec に, mais に insiste sur l'arrivée tandis que へ insiste sur la direction.`,
    structure: '[Destination] + へ + [Verbe de déplacement]',
    examples: [
      { japanese: '日本へ行きます。', kana: 'にほんへいきます。', frenchTranslation: "Je vais au Japon.", note: 'Direction' },
      { japanese: '駅へ向かっています。', kana: 'えきへむかっています。', frenchTranslation: "Je me dirige vers la gare." },
    ],
    relatedPointIds: ['ni-particle', 'de-particle'],
  },
  {
    id: 'negation-nai',
    titleFR: 'La négation en ない (forme polie : ません)',
    titleJP: '否定形',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: "Nier une action : ません (poli) ou ない (informel).",
    fullExplanationFR: `Pour nier un verbe en japonais :

- **Forme polie** : remplacer ます par **ません** (présent) ou **ませんでした** (passé)
- **Forme simple** : le radical verbal + **ない**

Pour les adjectifs en い : remplacer い par **くない**.
Pour les adjectifs en な et les noms + です : utiliser **じゃない / ではない**.`,
    structure: '[Radical] + ません (poli)  |  [Radical] + ない (simple)',
    examples: [
      { japanese: '食べません。', kana: 'たべません。', frenchTranslation: "Je ne mange pas.", note: 'Forme polie' },
      { japanese: '分からない。', kana: 'わからない。', frenchTranslation: "Je ne comprends pas.", note: 'Forme simple' },
      { japanese: '寒くないです。', kana: 'さむくないです。', frenchTranslation: "Il ne fait pas froid.", note: 'Adjectif en い nié' },
    ],
    relatedPointIds: ['desu-masu', 'i-adjectives'],
  },
  {
    id: 'past-form',
    titleFR: 'Le passé en た (ta-form)',
    titleJP: '過去形',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: "Exprime une action passée ou accomplie.",
    fullExplanationFR: `La **forme passée** (forme た) exprime qu'une action est terminée ou a eu lieu dans le passé.

- Forme polie : ました / ませんでした
- Forme simple (informel) : la terminaison た/だ, construite sur la même base que la forme て

Très utilisé dans les conversations normales entre amis.`,
    structure: '[Même racine que la forme て] + た / だ',
    examples: [
      { japanese: '昨日大阪に行った。', kana: 'きのうおおさかにいった。', frenchTranslation: "Hier je suis allé(e) à Osaka.", note: 'Passé informel' },
      { japanese: 'たこ焼きを食べた！', kana: 'たこやきをたべた！', frenchTranslation: "J'ai mangé des takoyaki !", note: "Partage d'expérience" },
      { japanese: '財布を忘れた。', kana: 'さいふをわすれた。', frenchTranslation: "J'ai oublié mon portefeuille.", note: 'Constat immédiat' },
    ],
    relatedPointIds: ['te-form', 'desu-masu'],
  },
  {
    id: 'te-iru',
    titleFR: '〜ている — action en cours ou état résultant',
    titleJP: '〜ている',
    level: 'N5',
    category: 'temps-et-aspect',
    shortExplanationFR: "Exprime une action en cours ou un état qui dure.",
    fullExplanationFR: `**〜ている** combine la **forme て** + **いる** (exister, pour les êtres animés).

Il a deux valeurs principales :
1. **Action en cours** (comme le présent progressif anglais "-ing") : je suis en train de...
2. **État résultant** : une action est terminée, mais son résultat dure.

Ex : 結婚している = "je suis marié(e)" (l'action de se marier est passée, mais l'état perdure)

À la forme polie : 〜ています. En parler courant, いる se réduit souvent en る ou disparaît.`,
    structure: '[Forme て] + いる / います',
    examples: [
      { japanese: '今、電話しています。', kana: 'いま、でんわしています。', frenchTranslation: "Je suis en train de téléphoner.", note: 'Action en cours' },
      { japanese: '眼鏡をかけています。', kana: 'めがねをかけています。', frenchTranslation: 'Je porte des lunettes.', note: 'État résultant durable' },
      { japanese: '道に迷っています。', kana: 'みちにまよっています。', frenchTranslation: "Je suis perdu(e).", note: 'Très utile à Tokyo/Osaka' },
    ],
    relatedPointIds: ['te-form', 'negation-nai'],
  },
  {
    id: 'tai-form',
    titleFR: '〜たい — vouloir faire quelque chose',
    titleJP: '〜たい形',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: "Exprimer un désir : \"je veux...\"",
    fullExplanationFR: `**〜たい** s'ajoute au radical en ます pour exprimer un **désir personnel**.

Il se conjugue comme un adjectif en い :
- Négatif : **〜たくない** (je ne veux pas)
- Passé : **〜たかった** (je voulais)

Attention : たい exprime uniquement le désir du locuteur. Pour parler du désir d'une autre personne, on utilise 〜たがっている.`,
    structure: '[Radical en ます] + たい',
    examples: [
      { japanese: '日本に行きたいです。', kana: 'にほんにいきたいです。', frenchTranslation: "Je veux aller au Japon.", note: 'Désir' },
      { japanese: 'ラーメンが食べたい。', kana: 'ラーメンがたべたい。', frenchTranslation: "J'ai envie de manger des ramen.", note: 'Informel' },
      { japanese: '勉強したくない。', kana: 'べんきょうしたくない。', frenchTranslation: "Je ne veux pas étudier.", note: 'Négatif' },
    ],
    relatedPointIds: ['hoshii', 'desu-masu'],
  },
  {
    id: 'can-dekiru',
    titleFR: '〜ことができる — pouvoir faire quelque chose',
    titleJP: '〜ことができる',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Exprimer la capacité ou la possibilité.",
    fullExplanationFR: `Pour dire qu'on **peut** faire quelque chose, le japonais utilise deux structures :

1. **[Verbe en dictionnaire] + ことができる** : forme plus formelle
2. **Forme potentielle** (modification du verbe) : forme plus naturelle en conversation

できる s'utilise aussi seul pour dire "c'est possible" ou "je peux".`,
    structure: '[Verbe dictionnaire] + ことができます',
    examples: [
      { japanese: '日本語を話すことができます。', kana: 'にほんごをはなすことができます。', frenchTranslation: "Je peux parler japonais.", note: 'Capacité formelle' },
      { japanese: '泳げますか？', kana: 'およげますか？', frenchTranslation: "Savez-vous nager ?", note: 'Forme potentielle' },
      { japanese: 'ここで写真が撮れます。', kana: 'ここでしゃしんがとれます。', frenchTranslation: "On peut prendre des photos ici.", note: 'Possibilité' },
    ],
    relatedPointIds: ['te-iru', 'desu-masu'],
  },
  {
    id: 'adjective-past',
    titleFR: 'Le passé des adjectifs',
    titleJP: '形容詞の過去形',
    level: 'N5',
    category: 'adjectifs',
    shortExplanationFR: "Conjuguer les adjectifs au passé et au passé négatif.",
    fullExplanationFR: `En japonais, les adjectifs se conjuguent aussi au passé.

**Adjectifs en い :**
- Passé affirmatif : 大きい → 大き**かった**です
- Passé négatif : 大きく**なかった**です

**Adjectifs en な :**
- Passé affirmatif : 静か**でした**
- Passé négatif : 静かじゃ**なかった**です`,
    structure: '[Adjectif-い] → [Radical] + かった(です)  |  [Adjectif-な] → [Na-adj] + でした',
    examples: [
      { japanese: '昨日は寒かったです。', kana: 'きのうはさむかったです。', frenchTranslation: "Il faisait froid hier.", note: 'Adjectif en い passé' },
      { japanese: '映画は面白くなかったです。', kana: 'えいがはおもしろくなかったです。', frenchTranslation: "Le film n'était pas intéressant.", note: 'Négatif passé' },
      { japanese: '子供の頃、元気でした。', kana: 'こどものころ、げんきでした。', frenchTranslation: "Quand j'étais enfant, j'étais en bonne forme.", note: 'Adjectif en な passé' },
    ],
    relatedPointIds: ['i-adjectives', 'na-adjectives'],
  },
  {
    id: 'suki-kirai',
    titleFR: '好き・嫌い — aimer et détester',
    titleJP: '好き・嫌い',
    level: 'N5',
    category: 'phrases',
    shortExplanationFR: "Exprimer ses goûts avec 好き (aimer) et 嫌い (détester).",
    fullExplanationFR: `**好き (suki)** et **嫌い (kirai)** sont des adjectifs en な qui expriment les goûts.

Important : l'objet aimé/détesté est marqué par **が** (et non を comme en français).

Pour renforcer : 大好き (dai-suki) = adorer, 大嫌い (dai-kirai) = vraiment détester.`,
    structure: '[Objet] + が + 好き / 嫌い + です',
    examples: [
      { japanese: '猫が好きです。', kana: 'ねこがすきです。', frenchTranslation: "J'aime les chats." },
      { japanese: '魚が嫌いです。', kana: 'さかながきらいです。', frenchTranslation: "Je déteste le poisson." },
      { japanese: '音楽が大好きです！', kana: 'おんがくがだいすきです！', frenchTranslation: "J'adore la musique !", note: '大好き = adorer' },
    ],
    relatedPointIds: ['ga-particle', 'hoshii'],
  },
  {
    id: 'hoshii',
    titleFR: '〜が欲しい — vouloir quelque chose',
    titleJP: '〜が欲しい',
    level: 'N5',
    category: 'phrases',
    shortExplanationFR: "Exprimer le désir de posséder quelque chose.",
    fullExplanationFR: `**欲しい (hoshii)** est un adjectif en い qui exprime le désir d'avoir **quelque chose** (un objet).

À distinguer de **〜たい** qui exprime le désir de **faire quelque chose** (une action).

L'objet désiré est marqué par が.`,
    structure: '[Objet] + が + 欲しい / 欲しいです',
    examples: [
      { japanese: '新しい車が欲しいです。', kana: 'あたらしいくるまがほしいです。', frenchTranslation: "Je veux une nouvelle voiture." },
      { japanese: '時間が欲しい。', kana: 'じかんがほしい。', frenchTranslation: "Je voudrais du temps.", note: 'Informel' },
      { japanese: 'お金が欲しくない。', kana: 'おかねがほしくない。', frenchTranslation: "Je ne veux pas d'argent.", note: 'Négatif' },
    ],
    relatedPointIds: ['tai-form', 'suki-kirai'],
  },
  {
    id: 'nde-form',
    titleFR: '〜んです / のです — explication et insistance',
    titleJP: '〜んです・のです',
    level: 'N4',
    category: 'phrases',
    shortExplanationFR: "Donner une explication ou mettre en valeur une information.",
    fullExplanationFR: `**んです** est une contraction de **のです** et sert à :

1. **Expliquer** une situation : "c'est que...", "en fait..."
2. **Demander une explication** : 〜んですか = "c'est que...?"
3. **Insister** ou **mettre en valeur** une information

C'est très naturel en japonais oral.`,
    structure: '[Verbe/Adjectif] + んです / んですか',
    examples: [
      { japanese: '具合が悪いんです。', kana: 'ぐあいがわるいんです。', frenchTranslation: "C'est que je ne me sens pas bien.", note: 'Explication' },
      { japanese: 'どこに行くんですか？', kana: 'どこにいくんですか？', frenchTranslation: "Où est-ce que vous allez (donc) ?", note: 'Question-explication' },
      { japanese: '実は、日本人なんです。', kana: 'じつは、にほんじんなんです。', frenchTranslation: "En fait, je suis japonais(e).", note: 'Révélation' },
    ],
    relatedPointIds: ['desu-masu', 'ka-question'],
  },
  {
    id: 'masho',
    titleFR: '〜ましょう — proposer, suggérer',
    titleJP: '〜ましょう',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: "Faire une proposition ou une suggestion : \"faisons...\"",
    fullExplanationFR: `**〜ましょう (mashou)** est la forme volitionnelle polie. Elle sert à :

1. **Proposer** de faire quelque chose ensemble : "allons-y !", "faisons..."
2. **Répondre positivement** à une invitation

La forme interrogative **〜ましょうか** signifie "voulez-vous qu'on... ?" ou "si on... ?".`,
    structure: '[Radical en ます] + ましょう / ましょうか',
    examples: [
      { japanese: '行きましょう！', kana: 'いきましょう！', frenchTranslation: "Allons-y !", note: 'Suggestion' },
      { japanese: '一緒に食べましょう。', kana: 'いっしょにたべましょう。', frenchTranslation: "Mangeons ensemble.", note: 'Invitation' },
      { japanese: '休みましょうか？', kana: 'やすみましょうか？', frenchTranslation: "Si on faisait une pause ?", note: 'Proposition douce' },
    ],
    relatedPointIds: ['desu-masu', 'tai-form'],
  },
  {
    id: 'nakereba-nai',
    titleFR: '〜なければならない — devoir, obligation',
    titleJP: '〜なければならない',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Exprimer une obligation : \"il faut que...\", \"je dois...\"",
    fullExplanationFR: `**〜なければならない** est la structure principale pour exprimer l'obligation.

En conversation, on utilise souvent la forme abrégée **〜なきゃ** ou **〜なければ**.

On peut aussi utiliser **〜なければいけない** (même sens, légèrement différent stylistiquement).`,
    structure: '[Forme ない] + ければならない  |  [Forme ない] + きゃ (informel)',
    examples: [
      { japanese: '宿題をしなければなりません。', kana: 'しゅくだいをしなければなりません。', frenchTranslation: "Je dois faire mes devoirs.", note: 'Obligation formelle' },
      { japanese: '早く起きなきゃ。', kana: 'はやくおきなきゃ。', frenchTranslation: "Il faut que je me lève tôt.", note: 'Informel' },
      { japanese: '薬を飲まなければいけません。', kana: 'くすりをのまなければいけません。', frenchTranslation: "Je dois prendre mes médicaments.", note: 'Variante' },
    ],
    relatedPointIds: ['negation-nai', 'te-mo-ii'],
  },
  {
    id: 'te-mo-ii',
    titleFR: '〜てもいい — permission',
    titleJP: '〜てもいい',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: "Demander ou accorder une permission : \"c'est OK de...\"",
    fullExplanationFR: `**〜てもいい** s'utilise pour :

1. **Demander la permission** : 〜てもいいですか ? = "est-ce que je peux... ?"
2. **Accorder la permission** : 〜てもいいです = "tu peux...", "c'est permis de..."

La forme négative **〜てはいけない** signifie "il ne faut pas".`,
    structure: '[Forme て] + もいい / もいいですか',
    examples: [
      { japanese: 'ここに座ってもいいですか？', kana: 'ここにすわってもいいですか？', frenchTranslation: "Je peux m'asseoir ici ?", note: 'Demande de permission' },
      { japanese: '写真を撮ってもいいです。', kana: 'しゃしんをとってもいいです。', frenchTranslation: "Vous pouvez prendre des photos.", note: 'Permission accordée' },
      { japanese: 'もう帰ってもいいよ。', kana: 'もうかえってもいいよ。', frenchTranslation: "Tu peux rentrer maintenant.", note: 'Informel' },
    ],
    relatedPointIds: ['te-form', 'te-wa-ikenai'],
  },
  {
    id: 'te-wa-ikenai',
    titleFR: '〜てはいけない — interdiction',
    titleJP: '〜てはいけない',
    level: 'N5',
    category: 'verbes',
    shortExplanationFR: "Exprimer une interdiction : \"il ne faut pas...\"",
    fullExplanationFR: `**〜てはいけない** exprime l'**interdiction** ou l'impermissibilité.

Variantes :
- **〜てはいけません** (poli)
- **〜てはダメ / てはだめ** (informel)
- **〜ちゃいけない** (très informel)

C'est l'opposé de 〜てもいい.`,
    structure: '[Forme て] + はいけない / はいけません',
    examples: [
      { japanese: 'ここで食べてはいけません。', kana: 'ここでたべてはいけません。', frenchTranslation: "Il est interdit de manger ici.", note: 'Interdiction' },
      { japanese: 'タバコを吸ってはダメです。', kana: 'タバコをすってはダメです。', frenchTranslation: "Il est interdit de fumer.", note: 'Informel' },
      { japanese: '嘘をついちゃいけないよ。', kana: 'うそをついちゃいけないよ。', frenchTranslation: "Il ne faut pas mentir.", note: 'Très informel' },
    ],
    relatedPointIds: ['te-mo-ii', 'nakereba-nai'],
  },
  {
    id: 'mae-ni',
    titleFR: '〜前に (mae ni) — avant de',
    titleJP: '〜前に',
    level: 'N5',
    category: 'temps-et-aspect',
    shortExplanationFR: "Indiquer qu'une action se passe avant une autre.",
    fullExplanationFR: `**前に (mae ni)** signifie **"avant de"** ou **"avant que"**.

Avec un verbe au dictionnaire : [verbe] + 前に = "avant de faire..."
Avec un nom : [nom] + の前に = "avant [le nom]"

Attention : le verbe avant 前に est toujours au **présent du dictionnaire**, même si la phrase entière est au passé.`,
    structure: '[Verbe dictionnaire] + 前に  |  [Nom] + の前に',
    examples: [
      { japanese: '寝る前に歯を磨きます。', kana: 'ねるまえにはをみがきます。', frenchTranslation: "Je me brosse les dents avant de dormir.", note: 'Routine' },
      { japanese: '食事の前に手を洗いましょう。', kana: 'しょくじのまえにてをあらいましょう。', frenchTranslation: "Lavons-nous les mains avant le repas.", note: 'Nom + の前に' },
      { japanese: '日本に来る前に、少し勉強しました。', kana: 'にほんにくるまえに、すこしべんきょうしました。', frenchTranslation: "Avant de venir au Japon, j'ai un peu étudié.", note: 'Passé' },
    ],
    relatedPointIds: ['ato-de', 'toki'],
  },
  {
    id: 'ato-de',
    titleFR: '〜後で (ato de) — après avoir',
    titleJP: '〜後で',
    level: 'N5',
    category: 'temps-et-aspect',
    shortExplanationFR: "Indiquer qu'une action se passe après une autre.",
    fullExplanationFR: `**後で (ato de)** signifie **"après"** ou **"après avoir fait..."**.

Avec un verbe au passé (forme た) : [verbe-た] + 後で = "après avoir fait..."
Avec un nom : [nom] + の後で = "après [le nom]"`,
    structure: '[Verbe-た] + 後で  |  [Nom] + の後で',
    examples: [
      { japanese: '宿題をした後で、テレビを見ます。', kana: 'しゅくだいをしたあとで、テレビをみます。', frenchTranslation: "Après avoir fait mes devoirs, je regarderai la télé.", note: 'Séquence' },
      { japanese: '授業の後で、カフェに行きましょう。', kana: 'じゅぎょうのあとで、カフェにいきましょう。', frenchTranslation: "Allons au café après les cours.", note: 'Nom + の後で' },
    ],
    relatedPointIds: ['mae-ni', 'toki'],
  },
  {
    id: 'kara-after',
    titleFR: '〜てから — après avoir fait (enchaînement)',
    titleJP: '〜てから',
    level: 'N5',
    category: 'temps-et-aspect',
    shortExplanationFR: "Exprimer une séquence : \"après avoir fait X, je fais Y\".",
    fullExplanationFR: `**〜てから** indique qu'une action est **complétée** avant qu'une autre commence.

Différence avec 後で : てから insiste sur le fait que la première action est **nécessairement complète** avant la deuxième. 後で est plus neutre.`,
    structure: '[Forme て] + から + [Action suivante]',
    examples: [
      { japanese: '手を洗ってから食べます。', kana: 'てをあらってからたべます。', frenchTranslation: "Je me lave les mains, puis je mange.", note: 'Séquence nécessaire' },
      { japanese: '考えてから答えます。', kana: 'かんがえてからこたえます。', frenchTranslation: "Je réfléchis d'abord, puis je réponds.", note: 'Ordre important' },
    ],
    relatedPointIds: ['ato-de', 'mae-ni'],
  },
  {
    id: 'toki',
    titleFR: '〜時 (toki) — quand, au moment où',
    titleJP: '〜時',
    level: 'N4',
    category: 'temps-et-aspect',
    shortExplanationFR: "Exprimer le moment où quelque chose se passe.",
    fullExplanationFR: `**時 (toki)** signifie **"quand"** ou **"au moment où"**.

Le choix du temps avant 時 est subtil :
- Verbe au **dictionnaire** + 時 : l'action principale et la subordonnée sont simultanées
- Verbe au **passé** (た) + 時 : l'action est déjà complète quand l'action principale se produit`,
    structure: '[Verbe/Adjectif] + 時',
    examples: [
      { japanese: '子供の時、ピアノを弾いていました。', kana: 'こどものとき、ピアノをひいていました。', frenchTranslation: "Quand j'étais enfant, je jouais du piano.", note: 'Temps révolu' },
      { japanese: '困った時は電話してください。', kana: 'こまったとき、でんわしてください。', frenchTranslation: "Appelez-moi quand vous avez un problème.", note: 'Condition' },
      { japanese: '日本に来た時、富士山が見えました。', kana: 'にほんにきたとき、ふじさんがみえました。', frenchTranslation: "Quand je suis arrivé au Japon, j'ai vu le Mont Fuji.", note: 'Passé' },
    ],
    relatedPointIds: ['mae-ni', 'ato-de'],
  },
  {
    id: 'yo-ne',
    titleFR: 'よ et ね — particules finales',
    titleJP: '終助詞「よ・ね」',
    level: 'N5',
    category: 'phrases',
    shortExplanationFR: "Nuancer une phrase : affirmation (よ) ou recherche d'accord (ね).",
    fullExplanationFR: `Les **particules finales** よ et ね s'ajoutent en fin de phrase pour nuancer le ton.

**よ (yo)** : insiste sur une information, comme si on affirmait quelque chose que l'autre ne sait pas.
→ "Je t'assure que...", "C'est comme ça !"

**ね (ne)** : cherche l'accord ou confirme quelque chose de partagé.
→ "n'est-ce pas ?", "tu vois ce que je veux dire ?"`,
    structure: '[Phrase] + よ / ね / よね',
    examples: [
      { japanese: 'これは美味しいですよ！', kana: 'これはおいしいですよ！', frenchTranslation: "C'est vraiment délicieux (je t'assure) !", note: 'Affirmation' },
      { japanese: '今日は暑いですね。', kana: 'きょうはあついですね。', frenchTranslation: "Il fait chaud aujourd'hui, n'est-ce pas ?", note: 'Accord' },
      { japanese: 'もう遅いですよね。', kana: 'もうおそいですよね。', frenchTranslation: "Il est déjà tard, non ?", note: 'よね combiné' },
    ],
    relatedPointIds: ['ka-question', 'desu-masu'],
  },
  {
    id: 'dono-kurai',
    titleFR: 'どのくらい — combien de temps, quelle distance',
    titleJP: 'どのくらい・どれくらい',
    level: 'N5',
    category: 'phrases',
    shortExplanationFR: "Demander une quantité, une durée ou une distance.",
    fullExplanationFR: `**どのくらい (dono kurai)** et sa variante **どれくらい** servent à demander une **quantité approximative** : durée, distance, prix, etc.

Ils correspondent à "combien de temps", "jusqu'où", "à quel point"...`,
    structure: 'どのくらい + [Verbe] ?',
    examples: [
      { japanese: '日本語を勉強してどのくらいですか？', kana: 'にほんごをべんきょうしてどのくらいですか？', frenchTranslation: "Depuis combien de temps étudiez-vous le japonais ?", note: 'Durée' },
      { japanese: '駅までどのくらいかかりますか？', kana: 'えきまでどのくらいかかりますか？', frenchTranslation: "Combien de temps faut-il pour aller à la gare ?", note: 'Distance/durée' },
      { japanese: 'どのくらい食べましたか？', kana: 'どのくらいたべましたか？', frenchTranslation: "Vous avez mangé combien ?", note: 'Quantité' },
    ],
    relatedPointIds: ['ka-question', 'yo-ne'],
  },

  // ── Grammaire N4 ─────────────────────────────────────────────────────────────

  {
    id: 'potential-form',
    titleFR: 'Forme potentielle — pouvoir faire',
    titleJP: '可能形（〜られる・〜える）',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Exprimer la capacité à faire quelque chose : 'pouvoir', 'savoir faire'.",
    fullExplanationFR: `La **forme potentielle** indique qu'on est capable de faire quelque chose.

**Verbes en る (ichidan)** : remplacer る par **られる**
→ 食べる → 食べられる (pouvoir manger)

**Verbes en う (godan)** : changer la dernière syllabe en **える**
→ 書く → 書ける / 飲む → 飲める / 行く → 行ける

**Verbes irréguliers** :
→ する → できる / くる → こられる

La forme potentielle se conjugue ensuite comme un verbe en る.`,
    structure: '[Verbe ichidan] → Radical + られる   |   [Verbe godan] → Radical (forme -e) + る',
    examples: [
      { japanese: '日本語が話せます。', kana: 'にほんごがはなせます。', frenchTranslation: 'Je parle japonais (je suis capable de parler japonais).', note: '話す → 話せる' },
      { japanese: '泳げません。', kana: 'およげません。', frenchTranslation: 'Je ne sais pas nager.', note: '泳ぐ → 泳げる' },
      { japanese: '明日来られますか？', kana: 'あしたこられますか？', frenchTranslation: 'Pouvez-vous venir demain ?', note: 'くる → こられる' },
    ],
    conjugationTable: [
      { form: 'Affirmatif présent', japanese: '食べられる', kana: 'たべられる', frenchTranslation: 'pouvoir manger' },
      { form: 'Négatif présent', japanese: '食べられない', kana: 'たべられない', frenchTranslation: 'ne pas pouvoir manger' },
      { form: 'Poli affirmatif', japanese: '食べられます', kana: 'たべられます', frenchTranslation: 'pouvoir manger (poli)' },
      { form: 'Poli négatif', japanese: '食べられません', kana: 'たべられません', frenchTranslation: 'ne pas pouvoir manger (poli)' },
    ],
    relatedPointIds: ['can-dekiru', 'te-form'],
  },
  {
    id: 'passive-form',
    titleFR: 'Forme passive — être fait par',
    titleJP: '受身形（〜られる）',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Exprimer qu'on subit une action : 'être fait par quelqu'un'.",
    fullExplanationFR: `La **forme passive** indique que le sujet subit l'action.

**Verbes en る (ichidan)** : radical + **られる**
→ 食べる → 食べられる (être mangé)

**Verbes en う (godan)** : voyelle finale → **a** + れる
→ 書く → 書かれる / 飲む → 飲まれる / 読む → 読まれる

**Attention** : la forme passive et potentielle sont identiques pour les verbes ichidan. Le contexte détermine le sens.

**Le sujet est marqué par に** : 先生に褒められた (être félicité par le professeur).`,
    structure: '[Verbe ichidan] → Radical + られる   |   [Verbe godan] → Radical (forme -a) + れる',
    examples: [
      { japanese: '先生に褒められました。', kana: 'せんせいにほめられました。', frenchTranslation: "J'ai été félicité par le professeur.", note: '褒める → 褒められる' },
      { japanese: '雨に降られた。', kana: 'あめにふられた。', frenchTranslation: "Il m'est tombé de la pluie dessus.", note: 'Passif de nuisance' },
      { japanese: 'この本は多くの人に読まれています。', kana: 'このほんはおおくのひとによまれています。', frenchTranslation: 'Ce livre est lu par beaucoup de gens.', note: 'Passif neutre' },
    ],
    relatedPointIds: ['potential-form', 'causative-form'],
  },
  {
    id: 'causative-form',
    titleFR: 'Forme causative — faire faire',
    titleJP: '使役形（〜させる）',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Exprimer qu'on fait faire quelque chose à quelqu'un : 'laisser faire', 'forcer à faire'.",
    fullExplanationFR: `La **forme causative** exprime qu'on provoque une action chez quelqu'un.

**Verbes en る (ichidan)** : radical + **させる**
→ 食べる → 食べさせる (faire manger)

**Verbes en う (godan)** : voyelle finale → **a** + せる
→ 書く → 書かせる / 飲む → 飲ませる

**Deux sens** :
1. Forcer quelqu'un à faire (obligation)
2. Laisser/autoriser quelqu'un à faire (permission)

**La personne qui fait l'action** est marquée par に ou を selon le verbe.`,
    structure: '[Verbe ichidan] → Radical + させる   |   [Verbe godan] → Radical (forme -a) + せる',
    examples: [
      { japanese: '子供に野菜を食べさせました。', kana: 'こどもにやさいをたべさせました。', frenchTranslation: "J'ai fait manger des légumes à l'enfant.", note: 'に = la personne qui agit' },
      { japanese: '先生が学生を立たせました。', kana: 'せんせいががくせいをたたせました。', frenchTranslation: "Le professeur a fait se lever l'étudiant.", note: 'を = la personne contrainte' },
      { japanese: '好きなものを食べさせてあげます。', kana: 'すきなものをたべさせてあげます。', frenchTranslation: "Je vais te laisser manger ce que tu veux.", note: 'Sens de permission' },
    ],
    relatedPointIds: ['passive-form', 'potential-form'],
  },
  {
    id: 'te-shimau',
    titleFR: '〜てしまう — finir par faire (regret ou achèvement)',
    titleJP: '〜てしまう',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Exprimer un achèvement complet ou un regret : 'j'ai fini par...', 'j'ai malheureusement...'.",
    fullExplanationFR: `**〜てしまう (te shimau)** s'attache à la forme て et exprime :

1. **Achèvement complet** : l'action est terminée, souvent avec soulagement ou résignation.
→ 宿題をしてしまった。 (J'ai terminé tous mes devoirs.)

2. **Regret ou inadvertance** : quelque chose de fâcheux s'est produit.
→ 財布を忘れてしまった。 (J'ai malheureusement oublié mon portefeuille.)

**Formes contractées** (langage oral) :
→ してしまう → しちゃう / してしまった → しちゃった`,
    structure: '[Verbe forme-て] + しまう',
    examples: [
      { japanese: 'ケーキを全部食べてしまいました。', kana: 'ケーキをぜんぶたべてしまいました。', frenchTranslation: "J'ai mangé tout le gâteau.", note: 'Achèvement total' },
      { japanese: '鍵を失くしてしまった。', kana: 'かぎをなくしてしまった。', frenchTranslation: "J'ai perdu mes clés (hélas).", note: 'Regret / inadvertance' },
      { japanese: '遅刻しちゃった！', kana: 'ちこくしちゃった！', frenchTranslation: "Zut, je suis arrivé en retard !", note: 'Forme contractée orale' },
    ],
    relatedPointIds: ['te-form', 'te-iru'],
  },
  {
    id: 'te-ageru-morau-kureru',
    titleFR: '〜てあげる / 〜てもらう / 〜てくれる — donner et recevoir des actions',
    titleJP: '〜てあげる・〜てもらう・〜てくれる',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Exprimer qui rend service à qui : le sens de la faveur change selon le verbe auxiliaire.",
    fullExplanationFR: `Ces trois structures s'attachent à la forme て d'un verbe pour indiquer des échanges de services.

**〜てあげる** : "je/quelqu'un fait quelque chose **pour** une autre personne"
→ Je suis le donneur du service.
→ 友達に教えてあげた。 (J'ai expliqué à mon ami.)

**〜てもらう** : "je/quelqu'un **reçoit** un service d'une autre personne"
→ Je suis le bénéficiaire. La personne qui aide est marquée par に.
→ 友達に教えてもらった。 (J'ai appris grâce à mon ami / mon ami m'a expliqué.)

**〜てくれる** : "quelqu'un fait quelque chose **pour moi** (ou pour ceux de mon groupe)"
→ La personne qui aide est le sujet, le bénéficiaire est implicitement moi.
→ 友達が教えてくれた。 (Mon ami m'a expliqué.)`,
    structure: '[Verbe forme-て] + あげる / もらう / くれる',
    examples: [
      { japanese: '荷物を持ってあげました。', kana: 'にもつをもってあげました。', frenchTranslation: "J'ai porté ses bagages pour lui.", note: 'あげる = je donne le service' },
      { japanese: '先生に説明してもらいました。', kana: 'せんせいにせつめいしてもらいました。', frenchTranslation: "Le professeur m'a donné des explications.", note: 'もらう = je reçois le service' },
      { japanese: '友達が手伝ってくれた。', kana: 'ともだちがてつだってくれた。', frenchTranslation: 'Mon ami m\'a aidé.', note: 'くれる = quelqu\'un me donne le service' },
    ],
    relatedPointIds: ['te-form', 'te-shimau'],
  },
  {
    id: 'tame-ni',
    titleFR: '〜ために — dans le but de, pour',
    titleJP: '〜ために',
    level: 'N4',
    category: 'phrases',
    shortExplanationFR: "Exprimer un but ou une cause : 'pour faire', 'afin de'.",
    fullExplanationFR: `**〜ために (tame ni)** exprime un **but** ou une **cause**.

**But (action volontaire)** : [Verbe dictionnaire / Nom + の] + ために
→ 日本語を勉強するために、毎日練習します。 (Pour apprendre le japonais, je m'entraîne chaque jour.)
→ 健康のために走っています。 (Je cours pour ma santé.)

**Cause** : [Verbe た形 / Nom] + ために
→ 雨が降ったために試合が中止になった。 (Le match a été annulé à cause de la pluie.)

**Différence avec ように** : ために implique une intention personnelle, ように est plus indirect ou utilisé avec des verbes d'état.`,
    structure: '[Verbe dictionnaire / Nom + の] + ために',
    examples: [
      { japanese: '大学に入るために一生懸命勉強しています。', kana: 'だいがくにはいるためにいっしょうけんめいべんきょうしています。', frenchTranslation: "J'étudie très sérieusement pour entrer à l'université.", note: 'But' },
      { japanese: '体を鍛えるためにジムに通っています。', kana: 'からだをきたえるためにジムにかよっています。', frenchTranslation: "Je vais à la salle de sport pour renforcer mon corps.", note: 'But' },
      { japanese: '事故のために電車が遅れました。', kana: 'じこのためにでんしゃがおくれました。', frenchTranslation: "Le train a eu du retard à cause d'un accident.", note: 'Cause' },
    ],
    relatedPointIds: ['you-ni', 'kara-after'],
  },
  {
    id: 'you-ni',
    titleFR: '〜ように — pour que, de façon à',
    titleJP: '〜ように',
    level: 'N4',
    category: 'phrases',
    shortExplanationFR: "Exprimer un but plus indirect ou un souhait : 'pour que', 'de manière à ce que'.",
    fullExplanationFR: `**〜ように (you ni)** exprime :

1. **But indirect** (résultat souhaité, souvent hors contrôle direct) : [Verbe dictionnaire / négatif] + ように
→ 忘れないようにメモします。 (Je prends note pour ne pas oublier.)
→ 聞こえるように大きい声で話してください。 (Parlez fort pour qu'on vous entende.)

2. **Instruction ou prière** : [Verbe dictionnaire / nai-form] + ようにしてください
→ 早く来るようにしてください。 (Veuillez venir tôt.)

3. **Effort / habitude** : 〜ようにする → "essayer de faire", "faire attention à"
→ 毎日運動するようにしています。 (J'essaie de faire du sport chaque jour.)`,
    structure: '[Verbe dictionnaire / négatif] + ように',
    examples: [
      { japanese: '日本語が話せるように毎日練習しています。', kana: 'にほんごがはなせるようにまいにちれんしゅうしています。', frenchTranslation: "Je m'entraîne tous les jours pour pouvoir parler japonais.", note: 'But indirect' },
      { japanese: '遅刻しないようにしてください。', kana: 'ちこくしないようにしてください。', frenchTranslation: 'Veuillez ne pas être en retard.', note: 'Instruction' },
      { japanese: '野菜を食べるようにしています。', kana: 'やさいをたべるようにしています。', frenchTranslation: "J'essaie de manger des légumes.", note: 'Effort / habitude' },
    ],
    relatedPointIds: ['tame-ni', 'te-form'],
  },
  {
    id: 'sou-da',
    titleFR: '〜そう — on dirait que, avoir l\'air de',
    titleJP: '〜そうだ（様態）',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Juger à partir de l'apparence : 'on dirait que', 'ça a l'air de'.",
    fullExplanationFR: `**〜そうだ (sou da)** de sens "apparence" s'attache directement au **radical** des adjectifs et des verbes pour exprimer une **impression visuelle**.

**Adjectifs い** : supprimer い, ajouter そうだ
→ 美味しい → 美味しそうだ (ça a l'air délicieux)

**Adjectifs な** : ajouter そうだ directement
→ 元気 → 元気そうだ (il a l'air en forme)

**Verbes** : forme ます sans ます, ajouter そうだ
→ 雨が降りそうだ (il va pleuvoir on dirait)

**Attention** : よさそう (いい → よい → よさ) et なさそう (ない → なさ)

**Différence** avec らしい (hearsay - information entendue) : そう est une observation directe.`,
    structure: '[Radical adj-い / adj-な / ます-forme] + そうだ',
    examples: [
      { japanese: 'この料理は美味しそうですね。', kana: 'このりょうりはおいしそうですね。', frenchTranslation: 'Ce plat a l\'air délicieux, n\'est-ce pas ?', note: 'Adjectif い' },
      { japanese: '彼は忙しそうだ。', kana: 'かれはいそがしそうだ。', frenchTranslation: 'Il a l\'air occupé.', note: 'Adjectif い' },
      { japanese: '今にも雨が降りそうです。', kana: 'いまにもあめがふりそうです。', frenchTranslation: 'On dirait qu\'il va pleuvoir d\'un moment à l\'autre.', note: 'Verbe' },
    ],
    relatedPointIds: ['rashii', 'you-da'],
  },
  {
    id: 'rashii',
    titleFR: '〜らしい — il paraît que, apparemment',
    titleJP: '〜らしい',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Rapporter une information entendue ou déduire : 'il paraît que', 'on dirait que'.",
    fullExplanationFR: `**〜らしい (rashii)** s'attache à la forme ordinaire (plain form) d'un verbe, d'un adjectif ou d'un nom et exprime :

1. **Ouï-dire** (information reçue de l'extérieur) : "il paraît que", "j'ai entendu que"
→ 明日は雨らしい。 (Il paraît qu'il va pleuvoir demain.)

2. **Déduction basée sur des indices** : "ça a tout d'un...", "c'est typique de..."
→ 彼らしい答えだ。 (C'est une réponse bien de lui.)
→ 子供らしい。 (C'est typiquement enfantin.)

**Différence** : そう = observation visuelle directe / らしい = information extérieure ou déduction`,
    structure: '[Verbe forme ordinaire / Adjectif / Nom] + らしい',
    examples: [
      { japanese: '田中さんは明日来ないらしいです。', kana: 'たなかさんはあしたこないらしいです。', frenchTranslation: 'Il paraît que Tanaka-san ne viendra pas demain.', note: 'Ouï-dire' },
      { japanese: '彼女は結婚したらしい。', kana: 'かのじょはけっこんしたらしい。', frenchTranslation: 'Il semblerait qu\'elle se soit mariée.', note: 'Déduction' },
      { japanese: '外は寒いらしいよ。', kana: 'そとはさむいらしいよ。', frenchTranslation: 'Il paraît qu\'il fait froid dehors.', note: 'Ouï-dire' },
    ],
    relatedPointIds: ['sou-da', 'you-da'],
  },
  {
    id: 'you-da',
    titleFR: '〜ようだ — il semble que, on dirait',
    titleJP: '〜ようだ',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Formuler une supposition basée sur des indices concrets : 'il semble que', 'on dirait'.",
    fullExplanationFR: `**〜ようだ (you da)** exprime une **supposition basée sur des preuves directes** (ce qu'on voit, entend, ressent).

S'attache à la forme ordinaire des verbes et adjectifs, à **の** après les noms.

→ 外が騒がしいようだ。 (Il semble qu'il y ait du bruit dehors.)
→ 風邪を引いたようです。 (J'ai l'impression d'attraper un rhume.)

**Formes dérivées utiles** :
→ ようだ → ようです (poli) → ように (comme si) → ような (attributif)
→ まるで夢のようだ。 (C'est comme un rêve.)`,
    structure: '[Verbe forme ordinaire / Adj / Nom + の] + ようだ',
    examples: [
      { japanese: '彼は疲れているようです。', kana: 'かれはつかれているようです。', frenchTranslation: 'Il semble être fatigué.', note: 'Déduction' },
      { japanese: 'まるで映画のような話ですね。', kana: 'まるでえいがのようなはなしですね。', frenchTranslation: "C'est une histoire comme dans un film.", note: 'Comparaison ような' },
      { japanese: '雨が降るようです。', kana: 'あめがふるようです。', frenchTranslation: 'Il semble qu\'il va pleuvoir.', note: 'Prévision' },
    ],
    relatedPointIds: ['rashii', 'sou-da'],
  },
  {
    id: 'kamoshirenai',
    titleFR: '〜かもしれない — peut-être, il se pourrait que',
    titleJP: '〜かもしれない',
    level: 'N4',
    category: 'phrases',
    shortExplanationFR: "Exprimer une possibilité incertaine : 'peut-être', 'il se pourrait que'.",
    fullExplanationFR: `**〜かもしれない (kamoshirenai)** s'attache à la forme ordinaire et exprime une **possibilité incertaine**, environ 50% de probabilité.

Correspond à "peut-être que", "il se pourrait que", "c'est possible que".

**Poli** : かもしれません
**Forme contractée orale** : かも

→ 明日雨が降るかもしれない。 (Il se pourrait qu'il pleuve demain.)
→ 彼は来ないかも。 (Il viendra peut-être pas.)

**Différence de probabilité** :
→ だろう / でしょう : ~70-80% (assez probable)
→ かもしれない : ~50% (incertain)
→ らしい : information reçue (hearsay)`,
    structure: '[Verbe / Adjectif / Nom] forme ordinaire + かもしれない',
    examples: [
      { japanese: '明日は雪が降るかもしれません。', kana: 'あしたはゆきがふるかもしれません。', frenchTranslation: "Il se pourrait qu'il neige demain.", note: 'Possibilité' },
      { japanese: '彼女は怒っているかもしれない。', kana: 'かのじょはおこっているかもしれない。', frenchTranslation: 'Elle est peut-être en colère.', note: 'Supposition' },
      { japanese: 'これは間違いかも。', kana: 'これはまちがいかも。', frenchTranslation: "C'est peut-être une erreur.", note: 'Forme contractée' },
    ],
    relatedPointIds: ['rashii', 'hazu-da'],
  },
  {
    id: 'hazu-da',
    titleFR: '〜はずだ — cela devrait être, normalement',
    titleJP: '〜はずだ',
    level: 'N4',
    category: 'phrases',
    shortExplanationFR: "Exprimer une attente logique : 'ça devrait être le cas', 'normalement'.",
    fullExplanationFR: `**〜はずだ (hazu da)** exprime qu'on s'attend logiquement à quelque chose, basé sur des informations ou une logique solide.

S'attache à la forme ordinaire des verbes, adjectifs, et à **の** / **な** après les noms.

**Sens positif** : "ça devrait être le cas, selon toute logique"
→ 彼はもう着いているはずです。 (Il devrait être déjà arrivé.)

**Sens négatif** : [はずがない] = "c'est impossible que"
→ そんなことがあるはずがない。 (Ça ne peut pas être vrai.)

**Différence** avec でしょう (supposition plus douce) : はず implique une base logique solide.`,
    structure: '[Verbe forme ordinaire / Adj / Nom + の / な] + はずだ',
    examples: [
      { japanese: '彼はもうすぐ来るはずです。', kana: 'かれはもうすぐくるはずです。', frenchTranslation: 'Il devrait arriver dans peu de temps.', note: 'Attente logique' },
      { japanese: 'このお金で足りるはずだ。', kana: 'このおかねでたりるはずだ。', frenchTranslation: 'Cet argent devrait suffire.', note: 'Estimation' },
      { japanese: '嘘のはずがない。', kana: 'うそのはずがない。', frenchTranslation: "Ce ne peut pas être un mensonge.", note: 'はずがない = impossible' },
    ],
    relatedPointIds: ['kamoshirenai', 'rashii'],
  },
  {
    id: 'nagara',
    titleFR: '〜ながら — tout en faisant, pendant que',
    titleJP: '〜ながら',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Deux actions simultanées par le même sujet : 'tout en faisant X, je fais Y'.",
    fullExplanationFR: `**〜ながら (nagara)** relie deux actions **simultanées effectuées par le même sujet**.

S'attache à la **forme ます sans ます** (radical ます).

→ 音楽を聴きながら勉強します。 (J'étudie tout en écoutant de la musique.)

**Règles importantes** :
1. Le même sujet fait les deux actions.
2. L'action principale est celle en fin de phrase.
3. L'action secondaire (ながら) est généralement l'arrière-plan.

**Différence avec 〜てから** : ながら = simultané / てから = séquentiel (l'un après l'autre).`,
    structure: '[Verbe radical-ます] + ながら + [Action principale]',
    examples: [
      { japanese: '歩きながら電話しないでください。', kana: 'あるきながらでんわしないでください。', frenchTranslation: 'Ne téléphonez pas en marchant.', note: 'Simultanéité' },
      { japanese: 'テレビを見ながら食べています。', kana: 'テレビをみながらたべています。', frenchTranslation: 'Je mange en regardant la télévision.', note: 'Habitude' },
      { japanese: '歌を歌いながら料理しました。', kana: 'うたをうたいながらりょうりしました。', frenchTranslation: "J'ai cuisiné tout en chantant.", note: 'Passé' },
    ],
    relatedPointIds: ['te-iru', 'kara-after'],
  },
  {
    id: 'ba-conditional',
    titleFR: '〜ば — si... alors (conditionnel)',
    titleJP: '〜ば形（条件形）',
    level: 'N4',
    category: 'verbes',
    shortExplanationFR: "Conditionnel logique : 'si X alors Y' — condition naturellement suffisante.",
    fullExplanationFR: `La **forme ば (ba)** exprime une condition : si X, alors Y. C'est un conditionnel logique.

**Conjugaison** :
→ **Verbes godan** : voyelle finale → **e** + ば → 書く → 書けば / 飲む → 飲めば
→ **Verbes ichidan** : radical + **れば** → 食べる → 食べれば
→ **Irréguliers** : する → すれば / くる → くれば
→ **Adjectifs い** : い → **ければ** → 寒い → 寒ければ
→ **Adjectifs な / Noms** : なら / であれば

**Nuance** : ば exprime une condition naturelle et suffisante. Si la condition est remplie, le résultat suit logiquement.

**Différence** avec たら (plus général) : ば porte une implication logique plus forte.`,
    structure: '[Verbe forme-ば / Adj-ければ / Nom + なら]',
    examples: [
      { japanese: '雨が降らなければ、公園に行きます。', kana: 'あめがふらなければ、こうえんにいきます。', frenchTranslation: "S'il ne pleut pas, j'irai au parc.", note: 'Condition négative' },
      { japanese: '時間があれば、手伝います。', kana: 'じかんがあれば、てつだいます。', frenchTranslation: "Si j'ai le temps, je vous aiderai.", note: 'Condition positive' },
      { japanese: '安ければ買います。', kana: 'やすければかいます。', frenchTranslation: 'Si c\'est bon marché, je l\'achète.', note: 'Adjectif い' },
    ],
    relatedPointIds: ['toki', 'tame-ni'],
  },
]
