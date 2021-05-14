/*
 * @Author: spp
 * @Date: 2021-05-07 11:00:26
 * @LastEditors: spp
 * @LastEditTime: 2021-05-08 16:42:27
 * @FilePath: \proUI\src\filters\index.js
 */

import * as filters from './collections'

export default {
    install(Vue) {
        Object.keys(filters).forEach(key => {
            Vue.filter(key, filters[key])
        })
    }
}