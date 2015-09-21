'use strict'

import { combineReducers } from 'redux'
import admin from './admin'
import styles from './theme'

const rootReducer = combineReducers({
  admin,
  styles
})

export default rootReducer
