/*
 * @Author: spp
 * @Date: 2021-04-30 17:09:42
 * @LastEditors: spp
 * @LastEditTime: 2021-05-13 16:47:07
 * @FilePath: \proUI\src\consts\authPath.js
 */

// 系统账户的菜单权限
const ROUTER_AUTH_LIST =  {
    "/cpm/archives": ["archives", "archives-add", "archives-perfect"], // 新建档案、档案详情
    "/cpm/archives/detail": "archives-details", // 档案概览
    "/cpm/archives/list": ["archives", "archives-list", "workBench"], // 档案列表，工作台
    "/cpm/archives-batch": ["archives", "archives-batch"], // 批量建档
    "/cpm/prices/list": "price-management", // 价格管理
    "/cpm/prices": "price-management", // 价格管理
    "/cpm/address-areas/list": "address-areas", // 小区管理
    "/cpm/charge/recharge": "single-recharge", // 单户缴费
    "/sns/announcement": "systemNotification",//系统公告 - FEAT: update: cpm -> sns
    "/etf/gas/usage-quantity/chart": "report",//报表首页(只有首页的某一接口存在应显示首页)
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
    "/cpm/device-monitor/collection": ["monitor", 'meter-monitor-detail'],
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
    "/v1/tos/tenant/list": ['tenantConfig-list', "tenantConfig-detail"], // 租户配置
  }

  /* 按钮权限  路径--按钮权限名称   路径+'&&'+method类型  为了方便，这里按钮名称直接写中文了。*/
  const BT_AUTH_LIST ={
    // 示例："/cpm/a": "缴费", "/cpm/b": ["批量缴费", "缴费"],
    /* 
    按钮操作一般为创建add、删除delete、修改modify、查询search，
    编码命名规则为页面名称-按钮名称（页面名称router.config.js中的name）
    */
    "/cpm/other-cost/list&&post": "other",
    "/cpm/charge/cancel-recharge&&post": "cancelRecharge",
    "/cpm/icCard/infos&&get": "读卡",
    "/cpm/icCard/openCard&&post": "制卡",
    "/cpm/icCard/patchCard&&post": "补卡",
    "/cpm/icCard/clearCard&&post": "回收卡",
    // 租户配置
    "/auth/aggregation/password/sys/manage/update&&post": "修改租户密码",
    "/v1/tos/tenant/modify&&put": "修改租户",
    "/v1/tos/tenant/create&&post": "新增租户",
    "/cpm/device-type/grant&&post": "表类型授予",
    "/cpm/device-type/cancel&&post": "表类型撤销",
    "/v1/tos/orgstruture/choose&&put": "组织机构分配",
    "/auth/authz/permission/scope/set&&post": "权限分配",
    "/v1/tos/tenant/enable&&put": "启用租户",
    "/v1/tos/tenant/disable&&put": "禁用租户",
    // 价格管理
    "/cpm/prices&&post": "priceManagement_add",//新增价格
    "/cpm/prices&&put": "priceManagement_edit",//编辑
    "/cpm/prices&&delete": "priceManagement_delete",//删除
    "/cpm/prices/adjust&&post": "priceManagement_modify",//调价
    "/cpm/prices/enable&&put": "priceManagement_enable",//启用
    "/cpm/prices/disable&&put": "priceManagement_disable",//禁用
    // 档案详情
    "/cpm/archives/build&&put": "点火",
    "/cpm/archives/disable&&put": "停用",
    "/cpm/archives/enable&&put": "启用",
    "/cpm/archives/change-user&&put": "过户",
    "/cpm/user&&post": "标记黑名单",
    "/cpm/user&&put": "取消黑名单",
    "/cpm/archives&&put": "修改档案",
    "/cpm/archives/last-disable-reason&&get": "查询档案上次停用原因",
    "/cpm/archives/close&&put": "销档",
    "/cpm/archives/change-meter&&put": "换表",
    "/cpm/archives/change-dtu&&put": "更换DTU",
    "/cpm/archives/change-meter-type&&put": "更换模组",
    "/cpm/archives/change-price&&put": "换价",
    "/cpm/archives/history-price&&get": "查询历史价格",
    "/cpm/other-cost/register&&post": "登记其他费用",
    "/cpm/charge/reissue&&post": "远传表补气",
    "/cpm/charge/recharge&&post": "远传表充值",
    "/cpm/icCharge/icChargeConfirm&&post": "ic卡充值",
    "/cpm/archives/costrecords&&post": 'payment_details',//缴费明细
    "/cpm/archives/settle-detail&&post": 'settle_detail',//结算明细(用气明细)
    "/cpm/archives/modifyrecords&&post": 'archives_record',//结算明细(用气明细)
    "/cpm/archives/alarmrecords&&post":"archives_alarm",//报警
    // 工作台
    "/cpm/archives&&post": "archives-add",//单户建档
    "/cpm/archives-batch&&post": "archives-batch",//批量建档
    "/cpm/device-monitor/meter-list&&post": "monitor",//表具监控
    "/cpm/charge-batch/recharge&&post": "batch-recharge",//批量缴费
    // 表具监控
    "/cpm/alarm/restore-alarm-record&&post": "meterMonitor_restore",//标记为已恢复
    "/cpm/code/cancel-command&&put": "meterMonitor_cancel",//取消发送
    "/cpm/code/resend-command&&put": "meterMonitor_resend",//取消发送
    "/cpm/code/web/send&&post": "meterMonitor_command",//指令下发
    "/cpm/code/command-detail-list&&post": "instruction_details",//指令明细
    "/cpm/alarm/get-alarmrecord&&post": "alarm_details",//报警明细
    "/cpm/device-monitor/detail-log&&post": "meterMonitor_record",//日志
    "/cpm/device-monitor/collection&&post": "collection_record",//采集记录
    // 小区管理
    "/cpm/address-areas&&put": "addressAreas_modify",//修改
    // 系统设置
    "/sns/message/tenant/notify-biz-setting&&post": "messageBusinessManage_modify",//修改消息业务
    "/cpm/invoiceSaler/save&&post": "salesInfoManage_modify",//销方信息管理
    "/cpm/taxRate/taxRateAdd&&post": "taxManage_add",//新增税率
    "/cpm/taxRate/taxRateModify&&post": "taxManage_modify",//编辑税率
    "/cpm/taxRate&&delete": "taxManage_delete",//删除税率
    "/cpm/sysdata/create-syspara&&post": "systemParameterSetting_modify",//系统参数设置
    // 系统信息维护
    "/v1/tos/templaterole/create&&post": "templateRole_add",//新建模板角色
    "/v1/tos/templaterole/modify&&put": "templateRole_modify",//编辑模板角色
    "/v1/tos/templaterole/delete&&delete": "templateRole_delete",//编辑模板角色
    "/v1/tos/roletemplate/create&&post": "templateRoles_add",//新建模板角色组
    "/v1/tos/roletemplate/modify&&put": "templateRoles_modify",//编辑模板角色组
    "/v1/tos/roletemplate/delete&&delete": "templateRoles_delete",//编辑模板角色组
    "/cpm/manufacturer&&post": "meterManufacturer_add",//新建表具厂商
    "/cpm/manufacturer&&put": "meterManufacturer_modify",//修改
    "/cpm/meterType&&post": "meterType_add",//新增表具类型
    "/cpm/meterType&&put": "meterType_modify",//修改
    "/cpm/dtu-type&&post": "dtuType_add",//新增dtu类型
    "/cpm/dtu-type&&put": "dtuType_modify",//修改
    "/cpm/icCardType&&post": "ICcardType_add",//新增ic卡类型
    "/cpm/icCardType&&put": "ICcardType_modify",//修改
    "/sns/message/template&&post": "messageTemplate_add",//新增消息模板
    "/sns/message/template&&delete": "messageTemplate_delete",//删除
    "/sns/message/sign&&post": "messageSign_add",//新增短信签名
    "/sns/message/sign&&delete": "messageSign_delete",//删除
    // 组织管理
    "/v1/tos/role/create&&post": "roleManage_add",//创建新角色
    "/v1/tos/role/templateroles/apply&&post": "roleManage_apply",//应用模板角色
    "/v1/tos/role/roletemplate/apply&&post": "roleManage_applys",//应用模板角色组
    "/v1/tos/role/delete&&delete": "roleManage_delete",//删除角色
    "/v1/tos/role/modify&&put": "roleManage_modify",//修改角色
    "/v1/tos/staff/create&&post": "departStaffManage_addstaff",//新增员工
    "/v1/tos/staff/modify&&put": "departStaffManage_modifystaff",//修改员工信息
    "/v1/tos/organization/create&&post": "departStaffManage_addorg",//新增部门
    "/v1/tos/organization/modify&&put": "departStaffManage_modifyorg",//编辑部门信息
    "/v1/tos/organization/lock&&put": "departStaffManage_lock",//锁定
    "/v1/tos/organization/unlock&&put": "departStaffManage_unlock",//解除锁定
    "/v1/tos/organization/delete&&delete": "departStaffManage_deleteorg",//删除组织机构
    "/auth/aggregation/password/tenant/manage/update&&post": "departStaffManage_modifypass",//修改密码
    //报表
    "/cpm/chart/open-account&&post": "report_open",//开户建档趋势
    "/etf/gas/usage-quantity/chart&&post": "report_usegas",//用气趋势
    "/cpm/chart/reading-meter&&post": "report_reading",//抄表率趋势图
    "/cpm/report/open-account/preview&&post": "other_open",//其他报表-开户建档
    "/etf/reading/meter-reading/preview&&post": "other_reading",//其他报表-抄表率
    "/etf/gas/collection/preview&&post": "other_collection",//其他报表-采集记录
    "/cpm/report/archives-operator/close/preview&&post": "other_destruction",//其他报表-销档
    "/cpm/report/archives-operator/change-user/preview&&post": "other_transfer",//其他报表-过户
    "/cpm/report/archives-operator/change-meter/preview&&post": "other_changewatch",//其他报表-换表
    "/etf/gas/usage-quantity/price/preview&&post": "use_price",//用气量报表-单价
    "/etf/gas/usage-quantity/archives/preview&&post": "use_archives",//用气量报表-档案
    "/etf/gas/usage-quantity/region/preview&&post": "use_region",//用气量报表-区县小区
    "/etf/gas/usage-quantity/archives-day/preview&&post": "use_day",//用气量报表-档案+天
    "/cpm/report/arrears/preview&&post": "error_arrears",//异常类报表-欠费
    "/cpm/report/valve-closed/preview&&post": "error_valve",//异常类报表-关阀
    "/cpm/report/unused-gas/preview&&post": "error_gas",//异常类报表-不用气
    "/cpm/report/low-battery/preview&&post": "error_battery",//异常类报表-电量不足
    "/cpm/report/interfere/preview&&post": "error_interfere",//异常类报表-电磁干扰
    "/cpm/report/no-upload/preview&&post": "error_upload",//异常类报表-不上传
    "/cpm/report/power-down/preview&&post": "error_power",//异常类报表-掉电
    // 打印
    "/cpm/invoice/opening-invoice&&post": "打印发票",
    "/cpm/invoice/getPDF&&get": "补打发票", // 补打发票、打印红票
    "/cpm/charge/charge-print-info&&post": "打印票据",
    "/cpm/invoice/redhash-invoice&&post": "发票红冲",
  
    "/cpm/charge/cancel-reissue&&post": "远传表取消补气",
    "/cpm/other-cost/cancel&&post": "取消其他费用",
  
    // 证书
    "/v1/tos/loginverify/create&&post" :"新增证书",
    "/v1/tos/loginverify/list&&get" :"查看证书",
    "/v1/tos/loginverify/delete&&delete":"删除证书"
  }

  export {
    ROUTER_AUTH_LIST,
    BT_AUTH_LIST,
  }