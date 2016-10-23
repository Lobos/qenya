const config = {
  debug: false,

  engine: 'tingodb',

  i18n: {
    locales: ['zh-cn'],
    // defaultLocale: 'zh-cn',
    extension: '.json',
    directory: './server/locales',
    cookieName: 'lang'
  },

  logPath: './log',

  mongo: {
    'host': '127.0.0.1',
    'port': 27017,
    'db': 'data',
    'opts': {
      'auto_reconnect': true,
      'safe': true
    }
  },

  tingo: {
    'path': './data'
  }
}

export default config

export function setConfig (conf) {
  Object.assign(config, conf)
}
