import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table } from 'rctui'

class TableExtend extends Component {
  static displayName = 'TableExtend'

  static propTypes = {
    data: PropTypes.array,
    schema: PropTypes.object,
    styles: PropTypes.object
  }

  static defaultProps = {
    data: []
  }

  render () {
    const { data, schema } = this.props
    const headers = Object.keys(schema).map(k => {
      let prop = schema[k]
      return {
        name: k,
        header: prop.alias || k,
        hidden: prop.ignore
      }
    })
    return (
      <Table headers={headers} data={data} />
    )
  }
}

function mapStateToProps(state) {
  return {
    styles: state.styles.table
  }
}

export default connect(
  mapStateToProps
)(TableExtend)
