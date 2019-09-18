import Layout from '@/layout'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: { title: 'Login' }
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '資訊總覽', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/orders',
    redirect: '/orders/index',
    component: Layout,
    meta: { title: '訂單管理' },
    children: [
      {
        path: 'index',
        name: 'Orders',
        component: () => import('@/views/orders'),
        meta: { title: '訂單管理', icon: 'shopping' }
      },
      {
        path: 'detail/:id',
        name: 'OrdersDetail',
        component: () => import('@/views/orders/order-detail'),
        meta: { title: '訂單明細', noCache: true, activeMenu: '/orders/index' },
        hidden: true
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Member',
        component: () => import('@/views/member/index'),
        meta: { title: '會員管理', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'About',
        component: () => import('@/views/about/index'),
        meta: { title: '公司簡介', icon: 'chart' }
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'News',
        component: () => import('@/views/news/index'),
        meta: { title: '最新消息', icon: 'email' }
      }
    ]
  },
  {
    path: '/products',
    name: 'Products',
    component: Layout,
    redirect: '/products/cate',
    meta: { title: '商品管理', icon: 'nested' },
    children: [
      {
        path: 'cate',
        name: 'productsCate',
        component: () => import('@/views/products/cate/index'),
        meta: { title: '商品分類', icon: 'component' }
      },
      {
        path: 'list',
        name: 'productsList',
        component: () => import('@/views/products/list/index'),
        meta: { title: '商品清單', icon: 'list' }
      }
    ]
  },
  {
    path: '/recipe',
    name: 'Recipe',
    component: Layout,
    redirect: '/recipe/cate',
    meta: { title: '料理食譜', icon: 'excel' },
    children: [
      {
        path: 'cate',
        name: 'recipeCate',
        component: () => import('@/views/recipe/cate/index'),
        meta: { title: '食譜分類', icon: 'component' }
      },
      {
        path: 'list',
        name: 'recipeList',
        component: () => import('@/views/recipe/list/index'),
        meta: { title: '食譜清單', icon: 'list' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Notice',
        component: () => import('@/views/notice/index'),
        meta: { title: '購物須知', icon: 'form' }
      }
    ]
  },
  {
    path: '/media',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Media',
        component: () => import('@/views/media/index'),
        meta: { title: '媒體報導', icon: 'example' }
      }
    ]
  },
  {
    path: '/links',
    name: 'Links',
    component: Layout,
    redirect: '/notice/cate',
    meta: { title: '友站連結', icon: 'link' },
    children: [
      {
        path: 'cate',
        name: 'linksCate',
        component: () => import('@/views/links/cate/index'),
        meta: { title: '連結分類', icon: 'component' }
      },
      {
        path: 'list',
        name: 'linksList',
        component: () => import('@/views/links/list/index'),
        meta: { title: '連結清單', icon: 'list' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
