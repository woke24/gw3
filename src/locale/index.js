// 提示信息仅在开发环境生效
import { createI18n } from 'vue-i18n'
import store from '@/store'

const files= import.meta.globEager('./modules/*.js')

let messages = {}
Object.keys(files).forEach((c) => {
  const module = files[c].default
  // 只导入英文和中文
  if (module.message.language === 'English' || module.message.language === '中文') {
    const moduleName = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
    messages[moduleName] = module
  }
  
})
// console.log(messages)

const lang = store.state.app.lang || navigator.language // 初次进入，采用浏览器当前设置的语言，默认采用英文
// const locale = lang.indexOf('en') !== -1 ? 'en' : 'zh-cn'
const locale = 'en'

/** 国际化主函数，调用vue-i18n插件生成 */
const i18n = createI18n({
  __VUE_I18N_LEGACY_API__: false,
  __VUE_I18N_FULL_INSTALL__: false,
  locale: locale,
  fallbackLocale: 'en',
  messages
})

document.getElementsByTagName('html')[0].setAttribute('lang', locale)

export default i18n