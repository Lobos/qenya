'use strict'

import { SET_THEME } from '../actions/theme'

export default function styles(state = {}, action) {
  switch (action.type) {
    case SET_THEME:
      return action.styles

    default:
      return state
  }
}
