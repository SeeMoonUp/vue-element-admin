import request from '@/utils/request'

export function save(query) {
  return request({
    url: 'video/save',
    method: 'post',
    baseURL: 'https://bit-admin.javalemon.com/',
    params: query,
    data: query
  })
}
export function list() {
  return request({
    url: 'video/list',
    method: 'post',
    baseURL: 'https://bit-admin.javalemon.com/'
  })
}

