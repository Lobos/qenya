import { getStyles } from '../themes'

export const SET_THEME = 'SET_THEME'

export function setTheme(theme) {
  const styles = getStyles(theme) || {}

  // load theme style file

  return {
    type: SET_THEME,
    styles
  }
}
