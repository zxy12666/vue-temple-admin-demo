import axios from 'axios'
// 创建axios实例
const service = axios.create({
  baseURL: 'http://139.196.192.241:10081/',
  timeout: 10000, // 10s超时
  headers: { 'X-Custom-Header': 'foobar' }
})
export default service
