'use strict'

import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Breadcrumb from '../components/breadcrumb'

class User extends Component {
  static displayName = 'Pages/User'

  static propTypes = {
    styles: PropTypes.object
  }

  render () {
    return (
      <div>
        <Breadcrumb items={['账户权限', '用户']} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    styles: state.styles.content
  }
}

export default connect(
  mapStateToProps
)(User)
