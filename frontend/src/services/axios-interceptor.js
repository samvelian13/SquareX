import axios from 'axios'
import store from '@/store'
import router from '@/router'
import tokenParser from '@/helpers/helperCollections'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers.Accept = 'application/json'

// // Add a request Interceptor
axios.interceptors.request.use(config => {
  const token = tokenParser()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add a response Interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.code !== 'ECONNABORTED' && error.response.status === 401) {
      store.commit('snackbarOpen', { text: error.response.data.msg, color: 'red' }, { root: true })
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    }
    const { response } = error
    if (response && (response.status === 500 || response.status === 422)) {
      const errors = response.status === 500 ? response.data.msg : response.data._error.msg
      store.commit('snackbarOpen', { text: errors, color: 'red' }, { root: true })
    }
    return Promise.reject(error)
  }
)

export default axios
