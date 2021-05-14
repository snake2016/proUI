/*
 * @Author: spp
 * @Date: 2021-04-19 14:49:32
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 16:52:05
 * @FilePath: \proUI\src\router\router.config.js
 */
/*
*整个项目菜单和按钮树，前端维护完善
*路由name必须存在且唯一，组件内的name与此name对应，tab和路由缓存均以name为准
*isMenu用于判断是否是头部菜单项，gcNavMenu组件使用，1 是菜单  0 不是菜单
*isMenu 为1时，必须在mete中加入icon属性，用于显示菜单前面图片显示
*/

// 导入各模块路由
const modulesFiles = require.context('./modules', true, /\.js$/)
const modChildren = []

modulesFiles.keys().map((key) => {
  const array = modulesFiles(key).default || []
  modChildren.push(...array);
})

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: () =>import("@/views/login/index.vue")
    },
    {
        path: "/",
        name: "layout",
        component: () => import("@/layout/index.vue"),
        redirect: "/login",
        children: [
            ...modChildren,
            {
                path: "workBench",
                name: "workBench",
                component: () => import("@/views/workBench/index.vue"),
                meta: {
                    'title': '工作台',
                    'isMenu': 1,
                    'icon': "workbench",
                }
            },
        ]
    }
];

export const ALL_MENU_LIST=routes[1].children