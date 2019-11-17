import request from '@/utils/request'

export function save(query) {
  return request({
    url: 'video/save',
    method: 'post',
    baseURL: 'http://admin.bitxueyuan.com/',
    data: query
  })
}
export function list() {
  return request({
    url: 'video/list',
    method: 'post',
    baseURL: 'http://admin.bitxueyuan.com/'
  })
}

export function fetchList(query) {
  return request({
    url: 'video/list',
    method: 'post',
    baseURL: 'http://admin.bitxueyuan.com/'
  })
}

export function searchList(query) {
  return request({
    url: 'video/searchList',
    method: 'post',
    data: { 'keyword': query },
    baseURL: 'http://admin.bitxueyuan.com/'
  })
}
