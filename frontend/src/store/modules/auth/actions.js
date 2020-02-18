import api from '@/services/axios-interceptor'
import { LOGIN_USER } from './mutation-types'
import { LOGIN_LINK } from '@/links'

const login = ({ commit }, payload) =>
  new Promise((resolve, reject) => {
    api
      .post(LOGIN_LINK, payload)
      .then(response => {
        if (response.data) {
          commit(LOGIN_USER, response.data.data)
          resolve(true)
        }
      })
      .catch(err => {
        reject(err.response.data)
      })
  })

export default {
  login
}
