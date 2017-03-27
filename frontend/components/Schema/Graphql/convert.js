function convertFields (fields, pad) {
  const rows = ['id']
  fields.forEach(f => {
    rows.push(f.name)
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
