import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/media/list',
    method: 'get',
    params: query
  })
}

export function creatMedia(data) {
  return request({
    url: '/media/create',
    method: 'post',
    data
  })
}

export function updatMedia(data) {
  return request({
    url: '/media/update',
    method: 'post',
    data
  })
}

export function deletMedia(id) {
  return request({
    url: `/media/delete/${id}`,
    method: 'delete'
  })
}
