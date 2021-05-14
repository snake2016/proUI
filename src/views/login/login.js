import menuList from "./menuList.js";
import pathAuth from "./pathAuth.js";
import allAuthList from "./allAuthList.js";
import btAuthList from "./btAuthList.js";
import {
  omLogin,
  postLogin,
  getCodeImg,
  getTenantPlace,
  getTenantDetail,
  footerInfo
} from "@/api/loginAPI";
import {loginverifyEnabled} from "@/api/tenantConfigAPI";
import {
  DataList
} from "@/api/archivesAPI.js";
export default {
  name: "Login",
  data() {
    return {
      timer: null,
      isHide: false,
      subLoading: false,
      enterkeyFlag: false,
      form: {
        username: "",
        password: "",
        code: "",
        codeKey: ""
      },
      codeImg: "",
      btnText: "立即登录",
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "change" },
          {
            max: 32,
            message: "最多32个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" },
          {
            max: 18,
            message: "最多18个字符",
            trigger: "change"
          }
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
          {
            max: 4,
            message: "最多4个字符",
            trigger: "change"
          }
        ]
      },
      menuList: [],
      // footer: "",
      errCodeList: {
        "1": "此用户尚未分配权限，请联系管理员。",
        "2": "此账号权限为空，请联系管理员。"
      },
      isNeedCertify:false
    };
  },
  // FEAT: 进入 login 页面, 断开 notice websocket 连接
  // 不在登出断开连接的原因是要兼容 “账号长时间未登录或在别处登录” 的情况
  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
        // 1.5.0迭代 处理浏览器多tab登录问题
        let localToken=vm.$ls.get('accessToken') 
        if(localToken){   
            vm.goHome();
            sessionStorage.setItem('accessToken', (localToken+'_auto'))
        }
      const isConnected = vm.$store.state.socket.isConnected
      if (isConnected) {
        vm.$disconnect()
        delete vm.$options.sockets.onmessage
      }
    })
  },
  mounted() {
    this.loadCodeImg();
    let _this=this;
    // 等后台程序加载完成后进行认证必要性判断
    window.onload=function(){
        // 1.5.0 客户端认证
        let subdomain=location.host.split('.')[0]
        if(subdomain!=='manage'){
            // _this.getisNeedCertify('shuiwu02')
            _this.getisNeedCertify(subdomain)
        }
    }
    // 页面关闭时关闭后台程序 刷新时也会进入
    // window.onbeforeunload=function(){
    //     window.postMessage({ type: "FROM_PAGE", method: "close"}, "*");
    // }
    // 监听后台系统推动的认证信息
    window.addEventListener("message", function(event) {
        if (event.data.type && event.data.type == "FROM_CS"){
            let response=event.data.text;
            if(response.key && response.request.rnd){
                window.login_r_code=response;
                _this.login()
            }
        }
    })
    // this.loadFooterInfo();
  },
  methods: {
    // 获取验证码
    loadCodeImg() {
      getCodeImg()
        .then(res => {
          if (res.data.code == 0) {
            let datas = res.data.data;
            this.form.codeKey = datas.codeKey;
            this.codeImg = datas.codeImage;
          }
        })
        .catch(res => {
          this.$message.error("获取验证码失败！");
          console.warn(res);
        });
    },
    // 先判断该租户是否开启校验配置
    getisNeedCertify(subdomain){
      loginverifyEnabled(subdomain)
        .then(res => {
          if (res.data.code == 0) {
            this.isNeedCertify = res.data.data.is_enabled;
            if( res.data.data.is_enabled){
                window.postMessage({ type: "FROM_PAGE", method: "connect",text:{"connect":"true"}}, "*");
                window.postMessage({ type: "FROM_PAGE", method: "send",text:{"cmd":"preLoad"}}, "*");
            }
          }else{
            this.$message.error(res.data.message); 
            console.warn(res.data);
          }
        })
        .catch(res => {
          this.$message.error("获取租户登录校验配置失败！");
          console.warn(res);
        }); 
    },
    preSendCertifycode(){
        // 先判断该租户是否开启校验配置
        let time=parseInt(+new Date()/1000)
        // 随机生成6位数，用于签名
        let rnd=parseInt((Math.random()*9+1)*1000000)
        return {"cmd": "signLogin", "time": time, "rnd":rnd }
    },
    // loadFooterInfo() {
    //   return footerInfo()
    //     .then(res => {
    //       if (res.data.code == 0) {
    //         if (res.data && res.data.data) {
    //           this.footer = res.data.data;
    //         } else {
    //           this.footer = "";
    //         }
    //       } else {
    //         this.footer = "Copyright © 2020 金卡智能 All Rights Reserved";
    //       }
    //     })
    //     .catch(err => {
    //       console.log("获取脚注失败！");
    //     });
    // },
    // 点击登录
    onSubmit(formName, enterkey = false) {
      if (enterkey && this.subLoading) return;//enter键多次点击造成重复登录问题
      // 为表单绑定验证功能
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.isNeedCertify){
            window.postMessage({ type: "FROM_PAGE", method: "send",text: this.preSendCertifycode()}, "*");
            this.subLoading = true;
            this.btnText = "正在认证...";
            return
           }
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.login();
          }, 200);
        }
      });
    },
    // 跳转首页
    goHome() {
      let menuList = this.$ls.get("menuList");
      // 寻找第一个路由或子路由
      let findFirst = arr => {
        if (!arr.length) {
          throw "1";
        }
        if (
          arr[0].children &&
          arr[0].children instanceof Array &&
          arr[0].children.length
        ) {
          return findFirst(arr[0].children);
        } else {
          return arr[0];
        }
      };
      let fixedTab = findFirst(menuList);
      if (!(fixedTab.name && fixedTab.path && fixedTab.title)) {
        this.$message.error("固定标签信息错误，请联系管理员解决");
        return;
      }
      // 更新菜单列表 - vuex和ls
      this.$store.commit("c_state", { key: "fixedTab", val: fixedTab });
      this.$ls.set("fixedTab", fixedTab);
      this.$router
        .push({ name: fixedTab.name })
        .then(() => { })
        .catch(err => {
          this.$message.error("跳转时遇到错误");
          console.warn("登录未完成，错误信息：", err);
        });
    },
    // 登录
    login() {
      this.getMenu()
        .then(res => {
          if (!res) {
            return Promise.resolve();
          }
          this.btnText = "立即登录";
          this.subLoading = false;
          // 获取数据字典
          const loading = this.$loading({ background: "rgba(255,255,255,0.7)" });
          DataList().then(res => {
            loading.close();
            this.$ls.set("DataList", res.data);
          }).catch(err => {
            loading.close();
            console.error("err", err)
          })
          this.goHome(); // 跳转首页，并添加固定标签
          this.$message.success("登录成功！");
        //   登录成功关闭后台程序
        //    window.postMessage({ type: "FROM_PAGE", method: "close" }, "*");
        })
        .catch(err => {
          let msg = err;
          if (typeof err == 'string' && err.constructor == String && this.errCodeList[err]) {
            msg = this.errCodeList[err];
            this.$alert(msg, '发现异常', { confirmButtonText: '确定', type: "error" });
          }
          console.error("getMenu回调发生错误", msg);
        });
    },
    // 登录、获取菜单
    getMenu(callback) {
      let that = this;
      that.subLoading = true;
      that.btnText = "登录中...";
      let c_receivedCertifyCode= window.login_r_code || {}
      if(this.isNeedCertify){
        if(!c_receivedCertifyCode.key){
            this.$message.error('未获取到认证机构信息')
            that.subLoading = false;
            that.btnText = "立即登录";
            return;
        }
      }
      let loginAjax = postLogin;
      if (this.$route.name == "om-login") {
        loginAjax = omLogin;
      }
      let _from = { ...this.form };
      this.form.username = _from.username.trim();
      var loginHeaders={}
      if(this.isNeedCertify){
      // 登录请求附带请求头:
        loginHeaders={
            "gcv-time":c_receivedCertifyCode.request.time,
            "gcv-rnd":c_receivedCertifyCode.request.rnd,
            // gcv_cert:c_receivedCertifyCode.cert,
            "gcv-sign":c_receivedCertifyCode.sign,
            "gcv-key":c_receivedCertifyCode.key
        }
     }
      return loginAjax(this.form,loginHeaders)
        .then(res => {
          if (res.data.code != 0) {
            that.btnText = "立即登录";
            that.subLoading = false;
            if (res.data.message == "验证码错误") {
              this.form.code = "";
              this.$nextTick(function () {
                this.$refs['loginForm'].clearValidate();
              })
            }
            that.$message({
              type: "error",
              message: res.data.message
            });
            that.loadCodeImg();
            // 手动清空缓存
            localStorage.clear()
            return Promise.resolve(false);
          }
          this.$store.commit("CLEAR_UESR");
          let resultDatas = res.data.data;

          // 权限列表，默认权限/公开权限的路由在此处添加
          // 此表影响路由访问权限以及菜单(导航)的显示
          let authListTemp = {
            ...this.$store.state.authList
          };
          // 按钮权限列表
          let btAuthListTemp = {};
          // 按接口permissions获取权限
          let getUserPermission = () => {
            let resList = resultDatas.permissions;
            if (!resList || resList === null) {
              throw "2";
            }
            resList.forEach(i1 => {
              // 请保持前端path映射表与后端接口同步
              if (pathAuth[i1.subPath]) {
                let v = pathAuth[i1.subPath];
                // 分String和Array分别处理，详见pathAuth.js
                if (typeof v == "string" && v.constructor == String) {
                  authListTemp[v] = true;
                } else if (typeof v == "object" && v.constructor == Array) {
                  v.forEach(i => {
                    authListTemp[i] = true;
                  });
                }
              }
              // 按钮权限
              if (btAuthList[i1.subPath + '&&' + i1.actionName]) {
                let v = btAuthList[i1.subPath + '&&' + i1.actionName];
                // 分String和Array分别处理，详见pathAuth.js
                if (typeof v == "string" && v.constructor == String) {
                  btAuthListTemp[v] = true;
                } else if (typeof v == "object" && v.constructor == Array) {
                  v.forEach(i => {
                    btAuthListTemp[i] = true;
                  });
                }
              }
            });
          };
          let sysUi = false; // true时进入系统管理员界面,只展示系统管理员菜单，false为普通租户界面，显示普通租户菜单
          // 系统级账号
          if (resultDatas.userLevel == 0) {
            // 系统管理员拥有所有权限
            if (resultDatas.isAdmin) {
              authListTemp = allAuthList;
              Object.keys(btAuthList).map(i => {
                let v = btAuthList[i];
                if (typeof v == "string" && v.constructor == String) {
                  btAuthListTemp[v] = true;
                } else if (typeof v == "object" && v.constructor == Array) {
                  v.forEach(i => {
                    btAuthListTemp[i] = true;
                  });
                }
              })
              sysUi = true;
            } else {
              // 系统普通账号（金卡管理员、金卡运维）
              if (resultDatas.tenantId == 0) {
                sysUi = true;
                getUserPermission();
              }
            }
          }
          // 租户级账号
          else if (resultDatas.userLevel == 1) {
            getUserPermission();
            // 跨域运维操作员
            if (resultDatas.isCrossDomain) {
            }
          } else {
            this.$message.error("系统错误：无法判断您的账号级别");
            return Promise.resolve(false);
          }

          // 生成菜单的方法
          const createMenu = (oMenu, authList) => {
            let arr = [];
            oMenu.forEach(i => {
              let judge_1 = false; // 第一级判断条件
              // 系统管理员:菜单sysAdmin字段为true且有权限
              if (sysUi) {
                judge_1 = i.sysAdmin && authList[i.name];
              } else {
                judge_1 = authList[i.name];
              }
              if (judge_1) {
                if (i.children) {
                  // 有子集，递归children
                  // 若children中不存在有权限的元素，将会得到一个空数据，由于此问题不影响菜单显示，暂不处理。
                  arr.push({
                    ...i,
                    children: createMenu(i.children, authList)
                  });
                } else {
                  // 无子集
                  arr.push(i);
                }
              }
            });
            return arr;
          };

          // 生成菜单/导航列表
          let menuListTemp = createMenu(menuList, authListTemp);

          // 更新权限列表 - vuex和ls
          this.$store.commit("c_state", { key: "authList", val: authListTemp });
          this.$ls.set("authList", authListTemp);
          // 更新菜单列表 - vuex和ls
          this.$store.commit("c_state", { key: "menuList", val: menuListTemp });
          this.$ls.set("menuList", menuListTemp);
          this.$store.commit("c_state", { key: "userInfo", val: resultDatas });
          this.$store.commit("c_state", {
            key: "accessToken",
            val: resultDatas.accessToken
          });
          this.$ls.set("userInfo", resultDatas);
          this.$ls.set("accessToken", resultDatas.accessToken);
          // 1.5.0 迭代  处理浏览器多tab登录问题
          sessionStorage.setItem('accessToken', resultDatas.accessToken)
          this.initUserGrade(resultDatas);
          let userGradeName = this.$ls.get("userGradeName");
          if (userGradeName == "普通管理员") {
            btAuthListTemp['权限分配'] = true;
          }
          // 更新按钮权限列表
          this.$store.commit("c_state", { key: "btAuthList", val: btAuthListTemp });
          this.$ls.set("btAuthList", btAuthListTemp);
          if (
            !sysUi &&
            !resultDatas.isAdmin &&
            !resultDatas.isTenantAdmin &&
            !resultDatas.isCrossDomain
          ) {
            // 获取租户所在省市
            this.getTenantPlace(resultDatas.orgId);
            //获取租户业务配置
            this.getTenantDetails();
          }
          return Promise.resolve(true);
        })
        .catch(err => {
          this.btnText = "立即登录";
          this.subLoading = false;
          console.error("登录失败-geMenu调用出错!", err);
          that.form.code = "";
          this.$message.error("登录失败-接口调用失败！");
        });
    },
    // 判断角色等级
    initUserGrade(res) {
      let userGrade; // 等级数字
      let userGradeName; // 等级名称
      let gradeList = {
        // 系统级
        "超级管理员": 0,
        "普通管理员": 1,
        "运维操作员": 2,
        "易联云微信": 4,
        // 租户级
        "租户管理员": 20,
        "分公司管理员": 21,
        "营业员": 22,
        "技术员": 23,
        "跨域运维操作员": 3,
      }
      if (res.userLevel == 0) {
        if (res.isAdmin) {
          userGradeName = "超级管理员";
        } else {
          if (res.roleId == "1") {
            userGradeName = "普通管理员";
          } else if (res.roleId == "2") {
            userGradeName = "运维操作员";
          } else if (res.roleId == "4") {
            userGradeName = "易联云微信";
          } else {
            userGradeName = "未知的roleId";
          }
        }
      } else if (res.userLevel == 1) {
        if (res.isTenantAdmin) {
          userGradeName = "租户管理员";
         //获取租户业务配置
         this.getTenantDetails();
        } else {
          if (res.orgStruName == "分公司") {
            userGradeName = "分公司管理员";
          } else if (res.roleName == "营业员") {
            userGradeName = "营业员";
          } else if (res.roleName == "技术人员") {
            userGradeName = "技术员";
          } else if (res.roleId == "3") {
            userGradeName = "跨域运维操作员";
            // 获取租户所在省市
            // this.getTenantPlace(resultDatas.orgId);
            //获取租户业务配置
            this.getTenantDetails();
          } else {
            userGradeName = "未知的orgStruName";
          }
        }
      } else {
        userGradeName = "userLevel异常";
      }
      if (gradeList.hasOwnProperty(userGradeName)) {
        userGrade = gradeList[userGradeName];
      } else {
        userGrade = -1;
      }
      this.$ls.set("userGrade", userGrade);
      this.$ls.set("userGradeName", userGradeName);
    },
    //获取租户所在省市
    getTenantPlace(orgId) {
      getTenantPlace({ id: orgId })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data && res.data.data) {
              let resultData = res.data.data;
              if (
                resultData.basic &&
                resultData.basic.constructor === Object &&
                resultData.basic.city
              ) {
                this.$store.commit("c_state", {
                  key: "tenantPlaceCode",
                  val: resultData.basic ? resultData.basic : ""
                });
                this.$ls.set("tenantPlaceCode", resultData.basic);
              } else {
                this.$message.error("请在租户组织机构配置省市信息");
              }
            } else {
              this.$message.error("该租户未配置相关组织机构信息");
            }
          } else {
            this.$message.error(`租户所在省市查询失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("获取租户所在省市发生错误-接口请求失败");
        });
    },
    //获取租户业务配置
    getTenantDetails() {
      getTenantDetail()
        .then(res => {
          let resultData = res.data;
          if (resultData.code == 0) {
            if (resultData && resultData.data) {
              this.$store.commit("c_state", {
                key: "tenantType",
                val: resultData.data.realm
              });
              this.$ls.set("tenantType", resultData.data.realm);
              if (resultData.data.business_config) {
                let configData = resultData.data.business_config;
                this.$store.commit("c_state", {
                  key: "tenantBasicConfig",
                  val: configData
                });
                this.$ls.set("tenantBasicConfig", configData);
              } else {
                this.$message.error(
                  "该租户未配置参数--初始周期累积量和上报类型"
                );
              }
            }
          } else {
            this.$message.error(`租户业务配置查询失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("获取租户业务配置发生错误-接口请求失败");
        });
    },
    goOmLogin() {
      this.$router.push("/om-login");
    }
  }
};