import api from '@/services/axios-interceptor'
import * as types from './mutation-types'
import { DRINK_OPTION_LINK } from '@/links'

const getDrinkOptions = async ({ commit }, payload) => {
  commit(types.FETCH_DRINK_OPTIONS.PENDING)
  try {
    const drinkOptions = await api.get(DRINK_OPTION_LINK.GET, {
      params: payload
    })
    commit(types.FETCH_DRINK_OPTIONS.SUCCESS, drinkOptions.data)
  } catch (error) {
    commit(types.FETCH_DRINK_OPTIONS.FAILED)
  }
}

const createDrinkOption = async ({ commit }, payload) => {
  commit(types.CREATE_DRINK_OPTION.PENDING)
  try {
    const createdDrinkOp = await api.post(DRINK_OPTION_LINK.CREATE, payload)
    commit(types.CREATE_DRINK_OPTION.SUCCESS, createdDrinkOp.data.data)
    commit('snackbarOpen', { text: createdDrinkOp.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.CREATE_DRINK_OPTION.FAILED)
  }
}

const updateDrinkOption = async ({ commit }, payload) => {
  commit(types.UPDATE_DRINK_OPTION.PENDING)
  try {
    const updateDrinkOp = await api.patch(`${DRINK_OPTION_LINK.UPDATE}${payload.updatedRowId}`, payload.data)
    commit(types.UPDATE_DRINK_OPTION.SUCCESS, { ...payload.data, id: payload.updatedRowId })
    commit('snackbarOpen', { text: updateDrinkOp.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.UPDATE_DRINK_OPTION.FAILED)
  }
}

const deleteDrinkOption = async ({ commit }, id) => {
  commit(types.DELETE_DRINK_OPTION.PENDING)
  try {
    const removed = await api.delete(DRINK_OPTION_LINK.DELETE + id)
    commit(types.DELETE_DRINK_OPTION.SUCCESS, id)
    commit('snackbarOpen', { text: removed.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.DELETE_DRINK_OPTION.FAILED)
  }
}

export default {
  getDrinkOptions,
  createDrinkOption,
  updateDrinkOption,
  deleteDrinkOption
}
