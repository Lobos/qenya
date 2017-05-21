import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormControl } from 'rctui'

function getType(val) {
  const type = typeof val

  if (type === 'number') {
    if (parseInt(val, 10) === val) return 'integer'
    return 'number'
  }

  switch (type) {
    case 'string':
      if (/^\d{4}(-|\/|\.)\d{1,2}\1\d{1,2}$/.test(val)) {
        return 'date'
      }
      if (/^\d{4}(-|\/|\.)\d{1,2}\1\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(val)) {
        return 'datetime'
      }
      return 'text'
    case 'boolean':
      return 'bool'
    case 'object':
      return 'json'
    default:
      return type
  }
}

class JsonImport extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(data) {
    let { fields } = data
    if (Array.isArray(fields)) fields = fields[0]

    fields = Object.keys(fields).map(k => ({
      name: k,
      label: k,
      type: getType(fields[k]),
    }))

    this.props.onSuccess(fields)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} data={{ fields: {} }}>
        <FormControl
          label="json结构"
          name="fields"
          type="json"
          valueType="object"
          tip="填入一个json格式字符串，会根据json生成对应字段"
        />
      </Form>
    )
  }
}

JsonImport.propTypes = {
  onSuccess: PropTypes.func.isRequired,
}

JsonImport.defaultProps = {
}

export default JsonImport
