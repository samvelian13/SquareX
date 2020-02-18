import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import tokenParser from '@/helpers/helperCollections'

const state = {
  isLoggedIn: !!tokenParser(),
  user: tokenParser('user')
}
export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
