import Mock from 'mockjs'

const List = []
const count = 7

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    title: '@cword(5, 10)',
    description: '<p>@cword(20, 40)</p>',
    'status|1': ['啟用', '停用']
  }))
}

export default [
  {
    url: '/notice/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query
      const mockList = List.filter(item => {
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/notice/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/notice/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/notice/delete/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]

