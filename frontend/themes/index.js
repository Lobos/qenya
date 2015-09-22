'use strict'

const themes = {
  'pure': {
    reset: require('./pure/reset.less'),
    header: require('./pure/header.less'),
    login: require('./pure/login.less')
  }
}

export function getStyles(theme = 'pure') {
  return themes[theme]
}
