import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)

export default function (inititalState) {
  return createStoreWithMiddleware(reducer, inititalState)
}
