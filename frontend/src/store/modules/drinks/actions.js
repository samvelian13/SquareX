import api from '@/services/axios-interceptor'
import * as types from './mutation-types'
import { DRINKS_LINK } from '@/links'

const getDrinksMenu = async ({ commit }, payload) => {
  commit(types.FETCH_DRINKS_MENU.PENDING)
  try {
    const drinks = await api.get(DRINKS_LINK.GET, {
      params: payload
    })
    commit(types.FETCH_DRINKS_MENU.SUCCESS, drinks.data)
  } catch (error) {
    commit(types.FETCH_DRINKS_MENU.FAILED)
  }
}

const createDrink = async ({ commit }, payload) => {
  commit(types.CREATE_DRINK.PENDING)
  try {
    const createdDrink = await api.post(DRINKS_LINK.CREATE, payload.data)
    commit(types.CREATE_DRINK.SUCCESS, createdDrink.data.data)
    commit('snackbarOpen', { text: createdDrink.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.CREATE_DRINK.FAILED)
  }
}

const updateDrink = async ({ commit }, payload) => {
  commit(types.UPDATE_DRINK.PENDING)
  try {
    const updatedDrink = await api.patch(DRINKS_LINK.UPDATE + payload.updatedRowId, payload.data)
    commit(types.UPDATE_DRINK.SUCCESS, updatedDrink.data.data)
    commit('snackbarOpen', { text: updatedDrink.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.UPDATE_DRINK.FAILED)
  }
}

const deleteDrink = async ({ commit }, id) => {
  commit(types.DELETE_DRINK.PENDING)
  try {
    const removed = await api.delete(DRINKS_LINK.DELETE + id)
    commit(types.DELETE_DRINK.SUCCESS, id)
    commit('snackbarOpen', { text: removed.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.DELETE_DRINK.FAILED)
  }
}

export default {
  getDrinksMenu,
  createDrink,
  updateDrink,
  deleteDrink
}
