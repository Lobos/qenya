import { FIRST_NAME, LAST_NAME, LOREM } from './definitions'
import { pickText, pickInteger, pickNumber, pickDate } from './pick'
import { pickEnum } from './enum'

export default async function (fields, db, getList) {
  return new Promise(async (resolve) => {
    let data = {}
    for (let i = 0; i < fields.length; i++) {
      let f = fields[i]
      let res = ''
      switch (f.type) {
        case 'username':
          res = pickText(LAST_NAME) + pickText(FIRST_NAME)
          break
        case 'bool':
          res = pickText([true, false])
          break
        case 'integer':
          res = pickInteger(f.max, f.min)
          break
        case 'number':
          res = pickNumber(f.max, f.min)
          break
        case 'enum':
          res = await pickEnum(f, db, getList)
          break
        case 'date':
        case 'datetime':
          res = pickDate(f)
          break
        default:
          res = pickText(LOREM, f.max || 20, 1)
      }
      data[f.name] = res
    }

    resolve(data)
  })
}
