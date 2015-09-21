'use strict'

import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { setAdminStatus, loadAdminInfo } from '../actions/admin'

class Master extends Component {
  static displayName = 'Pages/Master'

  static propTypes = {
    admin: PropTypes.object,
    children: PropTypes.any,
    loadAdminInfo: PropTypes.func,
    setAdminStatus: PropTypes.func
  }

  componentWillMount () {
    this.props.setAdminStatus(false)
    this.props.loadAdminInfo()
  }

  render () {
    const { status } = this.props.admin
    return (
      <div>
        <header>
          <div>Logo</div>
        </header>
        <div className="main">{this.props.children}</div>

        { status === 0 &&
          <div>login</div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    admin: state.admin
  }
}

export default connect(
  mapStateToProps,
  { setAdminStatus, loadAdminInfo }
)(Master)
