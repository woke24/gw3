import request from '@/utils/system/request'

// 用户登录
export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// Google 快捷登录
export function googleLogin (data) {
  return request({
    url: '/user/googleLogin',
    method: 'post',
    data
  })
}

// Facebook 快捷登录
export function facebookLogin (data) {
  return request({
    url: '/user/facebookLogin',
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getUserInfo (params) {
  return request({
    url: '/user/details',
    method: 'get',
    params
  })
}

// 获取用户信息
export function getInfo (params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  })
}

// 用户注册
export function register (data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 注销
export function loginOut () {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}

// 发送邮件验证码
export function sendEmailCode (data) {
  return request({
    url: '/user/sendMail',
    method: 'post',
    data
  })
}

// 修改密码
export function changePwd (data) {
  return request({
    url: '/user/changePwd',
    method: 'post',
    data
  })
}

// 修好账号信息
export function changeInfo (data) {
  return request({
    url: '/user/changeInfo',
    method: 'post',
    data
  })
}

// 检查邮箱
export function checkEmail (data) {
  return request({
    url: '/user/checkEmail',
    method: 'post',
    data
  })
}

// 检查验证码是否有效
export function verificationCode (data) {
  return request({
    url: '/user/verificationCode',
    method: 'post',
    data
  })
}

//  国家列表
export function getCountryList () {
  return request({
    url: '/user/countryList',
    method: 'get'
  })
}

// 会员激活
export function activation (data) {
  return request({
    url: '/user/activation',
    method: 'post',
    data
  })
}

// 鞋码列表
export function getShoeSizeList () {
  return request({
    url: '/user/shoeSizeList',
    method: 'get'
  })
}

// 头像列表
export function getAvatarList (params) {
  return request({
    url: '/user/avatarList',
    method: 'get',
    params
  })
}

export function getMenuApi () {
  return request({
    url: '/menu/list',
    method: 'post',
    baseURL: '/mock',
  })
}

// 每日任务列表
export function dailyTaskList (params) {
  return request({
    url: '/user/dailyTaskList',
    method: 'get',
    params
  })
}

// Fitness 页面用户数据分析
export function statistics (params) {
  return request({
    url: '/user/statistics',
    method: 'get',
    params
  })
}