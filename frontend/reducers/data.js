import { DATA_LIST } from '../actions/data'

export default function (state = {
  status: 0,
  query: {
    page: 1
  }
}, action) {
  switch (action.type) {
    case DATA_LIST:
      return Object.assign({}, state, {
        status: action.status,
        list: action.list,
        total: action.total,
        query: action.query
      })
    default:
      return state
  }
}
