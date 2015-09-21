'use strict'

import Qwest from 'qwest'
import Authentication from 'hydra-authentication'
export const ADMIN_STATUS = 'ADMIN_STATUS'

export function setAdminStatus(status) {
  return { 
    type: ADMIN_STATUS,
    status
  }
}

export const RECEIVE_ADMIN_INFO = 'RECEIVE_ADMIN_INFO'

function receiveInfo(info) {
  return {
    type: RECEIVE_ADMIN_INFO,
    status: 2,
    info
  }
}

export function loadAdminInfo() {
  return (dispatch) => {
    let token = Authentication.getToken()
    if (!token) {
      dispatch(setAdminStatus(0))
      return
    }

    dispatch(setAdminStatus(1))
    Qwest.get('/admin/user', res => dispatch(receiveInfo(res)))
  }
}
