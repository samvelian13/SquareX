import Vue from 'vue'
import Vuex from 'vuex'
// Modules
import modules from '@/store/modules'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    snackbar: {
      value: false,
      timeout: 6000,
      x: 'right',
      y: 'top',
      text: '',
      color: ''
    }
  },
  mutations: {
    snackbarOpen(state, payload) {
      state.snackbar.value = true
      Object.keys(payload).forEach(key => {
        state.snackbar[key] = payload[key]
      })
    },
    snackbarClose(state) {
      state.snackbar.value = false
    }
  },
  modules
})
