/*
 * @Author: spp
 * @Date: 2021-04-19 14:49:24
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 16:43:48
 * @FilePath: \proUI\src\api\addressAreasAPI.js
 */
import service from './baseAPI'

// 新增小区
export function addAddressAreas(data) {
  return service({
    url: moduleNames + 'address-areas',
    method: 'post',
    data: data
  })
}

//修改小区
export function changeAddressAreas(data) {
  return service({
    url: moduleNames + 'address-areas',
    method: 'PUT',
    data: data
  })
}

//查询小区列表 
export function getAreasList(data) {
  return service({
    url: moduleNames + 'address-areas/list',
    method: 'post',
    data: data
  })
}

//实时查询街道/小区 
export function realTimeQuery(data) {
  return service({
    url: moduleNames + 'address-polls/search',
    method: 'get',
    params: data
  })
}