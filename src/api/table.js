import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'patent/list',
    method: 'post',
    data: params
  })
}
