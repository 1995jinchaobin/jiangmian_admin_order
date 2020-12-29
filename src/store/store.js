// 你是一段成熟的代码，要学会自己改bug
'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

const getters = {}

const store = new Vuex.Store({
  modules: {
    user,
    app
  },
  getters,
  plugins: [createPersistedState({
    key: 'yc-user',
    storage: window.sessionStorage
  })]
})

export default store
