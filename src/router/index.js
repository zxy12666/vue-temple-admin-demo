import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }, // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '项目' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree' }
  //     }
  //   ]
  // },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form' }
      }
    ]
  }

]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/pdf',
    component: Layout,
    meta: { title: 'Pdf', roles: ['1'] },
    children: [
      {
        path: 'index',
        name: 'Pdf',
        meta: { title: 'Pdf', roles: ['1'] },
        component: () => import('@/views/pdf/Pdf')
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    meta: { title: 'Pdf', roles: ['1'] },
    children: [
      {
        path: 'index',
        name: 'Project',
        component: () => import('@/views/table/index'),
        meta: { title: '项目' }
      }
    ]
  },
  {
    path: '/train',
    component: Layout,
    meta: { title: 'train', roles: ['1'] },
    hidden: true,
    children: [
      {
        path: 'add',
        name: 'trainAdd',
        meta: { title: 'trainAdd', roles: ['1'] },
        component: () => import('@/views/train/trainAdd')
      },
      {
        path: 'edit/:id',
        name: 'trainEdit',
        meta: { title: 'trainAdd', roles: ['1'] },
        component: () => import('@/views/train/edit')
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
