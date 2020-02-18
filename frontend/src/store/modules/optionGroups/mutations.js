import * as types from './mutation-types'
import Vue from 'vue'

export default {
  // sync mutations
  [types.ON_EDIT_OP_GROUP_ROW]: (state, payload) => {
    state.formData = payload
    state.dialogOpen = true
  },
  [types.DIALOG_TOGGLE]: state => {
    if (!state.dialogOpen) {
      state.formData = null
    }
    state.dialogOpen = !state.dialogOpen
  },

  // Get Option Groups with relations
  [types.FETCH_OPTION_GROUPS.PENDING]: state => {
    state.optionGroupsLoading = true
  },
  [types.FETCH_OPTION_GROUPS.SUCCESS]: (state, payload) => {
    state.optionGroups = payload.data
    state.optionGroupsLoading = false
  },
  [types.FETCH_OPTION_GROUPS.FAILED]: state => {
    state.optionGroups = []
    state.optionGroupsLoading = false
  },

  // Create New Drink
  [types.CREATE_OPTION_GROUP.PENDING]: state => {
    state.dialogLoading = true
  },
  [types.CREATE_OPTION_GROUP.SUCCESS]: (state, payload) => {
    state.optionGroups.unshift(payload)
    state.dialogLoading = false
    state.dialogOpen = false
  },
  [types.CREATE_OPTION_GROUP.FAILED]: state => {
    state.dialogLoading = false
  },

  // Update Drink row
  [types.UPDATE_OPTION_GROUP.PENDING]: state => {
    state.dialogLoading = true
  },
  [types.UPDATE_OPTION_GROUP.SUCCESS]: (state, payload) => {
    const indexForUpdate = state.optionGroups.findIndex(item => item.id === payload.id)
    Vue.set(state.optionGroups, indexForUpdate, { ...state.optionGroups[indexForUpdate], ...payload })

    state.dialogLoading = false
    state.dialogOpen = false
    state.formData = null
  },
  [types.UPDATE_OPTION_GROUP.FAILED]: state => {
    state.dialogLoading = false
  },

  // Delete Drink row
  [types.DELETE_OPTION_GROUP.PENDING]: state => {
    state.optionGroupsLoading = true
  },
  [types.DELETE_OPTION_GROUP.SUCCESS]: (state, id) => {
    state.optionGroups = state.optionGroups.filter(item => item.id !== id)
    state.optionGroupsLoading = false
  },
  [types.DELETE_OPTION_GROUP.FAILED]: state => {
    state.optionGroupsLoading = false
  }
}
