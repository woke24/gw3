import request from '@/utils/system/request'

// 兑换商品列表
export function getExchangeList (params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}
// 兑换商品
export function productExchange (data) {
  return request({
    url: '/product/exchange',
    method: 'post',
    data
  })
}
// 新增/修改地址
export function addressChange (data) {
  return request({
    url: '/user/changeAddress',
    method: 'post',
    data
  })
}
// 地址信息
export function getAddress (params) {
  return request({
    url: '/user/addressDetail',
    method: 'get',
    params
  })
}

// 积分明细
export function getPointsHistory (params) {
  return request({
    url: '/user/integralDetail',
    method: 'get',
    params
  })
}