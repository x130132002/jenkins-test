import request from '@/utils/request'

export function fetchAbout() {
  return request({
    url: '/about',
    method: 'get'
  })
}

export function updateAbout(data) {
  return request({
    url: '/about/update',
    method: 'post',
    data
  })
}
