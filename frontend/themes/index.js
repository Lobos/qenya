'use strict'

let THEME = 'default'

const themes = {
  'default': {
    login: require('./default/login.less')
  }
}

export function getStyles() {
  return themes[THEME]
}
