/*
 * @Author: spp
 * @Date: 2020-12-01 10:49:32
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 17:20:56
 * @FilePath: \proUI\src\store\modules\permission.js
 */

import { ROUTER_AUTH_LIST,BT_AUTH_lIST} from '@/consts/authPath.js';
import {ALL_MENU_LIST} from '@/router/router.config.js'
import  * as LoginService from '@/api/loginAPI';
import { LS,SS } from '@/utils/storage';
// import { userinfo, permissions } from '../../../mock/mockpermission';

const state = {
  menulist:LS.get('menulist') || [],
//   dictlist: Vue.ls.get('dictlist') || [],
//   token: SS.get('token') || '',
//   userinfo: Vue.ls.get('userinfo') || {},
//   authlist: Vue.ls.get('authlist') || { login: true },
};

const mutations = {
  SET_MENU: (state, permission) => {
    let authListTemp = {};
    permission.forEach((i1) => {
      // 请保持前端path映射表与后端接口同步
      if (ROUTER_AUTH_LIST[i1.subPath]) {
        let v = ROUTER_AUTH_LIST[i1.subPath];
        // 分String和Array分别处理，详见pathAuth.js
        if (typeof v == 'string' && v.constructor == String) {
          authListTemp[v] = true;
        } else if (typeof v == 'object' && v.constructor == Array) {
          v.forEach((i) => {
            authListTemp[i] = true;
          });
        }
      }
    });
    // 生成菜单的方法
    const createMenu = (routes, authList) => {
      let arr = [];
      routes.forEach((i) => {
        let judge_1 = false;
        // router.config中如果设置ismenu为false 则不展示
        judge_1 = authList[i.name] && i.ismenu!==false;
        if (judge_1) {
          if (i.children) {
            // 有子集，递归children
            // 若children中不存在有权限的元素，将会得到一个空数据，由于此问题不影响菜单显示，暂不处理。
            arr.push({
              ...i,
              children: createMenu(i.children, authList),
            });
          } else {
            // 无子集
            arr.push(i);
          }
        }
      });
      return arr;
    };
    let finalMenu = createMenu(ALL_MENU_LIST,authListTemp);
    state.authlist = { ...authListTemp, login: true };
    LS.set('authlist', {
      ...authListTemp,
      login: true,
    });

    state.menulist = finalMenu;
    LS.set('menulist', finalMenu);
  },
//   SET_BTNAUTH: (state, permission) => {
//     let btAuthListTemp = {};
//     // 按钮权限
//     permission.forEach((i1) => {
//       if (BT_AUTH_lIST[i1.subPath]) {
//         // let v = BT_AUTH_lIST[i1.subPath + '&&' + i1.actionName];
//         let v = BT_AUTH_lIST[i1.subPath];
//         // 分String和Array分别处理，详见pathAuth.js
//         if (typeof v == 'string' && v.constructor == String) {
//           btAuthListTemp[v] = true;
//         } else if (typeof v == 'object' && v.constructor == Array) {
//           v.forEach((i) => {
//             btAuthListTemp[i] = true;
//           });
//         }
//       }
//     });
//     state.btnAuthList = btAuthListTemp;
//     LS.set('btnAuthList', btAuthListTemp);
//   },
//   SET_DICTLIST: (state, data) => {
//     state.dictlist = data;
//     LS.set('dictlist', data);
//   },
  SET_TOKEN: (state, token) => {
    state.token = token;
    SS.set('token', token);
    LS.set('token', token);
  },
  SET_USERINFO: (state, data) => {
    state.userinfo = data;
    LS.set('userinfo', data);
  },
  CLEAR_UESR: (state) => {
    state = {};
    LS.clear();
    SS.clear();
  },
};

const actions = {
//   setDictList({ commit }, data) {
//     return new Promise((resolve, reject) => {
//       LoginService.getDictlist().then((res) => {
//         res && commit('SET_DICTLIST', res);
//         resolve();
//       });
//     });
//   },
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
    //   LoginService.postLogin({ ...data })
         LoginService.postLogin({username:'bc-1-test1',code:'2',codeKey:'2',password:'000000' })
        .then((res) => {
          if (!res) {
            res = {};
          }
          res && commit('SET_USERINFO', res);
          res.accessToken && commit('SET_TOKEN', res.accessToken);
          res.permissions && commit('SET_MENU', res.permissions);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
//   loginOut({ commit }) {
//     return new Promise((resolve, reject) => {
//       LoginService.logout()
//         .then(() => {
//           commit('CLEAR_UESR');
//           resolve();
//         })
//         .catch((error) => {
//           console.log('登出失败');
//           reject(error);
//         });
//     });
//   },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
