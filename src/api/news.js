import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/news/list',
    method: 'get',
    params: query
  })
}

export function createNews(data) {
  return request({
    url: '/news/create',
    method: 'post',
    data
  })
}

export function updateNews(data) {
  return request({
    url: '/news/update',
    method: 'post',
    data
  })
}

export function deleteNews(id) {
  return request({
    url: `/news/delete/${id}`,
    method: 'delete'
  })
}
