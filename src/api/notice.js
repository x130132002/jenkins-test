import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: query
  })
}

export function createNotice(data) {
  return request({
    url: '/notice/create',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/notice/update',
    method: 'post',
    data
  })
}

export function deleteNotice(id) {
  return request({
    url: `/notice/delete/${id}`,
    method: 'delete'
  })
}
