import { createApp, computed } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/display.css' // 引入基于断点的隐藏类
import 'element-plus/dist/index.css'
import 'normalize.css' // css初始化
import './assets/style/common.scss' // 公共css
import './theme/modules/chinese/index.scss'
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './locale'
import SvgIcon from './components/SvgIcon/index.vue'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

/**
 * @Description: 初始化 C# 主机对象 (WebView2 交互)
 * 将 hostObject 挂载到 app.config.globalProperties.$host
 * @returns {Promise<boolean>} 返回 hostObject 是否成功初始化
 */
async function initializeHostObject (appInstance) {
  let hostObject = null

  try {
    // 检查是否在 WebView2 环境中
    const webview = window.chrome?.webview

    if (webview) {
      console.log('正在初始化 C# 主机对象 (nativeHost)...')

      // 获取 C# 主机对象
      const obj = webview.hostObjects.nativeHost

      if (obj) {
        hostObject = obj
        console.log('主机对象初始化成功')

        // 示例：调用一个 C# 方法并打印时间
        try {
          const time = await hostObject.GetCurrentTime()
          console.log(`C# 主机报告的当前时间: ${time}`)
        } catch (callError) {
          console.error('调用 C# GetCurrentTime 失败:', callError)
        }

        // 1. 将 hostObject 挂载到 Vue 实例的全局属性上
        // 这样在任何组件中都可以通过 this.$host 访问
        appInstance.config.globalProperties.$host = hostObject

        return true
      } else {
        console.warn('未找到 nativeHost 对象。请确保 C# 代码已调用 AddHostObjectToScript。')
      }
    } else {
      // 非 WebView2 环境，比如在浏览器中调试
      console.info('未检测到 WebView2 环境。全局 $host 对象将不可用。')
    }
  } catch (error) {
    console.error(`初始化主机对象失败: ${error.message}`, error)
  }

  // 即使失败，为了避免组件报错，也挂载一个空对象或 null
  appInstance.config.globalProperties.$host = hostObject
  return false
}

let appInstance = null

async function startApp () {

  if (store.restored) {
    await store.restored
  }

  const app = createApp(App)

  await initializeHostObject(app)

  app.directive('nodrag', {
    mounted (el) {
      el.ondragstart = () => false
    }
  })

  app.use(ElementPlus, { size: store.state.app.elementSize })
  app.use(store)
  app.use(router)
  app.use(ContextMenu)
  app.component('SvgIcon', SvgIcon)
  app.use(i18n)
  // app.config.performance = true
  app.mount('#app')
  appInstance = app
}

startApp()

export const getApp = () => appInstance
