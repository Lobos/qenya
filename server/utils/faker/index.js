import { FIRST_NAME, LAST_NAME, LOREM } from './definitions'
import { pickString, pickInteger, pickDate } from './pick'
import { pickEnum } from './enum'

export default async function (fields, db, getList) {
  return new Promise(async (resolve) => {
    let data = {}
    for (let i = 0; i < fields.length; i++) {
      let f = fields[i]
      let res = ''
      switch (f.type) {
        case 'username':
          res = pickString(LAST_NAME) + pickString(FIRST_NAME)
          break
        case 'bool':
          res = pickString([true, false])
          break
        case 'integer':
          res = pickInteger(f.max, f.min)
          break
        case 'enum':
          res = await pickEnum(f, db, getList)
          break
        case 'date':
        case 'datetime':
          res = pickDate(f)
          break
        default:
          res = pickString(LOREM, f.max || 20, 1)
      }
      data[f.name] = res
    }

    resolve(data)
  })
}
