import request from '@/utils/system/request'

// 获取旧版游戏配置
export function gameConfiguration (params) {
  return request({
    url: '/gateway/configuration',
    method: 'get',
    params
  })
}

// 获取新版游戏配置 
export function newGameConfiguration (params) {
  return request({
    url: '/gateway/newConfiguration',
    method: 'get',
    params
  })
}