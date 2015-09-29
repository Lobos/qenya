import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table } from 'rctui'
import Loading from '../components/loading'

class List extends Component {
  static displayName = 'List'

  static propTypes = {
    data: PropTypes.array,
    isFetching: PropTypes.bool,
    schema: PropTypes.object,
    styles: PropTypes.object
  }

  static defaultProps = {
    data: []
  }

  render () {
    const { data, isFetching, schema, styles } = this.props
    const headers = Object.keys(schema).map(k => {
      let prop = schema[k]
      return {
        name: k,
        header: prop.alias || k,
        hidden: prop.ignore
      }
    })
    return (
      <div className={styles.container}>
        { isFetching ?
          <Loading className={styles.loading} /> :
          <Table headers={headers} data={data} />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    styles: state.styles.list
  }
}

export default connect(
  mapStateToProps
)(List)
