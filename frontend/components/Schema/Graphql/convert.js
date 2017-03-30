function convertFields (fields, pad) {
  const rows = ['id']
  fields.forEach(f => {
    if (f.sourceType === 'ref' && f.renderType === 'json') {
      rows.push(`${f.name}(fmt: "${f.resultTpl}" join: "${f.sep}")`)
    } else {
      rows.push(f.name)
    }
  })

  return rows.join('\n' + pad)
}

export function queryList (schema) {
  return (
`{
  ${schema.code}List(page: 1, size: 10) {
    total
    page
    size
    list {
      ${convertFields(schema.fields, '      ')}
    }
  }
}`)
}

export function queryOne (schema) {
  return (
`{
  ${schema.code}(id: 1) {
    ${convertFields(schema.fields, '    ')}
  }
}`)
}

export function querySave (schema) {
  const name = schema.code.replace(/\b\w/g, l => l.toUpperCase())
  return (
`mutation ($data: ${schema.code}Input) {
  save${name} (data: $data) {
    ${convertFields(schema.fields, '    ')}
  }
}`)
}

export function queryDelete (schema) {
  const name = schema.code.replace(/\b\w/g, l => l.toUpperCase())
  return (
`mutation {
  delete${name} (id: 1)
}`)
}
