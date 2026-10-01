// Textes de lecture graduée, segmentés en tokens.
// Un token porte le texte (t), sa lecture kana (r) si nécessaire pour les furigana,
// et un sens français (m) qui le rend cliquable et ajoutable aux révisions.

export interface RToken {
  t: string
  r?: string
  m?: string
}

export interface GradedText {
  id: string
  title: string
  titleJp: string
  level: 'N5' | 'N4'
  summary: string
  sentences: RToken[][]
  questions: { q: string; options: string[]; answer: number }[]
}

export const GRADED_TEXTS: GradedText[] = [
  {
    id: 'mon-matin',
    title: 'Mon matin',
    titleJp: '私の朝',
    level: 'N5',
    summary: 'Une matinée ordinaire, du réveil au départ pour l\'école.',
    sentences: [
      [
        { t: '私', r: 'わたし', m: 'je, moi' }, { t: 'は' },
        { t: '毎朝', r: 'まいあさ', m: 'chaque matin' },
        { t: '六時', r: 'ろくじ', m: 'six heures' }, { t: 'に' },
        { t: '起きます', r: 'おきます', m: 'se lever' }, { t: '。' },
      ],
      [
        { t: '顔', r: 'かお', m: 'visage' }, { t: 'を' },
        { t: '洗って', r: 'あらって', m: 'laver (et)' }, { t: '、' },
        { t: '朝ごはん', r: 'あさごはん', m: 'petit-déjeuner' }, { t: 'を' },
        { t: '食べます', r: 'たべます', m: 'manger' }, { t: '。' },
      ],
      [
        { t: '七時', r: 'しちじ', m: 'sept heures' }, { t: 'に' },
        { t: '家', r: 'いえ', m: 'maison' }, { t: 'を' },
        { t: '出ます', r: 'でます', m: 'sortir' }, { t: '。' },
      ],
      [
        { t: '電車', r: 'でんしゃ', m: 'train' }, { t: 'で' },
        { t: '学校', r: 'がっこう', m: 'école' }, { t: 'へ' },
        { t: '行きます', r: 'いきます', m: 'aller' }, { t: '。' },
      ],
      [
        { t: '授業', r: 'じゅぎょう', m: 'cours, leçon' }, { t: 'は' },
        { t: 'とても', m: 'très' },
        { t: '楽しい', r: 'たのしい', m: 'amusant, agréable' }, { t: 'です' }, { t: '。' },
      ],
    ],
    questions: [
      { q: 'À quelle heure se lève-t-il ?', options: ['Six heures', 'Sept heures', 'Huit heures'], answer: 0 },
      { q: 'Comment va-t-il à l\'école ?', options: ['En bus', 'En train', 'À pied'], answer: 1 },
    ],
  },
  {
    id: 'ma-famille',
    title: 'Ma famille',
    titleJp: '私の家族',
    level: 'N5',
    summary: 'Présentation simple des membres de la famille et de leurs métiers.',
    sentences: [
      [
        { t: '私', r: 'わたし', m: 'je, moi' }, { t: 'の' },
        { t: '家族', r: 'かぞく', m: 'famille' }, { t: 'は' },
        { t: '四人', r: 'よにん', m: 'quatre personnes' }, { t: 'です' }, { t: '。' },
      ],
      [
        { t: '父', r: 'ちち', m: 'mon père' }, { t: 'と' },
        { t: '母', r: 'はは', m: 'ma mère' }, { t: 'と' },
        { t: '妹', r: 'いもうと', m: 'petite sœur' }, { t: 'が' },
        { t: 'います', m: 'il y a, être (animé)' }, { t: '。' },
      ],
      [
        { t: '父', r: 'ちち', m: 'mon père' }, { t: 'は' },
        { t: '医者', r: 'いしゃ', m: 'médecin' }, { t: 'です' }, { t: '。' },
      ],
      [
        { t: '母', r: 'はは', m: 'ma mère' }, { t: 'は' },
        { t: '学校', r: 'がっこう', m: 'école' }, { t: 'の' },
        { t: '先生', r: 'せんせい', m: 'professeur' }, { t: 'です' }, { t: '。' },
      ],
      [
        { t: '妹', r: 'いもうと', m: 'petite sœur' }, { t: 'は' },
        { t: '犬', r: 'いぬ', m: 'chien' }, { t: 'が' },
        { t: '大好き', r: 'だいすき', m: 'adorer' }, { t: 'です' }, { t: '。' },
      ],
    ],
    questions: [
      { q: 'Combien sont-ils dans la famille ?', options: ['Trois', 'Quatre', 'Cinq'], answer: 1 },
      { q: 'Quel est le métier du père ?', options: ['Professeur', 'Médecin', 'Cuisinier'], answer: 1 },
    ],
  },
  {
    id: 'la-meteo',
    title: 'Le temps qu\'il fait',
    titleJp: '今日の天気',
    level: 'N5',
    summary: 'Une belle journée et la météo du lendemain.',
    sentences: [
      [
        { t: '今日', r: 'きょう', m: 'aujourd\'hui' }, { t: 'は' },
        { t: 'とても', m: 'très' }, { t: 'いい', m: 'bon, bien' },
        { t: '天気', r: 'てんき', m: 'temps, météo' }, { t: 'です' }, { t: '。' },
      ],
      [
        { t: '空', r: 'そら', m: 'ciel' }, { t: 'が' },
        { t: '青くて', r: 'あおくて', m: 'bleu (et)' }, { t: '、' },
        { t: '暖かい', r: 'あたたかい', m: 'doux, chaud' }, { t: 'です' }, { t: '。' },
      ],
      [
        { t: '公園', r: 'こうえん', m: 'parc' }, { t: 'で' },
        { t: '子供', r: 'こども', m: 'enfant' }, { t: 'たち', m: 'pluriel (suffixe)' }, { t: 'が' },
        { t: '遊んでいます', r: 'あそんでいます', m: 'sont en train de jouer' }, { t: '。' },
      ],
      [
        { t: '明日', r: 'あした', m: 'demain' }, { t: 'は' },
        { t: '雨', r: 'あめ', m: 'pluie' }, { t: 'が' },
        { t: '降る', r: 'ふる', m: 'tomber (pluie)' }, { t: 'でしょう', m: 'probablement' }, { t: '。' },
      ],
      [
        { t: '傘', r: 'かさ', m: 'parapluie' }, { t: 'を' },
        { t: '忘れないで', r: 'わすれないで', m: 'n\'oublie pas' },
        { t: 'ください', m: 's\'il vous plaît' }, { t: '。' },
      ],
    ],
    questions: [
      { q: 'Quel temps fait-il aujourd\'hui ?', options: ['Il pleut', 'Il fait beau', 'Il neige'], answer: 1 },
      { q: 'Que ne faut-il pas oublier ?', options: ['Un manteau', 'Un parapluie', 'Un chapeau'], answer: 1 },
    ],
  },
  {
    id: 'le-weekend',
    title: 'Le week-end à Kyoto',
    titleJp: '週末の京都',
    level: 'N4',
    summary: 'Une excursion d\'une journée entre amis, au passé.',
    sentences: [
      [
        { t: '先週', r: 'せんしゅう', m: 'la semaine dernière' }, { t: 'の' },
        { t: '週末', r: 'しゅうまつ', m: 'week-end' }, { t: '、' },
        { t: '友達', r: 'ともだち', m: 'ami(e)' }, { t: 'と' },
        { t: '京都', r: 'きょうと', m: 'Kyoto' }, { t: 'へ' },
        { t: '行きました', r: 'いきました', m: 'suis allé(e)' }, { t: '。' },
      ],
      [
        { t: '朝', r: 'あさ', m: 'matin' }, { t: '早く', r: 'はやく', m: 'tôt' },
        { t: '電車', r: 'でんしゃ', m: 'train' }, { t: 'に' },
        { t: '乗りました', r: 'のりました', m: 'ai pris (monté)' }, { t: '。' },
      ],
      [
        { t: '古い', r: 'ふるい', m: 'ancien, vieux' },
        { t: 'お寺', r: 'おてら', m: 'temple' }, { t: 'を' },
        { t: '見ました', r: 'みました', m: 'ai vu' }, { t: '。' },
      ],
      [
        { t: '昼ごはん', r: 'ひるごはん', m: 'déjeuner' }, { t: 'に' },
        { t: 'おいしい', m: 'délicieux' }, { t: 'そば', m: 'nouilles soba' }, { t: 'を' },
        { t: '食べました', r: 'たべました', m: 'ai mangé' }, { t: '。' },
      ],
      [
        { t: 'とても', m: 'très' },
        { t: '楽しかった', r: 'たのしかった', m: 'c\'était amusant' }, { t: 'です' }, { t: '。' },
      ],
    ],
    questions: [
      { q: 'Où sont-ils allés ?', options: ['Tokyo', 'Kyoto', 'Osaka'], answer: 1 },
      { q: 'Qu\'ont-ils mangé le midi ?', options: ['Des sushis', 'Des soba', 'Des ramen'], answer: 1 },
    ],
  },
  {
    id: 'au-restaurant',
    title: 'Au restaurant',
    titleJp: 'レストランで',
    level: 'N4',
    summary: 'Un dîner en famille et ce que chacun commande.',
    sentences: [
      [
        { t: '昨日', r: 'きのう', m: 'hier' }, { t: '、' },
        { t: '家族', r: 'かぞく', m: 'famille' }, { t: 'と' },
        { t: 'レストラン', m: 'restaurant' }, { t: 'へ' },
        { t: '行きました', r: 'いきました', m: 'sommes allés' }, { t: '。' },
      ],
      [
        { t: '私', r: 'わたし', m: 'je, moi' }, { t: 'は' },
        { t: '魚', r: 'さかな', m: 'poisson' }, { t: 'の' },
        { t: '料理', r: 'りょうり', m: 'plat, cuisine' }, { t: 'を' },
        { t: '注文しました', r: 'ちゅうもんしました', m: 'ai commandé' }, { t: '。' },
      ],
      [
        { t: '父', r: 'ちち', m: 'mon père' }, { t: 'は' },
        { t: '肉', r: 'にく', m: 'viande' }, { t: 'が' },
        { t: '好き', r: 'すき', m: 'aimer' }, { t: 'なので', m: 'parce que' }, { t: '、' },
        { t: 'ステーキ', m: 'steak' }, { t: 'を' },
        { t: '食べました', r: 'たべました', m: 'a mangé' }, { t: '。' },
      ],
      [
        { t: '料理', r: 'りょうり', m: 'plats, cuisine' }, { t: 'は' },
        { t: '全部', r: 'ぜんぶ', m: 'tout, en entier' },
        { t: 'おいしかった', m: 'c\'était délicieux' }, { t: 'です' }, { t: '。' },
      ],
      [
        { t: 'また', m: 'de nouveau' },
        { t: '行きたい', r: 'いきたい', m: 'vouloir y aller' }, { t: 'です' }, { t: '。' },
      ],
    ],
    questions: [
      { q: 'Qu\'a commandé le narrateur ?', options: ['De la viande', 'Du poisson', 'Des légumes'], answer: 1 },
      { q: 'Qu\'aime le père ?', options: ['Le poisson', 'La viande', 'Le riz'], answer: 1 },
    ],
  },
]
