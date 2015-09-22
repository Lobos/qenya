'use strict'

const themes = {
  'pure': {
    reset: require('./pure/reset.less'),
    login: require('./pure/login.less')
  }
}

export function getStyles(theme = 'pure') {
  return themes[theme]
}
