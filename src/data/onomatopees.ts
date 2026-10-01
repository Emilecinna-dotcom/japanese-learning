export type OnoCategory =
  | 'sons-nature'
  | 'sons-animaux'
  | 'sons-humains'
  | 'mouvements'
  | 'etats-physiques'
  | 'etats-mentaux'
  | 'sons-objets'

export interface Onomatopee {
  id: string
  expression: string
  reading: string
  category: OnoCategory
  meaning: string
  usageNote: string
  example: string
  exampleReading: string
  exampleFR: string
  type: 'giongo' | 'gitaigo'
}

export const ONO_CATEGORIES: Record<OnoCategory, { label: string; labelJP: string; color: string }> = {
  'sons-nature':    { label: 'Sons de la nature', labelJP: '自然の音', color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
  'sons-animaux':   { label: 'Cris d\'animaux',   labelJP: '動物の音', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' },
  'sons-humains':   { label: 'Sons humains',       labelJP: '人間の音', color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
  'mouvements':     { label: 'Mouvements',          labelJP: '動作',     color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' },
  'etats-physiques':{ label: 'États physiques',     labelJP: '身体の状態', color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' },
  'etats-mentaux':  { label: 'États mentaux',       labelJP: '心の状態',  color: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300' },
  'sons-objets':    { label: 'Sons d\'objets',      labelJP: '物の音',    color: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' },
}

export const ONOMATOPEES: Onomatopee[] = [
  // Sons de la nature
  { id: 'ono01', expression: 'ザーザー', reading: 'ざーざー', category: 'sons-nature', type: 'giongo',
    meaning: 'pluie qui tombe fort', usageNote: 'Pluie forte et continue',
    example: '雨がザーザー降っている。', exampleReading: 'あめがざーざーふっている。', exampleFR: 'Il pleut à verse.' },
  { id: 'ono02', expression: 'パラパラ', reading: 'ぱらぱら', category: 'sons-nature', type: 'giongo',
    meaning: 'pluie légère, clairsemée', usageNote: 'Petite pluie ou quelques gouttes',
    example: '雨がパラパラと降り始めた。', exampleReading: 'あめがぱらぱらとふりはじめた。', exampleFR: 'Il a commencé à pleuvoir légèrement.' },
  { id: 'ono03', expression: 'ビュービュー', reading: 'びゅーびゅー', category: 'sons-nature', type: 'giongo',
    meaning: 'vent fort qui siffle', usageNote: 'Vent violent',
    example: '風がビュービュー吹いている。', exampleReading: 'かぜがびゅーびゅーふいている。', exampleFR: 'Le vent souffle fort.' },
  { id: 'ono04', expression: 'サラサラ', reading: 'さらさら', category: 'sons-nature', type: 'giongo',
    meaning: 'ruissellement léger, fluidité', usageNote: 'Eau qui coule doucement, ou chose légère et fluide',
    example: '川の水がサラサラと流れる。', exampleReading: 'かわのみずがさらさらとながれる。', exampleFR: "L'eau de la rivière coule doucement." },
  { id: 'ono05', expression: 'ゴロゴロ', reading: 'ごろごろ', category: 'sons-nature', type: 'giongo',
    meaning: 'tonnerre, roulement sourd', usageNote: 'Grondement du tonnerre ou d\'une chose lourde qui roule',
    example: '雷がゴロゴロ鳴っている。', exampleReading: 'かみなりがごろごろなっている。', exampleFR: 'Le tonnerre gronde.' },

  // Sons d'animaux
  { id: 'ono06', expression: 'ワンワン', reading: 'わんわん', category: 'sons-animaux', type: 'giongo',
    meaning: 'aboiement du chien', usageNote: 'Son du chien qui aboie',
    example: '犬がワンワン吠えている。', exampleReading: 'いぬがわんわんほえている。', exampleFR: 'Le chien aboie.' },
  { id: 'ono07', expression: 'ニャーニャー', reading: 'にゃーにゃー', category: 'sons-animaux', type: 'giongo',
    meaning: 'miaulement du chat', usageNote: 'Son du chat',
    example: '猫がニャーニャー鳴いている。', exampleReading: 'ねこがにゃーにゃーないている。', exampleFR: 'Le chat miaule.' },
  { id: 'ono08', expression: 'チュンチュン', reading: 'ちゅんちゅん', category: 'sons-animaux', type: 'giongo',
    meaning: 'pépiement des moineaux', usageNote: 'Chant des petits oiseaux',
    example: '朝、鳥がチュンチュン鳴く。', exampleReading: 'あさ、とりがちゅんちゅんなく。', exampleFR: 'Le matin, les oiseaux pépient.' },
  { id: 'ono09', expression: 'ブーブー', reading: 'ぶーぶー', category: 'sons-animaux', type: 'giongo',
    meaning: 'grognement du cochon', usageNote: 'Son du cochon, ou klaxon de voiture',
    example: '豚がブーブー鳴く。', exampleReading: 'ぶたがぶーぶーなく。', exampleFR: 'Le cochon grogne.' },

  // Sons humains
  { id: 'ono10', expression: 'ハハハ', reading: 'はははは', category: 'sons-humains', type: 'giongo',
    meaning: 'rires', usageNote: 'Rire sonore et ouvert',
    example: 'みんなはははと笑った。', exampleReading: 'みんなははははとわらった。', exampleFR: 'Tout le monde a ri aux éclats.' },
  { id: 'ono11', expression: 'ぺらぺら', reading: 'ぺらぺら', category: 'sons-humains', type: 'gitaigo',
    meaning: 'parler couramment (une langue)', usageNote: 'Parler une langue étrangère avec fluidité',
    example: '彼女は日本語をぺらぺらと話す。', exampleReading: 'かのじょはにほんごをぺらぺらとはなす。', exampleFR: 'Elle parle couramment le japonais.' },
  { id: 'ono12', expression: 'ぶつぶつ', reading: 'ぶつぶつ', category: 'sons-humains', type: 'giongo',
    meaning: 'marmonnement, grommellement', usageNote: 'Parler dans sa barbe, se plaindre à voix basse',
    example: '彼はぶつぶつ言っている。', exampleReading: 'かれはぶつぶついっている。', exampleFR: 'Il marmonne.' },

  // Mouvements
  { id: 'ono13', expression: 'ぴょんぴょん', reading: 'ぴょんぴょん', category: 'mouvements', type: 'gitaigo',
    meaning: 'sautiller, bondir légèrement', usageNote: 'Petits sauts répétés et légers',
    example: '子供がぴょんぴょん跳んでいる。', exampleReading: 'こどもがぴょんぴょんとんでいる。', exampleFR: "L'enfant sautille." },
  { id: 'ono14', expression: 'のろのろ', reading: 'のろのろ', category: 'mouvements', type: 'gitaigo',
    meaning: 'lentement, à pas de tortue', usageNote: 'Mouvement très lent et sans énergie',
    example: '車がのろのろ進んでいる。', exampleReading: 'くるまがのろのろすすんでいる。', exampleFR: 'La voiture avance lentement.' },
  { id: 'ono15', expression: 'さっさと', reading: 'さっさと', category: 'mouvements', type: 'gitaigo',
    meaning: 'rapidement, sans traîner', usageNote: 'Se dépêcher, agir sans perdre de temps',
    example: 'さっさと宿題をやりなさい。', exampleReading: 'さっさとしゅくだいをやりなさい。', exampleFR: 'Fais tes devoirs rapidement.' },
  { id: 'ono16', expression: 'ふらふら', reading: 'ふらふら', category: 'mouvements', type: 'gitaigo',
    meaning: 'tituber, vaciller, errer sans but', usageNote: 'Marcher en titubant (fatigue, alcool) ou errer',
    example: '疲れてふらふら歩いている。', exampleReading: 'つかれてふらふらあるいている。', exampleFR: 'Il marche en titubant de fatigue.' },
  { id: 'ono17', expression: 'ぐるぐる', reading: 'ぐるぐる', category: 'mouvements', type: 'gitaigo',
    meaning: 'tourner en rond, s\'enrouler', usageNote: 'Mouvement circulaire répété',
    example: '頭の中でぐるぐる考えている。', exampleReading: 'あたまのなかでぐるぐるかんがえている。', exampleFR: "Les pensées tournent en rond dans sa tête." },

  // États physiques
  { id: 'ono18', expression: 'ぺこぺこ', reading: 'ぺこぺこ', category: 'etats-physiques', type: 'gitaigo',
    meaning: 'avoir très faim (ventre creux)', usageNote: 'Estomac qui gargouille de faim',
    example: 'お腹がぺこぺこだ。', exampleReading: 'おなかがぺこぺこだ。', exampleFR: "J'ai très faim." },
  { id: 'ono19', expression: 'くたくた', reading: 'くたくた', category: 'etats-physiques', type: 'gitaigo',
    meaning: 'épuisé, à plat', usageNote: 'Fatigue extrême physique',
    example: '仕事でくたくたになった。', exampleReading: 'しごとでくたくたになった。', exampleFR: 'Je suis épuisé par le travail.' },
  { id: 'ono20', expression: 'ぽかぽか', reading: 'ぽかぽか', category: 'etats-physiques', type: 'gitaigo',
    meaning: 'doucement chaud, confortable', usageNote: 'Chaleur douce et agréable (soleil, boisson chaude)',
    example: '日差しでぽかぽかしている。', exampleReading: 'ひざしでぽかぽかしている。', exampleFR: 'Il fait bon au soleil.' },
  { id: 'ono21', expression: 'ずきずき', reading: 'ずきずき', category: 'etats-physiques', type: 'gitaigo',
    meaning: 'douleur lancinante, élancement', usageNote: 'Douleur pulsatile (dent, tête)',
    example: '頭がずきずき痛む。', exampleReading: 'あたまがずきずきいたむ。', exampleFR: "J'ai des élancements dans la tête." },
  { id: 'ono22', expression: 'ひりひり', reading: 'ひりひり', category: 'etats-physiques', type: 'gitaigo',
    meaning: 'brûlure, picotement', usageNote: 'Sensation de brûlure (coup de soleil, plaie)',
    example: '日焼けでひりひりする。', exampleReading: 'ひやけでひりひりする。', exampleFR: 'Ça brûle à cause du coup de soleil.' },

  // États mentaux
  { id: 'ono23', expression: 'わくわく', reading: 'わくわく', category: 'etats-mentaux', type: 'gitaigo',
    meaning: 'excitation, impatience joyeuse', usageNote: 'Sentiment d\'excitation et d\'anticipation positive',
    example: '明日の旅行がわくわくする。', exampleReading: 'あしたのりょこうがわくわくする。', exampleFR: "J'ai hâte d'être au voyage demain." },
  { id: 'ono24', expression: 'どきどき', reading: 'どきどき', category: 'etats-mentaux', type: 'gitaigo',
    meaning: 'cœur qui bat fort (émoi, peur)', usageNote: 'Palpitations d\'excitation ou de peur',
    example: '試験前でどきどきしている。', exampleReading: 'しけんまえでどきどきしている。', exampleFR: "J'ai le cœur qui bat avant l'examen." },
  { id: 'ono25', expression: 'いらいら', reading: 'いらいら', category: 'etats-mentaux', type: 'gitaigo',
    meaning: 'irritation, énervement', usageNote: 'État d\'agacement et d\'impatience',
    example: 'バスが来なくていらいらした。', exampleReading: 'バスがこなくていらいらした。', exampleFR: "Je me suis énervé parce que le bus n'arrivait pas." },
  { id: 'ono26', expression: 'うきうき', reading: 'うきうき', category: 'etats-mentaux', type: 'gitaigo',
    meaning: 'légèreté, joie légère et flottante', usageNote: 'Sentiment de légèreté et de bonheur',
    example: '春になってうきうきしている。', exampleReading: 'はるになってうきうきしている。', exampleFR: 'Avec le printemps, je me sens léger(ère) et heureux(se).' },
  { id: 'ono27', expression: 'ぼんやり', reading: 'ぼんやり', category: 'etats-mentaux', type: 'gitaigo',
    meaning: 'dans le brouillard, distrait, rêvasser', usageNote: 'Manque de concentration, rêverie',
    example: '疲れてぼんやりしている。', exampleReading: 'つかれてぼんやりしている。', exampleFR: "Je suis dans le brouillard, épuisé." },
  { id: 'ono28', expression: 'にこにこ', reading: 'にこにこ', category: 'etats-mentaux', type: 'gitaigo',
    meaning: 'souriant, visage rayonnant', usageNote: 'Sourire constant et chaleureux',
    example: '彼女はいつもにこにこしている。', exampleReading: 'かのじょはいつもにこにこしている。', exampleFR: 'Elle est toujours souriante.' },

  // Sons d'objets
  { id: 'ono29', expression: 'ガタガタ', reading: 'がたがた', category: 'sons-objets', type: 'giongo',
    meaning: 'bruit de claquement, vibration', usageNote: 'Bruit d\'une chose qui tremble ou claque',
    example: '扉がガタガタ音を立てている。', exampleReading: 'とびらががたがたおとをたてている。', exampleFR: 'La porte claque et tremble.' },
  { id: 'ono30', expression: 'ガチャガチャ', reading: 'がちゃがちゃ', category: 'sons-objets', type: 'giongo',
    meaning: 'cliquetis métallique', usageNote: 'Bruit de métal ou d\'objets qui s\'entrechoquent',
    example: '鍵がガチャガチャ鳴る。', exampleReading: 'かぎががちゃがちゃなる。', exampleFR: 'Les clés cliquettent.' },
  { id: 'ono31', expression: 'ポタポタ', reading: 'ぽたぽた', category: 'sons-objets', type: 'giongo',
    meaning: 'goutte-à-goutte', usageNote: 'Eau ou liquide qui coule goutte à goutte',
    example: '蛇口からポタポタ水が落ちる。', exampleReading: 'じゃぐちからぽたぽたみずがおちる。', exampleFR: "Le robinet goutte." },
  { id: 'ono32', expression: 'バリバリ', reading: 'ばりばり', category: 'sons-objets', type: 'giongo',
    meaning: 'craquement sec, déchirement', usageNote: 'Bruit de quelque chose qui craque ou se déchire',
    example: '袋をバリバリ開ける。', exampleReading: 'ふくろをばりばりあける。', exampleFR: 'Il ouvre le sachet en le déchirant.' },
]
