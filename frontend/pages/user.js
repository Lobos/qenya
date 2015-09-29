import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadSchema } from '../actions/schema'
import { loadEntity } from '../actions/entity'
import { loadList } from '../actions/list'
import Breadcrumb from '../components/breadcrumb'
import List from '../components/list'

class User extends Component {
  static displayName = 'Pages/User'

  static propTypes = {
    loadEntity: PropTypes.func,
    loadList: PropTypes.func,
    loadSchema: PropTypes.func,
    schema: PropTypes.object,
    styles: PropTypes.object
  }

  componentWillMount () {
    this.props.loadSchema('user')
    this.props.loadList('user', '/user/list')
  }

  render () {
    const { schema } = this.props
    return (
      <div>
        <Breadcrumb items={['账户权限', '用户']} />
        <List schema={schema.schemas['user'] || {}} />
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
  { loadSchema, loadEntity, loadList }
)(User)
