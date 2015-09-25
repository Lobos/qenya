import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from '../middleware/api'
import rootReducer from '../reducers'

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  apiMiddleware
)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  return store
}
