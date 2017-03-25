import React, { PropTypes } from 'react'
import Menu from './Menu'
import 'rctui'
import config from 'rctui/config'

config.iconfont = 'hydra'

import _styles from '_/styles/app.scss'

export default function App (props) {
  return (
    <div>
      <div className={_styles.header}>
        <span className={_styles.logo}>Hydra</span>
        <a className={_styles.link} href="#/collections">Collections</a>
        <a className={_styles.link} href="#/api">Api</a>
      </div>
      <Menu />
      <div className={_styles.main}>
        { props.children }
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element
}

