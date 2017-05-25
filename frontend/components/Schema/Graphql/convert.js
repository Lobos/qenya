function convertFields(fields, pad) {
  const rows = ['_id']
  fields.forEach((f) => {
    if (f.sourceType === 'ref' && f.renderType === 'json') {
      rows.push(`${f.name}(fmt: "${f.optionTpl}"${f.mult ? (` join: "${f.sep}"`) : ''})`)
    } else {
      rows.push(f.name)
    }
  })

  return rows.join(`\n${pad}`)
}

function convertType(field) {
  switch (field.type) {
    case 'integer':
      return 'Int'
    case 'number':
      return 'Float'
    case 'bool':
      return 'Boolean'
    case 'json':
      return 'Json'
    case 'enum':
      if (field.sourceType === 'ref' && !field.sep) {
        return field.mult ? '[ID]' : 'ID'
      }
      return 'String'

    default:
      return 'String'
  }
}

export function queryListWithPage(schema) {
  return (
`query ($page: Int, $size: Int) {
  ${schema.code}ListWithPage(page: $page, size: $size) {
    total
    page
    size
    list {
      ${convertFields(schema.fields, '      ')}
    }
  }
}`)
}

export function queryList(schema) {
  return (
`query ($page: Int, $size: Int) {
  ${schema.code}List(page: $page, size: $size) {
    ${convertFields(schema.fields, '    ')}
  }
}`)
}

export function queryOne(schema) {
  return (
`query ($_id: ID) {
  ${schema.code}(_id: $_id) {
    ${convertFields(schema.fields, '    ')}
  }
}`)
}

export function querySave(schema, isEdit) {
  const name = schema.code.replace(/\b\w/g, l => l.toUpperCase())

  const args = schema.fields.map(f => `$${f.name}: ${convertType(f)}`)
  const values = schema.fields.map(f => `${f.name}: $${f.name}`)

  if (isEdit) {
    args.unshift('$_id: ID')
    values.unshift('_id: $_id')
  }

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

export function queryDelete(schema) {
  const name = schema.code.replace(/\b\w/g, l => l.toUpperCase())
  return (
`mutation ($_id: ID) {
  delete${name} (_id: $_id)
}`)
}
