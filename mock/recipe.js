import Mock from 'mockjs'

const List = []
const Cate = [
  {
    id: '@increment',
    name: '類別一',
    title: '@title(5, 10)',
    description: '@cparagraph(0, 20)',
    'status|1': ['啟用', '停用']
  },
  {
    id: '@increment',
    name: '類別二',
    title: '@title(5, 10)',
    description: '@cparagraph(0, 20)',
    'status|1': ['啟用', '停用']
  },
  {
    id: '@increment',
    name: '類別三',
    title: '@title(5, 10)',
    description: '@cparagraph(0, 20)',
    'status|1': ['啟用', '停用']
  }
]
const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    'cate|1': ['類別一', '類別二', '類別三'],
    title: '@title(5, 10)',
    images: {
      name: '@string(4,7)',
      url: 'https://loremflickr.com/320/240'
    },
    description: '<p>@title(5, 10)</p>',
    'status|1': ['啟用', '停用']
  }))
}

export default [
  {
    url: '/recipe/list',
    type: 'get',
    response: config => {
      const { cate, title, page = 1, limit = 20, dateStart, dateEnd } = config.query
      const mockList = List.filter(item => {
        if (cate && item.cate !== cate) return false
        if (title && item.title.indexOf(title) < 0) return false
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
    url: '/recipe/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },
  {
    url: '/recipe/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/recipe/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/recipe/delete/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },
  {
    url: '/recipe/cate',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query
      const pageList = Cate.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: Cate.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/recipe/cate/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/recipe/cate/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/recipe/cate/delete/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]

