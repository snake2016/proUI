/*
 * @Author: spp
 * @Date: 2021-04-30 16:51:22
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 10:36:04
 * @FilePath: \proUI\src\store\getters.js
 */
const getters = {
    isCollapse: state => state.app.isCollapse,
    permission_routes: state => state.permission.menulist,
    openTabs: (state) => state.tagsView.openTabs,
    activeIndex: (state) => state.tagsView.activeIndex,
  }
  export default getters
  