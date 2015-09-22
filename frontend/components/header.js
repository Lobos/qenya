'use strict'

import { Component, PropTypes } from 'react'

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
        <div>Hydra Admin</div>
        <div>
          { info.nickname }
        </div>
      </header>
    )
  }
}
