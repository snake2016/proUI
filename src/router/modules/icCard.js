/*
 * @Author: spp
 * @Date: 2021-05-07 11:47:58
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 13:40:05
 * @FilePath: \proUI\src\router\modules\icCard.js
 */
export default [
{
    path: "/ic-card",
    name: "ic-card",
    title: "IC卡",
    icon: "el-icon-s-goods",
    meta:{
        title: "IC卡",
    },
    children: [
      {
        path: "ic-card-list",
        name: "ic-card-list",
        component: () => import("@/views/icManager/icCard/list/index.vue"),
        title: "IC卡管理",
        icon: "ic-card-list",
        meta:{
            title: "IC卡管理",
            fullPathTitle:"IC卡/IC卡管理",
            parentPath:'/ic-card'
        },
      },
      {
        path: "price-card",
        name: "price-card",
        component: () => import("@/views/icManager/priceCard/index.vue"),
        title: "调价卡管理",
        icon: "price-card",
        meta:{
            title: "调价卡管理",
            fullPathTitle:"IC卡/调价卡管理",
            parentPath:'/ic-card'
        },
      },
      {
        path: "double-price-card",
        name: "double-price-card",
        component: () => import("@/views/icManager/doublePriceCard/index.vue"),
        title: "双通道调价卡管理",
        icon: "double-price-card",
        meta:{
            title: "双通道调价卡管理",
            fullPathTitle:"IC卡/双通道调价卡管理",
            parentPath:'/ic-card'
        },
      },
      {
        path: "ic-card-detail",
        name: "ic-card-detail",
        component: () => import("@/views/icManager/icCard/detail/index.vue"),
        title: "IC卡详情",
        ismenu:false,
        meta:{
            title: "IC卡详情",
            fullPathTitle:"IC卡/IC卡管理/IC卡详情",
            parentPath:'/ic-card'
        },
      }
    ]
  }
]