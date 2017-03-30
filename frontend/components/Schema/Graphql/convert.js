function convertFields (fields, pad) {
  const rows = ['id']
  fields.forEach(f => {
    if (f.sourceType === 'ref' && f.renderType === 'json') {
      rows.push(`${f.name}(fmt: "${f.optionTpl}"${f.mult ? ('join: "' + f.sep + '"') : ''})`)
    } else {
      rows.push(f.name)
    }
  })

  return rows.join('\n' + pad)
}

function convertType (field) {
  switch (field.type) {
    case 'integer':
      return 'Int'
    case 'number':
      return 'Float'
    case 'bool':
      return 'Boolean'
    default:
      return 'String'
  }
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

export function querySave (schema, mock) {
  const name = schema.code.replace(/\b\w/g, l => l.toUpperCase())

  const args = schema.fields.map(f => `$${f.name}: ${convertType(f)}`)
  const values = schema.fields.map(f => `${f.name}: $${f.name}`)

  return (
`mutation (
  ${args.join('\n  ')}
) {
  save${name} (
    ${values.join('\n    ')}
  ) {
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
