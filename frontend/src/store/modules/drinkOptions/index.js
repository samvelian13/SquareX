import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  dialogOpen: false,
  dialogLoading: false,
  drinkOptionsLoading: false,
  drinkOptions: [],
  formData: null
}
export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
