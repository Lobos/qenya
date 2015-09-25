import { Component, PropTypes } from 'react'
import { Icon } from 'rctui'

class Item extends Component {
  static displayName = 'Navigation/Item'

  static propTypes = {
    icon: PropTypes.any,
    onClick: PropTypes.func,
    path: PropTypes.string,
    styles: PropTypes.object,
    text: PropTypes.string
  }
 
  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  routeChange () {
    const path = this.props.path
    if (!this.context.history.isActive(path)) {
      this.context.history.pushState(null, path)
    }
  }

  render () {
    let { icon, path, styles } = this.props
    icon = typeof icon === 'string' ? <Icon icon={icon} /> : icon
    const className = this.context.history.isActive(path) ? styles.active : null
    return (
      <li>
        <a className={className} onClick={this.routeChange.bind(this)} href="javascript:;">
          {icon}{this.props.text}
        </a>
      </li>
    )
  }
}

export default class Navigation extends Component {
  static displayName = 'Navigation'

  static propTypes = {
    styles: PropTypes.object
  }
 
  render () {
    const { styles } = this.props
    return (
      <div className={styles.nav}>
        <div className={styles.separator}>账户权限</div>
        <ul>
          <Item styles={styles} path="/user" icon="user" text="用户" />
          <Item styles={styles} path="/role" icon="users" text="角色" />
          <Item styles={styles} path="/access" icon="link" text="权限" />
        </ul>
        <div className={styles.separator}>数据结构</div>
      </div>
    )
  }
}
