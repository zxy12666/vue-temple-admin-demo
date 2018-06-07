import request from '@/utils/request'

export function getOrgList() {
  return request({
    url: 'lecturerJudges/list',
    method: 'get'
  })
}
