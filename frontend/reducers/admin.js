import objectAssign from 'object-assign'
import { ADMIN_STATUS, RECEIVE_ADMIN_INFO } from '../actions/admin'

export default function admin(state = { status: 0 }, action) {
  switch (action.type) {
    case ADMIN_STATUS:
      return objectAssign({}, state, {
        status: action.status,
        msg: action.msg
      })

    case RECEIVE_ADMIN_INFO:
      return objectAssign({}, state, {
        status: action.status,
        info: action.info,
        msg: action.msg
      })

    default:
      return state
  }
}
