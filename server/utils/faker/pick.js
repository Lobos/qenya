import * as Datetime from '../datetime'

export function pickText (items, max = 1, min) {
  let length = max
  if (min) {
    length = pickInteger(max, min)
  }

  let buffer = []
  while (length--) {
    buffer.push(one(items))
  }

  return max === 1 ? buffer[0] : buffer.join('')
}

export function pickNumber (max = 65555, min = 0) {
  return Math.random() * (max - min + 1) + min
}

export function pickInteger () {
  return Math.floor(pickNumber(...arguments))
}

export function pickDate (field) {
  let date = Date.now() - random(10000000000)
  return Datetime.format(date, field.type === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm:ss')
}

export function one (items) {
  return items[Math.floor(Math.random() * items.length)]
}

export function random (max) {
  return Math.ceil(Math.random() * max)
}
