import service from './baseAPI'

let userBaseUrl = process.env.VUE_APP_USERAPI_BASE_URL;

//获取系统数据字典
export function getsysdatasortlist(parameter) {
  return service({
    url: '/loaddata/cpmtest/sysdata/getsysdatalist',
    method: 'get',
    params: parameter,
    baseURL: userBaseUrl
  })
}

//获取验证码
export function getCodeImg(parameter) {
  return service({
    url: 'auth/authn/code',
    method: 'post',
    baseURL: userBaseUrl
  })
}

//登录  1.5.0迭代中添加客户端证书认证 加请求头
export function postLogin(parameter,headers) {
  return service({
    url: 'auth/aggregation/login?account=' + parameter.username + '&code=' + parameter.code + '&codeKey=' + parameter.codeKey + '&password=' + encodeURIComponent(parameter.password)  + '',
    method: 'POST',
    baseURL: userBaseUrl,
    headers:{...headers}
  })
}
// 运维登录
export function omLogin(parameter) {
  return service({
    url: 'auth/aggregation/om/login?account=' + parameter.username + '&code=' + parameter.code + '&codeKey=' + parameter.codeKey + '&password=' + encodeURIComponent(parameter.password) + '',
    method: 'POST',
    baseURL: userBaseUrl
  })
}
//登出
export function postlogout() {
  return service({
    url: 'auth/session/logout',
    method: 'POST'
  })
}
//租户业务配置
export function getTenantDetail(parameter) {
  return service({
    url: 'v1/tos/tenant/detail',
    method: 'get',
    params: parameter,
    baseURL: userBaseUrl
  })
}

//获取租户所在省份
export function getTenantPlace(parameter) {
  return service({
    url: 'v1/tos/organization/detail',
    method: 'get',
    params: parameter,
    baseURL: userBaseUrl
  })
}

//获取租户所在省份系统级
export function getTenantPlace_sys(parameter) {
  return service({
    url: '/v1/tos/organization/sys/detail',
    method: 'get',
    params: parameter,
    baseURL: userBaseUrl
  })
}

// 租户账户修改自身的密码
export function tenantUpdatePass(parameter) {
  return service({
    url: 'auth/aggregation/password/tenant/update',
    method: 'POST',
    params: parameter,
    baseURL: userBaseUrl
  })
}
// 管理员修改自己的密码
export function adminUpdatePass(parameter) {
  return service({
    url: 'auth/aggregation/password/sys/update',
    method: 'POST',
    params: parameter
  })
}
// 脚注
export function footerInfo(parameter) {
  return service({
    url: 'v1/tos/tenant/welcome',
    method: 'GET',
    params: parameter
  })
}