import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/recipe/list',
    method: 'get',
    params: query
  })
}

export function createRecipe(data) {
  return request({
    url: '/recipe/create',
    method: 'post',
    data
  })
}

export function updateRecipe(data) {
  return request({
    url: '/recipe/update',
    method: 'post',
    data
  })
}

export function deleteRecipe(id) {
  return request({
    url: `/recipe/delete/${id}`,
    method: 'delete'
  })
}

export function fetchCate(query) {
  return request({
    url: '/recipe/cate',
    method: 'get',
    params: query
  })
}
export function createCate(query) {
  return request({
    url: '/recipe/cate/create',
    method: 'post',
    params: query
  })
}
export function updateCate(query) {
  return request({
    url: '/recipe/cate/update',
    method: 'post',
    params: query
  })
}
export function deleteCate(id) {
  return request({
    url: `/recipe/cate/delete/${id}`,
    method: 'delete'
  })
}
