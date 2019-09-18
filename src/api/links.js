import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/links/list',
    method: 'get',
    params: query
  })
}

export function fetchLink(id) {
  return request({
    url: '/links/detail',
    method: 'get',
    params: { id }
  })
}

export function createLink(data) {
  return request({
    url: '/links/create',
    method: 'post',
    data
  })
}

export function updateLink(data) {
  return request({
    url: '/links/update',
    method: 'post',
    data
  })
}

export function deleteLink(id) {
  return request({
    url: `/links/delete/${id}`,
    method: 'delete'
  })
}

export function fetchCate(query) {
  return request({
    url: '/links/cate',
    method: 'get',
    params: query
  })
}
export function createCate(query) {
  return request({
    url: '/links/cate/create',
    method: 'post',
    params: query
  })
}
export function updateCate(query) {
  return request({
    url: '/links/cate/update',
    method: 'post',
    params: query
  })
}
export function deleteCate(id) {
  return request({
    url: `/links/cate/delete/${id}`,
    method: 'delete'
  })
}
