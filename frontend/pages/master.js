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
    setAdminStatus: PropTypes.func,
    styles: PropTypes.object
  }

  componentWillMount () {
    this.props.setAdminStatus(false)
    this.props.loadAdminInfo()
  }

  render () {
    const { styles, admin: { status } } = this.props
    return (
      <div>
        <header>
          <div>Logo</div>
        </header>
        <div className="main">{this.props.children}</div>

        { status === 0 &&
          <div className={styles.login.wrap}>
            <div className={styles.login.overlay} />
            <div className={styles.login.inner}>
              <h3>Login</h3>
            </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state.styles)
  return {
    admin: state.admin,
    styles: state.styles
  }
}

export default connect(
  mapStateToProps,
  { setAdminStatus, loadAdminInfo }
)(Master)
