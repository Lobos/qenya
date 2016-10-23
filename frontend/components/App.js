import React, { Component, PropTypes } from 'react'
import Menu from './Menu'
import 'rctui'

import _styles from '../styles/app.scss'

export default class App extends Component {
  render () {
    return (
      <div>
        <div className={_styles.header}>Hydra</div>
        <Menu />
        <div className={_styles.main}>
          { this.props.children }
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element
}
