'use strict'

import {
  Message as $Message,
  Notification as $Notice,
  MessageBox as $MessageBox
} from 'element-ui'

export default {
  message: {
    /**
     * 消息提示
     * @param content
     * @param param
     */
    info (content, param = {}) {
      $Message.info(content)
    },
    /**
     * 错误消息提示
     * @param content
     * @param param
     */
    error (content, param = {}) {
      $Message.error(content)
    },
    /**
     * 警告消息提示
     * @param content
     * @param param
     */
    warning (content, param = {}) {
      $Message.warning(content)
    },
    /**
     * 成功消息提示
     * @param content
     * @param param
     */
    success (content, param = {}) {
      $Message.success(content)
    }
  },
  notice: {
    /**
     * 消息通知
     * @param content
     * @param param
     */
    info (content, param = {}) {
      param['message'] = content
      if (!param.title) {
        param.title = '消息通知'
      }
      $Notice.info(param)
    },
    /**
     * 错误消息通知
     * @param content
     * @param param
     */
    error (content, param = {}) {
      param['message'] = content
      if (!param.title) {
        param.title = '消息通知'
      }
      $Notice.error(param)
    },
    /**
     * 错误消息通知
     * @param content
     * @param param
     */
    warning (content, param = {}) {
      param['message'] = content
      if (!param.title) {
        param.title = '消息通知'
      }
      $Notice.warning(param)
    },
    /**
     * 成功消息通知
     * @param content
     * @param param
     */
    success (content, param = {}) {
      param['message'] = content
      if (!param.title) {
        param.title = '消息通知'
      }
      $Notice.success(param)
    }
  },
  /**
   * 确认框
   * @param content
   * @param ok
   * @param cancel
   * @param params
   */
  confirm (content = '', ok = () => {}, cancel = () => {}, params = {}) {
    $MessageBox.confirm(content, (params.title || '提示'), {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(ok).catch(cancel)
  },
  /**
   * 弹框
   * @param content
   * @param ok
   * @param cancel
   * @param params
   */
  alert (content = '', ok = () => {}, cancel = () => {}, params = {}) {
    $MessageBox.alert(content, (params.title || '提示'), {
      confirmButtonText: '确定'
    }).then(ok).catch(cancel)
  }
}
