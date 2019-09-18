import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/member/list',
    method: 'get',
    params: query
  })
}

export function fetchMember(query) {
  return request({
    url: '/member/list',
    method: 'get',
    params: query
  })
}

export function createMember(data) {
  return request({
    url: '/member/create',
    method: 'post',
    data
  })
}

export function updateMember(data) {
  return request({
    url: '/member/update',
    method: 'post',
    data
  })
}

export function deleteMember(id) {
  return request({
    url: `/member/delete/${id}`,
    method: 'delete'
  })
}
