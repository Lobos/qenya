import { CALL_API } from '../middleware/api'

export const ENTITY_REQUEST = 'ENTITY_REQUEST'
export const ENTITY_SUCCESS = 'ENTITY_SUCCESS'
export const ENTITY_FAILURE = 'ENTITY_FAILURE'

function fetchEntity(name, endpoint) {
  return {
    [CALL_API]: {
      types: [ENTITY_REQUEST, ENTITY_SUCCESS, ENTITY_FAILURE],
      idAttribute: '_id',
      endpoint,
      name
    }
  }
}

export function loadEntity(name, endpoint) {
  return (dispatch) => {
    return dispatch(fetchEntity(name, endpoint))
  }
}
