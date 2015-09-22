'use strict'

import Request, { bindNoAuthAction } from '../utils/request'
import Authentication from 'hydra-authentication'

export const ADMIN_STATUS = 'ADMIN_STATUS'

export function setAdminStatus(status, msg) {
  return { 
    type: ADMIN_STATUS,
    msg,
    status
  }
}

bindNoAuthAction(setAdminStatus)

export const RECEIVE_ADMIN_INFO = 'RECEIVE_ADMIN_INFO'

function receiveInfo(info, msg) {
  return {
    type: RECEIVE_ADMIN_INFO,
    status: 2,
    msg,
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

    dispatch(setAdminStatus(1, '读取中...'))
    Request.get('/admin/info')
      .then((xhr, res) => {
        dispatch(receiveInfo(res.data))
      })
  }
}

export function login(data) {
  return (dispatch) => {
    dispatch(setAdminStatus(1))
    Request.post('/admin/login', data).then((xhr, res) => {
      if (res.status === 1) {
        Authentication.setToken(res.data.token)
        dispatch(receiveInfo(res.data))
      } else {
        dispatch(setAdminStatus(0, res.msg))
      }
    })
  }
}
