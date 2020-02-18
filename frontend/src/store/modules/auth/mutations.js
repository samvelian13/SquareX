import { LOGIN_USER, LOGOUT_USER } from './mutation-types'
import tokenParser from '@/helpers/helperCollections'

export default {
  // login
  [LOGIN_USER]: (state, payload) => {
    localStorage.setItem('token', btoa(JSON.stringify(payload)))
    state.isLoggedIn = true
    state.user = tokenParser('user')
  },
  [LOGOUT_USER]: state => {
    localStorage.removeItem('token')
    state.isLoggedIn = false
  }
}
