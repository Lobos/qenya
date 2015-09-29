import objectAssign from 'object-assign'
import { SCHEMA_REQUEST, SCHEMA_FAILURE, SCHEMA_SUCCESS } from '../actions/schema'

export default function schema(state = {
  isFetching: false,
  schemas: {}
}, action) {
  switch (action.type) {
    case SCHEMA_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })

    case SCHEMA_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        schemas: { [action.code]: action.response }
      })

    case SCHEMA_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })

    default:
      return state
  }
}
