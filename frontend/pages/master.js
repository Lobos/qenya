'use strict'

import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { setAdminStatus, loadAdminInfo, login } from '../actions/admin'
import Login from '../components/login'
import Header from '../components/header'
import Navigation from '../components/navigation'

class Master extends Component {
  static displayName = 'Pages/Master'

  static propTypes = {
    admin: PropTypes.object,
    children: PropTypes.any,
    loadAdminInfo: PropTypes.func,
    login: PropTypes.func,
    setAdminStatus: PropTypes.func,
    styles: PropTypes.object
  }

  state = {
    showSidebar: true
  }

  componentWillMount () {
    this.props.loadAdminInfo()
  }

  toggleSidebar () {
    let showSidebar = !this.state.showSidebar
    this.setState({ showSidebar })
  }

  render () {
    const { styles, login, admin: { info, status, msg } } = this.props
    return (
      <div>
        <Header toggleSidebar={this.toggleSidebar.bind(this)} info={info} styles={styles.header} />
        <Navigation styles={styles.navigation} />

        { status >= 2 ?
          <div className={styles.main.container}>{this.props.children}</div> :
          <Login msg={msg} status={status} login={login} styles={styles.login} />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    admin: state.admin,
    styles: state.styles
  }
}

export default connect(
  mapStateToProps,
  { setAdminStatus, loadAdminInfo, login }
)(Master)
