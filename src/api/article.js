import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/article/list',
    method: 'post',
    baseURL: 'https://bit-admin.javalemon.com/'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function save(query) {
  return request({
    url: 'article/save',
    method: 'post',
    baseURL: 'https://bit-admin.javalemon.com/',
    data: query
  })
}
