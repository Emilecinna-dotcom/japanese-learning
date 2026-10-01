export interface VocabItem {
  word: string;
  reading: string;
  meaning: string;
}

export interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface ReadingText {
  id: string;
  title: string;
  titleJp: string;
  jlpt: 'N5' | 'N4' | 'N3';
  text: string;
  furigana?: string;
  vocabulary: VocabItem[];
  questions: Question[];
}

export const READING_TEXTS: ReadingText[] = [
  {
    id: 'daily-routine',
    title: 'Ma journée',
    titleJp: 'わたしの いちにち',
    jlpt: 'N5',
    text: `まいあさ、しちじに おきます。かおを あらって、あさごはんを たべます。はちじに いえを でて、がっこうに いきます。じゅぎょうは くじから はじまります。ひるごはんは ともだちと たべます。ごごは べんきょうを します。よるは テレビを みて、じゅうにじごろ ねます。`,
    furigana: `毎朝(まいあさ)、七時(しちじ)に 起(お)きます。顔(かお)を 洗(あら)って、朝ご飯(あさごはん)を 食(た)べます。八時(はちじ)に 家(いえ)を 出(で)て、学校(がっこう)に 行(い)きます。授業(じゅぎょう)は 九時(くじ)から 始(はじ)まります。昼ご飯(ひるごはん)は 友達(ともだち)と 食(た)べます。午後(ごご)は 勉強(べんきょう)を します。夜(よる)は テレビを 見(み)て、十二時(じゅうにじ)ごろ 寝(ね)ます。`,
    vocabulary: [
      { word: '毎朝', reading: 'まいあさ', meaning: 'chaque matin' },
      { word: '起きます', reading: 'おきます', meaning: 'se lever' },
      { word: '授業', reading: 'じゅぎょう', meaning: 'cours (leçon)' },
      { word: '午後', reading: 'ごご', meaning: 'après-midi' },
      { word: '寝ます', reading: 'ねます', meaning: 'dormir, se coucher' },
    ],
    questions: [
      {
        question: 'À quelle heure cette personne se lève-t-elle le matin ?',
        options: ['6h', '7h', '8h', '9h'],
        answer: 1,
        explanation: 'Le texte dit「しちじに おきます」, ce qui signifie "se lever à 7h".',
      },
      {
        question: 'Avec qui mange-t-elle le déjeuner ?',
        options: ['Seule', 'Avec sa famille', 'Avec des amis', 'Avec ses professeurs'],
        answer: 2,
        explanation: '「ひるごはんは ともだちと たべます」signifie "manger le déjeuner avec des amis".',
      },
      {
        question: 'Que fait-elle le soir avant de dormir ?',
        options: ['Elle étudie', 'Elle regarde la télévision', 'Elle lit un livre', 'Elle sort'],
        answer: 1,
        explanation: `「よるは テレビを みて」indique qu'elle regarde la télévision le soir.`,
      },
    ],
  },
  {
    id: 'favorite-food',
    title: 'Mon plat préféré',
    titleJp: 'すきな たべもの',
    jlpt: 'N5',
    text: `わたしは すしが だいすきです。まいしゅう、かぞくと すしやに いきます。いちばん すきな すしは サーモンです。でも、からい たべものは あまり すきでは ありません。くだものも すきです。とくに りんごと みかんが すきです。にほんの りょうりは とても おいしいと おもいます。`,
    furigana: `私(わたし)は すしが 大好(だいす)きです。毎週(まいしゅう)、家族(かぞく)と すし屋(すしや)に 行(い)きます。一番(いちばん) 好(す)きな すしは サーモンです。でも、辛(から)い 食(た)べ物(もの)は あまり 好(す)きでは ありません。果物(くだもの)も 好(す)きです。特(とく)に りんごと みかんが 好(す)きです。日本(にほん)の 料理(りょうり)は とても おいしいと 思(おも)います。`,
    vocabulary: [
      { word: '大好き', reading: 'だいすき', meaning: 'adorer, aimer beaucoup' },
      { word: '毎週', reading: 'まいしゅう', meaning: 'chaque semaine' },
      { word: '辛い', reading: 'からい', meaning: 'épicé, piquant' },
      { word: '果物', reading: 'くだもの', meaning: 'fruits' },
      { word: '料理', reading: 'りょうり', meaning: 'cuisine, plat cuisiné' },
    ],
    questions: [
      {
        question: 'Quel type de sushi cette personne préfère-t-elle ?',
        options: ['Le thon', 'Le saumon', 'La crevette', 'Le concombre'],
        answer: 1,
        explanation: '「いちばん すきな すしは サーモンです」signifie "le sushi préféré est le saumon".',
      },
      {
        question: 'Comment est son rapport à la nourriture épicée ?',
        options: ['Elle adore ça', 'Elle le mange souvent', `Elle n\'aime pas trop ça`, 'Elle ne peut pas en manger'],
        answer: 2,
        explanation: "「からい たべものは あまり すきでは ありません」signifie \"n\'aime pas trop la nourriture épicée\".",
      },
      {
        question: 'Avec qui va-t-elle au restaurant de sushi ?',
        options: ['Seule', 'Avec des amis', 'Avec sa famille', 'Avec des collègues'],
        answer: 2,
        explanation: '「かぞくと すしやに いきます」signifie "aller au restaurant de sushi avec la famille".',
      },
    ],
  },
  {
    id: 'on-the-train',
    title: 'Dans le train',
    titleJp: 'でんしゃで',
    jlpt: 'N5',
    text: `きょう、でんしゃで とうきょうに いきました。えきが とても おおきくて、びっくりしました。でんしゃの なかは ひとが おおかったです。わたしは ざせきに すわりました。となりの ひとは ほんを よんでいました。とうきょうには いちじかんで つきました。えきの まえに おみせが たくさん ありました。`,
    furigana: `今日(きょう)、電車(でんしゃ)で 東京(とうきょう)に 行(い)きました。駅(えき)が とても 大(おお)きくて、びっくりしました。電車(でんしゃ)の 中(なか)は 人(ひと)が 多(おお)かったです。私(わたし)は 座席(ざせき)に 座(すわ)りました。隣(となり)の 人(ひと)は 本(ほん)を 読(よ)んでいました。東京(とうきょう)には 一時間(いちじかん)で 着(つ)きました。駅(えき)の 前(まえ)に お店(おみせ)が たくさん ありました。`,
    vocabulary: [
      { word: '電車', reading: 'でんしゃ', meaning: 'train (électrique)' },
      { word: '駅', reading: 'えき', meaning: 'gare' },
      { word: 'びっくりする', reading: 'びっくりする', meaning: 'être surpris' },
      { word: '座席', reading: 'ざせき', meaning: 'siège, place assise' },
      { word: '着きます', reading: 'つきます', meaning: 'arriver (à destination)' },
    ],
    questions: [
      {
        question: "Qu\'est-ce qui a surpris cette personne à la gare ?",
        options: ['Les prix des billets', 'La taille de la gare', 'Le retard du train', 'La foule sur le quai'],
        answer: 1,
        explanation: "「えきが とても おおきくて、びっくりしました」signifie \"la gare était très grande et cela m\'a surpris\".",
      },
      {
        question: 'Que faisait la personne assise à côté ?',
        options: ['Elle dormait', 'Elle écoutait de la musique', 'Elle lisait un livre', 'Elle regardait son téléphone'],
        answer: 2,
        explanation: "「となりの ひとは ほんを よんでいました」signifie \"la personne d\'à côté lisait un livre\".",
      },
      {
        question: "Combien de temps a duré le trajet jusqu\'à Tokyo ?",
        options: ['30 minutes', '2 heures', '1 heure', '3 heures'],
        answer: 2,
        explanation: '「いちじかんで つきました」signifie "arriver en une heure".',
      },
    ],
  },
  {
    id: 'my-family',
    title: 'Ma famille',
    titleJp: 'わたしの かぞく',
    jlpt: 'N5',
    text: `わたしの かぞくは よにんです。ちちと ははと あにと わたしです。ちちは かいしゃいんです。まいにち しごとに いきます。ははは りょうりが じょうずです。いつも おいしい ごはんを つくります。あには だいがくせいです。サッカーが とても すきです。わたしたちは みんな なかよし です。`,
    furigana: `私(わたし)の 家族(かぞく)は 四人(よにん)です。父(ちち)と 母(はは)と 兄(あに)と 私(わたし)です。父(ちち)は 会社員(かいしゃいん)です。毎日(まいにち) 仕事(しごと)に 行(い)きます。母(はは)は 料理(りょうり)が 上手(じょうず)です。いつも おいしい ご飯(ごはん)を 作(つく)ります。兄(あに)は 大学生(だいがくせい)です。サッカーが とても 好(す)きです。私(わたし)たちは みんな 仲良(なかよ)しです。`,
    vocabulary: [
      { word: '家族', reading: 'かぞく', meaning: 'famille' },
      { word: '会社員', reading: 'かいしゃいん', meaning: 'employé de bureau' },
      { word: '上手', reading: 'じょうず', meaning: 'habile, doué' },
      { word: '大学生', reading: 'だいがくせい', meaning: "étudiant à l\'université" },
      { word: '仲良し', reading: 'なかよし', meaning: 'en bonne entente, amis proches' },
    ],
    questions: [
      {
        question: 'Combien de personnes composent cette famille ?',
        options: ['2 personnes', '3 personnes', '4 personnes', '5 personnes'],
        answer: 2,
        explanation: '「かぞくは よにんです」signifie "la famille est composée de quatre personnes".',
      },
      {
        question: 'Quelle est la qualité principale de la mère ?',
        options: ['Elle est bonne en sport', 'Elle est bonne cuisinière', 'Elle parle bien anglais', 'Elle travaille dans une entreprise'],
        answer: 1,
        explanation: '「ははは りょうりが じょうずです」signifie "la mère est douée en cuisine".',
      },
      {
        question: 'Quel sport le grand frère aime-t-il ?',
        options: ['Le baseball', 'Le tennis', 'Le football', 'La natation'],
        answer: 2,
        explanation: '「あには サッカーが とても すきです」signifie "le grand frère aime beaucoup le football".',
      },
    ],
  },
  {
    id: 'part-time-job',
    title: 'Mon petit boulot',
    titleJp: 'アルバイト',
    jlpt: 'N4',
    text: `わたしは コンビニで アルバイトを しています。しゅうに さんにち、ごごから よるまで はたらいています。しごとは レジを うったり、たなに しょうひんを ならべたり します。さいしょは むずかしかったですが、なれてきました。おきゃくさんに ていねいに はなしかけることが たいせつだと おもっています。アルバイトで もらった おかねで、あたらしい パソコンを かいたいと おもっています。`,
    furigana: `私(わたし)は コンビニで アルバイトを しています。週(しゅう)に 三日(さんにち)、午後(ごご)から 夜(よる)まで 働(はたら)いています。仕事(しごと)は レジを 打(う)ったり、棚(たな)に 商品(しょうひん)を 並(なら)べたり します。最初(さいしょ)は 難(むずか)しかったですが、慣(な)れてきました。お客(おきゃく)さんに 丁寧(ていねい)に 話(はな)しかけることが 大切(たいせつ)だと 思(おも)っています。アルバイトで もらった お金(おかね)で、新(あたら)しい パソコンを 買(か)いたいと 思(おも)っています。`,
    vocabulary: [
      { word: 'アルバイト', reading: 'アルバイト', meaning: 'petit boulot, travail à temps partiel' },
      { word: '商品', reading: 'しょうひん', meaning: 'produit, marchandise' },
      { word: '慣れる', reading: 'なれる', meaning: "s\'habituer à" },
      { word: '丁寧', reading: 'ていねい', meaning: 'poli, attentionné' },
      { word: '大切', reading: 'たいせつ', meaning: 'important, précieux' },
    ],
    questions: [
      {
        question: 'Combien de jours par semaine travaille cette personne ?',
        options: ['2 jours', '3 jours', '4 jours', '5 jours'],
        answer: 1,
        explanation: '「しゅうに さんにち」signifie "trois jours par semaine".',
      },
      {
        question: 'Quelle est la tâche principale au travail ?',
        options: ['Livrer des colis', 'Tenir la caisse et ranger les produits', 'Cuisiner', "Accueillir les clients à l\'entrée"],
        answer: 1,
        explanation: '「レジを うったり、たなに しょうひんを ならべたり します」décrit les tâches : caisse et mise en rayon.',
      },
      {
        question: 'Que souhaite acheter cette personne avec son argent gagné ?',
        options: ['Un téléphone', 'Un vélo', 'Un ordinateur', 'Des vêtements'],
        answer: 2,
        explanation: '「あたらしい パソコンを かいたい」signifie "vouloir acheter un nouvel ordinateur".',
      },
    ],
  },
  {
    id: 'travel',
    title: 'Voyage',
    titleJp: 'りょこう',
    jlpt: 'N4',
    text: `せんげつ、かぞくで きょうとに りょこうしました。しんかんせんで いったので、はやくて かいてきでした。きょうとでは ふるい おてらや じんじゃを たくさん みました。とくに きんかくじは きれいで、かんどうしました。りょかんに とまって、ゆかたを きました。ゆうしょくは ほんかくてきな きょうとりょうりで、とても おいしかったです。らいねんも また きょうとに いきたいと おもっています。`,
    furigana: `先月(せんげつ)、家族(かぞく)で 京都(きょうと)に 旅行(りょこう)しました。新幹線(しんかんせん)で 行(い)ったので、速(はや)くて 快適(かいてき)でした。京都(きょうと)では 古(ふる)い お寺(おてら)や 神社(じんじゃ)を たくさん 見(み)ました。特(とく)に 金閣寺(きんかくじ)は きれいで、感動(かんどう)しました。旅館(りょかん)に 泊(と)まって、浴衣(ゆかた)を 着(き)ました。夕食(ゆうしょく)は 本格的(ほんかくてき)な 京都料理(きょうとりょうり)で、とても おいしかったです。来年(らいねん)も また 京都(きょうと)に 行(い)きたいと 思(おも)っています。`,
    vocabulary: [
      { word: '新幹線', reading: 'しんかんせん', meaning: 'Shinkansen, train à grande vitesse' },
      { word: '快適', reading: 'かいてき', meaning: 'confortable, agréable' },
      { word: '感動する', reading: 'かんどうする', meaning: 'être ému, être touché' },
      { word: '旅館', reading: 'りょかん', meaning: 'auberge japonaise traditionnelle' },
      { word: '本格的', reading: 'ほんかくてき', meaning: 'authentique, véritable' },
    ],
    questions: [
      {
        question: "Comment cette famille s\'est-elle rendue à Kyoto ?",
        options: ['En avion', 'En voiture', 'En Shinkansen', 'En bus'],
        answer: 2,
        explanation: '「しんかんせんで いった」signifie "y être allé en Shinkansen".',
      },
      {
        question: 'Quel lieu les a particulièrement émus ?',
        options: ['Le château de Nijo', "Le Kinkakuji (temple d'or)", 'Le temple Fushimi Inari', 'Le jardin Ryoanji'],
        answer: 1,
        explanation: '「きんかくじは きれいで、かんどうしました」signifie "le Kinkakuji était beau et les a émus".',
      },
      {
        question: 'Où ont-ils dormi pendant ce voyage ?',
        options: ['Dans un hôtel moderne', 'Chez des amis', 'Dans une auberge japonaise traditionnelle', 'Dans un camping'],
        answer: 2,
        explanation: '「りょかんに とまった」signifie "avoir séjourné dans un ryokan".',
      },
    ],
  },
  {
    id: 'letter',
    title: 'Une lettre',
    titleJp: 'てがみ',
    jlpt: 'N4',
    text: `けいこへ

おげんきですか。わたしは げんきです。
さいきん、にほんごの べんきょうを がんばっています。むずかしいですが、たのしいです。

らいつき、にほんに いく よていです。はじめての にほんりょこうなので、とても わくわくしています。けいこさんに あいたいです。いっしょに おすしを たべたり、おんせんに いったりしたいです。

またれんらくします。
たなか まり より`,
    furigana: `けいこへ\n\nお元気(げんき)ですか。私(わたし)は 元気(げんき)です。\n最近(さいきん)、日本語(にほんご)の 勉強(べんきょう)を 頑張(がんば)っています。難(むずか)しいですが、楽(たの)しいです。\n\n来月(らいつき)、日本(にほん)に 行(い)く 予定(よてい)です。初(はじ)めての 日本旅行(にほんりょこう)なので、とても わくわくしています。けいこさんに 会(あ)いたいです。一緒(いっしょ)に お寿司(すし)を 食(た)べたり、温泉(おんせん)に 行(い)ったりしたいです。\n\nまた 連絡(れんらく)します。\n田中(たなか) まり より`,
    vocabulary: [
      { word: '最近', reading: 'さいきん', meaning: 'récemment, ces derniers temps' },
      { word: '頑張る', reading: 'がんばる', meaning: 'faire de son mieux, persévérer' },
      { word: '予定', reading: 'よてい', meaning: 'prévu, programme' },
      { word: 'わくわくする', reading: 'わくわくする', meaning: 'être excité, impatient' },
      { word: '温泉', reading: 'おんせん', meaning: 'source thermale, onsen' },
    ],
    questions: [
      {
        question: 'Que fait Maari en ce moment comme activité ?',
        options: ['Elle travaille dans une entreprise', 'Elle étudie le japonais', 'Elle voyage au Japon', 'Elle apprend à cuisiner'],
        answer: 1,
        explanation: "「にほんごの べんきょうを がんばっています」signifie \"s\'appliquer dans l\'étude du japonais\".",
      },
      {
        question: "Quand est-ce que Maari prévoit d\'aller au Japon ?",
        options: ['Ce mois-ci', 'Le mois prochain', "L'année prochaine", 'Dans deux mois'],
        answer: 1,
        explanation: "「らいつき、にほんに いく よてい」signifie \"prévoir d\'aller au Japon le mois prochain\".",
      },
      {
        question: 'Quelle activité Maari souhaite-t-elle faire avec Keiko ?',
        options: ['Visiter des temples', 'Manger des sushis et aller aux sources thermales', 'Faire du shopping', 'Regarder des films'],
        answer: 1,
        explanation: '「おすしを たべたり、おんせんに いったりしたい」signifie "vouloir manger des sushis et aller aux onsen".',
      },
    ],
  },
  {
    id: 'studying-japanese',
    title: 'Apprendre le japonais',
    titleJp: 'にほんご の べんきょう',
    jlpt: 'N5',
    text: `まいにち、にほんごを べんきょうしています。まず、ひらがなと カタカナを おぼえました。いまは かんじを べんきょうしています。かんじは むずかしいですが、おもしろいです。にほんごの ドラマを みて、きくれんしゅうも します。すこしずつ わかるように なってきました。にほんじんの ともだちと はなすことが、いちばん いい れんしゅうだと おもいます。`,
    furigana: `毎日(まいにち)、日本語(にほんご)を 勉強(べんきょう)しています。まず、ひらがなと カタカナを 覚(おぼ)えました。今(いま)は 漢字(かんじ)を 勉強(べんきょう)しています。漢字(かんじ)は 難(むずか)しいですが、面白(おもしろ)いです。日本語(にほんご)の ドラマを 見(み)て、聞(き)く 練習(れんしゅう)も します。少(すこ)しずつ わかるように なってきました。日本人(にほんじん)の 友達(ともだち)と 話(はな)すことが、一番(いちばん) いい 練習(れんしゅう)だと 思(おも)います。`,
    vocabulary: [
      { word: '覚えます', reading: 'おぼえます', meaning: 'mémoriser, apprendre par cœur' },
      { word: '漢字', reading: 'かんじ', meaning: 'kanji, caractères chinois' },
      { word: '面白い', reading: 'おもしろい', meaning: 'intéressant, amusant' },
      { word: '練習', reading: 'れんしゅう', meaning: 'entraînement, pratique' },
      { word: '少しずつ', reading: 'すこしずつ', meaning: 'petit à petit, progressivement' },
    ],
    questions: [
      {
        question: "Qu\'a appris cette personne en premier ?",
        options: ['Les kanji', "L'hiragana et le katakana", 'La grammaire japonaise', 'Le vocabulaire'],
        answer: 1,
        explanation: "「まず、ひらがなと カタカナを おぼえました」signifie \"d\'abord, mémoriser l\'hiragana et le katakana\".",
      },
      {
        question: "Comment s\'entraîne-t-elle à la compréhension orale ?",
        options: ['En écoutant de la musique', 'En regardant des dramas japonais', 'En allant à des cours', 'En regardant des films américains sous-titrés'],
        answer: 1,
        explanation: "「にほんごの ドラマを みて、きくれんしゅうも します」signifie \"regarder des dramas japonais pour s\'entraîner à l\'écoute\".",
      },
      {
        question: 'Selon cette personne, quel est le meilleur entraînement ?',
        options: ['Lire des livres japonais', 'Écrire des kanji chaque jour', 'Parler avec des Japonais', 'Regarder des émissions de télévision'],
        answer: 2,
        explanation: '「にほんじんの ともだちと はなすことが、いちばん いい れんしゅう」signifie "parler avec des amis japonais est le meilleur entraînement".',
      },
    ],
  },
];
