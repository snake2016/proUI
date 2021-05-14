/*
 * @Author: spp
 * @Date: 2021-05-13 09:31:21
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 17:19:35
 * @FilePath: \proUI\src\store\modules\tagsView.js
 */
import { LS } from '@/utils/storage';

const state = {
  openTabs: LS.get('openTabs') || [], //所有打开的路由
  activeIndex: '/',
};

const mutations = {
  // 添加tabs
  ADD_TABS: (state, view) => {
    let ifInOpenTabs = state.openTabs.some((v) =>v.name === view.name );
    if (ifInOpenTabs) return;
    state.openTabs.push(
      Object.assign({}, view, {
        name: view.name,
        title: view.title,
      })
    );
    LS.set('openTabs', state.openTabs);
  },
  // 删除tabs
  DELETE_TABS: (state, view) => {
    for (const [i, v] of state.openTabs.entries()) {
      if (v.name === view) {
        state.openTabs.splice(i, 1);

        // FEAT: update opentab list of local storage.
        LS.set('openTabs', state.openTabs);
        break;
      }
    }
  },
  // 设置当前激活的tab
  SET_ACTIVE_INDEX: (state, data) => {
    state.activeIndex = data;
  },

  // 重置tab
  RESET_TABS: (state, data) => {
    state.openTabs = data;
  },
}


const actions = {
  delete_tabs({ commit, state }, data) {
    return new Promise((resolve) => {
      commit('DELETE_TABS', data);
      resolve({
        openTabs: [...state.openTabs],
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

