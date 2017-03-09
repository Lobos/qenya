import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './components/Root'
import store from './store'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.querySelector('#root')
  )
}

render(Root)
module.hot && module.hot.accept('./components/Root', () => render(Root))
