'use strict'

import * as Cookies from 'js-cookie'

// const param = {
//
// }

const defaultMethod = {
  /**
   * 获取参数信息
   * @returns {{REMEMBER_ACCOUNT: string, USER_ID: string, USER_ACCOUNT: string}}
   */
  getParam () {
    return {
      // 存入cookie的用户信息字段
      USER_ACCOUNT: 'user_account',
      // 用户id
      USER_ID: 'user_id',
      // 是否记住密码
      REMEMBER_ACCOUNT: 'remember_account'
    }
  },
  /**
   * 获取cookie值
   * @param key
   * @returns {*}
   */
  getItem (key) {
    return Cookies.get(key)
  },
  /**
   * 设置cookie
   * @param key
   * @param value
   * @param params
   */
  setItem (key, value, params = {}) {
    Cookies.set(key, value, params)
  },
  /**
   * 移除cookie
   * @param key
   * @param param
   */
  removeItem (key, param) {
    if (param) {
      Cookies.remove(key, param)
    } else {
      Cookies.remove(key)
    }
  },
  /**
   * 获取cookie的json数据
   * @param key
   * @returns {*}
   */
  getJSON (key) {
    if (key) {
      return Cookies.getJSON(key)
    } else {
      return Cookies.getJSON()
    }
  }
}

export default defaultMethod
