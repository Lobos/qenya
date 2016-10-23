import { fetch } from '../utils/fetch'

export const SCHEMA_LIST = 'SCHEMA_LIST'
function handleList (status, data) {
  return {
    type: SCHEMA_LIST,
    status,
    data
  }
}

function fetchList (data) {
  return dispatch => {
    dispatch(handleList(0))
    fetch.get('/schemas', data).then(model => {
      dispatch(handleList(1, model))
    }).catch((err) => {
      dispatch(handleList(2, err.message))
    })
  }
}

export function getList () {
  return (dispatch, getState) => {
    let data = getState().schemas.data
    if (data && data.length > 0) {
      return Promise.resolve()
    } else {
      return dispatch(fetchList())
    }
  }
}
