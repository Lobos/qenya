require('./pure/icon.less')

const themes = {
  'pure': {
    reset: require('./pure/reset.less'),
    header: require('./pure/header.less'),
    login: require('./pure/login.less'),
    main: require('./pure/main.less'),
    navigation: require('./pure/navigation.less'),
    content: require('./pure/content.less'),
    list: require('./pure/list.less')
  }
}

export function getStyles(theme = 'pure') {
  return themes[theme]
}
