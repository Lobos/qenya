import { Component, PropTypes } from 'react'
import { Form, FormControl } from 'rctui'

class DataEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  setBool (field, props) {
    props.type = 'checkbox'
    props.text = field.label
    delete props.defaultValue
    delete props.label
  }

  setText (field, props) {
    const { max = 20 } = field
    props.grid = max > 10 ? 1 : 1 / 2
    props.type = max > 100 ? 'textarea' : 'text'
    if (max > 100 && max < 300) {
      props.rows = 3
    } else if (max >= 300) {
      props.rows = 5
    }
  }

  setEnum (field, props) {
    props.type = 'select'
    props.grid = 1 / 2
    props.mult = field.mult
    props.sep = field.sep
    props.valueTpl = field.valueTpl
    props.optionTpl = field.optionTpl
    switch (field.sourceType) {
      case 'json':
        props.data = JSON.parse(field.sourceJson)
        break
      case 'ref':
        props.fetch = {
          url: `/data/${field.sourceRef}/1/999`,
          then: (res) => res.data.list
        }
        break
      case 'url':
        props.fetch = field.sourceUrl
        break
    }
  }

  renderField (field) {
    const props = {
      key: field.name,
      name: field.name,
      label: field.label,
      min: field.min,
      max: field.max,
      type: field.type,
      defaultValue: field.defaultValue
    }

    switch (field.type) {
      case 'bool':
        this.setBool(field, props)
        break
      case 'text':
        this.setText(field, props)
        break
      case 'enum':
        this.setEnum(field, props)
        break
    }

    return <FormControl {...props} />
  }

  render () {
    const { data, fields, onSubmit } = this.props
    return (
      <Form onSubmit={onSubmit} data={data}>
        {fields.map(f => this.renderField(f))}
      </Form>
    )
  }
}

DataEdit.propTypes = {
  data: PropTypes.object,
  fields: PropTypes.array,
  onSubmit: PropTypes.func
}

DataEdit.defaultProps = {}

export default DataEdit
