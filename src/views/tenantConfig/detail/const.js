/*
 * @Author: spp
 * @Date: 2021-01-11 16:44:45
 * @LastEditors: wangpc
 * @LastEditTime: 2021-01-25 11:31:14
 * @FilePath: \ui - 副本\src\views\tenantConfig\detail\const.js
 */
export const basic_config_type_fa = [{
    label: '允许', value: '1'
},{
    label: '禁止', value: '0'
}]

export const basic_config_type_yn = [{
    label: '是', value: '1'
},{
    label: '否', value: '0'
}]

export const basic_temple_config=[
    {key:'is_allow_define_cyc_surplus',label:'是否允许自定义各阶余量重置策略',typeOptions:basic_config_type_fa},
    {key:'is_allow_define_initial_cyc_qty',label:'是否允许自定义初始周期累积量',typeOptions:basic_config_type_fa},
    {key:'is_allow_month_avg',label:'是否允许阶梯价开启按月均摊',typeOptions:basic_config_type_fa},
    {key:'is_allow_population_ladder',label:'是否允许阶梯价开启人口阶梯',typeOptions:basic_config_type_fa},
    {key:'is_need_sms',label:'是否开通短信',typeOptions:basic_config_type_yn},
    {key:'is_need_wechat',label:'是否开通微信',typeOptions:basic_config_type_yn},
    {key:'need_gas_receipt',label:'是否需要补气收据',typeOptions:basic_config_type_yn},
    {key:'need_open_operator',label:'是否需要点火操作',typeOptions:basic_config_type_yn},
    {key:'is_invoice_enabled',label:'是否开通发票',typeOptions:basic_config_type_yn},
    {key:'is_merge_olbh_enabled',label:'是否合并网厅数据',typeOptions:basic_config_type_yn},
    {key:'is_login_verify_enabled',label:'是否启用登录校验',typeOptions:basic_config_type_yn}
]