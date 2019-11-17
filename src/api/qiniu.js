import request from '@/utils/request'

export function getToken() {
  return request({
    url: 'qiniu/getToken', // 假地址 自行替换
    method: 'post',
    baseURL: 'http://admin.bitxueyuan.com/'
  })
}
