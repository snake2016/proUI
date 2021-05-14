/* 
此文件导出路由中所有的name，代表管理员拥有所有的权限
*/
import {routes} from '@/router/router.config.js'
import menuList from './menuList.js'

let authResult = {};

let exportAuth = (arrTemp) => {
  if (arrTemp instanceof Array) {
    arrTemp.forEach(item => {
      if (item.name) {
        authResult[item.name] = true;
      } else {
      }
      // 递归children数组
      if (item.children && item.children.length) {
        exportAuth(item.children);
      }
    })
  }
}

exportAuth(routes);
exportAuth(menuList);

export default authResult