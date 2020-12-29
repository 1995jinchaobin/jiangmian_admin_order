export default {
  /**
   * 获取地址栏参数值
   * @param param
   * @return {*}
   */
  getQueryByName (param) {
    let reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) { return decodeURI(r[2]) }
    return null
  },
  /**
   * 去除文本的html标签
   * @param content
   */
  removeHtmlTag (content) {
    return content.replace(/<[^>]+>/g, '').replace(/\n/g, '')
  },
  /**
   * 随机打乱数组
   * @param array
   */
  randArray (array) {
    const arr = [...array]
    for (let j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
    return arr
  },
  /**
   * 回车转html换行
   * @param content
   * @returns {*}
   */
  enterToBr (content) {
    if (!content) {
      return content
    }
    return content.replace(/\n/ig, '<br/>')
  },
  /**
   * 获取元素在数组中的索引值
   * @param array
   * @param item
   * @returns {*}
   */
  getItemIndex (array, item) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return i
      }
    }
    return -1
  },
  //将数字每隔3位用，隔开
  fmoney(money) {
    money = String(money);
    var left = money.split('.')[0];
    var right=money.split('.')[1];
    right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '';   //此处保留两位小数，可根据情况是适当更改
    var temp = left.split('').reverse().join('').match(/(\d{1,3})/g); // 此处每三位隔开
    return (Number(money)<0?"-":"") + temp.join(',').split('').reverse().join('')+right;
  }
}

/**
 * base64转blob
 * @param base64
 * @returns {Blob}
 */
export function base64toBlob (base64) {
  const array = base64.split(',')
  const mime = array[0].match(/:(.*?);/)[1]
  const blobStr = atob(array[1])
  let n = blobStr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = blobStr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * blob转base64
 * @param blob
 * @returns {Promise<any>}
 */
export function blobToBase64 (blob) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      resolve(e.target.result)
    }
    reader.readAsDataURL(blob)
  })
}
