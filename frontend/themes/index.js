'use strict'

const themes = {
  'pure': {
    global: require('./pure/global.less'),
    login: require('./pure/login.less')
  }
}

export function getStyles(theme = 'pure') {
  return themes[theme]
}
