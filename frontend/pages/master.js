'use strict'

import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { setAdminStatus, loadAdminInfo } from '../actions/admin'
import { Form, FormControl, Button } from 'rctui'

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
              <h3>登录</h3>
              <Form layout="stacked">
                <FormControl label="email" width={24} name="email" required="true" type="email" />
                <FormControl label="password" width={24} name="password" required="true" type="password" />
                <Button type="submit" status="primary">登录</Button>
              </Form>
            </div>
          </div>
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
  { setAdminStatus, loadAdminInfo }
)(Master)
