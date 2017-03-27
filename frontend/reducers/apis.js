import { API_LIST } from '_/actions/apis'

export default function (state = {
  status: 0,
  data: undefined
}, action) {
  switch (action.type) {
    case API_LIST:
      return Object.assign({}, state, {
        status: action.status,
        data: action.data
      })
    default:
      return state
  }
}
