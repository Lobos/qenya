import objectAssign from 'object-assign'
import { LIST_REQUEST, LIST_SUCCESS, LIST_FAILURE, CLEAR_LIST } from '../actions/list'

export default function list(state = {}, action) {
  switch (action.type) {
    case LIST_REQUEST:
      return objectAssign({}, state, {
        [action.name]: true
      })

    case LIST_SUCCESS:
      let list = {}
      action.response.forEach(e => {
        list[e._id] = e.update_at
      })
      return objectAssign({}, state, {
        [action.name]: list
      })

    case LIST_FAILURE:
    case CLEAR_LIST:
      return objectAssign({}, state, {
        [action.name]: {}
      })

    default:
      return state
  }
}
