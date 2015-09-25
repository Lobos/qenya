import { combineReducers } from 'redux'
import admin from './admin'
import styles from './theme'
import schema from './schema'

const rootReducer = combineReducers({
  admin,
  styles,
  schema
})

export default rootReducer
