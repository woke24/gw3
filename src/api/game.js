import request from '@/utils/system/request'

// 游戏列表
export function gameCategoryLists (params) {
  return request({
    url: '/game/categoryLists',
    method: 'get',
    params
  })
}

// 游戏详情
export function gameDetail (params) {
  return request({
    url: '/game/detail',
    method: 'get',
    params
  })
}

// 游戏线程ID列表
export function gameThreads (params) {
  return request({
    url: '/game/threads',
    method: 'get',
    params
  })
}


// 游戏记录上报
export function dataReporting (data) {
  return request({
    url: '/game/dataReporting',
    method: 'post',
    data
  })
}
