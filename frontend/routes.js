import { Route, Router } from 'react-router'
import { Provider } from 'react-redux'
import createHistory from 'history/lib/createHashHistory'

import { getStyles } from './themes'
import configureStore from './store'
import { bindStore } from './utils/request'

import Master from './pages/master'
import Home from './pages/home'
import User from './pages/user'

const history = createHistory({ queryKey: false })
const store = configureStore({ styles: getStyles() })

// bind request
bindStore(store)

const Routes = (
  <Provider store={store}>
    { () =>
      <Router history={history}>
        <Route path="/" indexRoute={{ component: Home }} component={Master}>
          <Route path="/home" component={Home} />
          <Route path="/user" component={User} />
        </Route>
      </Router>
    } 
  </Provider>
)

export default Routes
