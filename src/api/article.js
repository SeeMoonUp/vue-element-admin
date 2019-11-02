import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/article/list',
    method: 'post',
    baseURL: 'https://bit-admin.javalemon.com/'
  })
}

export function fetchArticle(articleId) {
  return request({
    url: '/article/detail',
    method: 'post',
    params: { articleId }
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post'
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
