import { one, random } from './pick'
import { substitute } from '../strings'

async function pickRef (field, db, getList) {
  return new Promise(async (resolve, reject) => {
    let times = random(3)
    let values = []
    while (times--) {
      let list = await getList(db.collection(field.sourceRef), {}, 1, 20)
      let value = substitute(field.valueTpl || '{_id}', one(list.list))
      values.push(value)
    }
    values = Array.from(new Set(values))
    if (field.sep) values = values.join(field.sep)
    resolve(field.mult ? values : values[0])
  })
}

async function pickJson (field) {
  return new Promise((resolve, reject) => {
    let data = JSON.parse(field.sourceJson)
    if (!Array.isArray(data)) {
      data = Object.keys(data).map(k => {
        return {
          _id: k,
          text: data[k]
        }
      })
    } else {
      data = data.map(d => {
        if (typeof d === 'object') return d
        return { _id: d }
      })
    }

    let times = random(3)
    let values = []
    while (times--) {
      let value = substitute(field.valueTpl || '{_id}', one(data))
      values.push(value)
    }
    values = Array.from(new Set(values))
    if (field.sep) values = values.join(field.sep)
    resolve(field.mult ? values : values[0])
  })
}

export async function pickEnum (field, db, getList) {
  const { sourceType } = field
  switch (sourceType) {
    case 'json':
      return await pickJson(field)
    case 'ref':
      return await pickRef(field, db, getList)
  }
}
