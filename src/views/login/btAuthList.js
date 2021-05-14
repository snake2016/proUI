/*
按钮权限
路径--按钮权限名称
路径+'&&'+method类型
为了方便，这里按钮名称直接写中文了。
*/
export default {
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
  "/etf/gas/collection/preview&&post": "other_collection",//采集记录-采集记录
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