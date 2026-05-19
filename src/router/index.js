/**
 * @description 所有人可使用的参数配置列表
 * @params hideMenu: 是否隐藏当前路由结点不在导航中展示
 * @params alwayShow: 只有一个子路由时是否总是展示菜单，默认false
 */
import { reactive } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import i18n from '@/locale'
import NProgress from '@/utils/system/nprogress'
import { changeTitle } from '@/utils/system/title'
import { hasAddedDynamicRoutes, getAuthRoutes } from './permission'

NProgress.configure({ showSpinner: false })

// 引入不需要权限的modules
import Dashboard from './modules/dashboard'
import System from './modules/system'

/**
 * @name 初始化必须要的路由
 * @description 使用reactive属性使得modules可以在路由菜单里面实时响应，搞定菜单回显的问题
 * @detail 针对modules的任何修改，均会同步至菜单级别，记住，是针对变量名为：moduels的修改
 **/
let modules = reactive([...Dashboard, ...System])

const { t } = i18n.global

const router = createRouter({
  history: createWebHashHistory(),
  routes: modules,
  scrollBehavior (to, from, savedPosition) {
    if (to.name === from.name) {
      return savedPosition || false
    }
    return { top: 0 }
  }
})

// 未授权时可访问的白名单
const whiteList = ['/login']

// 路由跳转前的监听操作
router.beforeEach(async (to, from, next) => {

  NProgress.start()

  let token = store.state.user.token || localStorage.getItem('token')

  if (token && !store.state.user.token) {
    store.commit('user/setToken', token)
  }

  if (!token) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
    NProgress.done()
    return
  }

  if (to.path === '/login') {
    next('/')
    NProgress.done()
    return
  } else {
      const validated = store.state.user.validated
      if (!validated) {
        try {
          await store.dispatch('user/validateLogin')
          next()
          // store.state.user.validated = true
          return
        } catch (e) {
          await store.dispatch('user/loginOut')
          next('/login')
          NProgress.done()
          return
        }
      }
      if (!hasAddedDynamicRoutes) {
        try {
          await getAuthRoutes()
          next({ ...to, replace: true })
        } catch (e) {
          await store.dispatch('user/loginOut')
          next('/login')
        }
        return
      } else {
        to.meta?.title && changeTitle(to.meta.title)
        next()
      }
  }
})

// 路由跳转后的监听操作
router.afterEach((to, from) => {
  NProgress.done()

  const componentName = to.name
  if (to.meta && to.meta.cache && componentName) {
    store.commit('keepAlive/addKeepAliveComponentsName', componentName)
  }
})

export { modules }

export default router
