import { fetch } from '../utils/fetch'
import { Message } from 'rctui'
import { loading } from '../utils/loading'

const Loading = loading({ position: 'initial', height: 200 })

export const SCHEMA_LIST = 'SCHEMA_LIST'
function handleList (status, data = Loading) {
  return {
    type: SCHEMA_LIST,
    status,
    data
  }
}

function fetchList (query) {
  return dispatch => {
    dispatch(handleList(0))
    fetch.get('/schemas', query).then(model => {
      dispatch(handleList(1, model))
    }).catch(err => {
      dispatch(handleList(2, err.message))
    })
  }
}

export function getList () {
  return (dispatch, getState) => {
    const { data, status } = getState().schemas
    if (status === 1 && data && data.length > 0) {
      return Promise.resolve()
    } else {
      return dispatch(fetchList())
    }
  }
}

export function saveCollection (body, onSuccess) {
  delete body.fields
  return (dispatch, getState) => {
    fetch.post('/schema', body, { dataType: 'json' }).then(model => {
      onSuccess()
      let data = getState().schemas.data.filter(d => d._id !== model._id)
      data.unshift(model)
      dispatch(handleList(1, data))
      Message.success('保存成功')
    }).catch(err => {
      Message.error(err.message)
    })
  }
}

export function removeCollection (id) {
  return (dispatch, getState) => {
    fetch.delete('/schema', { _id: id }).then(model => {
      if (model === 1) {
        let data = getState().schemas.data.filter(d => d._id !== id)
        dispatch(handleList(1, data))
      }
    }).catch(err => {
      Message.error(err.message)
    })
  }
}

export function saveFields (_id, fields) {
  return (dispatch, getState) => {
    fetch.post('/schema/fields', { _id, fields }, { dataType: 'json' }).then(model => {
      let data = getState().schemas.data.filter(d => d._id !== model._id)
      data.unshift(model)
      dispatch(handleList(1, data))
      Message.success('保存成功')
    }).catch(err => {
      Message.error(err.message)
    })
  }
}
