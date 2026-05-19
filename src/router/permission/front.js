/**
 * 前端路由管理
 **/
import Layout from '@/layout/index.vue'
/** 引入需要权限的Modules */
import Device from '../modules/device'
import topNav from '../modules/topNav'
import Settings from '../modules/settings'

/** 登录后需要动态加入的本地路由 */
const FrontRoutes = [
  ...Device,
  ...topNav,
  ...Settings
]

const finalRoutes = [
  ...FrontRoutes,
  {
    // 找不到路由重定向到404页面
    path: "/:pathMatch(.*)",
    component: Layout,
    redirect: "/404",
    hideMenu: true,
    meta: { title: '' },
  },
]

export default finalRoutes