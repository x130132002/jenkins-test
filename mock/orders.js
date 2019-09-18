import Mock from 'mockjs'

const List = []
const Status = [
  {
    name: '新訂單',
    description: '您已經完成訂單資料的填寫，等待我們處理的狀態'
  },
  {
    name: '處理中',
    description: '我們已經對到您的帳款，正在幫您處理中的狀態'
  },
  {
    name: '已寄出',
    description: '我們已經幫您寄出商品的狀態'
  },
  {
    name: '等貨中',
    description: '已經對到您的帳款，因您有部分商品需要等貨的狀態'
  },
  {
    name: '未付款',
    description: '您尚未完成匯款，或是您沒有上傳匯款資料的狀態'
  },
  {
    name: '款項不符',
    description: '您的匯款金額與訂單上的總金額不同無法幫您寄出的狀態'
  },
  {
    name: '查無帳款',
    description: '您所填寫帳號後5碼，我們查不到您帳款的狀態'
  },
  {
    name: '資料錯誤',
    description: '您所填寫的資料不完整導致我們無法寄出或對帳的狀態'
  }
]
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    number: '@string("upper", 7)',
    timestamp: +Mock.Random.date('T'),
    editDate: +Mock.Random.date('T'),
    'status|1': Status,
    'method|1': ['線上刷卡', 'ATM、銀行、郵局轉帳匯款', '貨到付款'],
    'receipt|1': [
      {
        name: '二聯式'
      },
      {
        name: '三聯式',
        title: '@cword(5, 10)',
        taxID: '@string("number", 8)'
      }
    ],
    customer: {
      username: '@string(5, 10)',
      name: '@cname',
      email: '@email',
      cell: '09@string("number", 8)',
      tel: '0@string("number", 1)@string("number", 7)',
      address: '@county(true)',
      shippingAdd: '@county(true)'
    },
    products: {
      'shipping|1': ['120', '250'],
      collectionCosts: 30,
      totalPrice: '@string("number", 2)00',
      'detail|1-4': [
        {
          id: '@increment',
          name: '@cword(5, 10)',
          price: '@string("number", 1, 2)00',
          qty: '@string("number", 1)'
        }
      ]
    }
  }))
}

export default [
  {
    url: '/orders/list',
    type: 'get',
    response: config => {
      const { orderFinished, status, keyword, page = 1, limit = 20, dateStart, dateEnd } = config.query
      const mockList = List.filter(item => {
        if (orderFinished && item.status === orderFinished) return false
        if (status && item.status !== status) return false
        if (keyword && item.customer.name.indexOf(keyword) < 0 && item.number.indexOf(keyword) < 0) return false
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
    url: '/orders/status',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query
      const pageList = Status.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: Status.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/orders/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const order of List) {
        if (order.id === +id) {
          return {
            code: 20000,
            data: order
          }
        }
      }
    }
  },
  {
    url: '/orders/pv',
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
    url: '/orders/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/orders/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          msg: 'success',
          editDate: +Mock.Random.now('T')
        }
      }
    }
  },
  {
    url: '/orders/delete/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
