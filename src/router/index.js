import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/page/HelloWorld.vue') },
    { path: '/about', name: 'about', component: () => import('@/page/AboutView.vue') },
    { path: '/imgPica', name: 'imgPica', component: () => import('@/page/ImgPica.vue') },
    { path: '/positionStiky', name: 'positionStiky', component: () => import('@/page/PositionStiky.vue') },
    { path: '/audioCall', name: 'AudioCall', component: () => import('@/page/AudioCall.vue') },
    { path: '/mediaRecorder', name: 'MediaRecorder', component: () => import('@/page/MediaRecorder.vue') },
    { path: '/sudoku', name: 'Sudoku', component: () => import('@/page/Sudoku.vue') },
    { path: '/login', name: 'login', component: () => import('@/page/login.vue') },
  ],
})
// 拦截路由
router.beforeEach((to, from, next) => {
  // 获取用户信息
  const userInfo = sessionStorage.getItem('userInfo')
  // 判断用户是否登录
  if (userInfo) {
    // 登录了
    // 判断用户是否访问登录页面
    if (to.path === '/login') {
      // 访问登录页面，跳转到首页
      next('/')
    } else {
      // 访问其他页面，正常跳转
      next()
    }
  } else {
    // 未登录
    if (to.path === '/login') {
      // 访问登录页面，正常跳转
      next()
    } else {
      // 访问其他页面，跳转到登录页面
      next('/login')
    }
  }
})

export default router