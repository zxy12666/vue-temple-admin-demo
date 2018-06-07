import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

router.beforeEach((to, from, next) => {
  NProgress.start()
  // const isLogin = Boolean(store.state.user.roleId) // true用户已登录， false用户未登录
  const isLogin = true
  if (!isLogin && to.path !== '/login') {
    return next({ path: '/login' })
  } else {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      // 判断当前用户是否已拉取完user_info信息
      if (!store.getters.roleA) {
        // note: roles must be a array! such as: ['editor','develop']
        // const roleId = store.state.user.roleId
        const roleId = '0'
        store.dispatch('GenerateRoutes', { roleId }).then(() => {
          // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters)// 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      } else {
        next()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
