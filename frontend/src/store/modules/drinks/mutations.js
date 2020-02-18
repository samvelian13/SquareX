import * as types from './mutation-types'
import Vue from 'vue'

export default {
  // sync mutations
  [types.ON_EDIT_DRINK_ROW]: (state, payload) => {
    state.formData = payload
    state.dialogOpen = true
  },
  [types.DIALOG_TOGGLE]: state => {
    if (!state.dialogOpen) {
      state.formData = null
    }
    state.dialogOpen = !state.dialogOpen
  },

  // Get Drinks with relations
  [types.FETCH_DRINKS_MENU.PENDING]: state => {
    state.drinksLoading = true
  },
  [types.FETCH_DRINKS_MENU.SUCCESS]: (state, payload) => {
    state.drinks = payload.data
    state.drinksLoading = false
  },
  [types.FETCH_DRINKS_MENU.FAILED]: state => {
    state.drinks = []
    state.drinksLoading = false
  },

  // Create New Drink
  [types.CREATE_DRINK.PENDING]: state => {
    state.dialogLoading = true
  },
  [types.CREATE_DRINK.SUCCESS]: (state, payload) => {
    state.drinks.unshift(payload)
    state.dialogLoading = false
    state.dialogOpen = false
  },
  [types.CREATE_DRINK.FAILED]: state => {
    state.dialogLoading = false
  },

  // Update Drink row
  [types.UPDATE_DRINK.PENDING]: state => {
    state.dialogLoading = true
  },
  [types.UPDATE_DRINK.SUCCESS]: (state, payload) => {
    const indexForUpdate = state.drinks.findIndex(item => item.id === payload.id)
    Vue.set(state.drinks, indexForUpdate, { ...state.drinks[indexForUpdate], ...payload })
    state.dialogLoading = false
    state.dialogOpen = false
    state.formData = null
  },
  [types.UPDATE_DRINK.FAILED]: state => {
    state.dialogLoading = false
  },
  // Delete Drink row
  [types.DELETE_DRINK.PENDING]: state => {
    state.drinksLoading = true
  },
  [types.DELETE_DRINK.SUCCESS]: (state, id) => {
    state.drinks = state.drinks.filter(item => item.id !== id)
    state.drinksLoading = false
  },
  [types.DELETE_DRINK.FAILED]: state => {
    state.drinksLoading = false
  }
}
