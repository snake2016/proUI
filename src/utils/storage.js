/*
 * @Author: spp
 * @Date: 2021-05-06 14:20:56
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 16:26:33
 * @FilePath: \proUI\src\utils\storage.js
 */

// 封装模块 使用localStorage实现持久化 只是进行保存
// 从localStorage中取出一项数据 名字叫name
export const LS = {
    get: (name) => {
      //  兼容 JSON.parse(undefined) 报错 Uncaught SyntaxError: Unexpected token u in JSON at position 0
      return localStorage.getItem(name) && JSON.parse(localStorage.getItem(name));
    },
    set: (name, obj) => {
      localStorage.setItem(name, JSON.stringify(obj));
    },
    remove: (name) => {
      localStorage.removeItem(name);
    },
    clear: () => {
      localStorage.clear();
    },
  };
  
  // sessionStorage的存储
  export const SS = {
    get: (name) => {
      let result = sessionStorage.getItem(name);
      try {
        result = JSON.parse(sessionStorage.getItem(name));
      } catch (error) {}
      if (result && result.indexOf('null') > -1) {
        result = null;
      }
      return result;
    },
    set: (name, obj) => {
      sessionStorage.setItem(name, JSON.stringify(obj));
    },
    remove: (name) => {
      sessionStorage.removeItem(name);
    },
    clear: () => {
      sessionStorage.clear();
    },
  };
  