export { CHIFFRES_THEME } from './chiffres'
export { COULEURS_THEME } from './couleurs'
export { FAMILLE_THEME } from './famille'
export { NOURRITURE_THEME } from './nourriture'
export { TRANSPORT_THEME } from './transport'
export { CORPS_THEME } from './corps'
export { TEMPS_THEME } from './temps'
export { SALUTATIONS_THEME } from './salutations'
export { TRAVAIL_THEME } from './travail'
export { VILLE_THEME } from './ville'
export { EMOTIONS_THEME } from './emotions'
export { ECOLE_THEME } from './ecole'
export { MAISON_THEME } from './maison'
export { ACTIVITES_THEME } from './activites'
export { METEO_THEME } from './meteo'
export { VETEMENTS_THEME } from './vetements'

import { CHIFFRES_THEME } from './chiffres'
import { COULEURS_THEME } from './couleurs'
import { FAMILLE_THEME } from './famille'
import { NOURRITURE_THEME } from './nourriture'
import { TRANSPORT_THEME } from './transport'
import { CORPS_THEME } from './corps'
import { TEMPS_THEME } from './temps'
import { SALUTATIONS_THEME } from './salutations'
import { TRAVAIL_THEME } from './travail'
import { VILLE_THEME } from './ville'
import { EMOTIONS_THEME } from './emotions'
import { ECOLE_THEME } from './ecole'
import { MAISON_THEME } from './maison'
import { ACTIVITES_THEME } from './activites'
import { METEO_THEME } from './meteo'
import { VETEMENTS_THEME } from './vetements'
import type { VocabTheme, VocabThemeId } from '@/types/vocabulary'

export const ALL_THEMES: VocabTheme[] = [
  SALUTATIONS_THEME,
  CHIFFRES_THEME,
  COULEURS_THEME,
  FAMILLE_THEME,
  NOURRITURE_THEME,
  TRANSPORT_THEME,
  CORPS_THEME,
  TEMPS_THEME,
  TRAVAIL_THEME,
  VILLE_THEME,
  EMOTIONS_THEME,
  ECOLE_THEME,
  MAISON_THEME,
  ACTIVITES_THEME,
  METEO_THEME,
  VETEMENTS_THEME,
]

export const THEMES_MAP: Record<VocabThemeId, VocabTheme> = Object.fromEntries(
  ALL_THEMES.map(t => [t.id, t])
) as Record<VocabThemeId, VocabTheme>
