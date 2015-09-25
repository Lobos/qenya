import { Component, PropTypes } from 'react'
import { Form, FormControl, FormSubmit } from 'rctui'

export default class Login extends Component {
  static displayName = 'Login'

  static propTypes = {
    login: PropTypes.func,
    msg: PropTypes.string,
    status: PropTypes.number,
    styles: PropTypes.object
  }

  onSubmit (data) {
    this.props.login(data)
  }

  render () {
    const { styles, status, msg } = this.props
    return (
      <div className={styles.wrap}>
        <div className={styles.overlay} />
        <div className={styles.inner}>
          <h3>登录</h3>
          { msg && <div className={styles.msg}>{msg}</div> }
          <Form locked={status === 1} onSubmit={this.onSubmit.bind(this)} layout="stacked">
            <FormControl label="email" width={24} name="email" required="true" type="email" />
            <FormControl label="password" width={24} name="password" required="true" type="password" />
            <FormSubmit>
              <span>提交</span>
              <span>处理中...</span>
            </FormSubmit>
          </Form>
        </div>
      </div>
    )
  }
}
