import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadAdminInfo, login } from '../actions/admin'
import Login from '../components/login'
import Header from '../components/header'
import Navigation from '../components/navigation'
import Loading from '../components/loading'

class Master extends Component {
  static displayName = 'Pages/Master'

  static propTypes = {
    admin: PropTypes.object,
    children: PropTypes.any,
    loadAdminInfo: PropTypes.func,
    login: PropTypes.func,
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

    if (status === 2) {
      return <Loading className={styles.main.loading} />
    }

    return (
      <div>
        <Header toggleSidebar={this.toggleSidebar.bind(this)} info={info} styles={styles.header} />
        <Navigation styles={styles.navigation} />

        { status === 3 ?
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
  { loadAdminInfo, login }
)(Master)
