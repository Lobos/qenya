import { combineReducers } from 'redux'
import merge from 'deepmerge'
import admin from './admin'
import styles from './theme'
import schema from './schema'
import list from './list'

function entities(state = {}, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}

const rootReducer = combineReducers({
  admin,
  entities,
  list,
  styles,
  schema
})

export default rootReducer
