import { SCHEMA_LIST } from '_/actions/schemas'

export default function (state = {
  status: 0,
  data: undefined
}, action) {
  switch (action.type) {
    case SCHEMA_LIST:
      return Object.assign({}, state, {
        status: action.status,
        data: action.data
      })
    default:
      return state
  }
}
