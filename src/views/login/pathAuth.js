/* 
>>后台路径与路由权限映射表，方便生成路由权限表。
>>key为后台接口数据中的路径，value为路由的name。
>>默认value为string，表示该路径对应一个路由，当为Array时，表示该路径为子路由下的请求路径，则父路由权限也应予以开放。
>>请保持格式整齐，缩进为2。
*/
// 系统账户的菜单权限
let sysMenu = {
  "/v1/tos/tenant/list": ['tenantConfig-list', "tenantConfig-detail"], // 租户配置
}
export default {
  "/cpm/archives": ["archives", "archives-add", "archives-perfect"], // 新建档案、档案详情
  "/cpm/archives/detail": "archives-details", // 档案概览
  "/cpm/archives/list": ["archives", "archives-list", "workBench"], // 档案列表，工作台
  "/cpm/archives-batch": ["archives", "archives-batch"], // 批量建档
  "/cpm/prices/list": "price-management", // 价格管理
  "/cpm/prices": "price-management", // 价格管理
  "/cpm/address-areas/list": "address-areas", // 小区管理
  "/cpm/charge/recharge": "single-recharge", // 单户缴费
  "/sns/announcement": "systemNotification",//系统公告 - FEAT: update: cpm -> sns
  // "/etf/gas/usage-quantity/chart": "report",//报表首页(只有首页的某一接口存在应显示首页)
  // 报表
  "/etf/gas/usage-quantity/price/preview": ["report-useGas", "report"],//用气报表
  "/etf/gas/usage-quantity/archives/preview": ["report-useGas", "report"],//用水报表
  "/etf/expense/recharge-summary/preview": ["report-costPay", "report"],//收费报表
  "/cpm/report/balance-detail/preview": ["report-account", "report"],//账户报表
  "/cpm/report/unused-gas/preview": ["report-error", "report"],//异常报表
  "/cpm/report/no-upload/preview": ["report-error", "report"],//异常报表
  "/cpm/report/open-account/preview": ["report-other", "report"],//其他报表
  "/etf/notify/sms/preview": ["report-smsStatistics", "report"],//短信统计报表
  "/etf/notify/sms-system/preview": ["report-smsStatistics", "report"],//短信统计报表
  "/cpm/charge-batch/recharge": "batch-recharge", // 批量缴费
  "/cpm/icCard/icCardArchives": ["ic-card", "ic-card-list"], // IC卡管理
  "/cpm/icCard/getIcCardDetails": ["ic-card", "ic-card-detail"], // IC卡详情
  "/cpm/icCard/priceCard": ["ic-card", "price-card"], // 调价卡管理
  "/cpm/icCard/doubleWayPriceCard": ["ic-card", "double-price-card"], // 双通道调价卡管理
  "/cpm/device-monitor/meter-list": ["monitor", "meter-monitor"], //表具监控
  "/cpm/code/command-batch-list": ["monitor", "batch-orders-monitor"], //批量指令监控
  "/cpm/code/command-batch-detail": ["monitor", "batch-orders-monitor-detail"], //批量指令监控详情
  "/cpm/prices/adjust-list": ["monitor", "batch-adjust-monitor"], //批量调价监控
  "/cpm/prices/adjust-detail": ["monitor", "batch-adjust-monitor-detail"], //批量调价监控详情
  "/cpm/device-monitor/duplicate-meter/list": ["monitor", "repeat-meter-management"], // FEAT: 重复表具管理列表
  "/cpm/device-monitor/del-duplicate-meter": ["monitor", "repeat-meter-management"], // FEAT: 删除tb平台设备
  "/cpm/device-monitor/meter-detail": ["monitor", 'meter-monitor-detail'], //表具监控详情
  // "/cpm/device-monitor/collection": ["monitor", 'meter-monitor-detail'],
  "/auth/authz/permission/group/sys/tree": ['basicInfo-management', 'permission-maintain',],// 权限维护
  '/v1/tos/templaterole/create': ['basicInfo-management', 'template-maintain'],//模板维护
  '/v1/tos/roletemplate/create': ['basicInfo-management', 'template-maintain'],//模板维护
  '/cpm/manufacturer/manufacturerList': ['basicInfo-management', 'table-info-maintain'],//表信息维护
  '/sns/message/template/list': ['basicInfo-management', "message-basic-configuration"],//消息基础配置
  "/sns/message/tenant/notify-biz-list": ['system-settings', 'message-business-manage'],//消息业务管理
  "/cpm/invoiceSaler/details": ['system-settings', "sales-info-manage"],//销方信息
  "/cpm/taxRate/taxRateList": ['system-settings', "tax-manage"],  // 税率管理
  "/cpm/sysdata/get-sysparalist": ['system-settings', 'system-parameter-setting'],//系统参数设置
  "/v1/tos/role/list": ["orgin-management", "role-manage"],//角色管理
  "/v1/tos/staff/list": ["orgin-management", 'depart-staff-manage'],//部门员工管理
  '/cpm/code/archives/commandlist': ['system-settings', 'account-open-set-config'],//开户指令集配置
  '/cpm/alarm/list': ['system-settings', 'alarm-parameter-setting'],//报警参数设置
  ...sysMenu,
}