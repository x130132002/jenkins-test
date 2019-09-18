import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    username: '@string(5, 10)',
    name: '@cname',
    email: '@email',
    cell: '09@string("number", 8)',
    tel: '0@string("number", 1)@string("number", 7)',
    address: '@county(true)',
    shippingAdd: '@county(true)',
    'status|1': ['啟用', '停用']
  }))
}

export default [
  {
    url: '/member/list',
    type: 'get',
    response: config => {
      const { status, keyword, page = 1, limit = 20, dateStart, dateEnd } = config.query
      const mockList = List.filter(item => {
        if (status && item.status !== status) return false
        if (keyword && item.username.indexOf(keyword) < 0) return false
        if (dateStart && dateEnd && dateStart >= item.timestamp >= dateEnd) return false
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
    url: '/member/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },
  {
    url: '/member/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/member/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/member/delete/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
