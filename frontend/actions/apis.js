import { fetch } from '../utils/fetch'
import { Message } from 'rctui'
import { loading } from '../utils/loading'

const Loading = loading({ position: 'initial', height: 200 })

export const API_LIST = 'API_LIST'
function handleList (status, data = Loading) {
  return {
    type: API_LIST,
    status,
    data
  }
}

function fetchList (query) {
  return dispatch => {
    dispatch(handleList(0))
    fetch.get('/api', query).then(model => {
      dispatch(handleList(1, model))
    }).catch(err => {
      dispatch(handleList(2, err.message))
    })
  }
}

export function resetApi (callback) {
  fetch.get('/resetapi').then(res => callback())
}

export function getList () {
  return (dispatch, getState) => {
    const { data, status } = getState().apis
    if (status === 1 && data && data.length > 0) {
      return Promise.resolve()
    } else {
      return dispatch(fetchList())
    }
  }
}

export function saveApi (body, onSuccess) {
  return (dispatch, getState) => {
    fetch.post('/api', body, { dataType: 'json' }).then(model => {
      resetApi(() => {
        onSuccess()

        // remove query
        delete model.query

        let data = getState().apis.data.filter(d => d._id !== model._id)
        data.unshift(model)
        dispatch(handleList(1, data))
        Message.success('Save successed')
      })
    }).catch(err => {
      Message.error(err.message)
    })
  }
}

export function removeApi (id) {
  return (dispatch, getState) => {
    fetch.delete('/api', { _id: id }).then(model => {
      if (model === 1) {
        let data = getState().apis.data.filter(d => d._id !== id)
        dispatch(handleList(1, data))
      }
    }).catch(err => {
      Message.error(err.message)
    })
  }
}
