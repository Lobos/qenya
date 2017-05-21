import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormControl } from 'rctui'

class JsonEdit extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(form) {
    this.props.onSubmit(form.data)
  }

  render() {
    const { data } = this.props

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormControl
          required
          type="json"
          valueType="object"
          labelWidth="1px"
          name="data"
          value={data}
          rows={15}
        />
      </Form>
    )
  }
}

JsonEdit.propTypes = {
  data: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
}

JsonEdit.defaultProps = {
  data: {},
}

export default JsonEdit
