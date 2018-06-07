/**
 * Created by jiachenpan on 16/11/18.
 */
import { upload } from '@/api/upload'
import QRCode from 'qrcode'
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}
export function extend(obj) {
  const o = {}
  const attr = Array.prototype.slice.call(arguments).slice(1)
  console.log(111)
  attr.forEach(function(val, index) {
    if (val in obj) { o[val] = obj[val] }
  })
  return o
}
export const createQR = researchurl => new Promise((resolve, reject) => {
  const resurl = researchurl.substr(0, 7).toLowerCase() === 'http://' ? researchurl : 'http://' + researchurl
  return new Promise(function(reslove, reject) {
    QRCode.toDataURL(resurl)
      .then(url => {
        console.log(url)
        upload({
          fileContent: url.substr(url.indexOf(',') + 1),
          suffix: 'png',
          fileName: 'QR',
          scaleFlag: true,
          scaleSize: [{ width: 50, height: 50 }]
        }).then(function(resp) {
          if (resp.data.success) {
            resolve(resp.data.data.storePath)
          } else {
            reject(resp.data.errorMsg)
          }
        })
      })
      .catch(err => {
        console.error(err)
      })
  })
})
