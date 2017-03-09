import { fetch } from '../utils/fetch'
import { Message } from 'rctui'
import { deepEqual } from 'rctui/utils/objects'
import { loading } from '../utils/loading'

const Loading = loading({ position: 'initial', height: 200 })

export const DATA_LIST = 'DATA_LIST'
function handleList (status, query, total = 0, list = Loading) {
  return {
    type: DATA_LIST,
    status,
    query,
    total,
    list
  }
}

function fetchData (query) {
  return dispatch => {
    dispatch(handleList(0, query))
    const { schema, page = 1, size = 20, ...qs } = query
    fetch.get(`/data/${schema}/${page}/${size}`, qs).then(model => {
      dispatch(handleList(1, query, model.total, model.list))
    }).catch(err => {
      dispatch(handleList(2, query, 0, err.message))
    })
  }
}

export function getData (query, force) {
  return (dispatch, getState) => {
    const data = getState().data
    if (!force && deepEqual(query, data.query) && data.status === 1 && data.list) {
      return Promise.resolve()
    } else {
      return dispatch(fetchData(query))
    }
  }
}

export function saveData (schema, data, onSuccess) {
  return (dispatch, getState) => {
    fetch.post(`/data/${schema}`, data, { dataType: 'json' }).then(model => {
      onSuccess()
      Message.success('保存成功')
      dispatch(fetchData(getState().data.query))
    }).catch(err => {
      Message.error(err.message)
    })
  }
}

export function removeData (schema, _id) {
  return (dispatch, getState) => {
    fetch.delete(`/data/${schema}`, { _id }).then(model => {
      if (model === 1) {
        Message.success('删除成功')
        dispatch(fetchData(getState().data.query))
      }
    }).catch(err => {
      Message.error(err.message)
    })
  }
}

// mock data
export function createMockData (schema, number) {
  return (dispatch, getState) => {
    fetch.post(`/data/${schema}/mockcreate/${number}`).then(model => {
      dispatch(fetchData(getState().data.query))
    }).catch(err => {
      Message.error(err.message)
    })
  }
}

export function removeAll (schema) {
  return (dispatch, getState) => {
    fetch.delete(`/data/${schema}/all`).then(model => {
      Message.success('数据已清空')
      dispatch(fetchData(getState().data.query))
    }).catch(err => {
      Message.error(err.message)
    })
  }
}
