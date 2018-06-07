import request from '@/utils/upload'

export function upload(params) {
  return request({
    url: 'file/upload',
    method: 'post',
    data: params
  })
}
