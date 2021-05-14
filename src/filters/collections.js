/*
 * @Author: spp
 * @Date: 2021-05-07 11:41:32
 * @LastEditors: spp
 * @LastEditTime: 2021-05-07 11:42:41
 * @FilePath: \proUI\src\filters\filterCollections.js
 */

// 暂时先一个集合文件处理所有的指令集，多的话按模块拆
// 是否支持小时抄表  supportHourReading  1支持，2不支持 默认空
export const supportHourReading = (val) => {
    if (val === null) return ''
    return val === 1 ? '是' : '否'
}