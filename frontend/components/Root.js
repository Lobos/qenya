import { PropTypes, PureComponent } from 'react'
import { Router, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import routes from './routes'

class Root extends PureComponent {
  render () {
    const { store } = this.props
    return (
      <Provider store={store}>
        <Router history={hashHistory} routes={routes} />
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
