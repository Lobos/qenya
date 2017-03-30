import Refetch from 'refetch'

export const fetch = Refetch.create({
  promise: (f) => f.then((res, xhr) => {
    if (res.hasOwnProperty('data')) {
      return res.data
    } else {
      throw new Error(res.error || 'Server data fetch failed.')
    }
  })
})
