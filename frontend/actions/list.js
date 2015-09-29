import { CALL_API } from '../middleware/api'

export const LIST_REQUEST = 'LIST_REQUEST'
export const LIST_SUCCESS = 'LIST_SUCCESS'
export const LIST_FAILURE = 'LIST_FAILURE'

function fetchList(name, endpoint) {
  return {
    [CALL_API]: {
      types: [LIST_REQUEST, LIST_SUCCESS, LIST_FAILURE],
      endpoint,
      name
    }
  }
}

export function loadList(name, endpoint) {
  return (dispatch) => {
    return dispatch(fetchList(name, endpoint))
  }
}

export const CLEAR_LIST = 'CLEAR_LIST'

export function clearList(name) {
  return {
    type: CLEAR_LIST,
    name
  }
}
