/*
 * @Author: spp
 * @Date: 2021-05-07 11:47:58
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 16:53:38
 * @FilePath: \proUI\src\router\modules\archives.js
 */
export default [
  {
    path: "/archives",
    name: "archives",
    title: "档案",
    icon: "el-icon-s-tools",
    meta:{
        title: "档案", 
    },
    children: [
      {
        path: "archives-list",
        name: "archives-list",
        title: "档案管理",
        icon: "el-icon-s-cooperation",
        component: () => import("@/views/archives/list/index.vue"),
        meta:{
            title: "档案管理",
            fullPathTitle:"档案/档案管理",
            parentPath:'/archives'
        }
      },
      {
        path: "address-areas",
        name: "address-areas",
        title: "小区管理",
        icon: "el-icon-menu",
        component: () => import("@/views/addressAreas/index.vue"),
        meta:{
            title: "小区管理",
            fullPathTitle:"档案/小区管理",
            parentPath:'/archives'
        }
      },
    ]
  },
]