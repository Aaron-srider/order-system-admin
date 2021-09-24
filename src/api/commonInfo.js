import request from '@/utils/request'

export function getCommonInfo() {
  return request({
    url: '/utils/commonInfo',
    method: 'get'
  })
}
