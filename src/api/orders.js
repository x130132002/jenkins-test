import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/orders/list',
    method: 'get',
    params: query
  })
}

export function fetchOrder(id) {
  return request({
    url: '/orders/detail',
    method: 'get',
    params: { id }
  })
}

export function updateOrder(data) {
  return request({
    url: '/orders/update',
    method: 'post',
    data
  })
}

export function fetchStatus(query) {
  return request({
    url: '/orders/status',
    method: 'get',
    params: query
  })
}

export function deleteOrder(id) {
  return request({
    url: `/orders/delete/${id}`,
    method: 'delete'
  })
}
