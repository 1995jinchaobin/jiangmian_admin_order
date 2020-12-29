// 你是一段成熟的代码，要学会自己改bug
'use strict'

const app = {
  state: {
    app: {
      token: ''
    },
    params: {}
  },
  getters: {
    app: state => state.app,
    token: state => state.app.token,
    params: state => state.params
  },
  mutations: {
    /**
     * 设置系统参数信息
     * @param state
     * @param params
     */
    setParams (state, params) {
      state.params = params
    },
    /**
     * 更新参数信息
     * @param state
     * @param params
     */
    updateParams (state, params) {
      if (params) {
        state.params = {
          ...state.params,
          ...params
        }
      }
    },
    /**
     * 移除某个属性
     * @param state
     * @param key
     */
    removeParams (state, key) {
      if (state.params[key]) {
        delete state.params[key]
      }
    }
  },
  actions: {
    /**
     * 设置系统参数信息
     * @param commit
     * @param params
     */
    setParams ({commit}, params) {
      commit('setParams', params)
    },
    /**
     * 更新参数信息
     * @param commit
     * @param params
     */
    updateParams ({commit}, params) {
      commit('updateParams', params)
    },
    /**
     * 移除某个属性
     * @param commit
     * @param key
     */
    removeParams ({commit}, key) {
      commit('removeParams', key)
    }
  }
}

export default app
