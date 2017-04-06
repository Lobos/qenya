import fs from 'fs'
import * as Datetime from './datetime'
import config from '../config'

const slice = Array.prototype.slice

if (!fs.existsSync(config.logPath)) {
  fs.mkdirSync(config.logPath)
}

function wirteLog (type, args) {
  const filePrint = type === 'warn' || type === 'error'

  if (!filePrint && !config.debug) {
    return
  }

  const date = Date.now()

  args = slice.call(args)
  args.unshift(Datetime.format(date, 'yyyy-MM-dd hh:mm:ss'))
  const msg = args.join(' ')

  if (filePrint) {
    fs.appendFile(`${config.logPath}/${type}-${Datetime.format(date, 'yyyyMMdd')}.log`, msg + '\n')
  }

  if (config.debug) {
    console.log(msg)
  }
}

export function info () {
  wirteLog('info', arguments)
}

export function debug () {
  wirteLog('debug', arguments)
}

export function warn () {
  wirteLog('warn', arguments)
}

export function error () {
  wirteLog('error', arguments)
}
