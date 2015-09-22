'use strict'

import { Component, PropTypes } from 'react'
import Config from '../config'

export default class Header extends Component {
  static displayName = 'Header'

  static propTypes = {
    info: PropTypes.object,
    styles: PropTypes.object
  }

  static defaultProps = {
    info: {}
  }

  render () {
    const { info, styles } = this.props

    return (
      <header className={styles.header}>
        <div className={styles.title}>{ Config.TITLE }</div>
        <div className={styles.info}>
          <img src={info.avatar} />
          { info.nickname }
        </div>
      </header>
    )
  }
}
