export { CHIFFRES_THEME } from './chiffres'
export { COULEURS_THEME } from './couleurs'
export { FAMILLE_THEME } from './famille'
export { NOURRITURE_THEME } from './nourriture'
export { TRANSPORT_THEME } from './transport'
export { CORPS_THEME } from './corps'
export { TEMPS_THEME } from './temps'
export { SALUTATIONS_THEME } from './salutations'

import { CHIFFRES_THEME } from './chiffres'
import { COULEURS_THEME } from './couleurs'
import { FAMILLE_THEME } from './famille'
import { NOURRITURE_THEME } from './nourriture'
import { TRANSPORT_THEME } from './transport'
import { CORPS_THEME } from './corps'
import { TEMPS_THEME } from './temps'
import { SALUTATIONS_THEME } from './salutations'
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
]

export const THEMES_MAP: Record<VocabThemeId, VocabTheme> = Object.fromEntries(
  ALL_THEMES.map(t => [t.id, t])
) as Record<VocabThemeId, VocabTheme>
