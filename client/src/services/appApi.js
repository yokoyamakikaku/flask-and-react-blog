import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const appApi = createApi({
  reducerPath: 'app',
  baseQuery: fetchBaseQuery({
    mode: 'cors',
    credentials: 'include',
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    }
  }),
  endpoints: () => ({}),
  fetchFn: (resource, init = {}) => {
    return fetch(resource, {
      mode: 'cors',
      credentials: 'include',
      ...init,
    })
  }
})

export default appApi
