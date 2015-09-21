'use strict'

import objectAssign from 'object-assign'
import { ADMIN_STATUS, ADMIN_INFO } from '../actions/admin'

export default function admin(state = {}, action) {
  switch (action.type) {
    case ADMIN_STATUS:
      return objectAssign({}, state, {
        status: action.status
      })

    case ADMIN_INFO:
      return objectAssign({}, state, {
        info: action.info
      })

    default:
      return state
  }
}
