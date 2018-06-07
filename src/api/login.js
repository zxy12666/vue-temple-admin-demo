import request from '@/utils/request'

export function login(parms) {
  return request({
    url: '/login',
    method: 'post',
    data: parms
  })
}
export function loginByName(parms) {
  return request({
    url: '/loginByName',
    method: 'post',
    data: parms
  })
}
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
