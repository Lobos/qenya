import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './components/App'

import 'rctui'
import config from 'rctui/config'
config.iconfont = 'hydra'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)

module.hot && module.hot.accept()
