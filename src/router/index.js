import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/Login',
    component: () => import('@/views/Login/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/Home',
    children: [{
      path: 'Home',
      name: 'Home',
      component: () => import('@/views/Home/Home'),
      meta: { title: '首页', icon: 'Home' }
    }]
  },

  {
    path: '/Register',
    name: 'Register',
    component: () => import('@/views/Register/Register'),
  },

  {
    path: '/Forgotpwd',
    name: 'Forgotpwdr',
    component: () => import('@/views/Forgotpwd/Forgotpwd'),
  },

  {
    path: '/Affairs',
    component: Layout,
    redirect: '/Affairs/CourseM/CourseM',
    name: 'Affairs',
    meta: { title: '事务管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'CourseM',
        name: 'CourseM',
        component: () => import('@/views/Affairs/CourseM/CourseM'),
        meta: { title: '课程管理', icon: 'table' }
      },
      {
        path: 'PersonM',
        name: 'PersonM',
        component: () => import('@/views/Affairs/PersonM/PersonM'),
        meta: { title: '人员管理', icon: 'tree' }
      },
      {
        path: 'SignInfo',
        name: 'SignInfo',
        component: () => import('@/views/Affairs/SignInfo/SignInfo'),
        meta: { title: '签到详情', icon: 'form' }
      },
      {
        path: 'SchoolM',
        name: 'SchoolM',
        component: () => import('@/views/Affairs/SchoolM/SchoolM'),
        meta: { title: '学校管理', icon: 'nested' }
      }
    ]
  },

  {
    path: '/Permission',
    component: Layout,
    redirect: '/Permission/CourseM/CourseM',
    name: 'Permission',
    meta: { title: '权限管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'RoleM',
        name: 'RoleM',
        component: () => import('@/views/Permission/RoleM/RoleM'),
        meta: { title: '角色管理', icon: 'table' }
      },
      {
        path: 'PermissionM',
        name: 'PermissionM',
        component: () => import('@/views/Permission/PermissionM/PermissionM'),
        meta: { title: '权限设置', icon: 'tree' }
      },
      {
        path: 'DictionaryM',
        name: 'DictionaryM',
        component: () => import('@/views/Permission/DictionaryM/DictionaryM'),
        meta: { title: '数据字典', icon: 'form' }
      }
    ]
  },

  {
    path: '/BasePage',
    component: Layout,
    redirect: '/BasePage/BaseForm',
    name: 'BasePage',
    meta: { title: '基础页面', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'BaseForm',
        name: 'BaseForm',
        component: () => import('@/views/BasePage/BaseForm'),
        meta: { title: '基础表单', icon: 'form' }
      },
      {
        path: 'BaseTable',
        name: 'BaseTable',
        component: () => import('@/views/BasePage/BaseTable'),
        meta: { title: '基础表格', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
