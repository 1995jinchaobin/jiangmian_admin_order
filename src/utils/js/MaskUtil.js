import {Loading as $Loading} from 'element-ui'

const mask = {
  // 计数键值对
  numMap: {},
  // 默认的Key值
  defaultKey: 'yc-loding',
  /**
   * 初始化计数键值对
   * @param key
   */
  init (key = mask.defaultKey) {
    if (!this.numMap[key]) {
      this.numMap[key] = {
        num: 0,
        instance: null
      }
    }
  }
}

export default {
  /**
   * 显示遮罩层
   * @param key
   */
  open (key = mask.defaultKey) {
    mask.init(key)
    if (mask.numMap[key].num++ === 0) {
      mask.numMap[key].instance = $Loading.service({})
    }
  },
  /**
   * 关闭遮罩层
   * @param key
   * @param num 关闭的数据
   */
  close (key = mask.defaultKey, num = 1) {
    mask.numMap[key].num -= num
    if (mask.numMap[key].num <= 0) {
      mask.numMap[key].num = 0
      mask.numMap[key].instance.close()
    }
  }

}
