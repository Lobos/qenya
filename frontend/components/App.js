import React, { PropTypes } from 'react'
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Collections from './Collections'
import Api from './Api'
import ApiEdit from './Api/Edit'
import Schema from './Schema'

import _styles from '_/styles/app.scss'

export default function App (props) {
  return (
    <Router>
      <div>
        <div className={_styles.header}>
          <span className={_styles.logo}>Qenya</span>

          <Link className={_styles.link} to="/collections">Collections</Link>
          <Link className={_styles.link} to="/api">API</Link>
        </div>
        <div className={_styles.main}>
          <Route exact path="/" render={() => <Redirect to="/collections" />} />
          <Route path="/collections" component={Collections} />
          <Route exact path="/api" component={Api} />
          <Route path="/api/:id" component={ApiEdit} />
          <Route path="/schema/:code" component={Schema} />
        </div>
      </div>
    </Router>
  )
}

App.propTypes = {
  children: PropTypes.element
}

