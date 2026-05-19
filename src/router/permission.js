/** 引入路由相关的资源 */
import router, { modules } from './index'
/** 引入vuex实例 */
import store from '@/store'

/** 引入纯前端路由 */
import FrontRoutes from './permission/front'

let isAddingRoutes = false
let routeInitPromise = null

export let hasAddedDynamicRoutes = false

/**
 * @name 动态路由的权限新增，供登录后调用
 * @other 如果需要进行后端接口控制菜单的话，请在此拿到后端的菜单树与asyncRoutes对比，生成一个新的值
 */
async function addRoutes () {
  FrontRoutes.forEach((item) => {
    if (!router.hasRoute(item.name)) {
      modules.push(item)
      router.addRoute(item)
    }
  })

  hasAddedDynamicRoutes = true
}

/**
 * @des 登录了之后会执行这个方法，实现动态路由的功能
 */
export async function getAuthRoutes () {
  const token = store.state.user.token

  if (!token) return

  if (hasAddedDynamicRoutes) return

  if (isAddingRoutes && routeInitPromise) {
    return routeInitPromise
  }

  isAddingRoutes = true

  routeInitPromise = (async () => {
    try {
      const userInfo = await store.dispatch('user/getInfo', { token })

      await addRoutes()

      return userInfo
    } catch (e) {
      hasAddedDynamicRoutes = false
      throw e
    } finally {
      isAddingRoutes = false
    }
  })()

  return routeInitPromise
}
