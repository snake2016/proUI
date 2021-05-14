/*
此处为完整的菜单列表，
根据权限在登录组件中筛选
childNum为子集导航数量
icon必须写上，用于菜单栏前面的图标,icon命名必须为path字段中的第一个单词
sysAdmin:系统管理员
*/
export default [
  {
    path: "/workBench",
    name: "workBench",
    title: "工作台",
    childNum: 0,
    icon: "workbench",
  },
  {
    path: "/tenantConfig-list",
    name: "tenantConfig-list",
    title: "租户配置",
    sysAdmin: true,
    childNum: 0,
    icon: "tenantConfig",
  },
  {
    path: "/archives",
    name: "archives",
    title: "档案",
    icon: "archives",
    sysAdmin: true,
    childNum: 1,
    children: [
      {
        path: "/archives-list",
        name: "archives-list",
        title: "档案管理",
        icon: "archives",
        sysAdmin: true,
      },
      {
        path: "/address-areas",
        name: "address-areas",
        title: "小区管理",
        icon: "archives",
      },
    ]
  },
  {
    path: "/ic-card",
    name: "ic-card",
    title: "IC卡",
    icon: "ic-card",
    childNum: 1,
    children: [
      {
        path: "/ic-card-list",
        name: "ic-card-list",
        title: "IC卡管理",
        icon: "ic-card-list",
      },
      {
        path: "/price-card",
        name: "price-card",
        title: "调价卡管理",
        icon: "price-card",
      },
      {
        path: "/double-price-card",
        name: "double-price-card",
        title: "双通道调价卡管理",
        icon: "double-price-card",
      },
    ]
  },
  {
    path: "/monitor",
    name: "monitor",
    title: "监控",
    icon: "monitor",
    sysAdmin: true,
    childNum: 1,
    children: [
      {
        path: "/meter-monitor",
        name: "meter-monitor",
        title: "表具监控",
        icon: "monitor",
        sysAdmin: true,
      },
      {
        path: "/batch-orders-monitor",
        name: "batch-orders-monitor",
        title: "批量指令监控",
        icon: "monitor",
        sysAdmin: true,
      },
      {
        path: "/batch-adjust-monitor",
        name: "batch-adjust-monitor",
        title: "批量调价监控",
        icon: "monitor",
        sysAdmin: true,
      },
      {
        path: "/repeat-meter-management",
        name: "repeat-meter-management",
        title: "重复表具管理",
        icon: "monitor",
        sysAdmin: true,
      }
    ]
  },

  {
    path: "/basicInfo-management",
    name: "basicInfo-management",
    title: "系统信息维护",
    icon: "basicInfo",
    sysAdmin: true,
    childNum: 1,
    children: [
      {
        path: "/permission-maintain",
        name: "permission-maintain",
        title: "权限维护",
        sysAdmin: true,
        icon: "basicInfo"
      },
      {
        path: "/template-maintain",
        name: "template-maintain",
        title: "模板维护",
        sysAdmin: true,
        icon: "basicInfo",
      },
      {
        path: "/table-info-maintain",
        name: "table-info-maintain",
        title: "表信息维护",
        sysAdmin: true,
        icon: "basicInfo",
      },
      {
        path: "/message-basic-configuration",
        name: "message-basic-configuration",
        title: "消息基础配置",
        sysAdmin: true,
        icon: "basicInfo",
      },
    ]
  },
  {
    path: "/system-settings",
    name: "system-settings",
    title: "系统设置",
    icon: "setting",
    childNum: 1,
    children: [
      {
        path: "/account-open-set-config",
        name: "account-open-set-config",
        title: "开户指令集配置",
        icon: "setting",
      },
      {
        path: "/alarm-parameter-setting",
        name: "alarm-parameter-setting",
        title: "报警参数配置",
        icon: "setting",
      },
      {
        path: "/message-business-manage",
        name: "message-business-manage",
        title: "消息业务管理",
        icon: "basicInfo"
      },
      {
        path: "/system-parameter-setting",
        name: "system-parameter-setting",
        title: "系统参数设置",
        icon: "basicInfo",
      },
      {
        path: "/sales-info-manage",
        name: "sales-info-manage",
        title: "销方信息管理",
        icon: "setting",
      },
      {
        path: "/tax-manage",
        name: "tax-manage",
        title: "税率管理",
        icon: "setting",
      },
    ]
  },
  {
    path: "/price-management",
    name: "price-management",
    title: "价格管理",
    icon: "priceManagement",
    childNum: 0
  },
  {
    path: "/systemNotification",
    name: "systemNotification",
    title: "系统公告",
    icon: "systemNotification",
    sysAdmin: true,
    childNum: 0
  },
  {
    path: "/system-user-set",
    name: "system-user-set",
    title: "系统用户设置",
    icon: "userManage",
    sysAdmin: true,
    childNum: 1,
    children: [
      {
        path: "/system-user-set-list",
        name: "system-user-set-list",
        title: "系统用户列表",
        icon: "userManage",
        sysAdmin: true,
      },
      {
        path: "/system-user-set-roleManage",
        name: "system-user-set-roleManage",
        title: "系统角色管理",
        icon: "userManage",
        sysAdmin: true,
      },
    ]
  },
  {
    path: "/report-home",
    name: "report",
    title: "报表",
    icon: "report",
    sysAdmin: true,
    childNum: 0
  },
  {
    path: "/orgin-management",
    name: "orgin-management",
    title: "组织管理",
    icon: "ori",
    childNum: 1,
    children: [
      {
        path: "/role-manage",
        name: "role-manage",
        title: "角色管理",
        icon: "ori"
      },
      {
        path: "/depart-staff-manage",
        name: "depart-staff-manage",
        title: "部门员工管理",
        icon: "ori",
      }
    ]
  },
]