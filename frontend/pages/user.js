import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadSchema } from '../actions/schema'
import Breadcrumb from '../components/breadcrumb'
import Table from '../components/table'

class User extends Component {
  static displayName = 'Pages/User'

  static propTypes = {
    loadSchema: PropTypes.func,
    schema: PropTypes.object,
    styles: PropTypes.object
  }

  componentWillMount () {
    this.props.loadSchema('user')
  }

  render () {
    const { schema } = this.props
    return (
      <div>
        <Breadcrumb items={['账户权限', '用户']} />
        <Table schema={schema.schemas['user'] || {}} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    schema: state.schema,
    styles: state.styles.content
  }
}

export default connect(
  mapStateToProps,
  { loadSchema }
)(User)
