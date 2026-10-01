import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Fact { label: string; value: string }

interface SystemeEcritureInfoProps {
  kana: string
  nom: string
  nomJP: string
  accentClass: string
  bgClass: string
  borderClass: string
  pitch: string
  faits: Fact[]
  usages: string[]
  exemples?: { jp: string; fr: string }[]
}

export function SystemeEcritureInfo({
  kana, nom, nomJP, accentClass, bgClass, borderClass,
  pitch, faits, usages, exemples,
}: SystemeEcritureInfoProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('rounded-2xl border overflow-hidden', bgClass, borderClass)}>
      {/* En-tête toujours visible */}
      <div className="flex items-start gap-4 p-4">
        <div className={cn('shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-jp-serif text-2xl font-bold', bgClass, 'border', borderClass)}>
          <span className={accentClass}>{kana}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-foreground text-sm">{nom}</span>
            <span className={cn('font-jp text-xs', accentClass)}>{nomJP}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{pitch}</p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="shrink-0 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label={open ? 'Réduire' : 'En savoir plus'}
        >
          <ChevronDown size={15} className={cn('text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
        </button>
      </div>

      {/* Contenu dépliable */}
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-inherit pt-4">
          {/* Faits clés */}
          <div className="grid grid-cols-2 gap-2">
            {faits.map(f => (
              <div key={f.label} className="bg-background/60 rounded-xl p-3">
                <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-0.5', accentClass)}>{f.label}</p>
                <p className="text-xs font-medium text-foreground">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Usages */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">À quoi ça sert</p>
            <ul className="space-y-1.5">
              {usages.map((u, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed">
                  <span className={cn('mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full', accentClass.replace('text-', 'bg-'))} />
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* Exemples */}
          {exemples && exemples.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Exemples</p>
              <div className="flex flex-wrap gap-2">
                {exemples.map(ex => (
                  <div key={ex.jp} className="bg-background/60 rounded-lg px-3 py-2 text-center">
                    <p className={cn('font-jp text-base font-bold leading-none', accentClass)}>{ex.jp}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{ex.fr}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Données préconfigurées ───────────────────────────────────────

// ── Grammaire ────────────────────────────────────────────────────
export const GRAMMAIRE_INFO: SystemeEcritureInfoProps = {
  kana:        '文',
  nom:         'Grammaire',
  nomJP:       '文法',
  accentClass: 'text-violet-600 dark:text-violet-400',
  bgClass:     'bg-violet-500/5 dark:bg-violet-500/8',
  borderClass: 'border-violet-500/20',
  pitch:       'Le japonais fonctionne à l\'envers du français. Le verbe est toujours en fin de phrase, les modificateurs précèdent ce qu\'ils décrivent.',
  faits: [
    { label: 'Ordre',          value: 'Sujet → Objet → Verbe (SOV)' },
    { label: 'Articles',       value: 'Inexistants (pas de le/la/un)' },
    { label: 'Genre/Nombre',   value: 'Pas de pluriel ni de genre' },
    { label: 'Niveaux JLPT',   value: 'N5 à N1 (ce site : N5–N4)' },
  ],
  usages: [
    'Construire des phrases simples : 私は学生です (Je suis étudiant)',
    'Les particules remplacent les prépositions et marquent les rôles grammaticaux',
    'Le temps (passé, présent/futur) se marque sur le verbe uniquement',
    'La négation aussi est portée par le verbe : tabemasu → tabemasen',
    'Les subordonnées se placent AVANT le nom qu\'elles modifient',
  ],
  exemples: [
    { jp: '私は日本語を勉強します。', fr: 'J\'étudie le japonais.' },
    { jp: '昨日食べました。',         fr: 'J\'ai mangé hier.' },
    { jp: '難しくない。',             fr: 'Ce n\'est pas difficile.' },
  ],
}

// ── Particules ────────────────────────────────────────────────────
export const PARTICULES_INFO: SystemeEcritureInfoProps = {
  kana:        '助',
  nom:         'Particules',
  nomJP:       '助詞',
  accentClass: 'text-orange-600 dark:text-orange-400',
  bgClass:     'bg-orange-500/5 dark:bg-orange-500/8',
  borderClass: 'border-orange-500/20',
  pitch:       'De petits mots sans équivalent en français qui indiquent le rôle de chaque élément dans la phrase. Indispensables pour tout comprendre.',
  faits: [
    { label: 'Nombre',       value: '~20 particules essentielles' },
    { label: 'Position',     value: 'Après le mot qu\'elles marquent' },
    { label: 'Équivalent',   value: 'Aucun en français — concept nouveau' },
    { label: 'Niveau JLPT',  value: 'N5 à N1 selon la particule' },
  ],
  usages: [
    'は (wa) : thème de la phrase — ce dont on parle',
    'が (ga) : sujet grammatical — qui fait l\'action',
    'を (wo) : objet direct — ce sur quoi porte l\'action',
    'に (ni) : direction, destination, moment, existence',
    'で (de) : lieu d\'action, moyen, matière',
    'と (to) : et (liste), avec (accompagnement), citation',
    'の (no) : possession, relation entre deux noms',
  ],
  exemples: [
    { jp: '私は学生です。',   fr: 'Moi, je suis étudiant. (thème は)' },
    { jp: '猫が好きです。',   fr: 'J\'aime les chats. (sujet が)' },
    { jp: '水を飲みます。',   fr: 'Je bois de l\'eau. (objet を)' },
    { jp: '東京に行きます。', fr: 'Je vais à Tokyo. (direction に)' },
  ],
}

// ── Conjugaison ───────────────────────────────────────────────────
export const CONJUGAISON_INFO: SystemeEcritureInfoProps = {
  kana:        '活',
  nom:         'Conjugaison',
  nomJP:       '活用',
  accentClass: 'text-blue-600 dark:text-blue-400',
  bgClass:     'bg-blue-500/5 dark:bg-blue-500/8',
  borderClass: 'border-blue-500/20',
  pitch:       'Les verbes japonais ne varient pas selon la personne ni le nombre. Ils changent selon la politesse et le temps — et c\'est tout.',
  faits: [
    { label: 'Groupes',       value: '3 : godan (1), ichidan (2), irréguliers' },
    { label: 'Temps',         value: 'Présent/futur et passé (seulement 2)' },
    { label: 'Personne',      value: 'Invariable (même forme pour je/tu/il…)' },
    { label: 'Formes clés',   value: 'Polie (masu), Négative, Impérative, Te-form' },
  ],
  usages: [
    'Groupe 1 (godan) : verbes dont la racine se termine par une consonne — kaku, yomu, nomu',
    'Groupe 2 (ichidan) : verbes dont la racine se termine par -i ou -e — taberu, miru',
    'Irréguliers : seulement 2 — する (suru = faire) et くる (kuru = venir)',
    'Forme polie (ます/masu) : utilisée dans les conversations formelles',
    'Forme courte (plain form) : conversations familières, subordonnées, écriture',
    'Te-form (て) : enchaîner des actions, demandes polies',
  ],
  exemples: [
    { jp: '食べます',   fr: 'je mange (poli)' },
    { jp: '食べました', fr: 'j\'ai mangé (poli passé)' },
    { jp: '食べない',   fr: 'je ne mange pas (familier)' },
    { jp: '食べて',     fr: 'manger et… / mange ! (te-form)' },
  ],
}

// ── Keigo ─────────────────────────────────────────────────────────
export const KEIGO_INFO: SystemeEcritureInfoProps = {
  kana:        '敬',
  nom:         'Keigo',
  nomJP:       '敬語',
  accentClass: 'text-rose-600 dark:text-rose-400',
  bgClass:     'bg-rose-500/5 dark:bg-rose-500/8',
  borderClass: 'border-rose-500/20',
  pitch:       'La langue honorifique japonaise. Pas juste de la politesse — un système grammatical complet avec des verbes et des formes différents selon les rapports sociaux.',
  faits: [
    { label: 'Niveaux',      value: '3 : sonkeigo, kenjōgo, teineigo' },
    { label: 'Usage',        value: 'Travail, commerce, médias, administration' },
    { label: 'Difficultés',  value: 'Verbes entièrement remplacés' },
    { label: 'Culture',      value: 'Reflète la hiérarchie sociale japonaise' },
  ],
  usages: [
    'Sonkeigo (尊敬語) : élever l\'action de l\'interlocuteur — いらっしゃる au lieu de いる',
    'Kenjōgo (謙譲語) : abaisser sa propre action — 申す au lieu de 言う',
    'Teineigo (丁寧語) : politesse générale avec ～ます et ～です',
    'Indispensable en entreprise, dans les commerces, face aux clients',
    'Omniprésent dans les dramas, actualités et documents officiels',
  ],
  exemples: [
    { jp: 'いらっしゃいます',   fr: 'être / se trouver (sonkeigo)' },
    { jp: '申します',           fr: 'dire / s\'appeler (kenjōgo)' },
    { jp: 'いただきます',       fr: 'recevoir / manger (kenjōgo)' },
    { jp: 'よろしくお願いします', fr: 'formule de politesse polyvalente' },
  ],
}

// ── Compteurs ─────────────────────────────────────────────────────
export const COMPTEURS_INFO: SystemeEcritureInfoProps = {
  kana:        '数',
  nom:         'Compteurs',
  nomJP:       '助数詞',
  accentClass: 'text-amber-600 dark:text-amber-400',
  bgClass:     'bg-amber-500/5 dark:bg-amber-500/8',
  borderClass: 'border-amber-500/20',
  pitch:       'En japonais, on ne dit pas "deux chats" — on dit "deux queues-de-chat" (二匹). Chaque type d\'objet a son propre mot compteur.',
  faits: [
    { label: 'Nombre',       value: '350+ compteurs officiels' },
    { label: 'Équivalent',   value: 'Aucun en français' },
    { label: 'Niveau',       value: 'N5 à N3 pour les essentiels' },
    { label: 'Prononciation', value: 'Souvent irrégulière avec 1, 3, 6, 8' },
  ],
  usages: [
    '人 (nin/hitori/futari) : personnes',
    '匹 (hiki) : animaux de petite taille — chats, chiens, poissons',
    '頭 (tō) : grands animaux — vaches, chevaux',
    '枚 (mai) : objets plats — feuilles, assiettes, t-shirts',
    '冊 (satsu) : livres, cahiers, magazines',
    '本 (hon) : objets longs et cylindriques — bouteilles, stylos, arbres',
    '台 (dai) : machines, véhicules, appareils',
    '杯 (hai) : tasses, verres, bols',
  ],
  exemples: [
    { jp: '一人',   fr: 'une personne (hitori)' },
    { jp: '二匹',   fr: 'deux animaux (nihiki)' },
    { jp: '三枚',   fr: 'trois feuilles (sanmai)' },
    { jp: '四冊',   fr: 'quatre livres (yonsatsu)' },
  ],
}

// ── Chiffres ──────────────────────────────────────────────────────
export const CHIFFRES_INFO: SystemeEcritureInfoProps = {
  kana:        '数',
  nom:         'Chiffres',
  nomJP:       '数字',
  accentClass: 'text-emerald-600 dark:text-emerald-400',
  bgClass:     'bg-emerald-500/5 dark:bg-emerald-500/8',
  borderClass: 'border-emerald-500/20',
  pitch:       'Le japonais a deux systèmes de comptage : le système sino-japonais (venu de Chine, universel) et le système natif (limité à 10). La grande unité est la "myriade" — 万 = 10 000, pas 1 000.',
  faits: [
    { label: 'Systèmes',      value: '2 : sino-japonais (ichi/ni/san) + natif (hitotsu/futatsu)' },
    { label: 'Natif',         value: 'Utilisé de 1 à 10 seulement' },
    { label: 'Grande unité',  value: '万 (man) = 10 000 — pas 1 000' },
    { label: 'Usage',         value: 'Prix, âges, heures, quantités' },
  ],
  usages: [
    'Sino-japonais (ichi, ni, san…) : pour la plupart des usages — heures, prix, téléphone',
    'Natif (hitotsu, futatsu…) : objets généraux sans compteur spécifique',
    '万 (man = 10 000) : les Japonais regroupent par 10 000, pas par 1 000',
    '100 000 = 十万 (jūman = 10 × 10 000), pas cent-mille',
    'Les prix au Japon s\'expriment souvent en dizaines de milliers de yens',
  ],
  exemples: [
    { jp: '一、二、三', fr: 'ichi, ni, san (sino-japonais)' },
    { jp: 'ひとつ、ふたつ', fr: 'hitotsu, futatsu (natif)' },
    { jp: '一万円', fr: '10 000 yens (ichiman en)' },
    { jp: '三十万', fr: '300 000 (sanjūman)' },
  ],
}

// ── Onomatopées ───────────────────────────────────────────────────
export const ONOMATOPEES_INFO: SystemeEcritureInfoProps = {
  kana:        '擬',
  nom:         'Onomatopées',
  nomJP:       '擬音語・擬態語',
  accentClass: 'text-teal-600 dark:text-teal-400',
  bgClass:     'bg-teal-500/5 dark:bg-teal-500/8',
  borderClass: 'border-teal-500/20',
  pitch:       'Le japonais possède plus de 4 500 onomatopées — bien plus que le français. Elles expriment des sons, des émotions, des textures, des états physiques et des actions.',
  faits: [
    { label: 'Nombre',      value: '4 500+ recensées' },
    { label: 'Types',       value: 'Giongo (sons) + Gitaigo (états/sensations)' },
    { label: 'Écriture',    value: 'Souvent en katakana dans les mangas' },
    { label: 'Usage',       value: 'Indispensables dans manga, anime, conversation' },
  ],
  usages: [
    'Giongo (擬音語) : sons réels — ドン (boum), ニャー (miaou), ザーザー (pluie qui tombe)',
    'Gitaigo (擬態語) : états sans son — キラキラ (qui brille), フワフワ (moelleux)',
    'Gijōgo (擬情語) : émotions — ドキドキ (cœur qui bat fort), ワクワク (excitation)',
    'Très présentes dans les mangas et anime comme effets visuels en katakana',
    'Enrichissent considérablement l\'expression orale et la compréhension',
  ],
  exemples: [
    { jp: 'ドキドキ',   fr: 'cœur qui bat (stress/amour)' },
    { jp: 'キラキラ',   fr: 'qui brille, scintille' },
    { jp: 'フワフワ',   fr: 'moelleux, léger, aérien' },
    { jp: 'ザーザー',   fr: 'pluie battante' },
    { jp: 'ワクワク',   fr: 'excitation, impatience' },
    { jp: 'ペラペラ',   fr: 'parler couramment' },
  ],
}

// ── JLPT ──────────────────────────────────────────────────────────
export const JLPT_INFO: SystemeEcritureInfoProps = {
  kana:        '験',
  nom:         'JLPT',
  nomJP:       '日本語能力試験',
  accentClass: 'text-primary',
  bgClass:     'bg-primary/5 dark:bg-primary/8',
  borderClass: 'border-primary/20',
  pitch:       'Le JLPT (Japanese Language Proficiency Test) est la certification internationale de japonais la plus reconnue. 5 niveaux, de N5 (débutant) à N1 (maîtrise).',
  faits: [
    { label: 'Niveaux',      value: '5 : N5 → N1 (N5 = débutant)' },
    { label: 'Candidats',    value: '~1 million par an dans 85 pays' },
    { label: 'Sessions',     value: 'Juillet et décembre chaque année' },
    { label: 'Organisateur', value: 'JLEES (Japan Educational Exchanges)' },
  ],
  usages: [
    'N5 : hiragana, katakana, ~100 kanji, vocabulaire de base, phrases simples',
    'N4 : ~300 kanji, conversations courantes, structures grammaticales essentielles',
    'N3 : ~650 kanji, textes de la vie quotidienne, japonais naturel basique',
    'N2 : ~1 000 kanji, presse, documents, proche du niveau professionnel',
    'N1 : ~2 000 kanji, textes complexes, littérature, niveau quasi-natif',
    'Reconnu par les universités japonaises, les entreprises et les services d\'immigration',
  ],
  exemples: [
    { jp: 'N5',  fr: '~103 kanji · ~800 mots — débutant' },
    { jp: 'N4',  fr: '~300 kanji · ~1500 mots — élémentaire' },
    { jp: 'N3',  fr: '~650 kanji · ~3700 mots — intermédiaire' },
    { jp: 'N2',  fr: '~1000 kanji · ~6000 mots — avancé' },
    { jp: 'N1',  fr: '~2000 kanji · ~10000 mots — maîtrise' },
  ],
}

// ── Écriture ──────────────────────────────────────────────────────
export const ECRITURE_INFO: SystemeEcritureInfoProps = {
  kana:        '書',
  nom:         'Écriture',
  nomJP:       '書き練習',
  accentClass: 'text-sky-600 dark:text-sky-400',
  bgClass:     'bg-sky-500/5 dark:bg-sky-500/8',
  borderClass: 'border-sky-500/20',
  pitch:       'L\'ordre des traits n\'est pas arbitraire : il suit des règles précises qui garantissent un tracé harmonieux, identique à celui des Japonais.',
  faits: [
    { label: 'Règle principale', value: 'De gauche à droite, de haut en bas' },
    { label: 'Importance',       value: 'Indispensable pour l\'écriture rapide et les cursives' },
    { label: 'Reconnaissance',   value: 'Facilite la lecture des kanji manuscrits' },
    { label: 'Pratique',         value: 'Canvas interactif avec détection d\'ordre' },
  ],
  usages: [
    'Mémoriser les kana en les traçant — le geste ancre mieux que la vue seule',
    'Préparer l\'écriture rapide (cursive) où les traits se lient naturellement dans le bon ordre',
    'Comprendre les variantes calligraphiques et les polices manuscrites',
    'Reconnaître les kanji écrits à la main par des Japonais natifs',
  ],
  exemples: [
    { jp: 'あ', fr: '3 traits — courbe + jonction + boucle' },
    { jp: 'き', fr: '4 traits — horizontaux puis verticaux' },
    { jp: '日', fr: '4 traits — encadrement puis traverses' },
    { jp: '山', fr: '3 traits — pic central, puis côtés' },
  ],
}

// ── Phrases ───────────────────────────────────────────────────────
export const PHRASES_INFO: SystemeEcritureInfoProps = {
  kana:        '句',
  nom:         'Phrases utiles',
  nomJP:       '表現',
  accentClass: 'text-pink-600 dark:text-pink-400',
  bgClass:     'bg-pink-500/5 dark:bg-pink-500/8',
  borderClass: 'border-pink-500/20',
  pitch:       'Des expressions mémorisées entières sont souvent plus utiles qu\'une grammaire parfaite. Ce sont les vraies phrases que les Japonais utilisent au quotidien.',
  faits: [
    { label: 'Approche',     value: 'Bloc-mémo — formules toutes faites' },
    { label: 'Registre',     value: 'Poli (teineigo) par défaut' },
    { label: 'Situations',   value: 'Restaurant, transports, commerces, social' },
    { label: 'Objectif',     value: 'Survie immédiate au Japon' },
  ],
  usages: [
    'Saluer et se présenter dans des situations formelles et informelles',
    'Commander au restaurant, demander l\'addition',
    'Demander son chemin, comprendre les indications',
    'Faire du shopping, demander un prix, négocier',
    'Situations d\'urgence et formules de politesse essentielles',
  ],
  exemples: [
    { jp: 'すみません',         fr: 'Excusez-moi / Pardon' },
    { jp: 'これをください',     fr: 'Je voudrais ceci, s\'il vous plaît' },
    { jp: 'どこですか？',       fr: 'Où est… ?' },
    { jp: 'いくらですか？',     fr: 'C\'est combien ?' },
  ],
}

// ── Vocabulaire ───────────────────────────────────────────────────
export const VOCABULAIRE_INFO: SystemeEcritureInfoProps = {
  kana:        '語',
  nom:         'Vocabulaire',
  nomJP:       '語彙',
  accentClass: 'text-teal-600 dark:text-teal-400',
  bgClass:     'bg-teal-500/5 dark:bg-teal-500/8',
  borderClass: 'border-teal-500/20',
  pitch:       'Organisé par thèmes du quotidien pour mémoriser des groupes de mots cohérents. Chaque mot est présenté avec son kanji, sa lecture kana et sa prononciation audio.',
  faits: [
    { label: 'Thèmes',      value: '8 catégories du quotidien' },
    { label: 'Format',      value: 'Japonais · Kana · Traduction française' },
    { label: 'Audio',       value: 'Prononciation native sur chaque mot' },
    { label: 'Niveau',      value: 'N5 à N4 (débutant–élémentaire)' },
  ],
  usages: [
    'Apprendre les mots en contexte thématique (famille, nourriture, couleurs…)',
    'Quiz JP→FR et FR→JP pour ancrer les deux sens',
    'Chaque mot vocalique permet d\'entraîner sa prononciation',
    'Progresser vers les flashcards SRS pour la révision long-terme',
  ],
  exemples: [
    { jp: '家族', fr: 'famille (kazoku)' },
    { jp: '食べ物', fr: 'nourriture (tabemono)' },
    { jp: '色', fr: 'couleur (iro)' },
    { jp: '動物', fr: 'animal (dōbutsu)' },
  ],
}

// ── Écoute ────────────────────────────────────────────────────────
export const ECOUTE_INFO: SystemeEcritureInfoProps = {
  kana:        '聴',
  nom:         'Écoute',
  nomJP:       '聴く',
  accentClass: 'text-rose-600 dark:text-rose-400',
  bgClass:     'bg-rose-500/5 dark:bg-rose-500/8',
  borderClass: 'border-rose-500/20',
  pitch:       'Lire le japonais et le comprendre à l\'oral sont deux compétences distinctes. L\'écoute régulière entraîne le cerveau à segmenter les mots sans espaces.',
  faits: [
    { label: 'Particularité', value: 'Pas d\'espaces entre les mots en japonais' },
    { label: 'Vitesse',       value: 'Discours natif : ~7 more/s (syllabes/seconde)' },
    { label: 'Registres',     value: 'Formel, familier et keigo — très différents' },
    { label: 'Conseil',       value: 'Écouter même sans tout comprendre aide' },
  ],
  usages: [
    'Entraîner la segmentation : identifier où finit un mot et où en commence un autre',
    'Habituer l\'oreille aux contractions et aux formes familières (じゃ pour では)',
    'Distinguer les sons proches : ri/li, tsu/su, long/court vowel',
    'Préparer la compréhension du japonais naturel (anime, podcasts, dramas)',
  ],
  exemples: [
    { jp: 'ありがとう', fr: 'merci — 5 more' },
    { jp: 'よろしく',   fr: 's\'il vous plaît — 4 more' },
    { jp: 'すみません', fr: 'excusez-moi — 5 more' },
  ],
}

// ── Données préconfigurées ───────────────────────────────────────

export const HIRAGANA_INFO: SystemeEcritureInfoProps = {
  kana:        'あ',
  nom:         'Hiragana',
  nomJP:       'ひらがな',
  accentClass: 'text-primary',
  bgClass:     'bg-primary/5 dark:bg-primary/8',
  borderClass: 'border-primary/20',
  pitch:       'Le premier alphabet que tu dois apprendre. 46 syllabes rondes et courbes, créées au IXe siècle.',
  faits: [
    { label: 'Époque',      value: 'IXe siècle' },
    { label: 'Caractères',  value: '46 de base + variantes' },
    { label: 'Type',        value: 'Syllabaire (1 signe = 1 son)' },
    { label: 'Niveau JLPT', value: 'Requis dès le N5' },
  ],
  usages: [
    'Mots japonais natifs (hana 花, yama 山)',
    'Terminaisons et conjugaisons verbales (tabemasu → ます)',
    'Particules grammaticales (は, が, を, に)',
    'Furigana : petits caractères au-dessus des kanji pour indiquer la lecture',
    'Textes pour enfants, où les kanji sont remplacés par des hiragana',
  ],
  exemples: [
    { jp: 'あ',  fr: 'a'   },
    { jp: 'か',  fr: 'ka'  },
    { jp: 'さ',  fr: 'sa'  },
    { jp: 'です',fr: 'desu (être)' },
    { jp: 'は',  fr: 'wa (particule sujet)' },
  ],
}

export const KATAKANA_INFO: SystemeEcritureInfoProps = {
  kana:        'ア',
  nom:         'Katakana',
  nomJP:       'カタカナ',
  accentClass: 'text-amber-600 dark:text-amber-400',
  bgClass:     'bg-amber-500/5 dark:bg-amber-500/8',
  borderClass: 'border-amber-500/20',
  pitch:       'L\'alphabet des mots étrangers et de l\'emphase. Formes angulaires, même sons que les hiragana.',
  faits: [
    { label: 'Époque',      value: 'IXe siècle (moines)' },
    { label: 'Caractères',  value: '46 de base + sons étrangers' },
    { label: 'Type',        value: 'Syllabaire (même sons que hiragana)' },
    { label: 'Niveau JLPT', value: 'Requis dès le N5' },
  ],
  usages: [
    'Mots d\'origine étrangère (emprunts) : コーヒー (kōhī = café), テレビ (terebi = télé)',
    'Noms de pays et de personnes étrangères : フランス (Furansu = France)',
    'Onomatopées et effets sonores dans les mangas : ドン！ガン！',
    'Emphase, comme les italiques en français : ほんとうに？ → ほんとうに？',
    'Termes scientifiques, noms d\'espèces animales et végétales',
    'Noms de certaines entreprises et marques japonaises',
  ],
  exemples: [
    { jp: 'スマホ',   fr: 'smartphone'  },
    { jp: 'コーヒー', fr: 'café'        },
    { jp: 'フランス', fr: 'France'      },
    { jp: 'アニメ',   fr: 'anime'       },
    { jp: 'パン',     fr: 'pain'        },
  ],
}

export const KANJI_INFO: SystemeEcritureInfoProps = {
  kana:        '漢',
  nom:         'Kanji',
  nomJP:       '漢字',
  accentClass: 'text-teal-600 dark:text-teal-400',
  bgClass:     'bg-teal-500/5 dark:bg-teal-500/8',
  borderClass: 'border-teal-500/20',
  pitch:       'Des idéogrammes venus de Chine. Chaque kanji porte un sens, pas seulement un son.',
  faits: [
    { label: 'Origine',       value: 'Chine, Ve siècle' },
    { label: 'Usage courant', value: '2 136 jōyō kanji' },
    { label: 'Lectures',      value: 'On\'yomi (CN) + Kun\'yomi (JP)' },
    { label: 'Ce site',       value: 'N5 : 103 · N4 : 181' },
  ],
  usages: [
    'Représenter des mots ou des morphèmes (unités de sens)',
    'Distinguer des homophones : 橋 (hashi = pont) ≠ 箸 (hashi = baguettes)',
    'Comprimer l\'information : 日本語 = ni-hon-go (japonais), 3 kanji = 1 mot',
    'Lire les journaux, livres, panneaux, menus au Japon',
    'Les noms propres japonais sont presque toujours écrits en kanji',
  ],
  exemples: [
    { jp: '日',  fr: 'soleil / jour' },
    { jp: '山',  fr: 'montagne'      },
    { jp: '人',  fr: 'personne'      },
    { jp: '水',  fr: 'eau'           },
    { jp: '火',  fr: 'feu'           },
  ],
}
