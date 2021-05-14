/*
 * @Author: spp
 * @Date: 2021-04-30 16:52:23
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 16:27:58
 * @FilePath: \proUI\src\store\modules\app.js
 */

const state = {
    isCollapse:false
}

// 方法名尽量大写
const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.isCollapse = !state.isCollapse
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
