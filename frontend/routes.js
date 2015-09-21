'use strict'

import { Route, Router } from 'react-router'
import { Provider } from 'react-redux'
import createHistory from 'history/lib/createHashHistory'

import { getStyles } from './themes'
import configureStore from './store'

import Master from './pages/master'
import Home from './pages/home'

const history = createHistory({ queryKey: false })
const store = configureStore({ styles: getStyles() })

const Routes = (
  <Provider store={store}>
    { () =>
      <Router history={history}>
        <Route path="/" indexRoute={{ component: Home }} component={Master}>
          <Route path="/home" component={Home} />
        </Route>
      </Router>
    } 
  </Provider>
)

export default Routes
