import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'
const baseURL = import.meta.env.VITE_BASE_URL

axios.defaults.withCredentials = true;

const service = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  withCredentials: true
})

// 请求前的统一处理
service.interceptors.request.use(
  (config) => {
    // JWT鉴权处理
    const token = store.getters['user/token']
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 20000) {
      return res
    } else {
      showError(res)
      return Promise.reject(res)
    }
  },
  (error) => {
    console.log(error) // for debug
    const badMessage = error.message || error
    const code = parseInt(badMessage.toString().replace('Request failed with status code', ''))
    showError({ code, message: badMessage })
    return Promise.reject(error)
  }
)

// 错误处理
function showError (error) {
  // token过期，清除本地数据，并跳转至登录页面
  if (error.code === 401) {

    ElMessage({
      message: 'Your login information has expired. Please log in again!',
      type: 'error',
      duration: 3 * 1000
    })
    // to re-login
    store.dispatch('user/loginOut')
  } else {
    ElMessage({
      message: error.msg || error.message || 'Service error',
      type: 'error',
      duration: 3 * 1000
    })
  }

}

export default service