import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login', // path 顾名思义跳转路径，从哪里跳转 两处名字要一致，它可以有二级路径比如/system/home.. 
    name: 'login',  // name就相当于该路径的别名，只是为了方便找到他，有时候也可以不设置name，比如一个人的名字太长，你可以给它起一个短点儿的名字，当你准备跳转的时候，直接用起的这个别名就行。
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout',   // 如果父路由有默认子路由，那它的 name 没有意义
    component: () => import('@/views/layout'),
    children: [
      {
        path: '',  // 为空是默认子路由  ，只能有一个
        name: 'home',
        component: () => import('@/views/home'),
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa'),
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video'),
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my'),
      }
    ]
  },
  {
    path: '/search', // path 顾名思义跳转路径，从哪里跳转 两处名字要一致，它可以有二级路径比如/system/home.. 
    name: 'search',  // name就相当于该路径的别名，只是为了方便找到他，有时候也可以不设置name，比如一个人的名字太长，你可以给它起一个短点儿的名字，当你准备跳转的时候，直接用起的这个别名就行。
    component: () => import('@/views/search')

  },
  {
    // 所有文章的详情页都要匹配到这个路由，所以要设置成动态路由,接受文章id
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true  // 开启 props 传参，说白了就是把路由参数映射到 组件的props数据中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
  }
]

const router = new VueRouter({
  routes
})

export default router
