const config = {
  debug: false,

  engine: 'tingodb',

  logPath: './log',

  mongo: {
    qenya: 'mongodb://localhost:27017/qenya',
    data: 'mongodb://localhost:27017/data',
  },

  tingo: {
    qenya: './data',
    data: './data/data',
  },
}

export default config

export function setConfig(conf) {
  Object.assign(config, conf)
}
