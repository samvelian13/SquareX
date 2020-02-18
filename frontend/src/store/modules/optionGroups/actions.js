import api from '@/services/axios-interceptor'
import * as types from './mutation-types'
import { OPTION_GROUPS_LINK } from '@/links'

const getOptionGroups = async ({ commit }, payload) => {
  commit(types.FETCH_OPTION_GROUPS.PENDING)
  try {
    const optionGroups = await api.get(OPTION_GROUPS_LINK.GET, {
      params: payload
    })
    commit(types.FETCH_OPTION_GROUPS.SUCCESS, optionGroups.data)
  } catch (error) {
    commit(types.FETCH_OPTION_GROUPS.FAILED)
  }
}

const createOptionGroup = async ({ commit }, payload) => {
  commit(types.CREATE_OPTION_GROUP.PENDING)
  try {
    const createOpGroup = await api.post(OPTION_GROUPS_LINK.CREATE, payload)
    commit(types.CREATE_OPTION_GROUP.SUCCESS, createOpGroup.data.data)
    commit('snackbarOpen', { text: createOpGroup.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.CREATE_OPTION_GROUP.FAILED)
  }
}

const updateOptionGroup = async ({ commit }, payload) => {
  commit(types.UPDATE_OPTION_GROUP.PENDING)
  try {
    const updateOpGroup = await api.patch(OPTION_GROUPS_LINK.UPDATE + payload.updatedRowId, payload.data)
    commit(types.UPDATE_OPTION_GROUP.SUCCESS, updateOpGroup.data.data)
    commit('snackbarOpen', { text: updateOpGroup.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.UPDATE_OPTION_GROUP.FAILED, error)
  }
}

const deleteOptionGroup = async ({ commit }, id) => {
  commit(types.DELETE_OPTION_GROUP.PENDING)
  try {
    const removed = await api.delete(OPTION_GROUPS_LINK.DELETE + id)
    commit(types.DELETE_OPTION_GROUP.SUCCESS, id)
    commit('snackbarOpen', { text: removed.data.message, color: 'green' }, { root: true })
  } catch (error) {
    commit(types.DELETE_OPTION_GROUP.FAILED)
  }
}

export default {
  getOptionGroups,
  createOptionGroup,
  updateOptionGroup,
  deleteOptionGroup
}
