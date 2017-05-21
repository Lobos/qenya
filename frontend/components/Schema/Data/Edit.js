import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Nav } from 'rctui'
import FormEdit from './FormEdit'
import JsonEdit from './JsonEdit'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'form',
    }

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange(tab) {
    this.setState({ tab })
  }

  render() {
    const { tab } = this.state
    const { data, fields, onSubmit } = this.props

    return (
      <div>
        <Nav active={tab} stateLess onSelect={this.handleTabChange} inline>
          <Nav.Item id="form">Form</Nav.Item>
          <Nav.Item id="json">Json</Nav.Item>
        </Nav>

        <div style={{ padding: '2rem' }}>
          { tab === 'form' && <FormEdit data={data} fields={fields} onSubmit={onSubmit} /> }
          { tab === 'json' && <JsonEdit data={data} onSubmit={onSubmit} /> }
        </div>
      </div>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object,
  fields: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

Edit.defaultProps = {
  data: {},
}

export default Edit
