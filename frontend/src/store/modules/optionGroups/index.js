import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  dialogOpen: false,
  dialogLoading: false,
  optionGroupsLoading: false,
  optionGroups: [],
  formData: null
}
export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
