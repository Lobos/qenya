import { CALL_API } from '../middleware/api'

export const SCHEMA_REQUEST = 'SCHEMA_REQUEST'
export const SCHEMA_SUCCESS = 'SCHEMA_SUCCESS'
export const SCHEMA_FAILURE = 'SCHEMA_FAILURE'

// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchSchema(code) {
  return {
    [CALL_API]: {
      types: [SCHEMA_REQUEST, SCHEMA_SUCCESS, SCHEMA_FAILURE],
      endpoint: `/schema/code/${code}`,
      code
    }
  }
}

// Relies on Redux Thunk middleware.
export function loadSchema(code) {
  return (dispatch, getState) => {
    const schema = getState().schema.schemas[code]
    if (schema) {
      return null
    }

    return dispatch(fetchSchema(code))
  }
}
