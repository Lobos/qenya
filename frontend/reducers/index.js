import { combineReducers } from 'redux'
import data from './data'
import schemas from './schemas'
import apis from './apis'

export default combineReducers({
  apis,
  data,
  schemas
})
