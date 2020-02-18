import * as types from './mutation-types'
import Vue from 'vue'

export default {
  // sync mutations
  [types.ON_EDIT_DRINK_OPTION_ROW]: (state, payload) => {
    state.formData = payload
    state.dialogOpen = true
  },
  [types.DIALOG_TOGGLE]: state => {
    if (!state.dialogOpen) {
      state.formData = null
    }
    state.dialogOpen = !state.dialogOpen
  },

  // Get Drink Options with relations
  [types.FETCH_DRINK_OPTIONS.PENDING]: state => {
    state.drinkOptionsLoading = true
  },
  [types.FETCH_DRINK_OPTIONS.SUCCESS]: (state, payload) => {
    state.drinkOptions = payload.data
    state.drinkOptionsLoading = false
  },
  [types.FETCH_DRINK_OPTIONS.FAILED]: state => {
    state.drinkOptions = []
    state.drinkOptionsLoading = false
  },

  // Create New  Drink Options
  [types.CREATE_DRINK_OPTION.PENDING]: state => {
    state.dialogLoading = true
  },
  [types.CREATE_DRINK_OPTION.SUCCESS]: (state, payload) => {
    state.drinkOptions.unshift(payload)
    state.dialogLoading = false
    state.dialogOpen = false
  },
  [types.CREATE_DRINK_OPTION.FAILED]: state => {
    state.dialogLoading = false
  },

  // Update  Drink Options row
  [types.UPDATE_DRINK_OPTION.PENDING]: state => {
    state.dialogLoading = true
  },
  [types.UPDATE_DRINK_OPTION.SUCCESS]: (state, payload) => {
    const indexForUpdate = state.drinkOptions.findIndex(item => item.id === payload.id)
    Vue.set(state.drinkOptions, indexForUpdate, { ...state.drinkOptions[indexForUpdate], ...payload })
    state.dialogLoading = false
    state.dialogOpen = false
    state.formData = null
  },
  [types.UPDATE_DRINK_OPTION.FAILED]: state => {
    state.dialogLoading = false
  },
  // Delete  Drink Options row
  [types.DELETE_DRINK_OPTION.PENDING]: state => {
    state.drinkOptionsLoading = true
  },
  [types.DELETE_DRINK_OPTION.SUCCESS]: (state, id) => {
    state.drinkOptions = state.drinkOptions.filter(item => item.id !== id)
    state.drinkOptionsLoading = false
  },
  [types.DELETE_DRINK_OPTION.FAILED]: state => {
    state.drinkOptionsLoading = false
  }
}
