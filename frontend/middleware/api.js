import Request from '../utils/request'
import config from '../config'
import { Message } from 'rctui'

const API_ROOT = config.API_ROOT || ''

export const CALL_API = '0ol2mz8pi3utmx6r14ymt1e4von7b9'

function callApi(endpoint) {
  const fullUrl = (endpoint.indexOf('http') !== 0) ? API_ROOT + endpoint : endpoint

  return Request.get(fullUrl)
    .then((xhr, res) => {
      if (res.status === 1) {
        return res.data
      } else {
        Message.show(res.msg || 'Something bad happened', 'error')
        return null
      }
    })
}

export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { schema, types, ...others } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  //if (!schema) {
  //  throw new Error('Specify one of the exported Schemas.')
  //}
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType,
      ...others
    }))
  ).catch(
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
