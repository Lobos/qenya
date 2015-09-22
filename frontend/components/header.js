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
    const { info } = this.props

    return (
      <header>
        <div>{ Config.TITLE }</div>
        <div>
          <img src={info.avatar} />
          { info.nickname }
        </div>
      </header>
    )
  }
}
