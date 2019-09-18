import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/products/list',
    method: 'get',
    params: query
  })
}

export function fetchProduct(id) {
  return request({
    url: '/products/detail',
    method: 'get',
    params: { id }
  })
}

export function createProduct(data) {
  return request({
    url: '/products/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/products/update',
    method: 'post',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: `/products/delete/${id}`,
    method: 'delete'
  })
}

export function fetchCate(query) {
  return request({
    url: '/products/cate',
    method: 'get',
    params: query
  })
}
export function createCate(query) {
  return request({
    url: '/products/cate/create',
    method: 'post',
    params: query
  })
}
export function updateCate(query) {
  return request({
    url: '/products/cate/update',
    method: 'post',
    params: query
  })
}
export function deleteCate(id) {
  return request({
    url: `/products/cate/delete/${id}`,
    method: 'delete'
  })
}
