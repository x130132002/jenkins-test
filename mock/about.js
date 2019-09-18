import Mock from 'mockjs'

export default [
  {
    url: '/about',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: {
          timestamp: +Mock.Random.date('T'),
          content: '<p>@cword(20, 40)</p>'
        }
      }
    }
  },
  {
    url: '/about/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

