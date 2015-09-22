'use strict'

import Qwest from 'qwest'
import Authentication from 'hydra-authentication'
import objectAssign from 'object-assign'

function getOptions(options) {
  options = options || {}
  return objectAssign({}, options, {
    headers: {
      authorization: Authentication.getToken()
    }
  })
}

const Request = {}
const methods = ['get', 'post', 'put', 'delete']
let setAdminStatus = null
let globalStore = null

methods.forEach(m => {
  Request[m] = (url, data, options, before) => {
    let req = Qwest[m](url, data, getOptions(options), before)
    if (globalStore) {
      req.catch((xhr, res) => {
        // catch all noauth error
        if (xhr.status === 401 && setAdminStatus) {
          globalStore.dispatch(setAdminStatus(0, res.msg))
        }
      })
    }
    return req
  }
})

export function bindNoAuthAction(fn) {
  setAdminStatus = fn
}

export function bindStore(store) {
  globalStore = store
}

export default Request

