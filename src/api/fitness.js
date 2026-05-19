import request from '@/utils/system/request'
// ranking board
export function fitnessRankingList (params) {
  return request({
    url: '/gateway/fitnessRankingBord',
    method: 'get',
    params
  })
}