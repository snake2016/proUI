import { tenantCreate, tenantModify, tenantEnable, tenantDisable, managePw, tenantList } from "@/api/tenant.js";
import dayjs from 'dayjs';
import {basic_temple_config} from './const'
export default {
  components: {},
  props: {},
  data() {
    return {
      data: null, // 租户信息
      tenantId: null, // 租户id
      baseInfoAbled: false, // 基础信息是否可编辑 true可编辑 false不可编辑
      basic: {
        customer_number:'',
        company_name: '', // 企业名称
        contact: '', // 联系人
        phone: '', // 联系电话
        subdomain: '', // 子域名 - 基础设置
        name: '', // 租户名称 - 基础设置
        create_time: '', // 创建时间
        tenant_type: ''//租户类型
      }, // 基础设置中的数据
      tenantTypeOptions: [{
        value: 'gas',
        label: '燃气'
      }, {
        value: 'water',
        label: '水务'
      }],//租户类型
      cTime: "--", // 创建时间格式化
      business_configAbled: false, // 参数设置是否可编辑 true可编辑 false不可编辑
      basic_temple_config:basic_temple_config,
      business_config: {
        customer_number:'', // 客户编号
        is_allow_define_cyc_surplus: '0', // 是否允许自定义各阶余量重置策略
        is_allow_define_initial_cyc_qty: '0', // 是否允许自定义初始周期累积量
        // is_allow_define_report_type: '0', // 是否允许选择上报类型
        is_allow_month_avg: '0', // 是否允许阶梯价开启按月均摊
        is_allow_population_ladder: '0', // 是否允许阶梯价开启人口阶梯
        is_need_sms: '0', // 是否开通短信
        is_need_wechat: '0', // 是否开通微信
        is_invoice_enabled: '0', // 是否开通发票
        need_gas_receipt: '0', // 是否需要补气收据
        need_open_operator: '0', // 是否需要点火操作
        is_merge_olbh_enabled: '0',//是否合并网厅数据
        is_login_verify_enabled: '0' //是否启用登录校验
      }, // 参数设置中的数据
      personal: {
        welcome_info: "", // 脚注
        remark: '', // 备注
      },
      personalEnable: false, // 个性化设置是否可编辑 true可编辑 false不可编辑
      is_enabled: '', // 是否可用
      disableTenantShow: false, // 禁用租户的弹窗显示
      disableReason: '', // 禁用原因默认值
      disableReasonRule: {
        disableReason: [
          {
            validator: (rule, value, callback) => {
              value = this.disableReason;
              if (value.length > 32) {
                callback(new Error("禁用原因不可超过32位"));
              } else if (value.trim() == "") {
                callback(new Error("禁用原因不可为空"));
              } else {
                callback();
              }
            }
          }
        ]
      }, // 禁用原因表单校验
      // 基础信息表单校验
      basicRules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 32) {
                callback(new Error("租户名称不可超过32位"));
              } else if (this.tenantId === null && value.trim() == "") {
                callback(new Error("租户名称不可为空"));
              } else {
                callback();
              }
            }
          }
        ],
        company_name: [
          { required: true, message: '企业名称不可为空', trigger: 'blur' },
          { max: 64, message: "企业名称不可超过64位", trigger: "blur" }
        ],
        customer_number:[
          { max: 32, message: "客户编号不可超过32位", trigger: "blur" }
        ],
        contact: [
          { max: 32, message: "联系人不可超过32位", trigger: "blur" }
        ],
        phone: [
          { max: 18, message: "联系电话不可超过18位", trigger: "blur" }
        ],
        subdomain: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 24) {
                callback(new Error("子域名不可超过24位"));
              } else if (value.trim() == "") {
                callback(new Error("子域名不可为空"));
              } else {
                callback();
              }
            }
          }
        ],
        tenant_type: [
          { required: true, message: '租户类型不可为空', trigger: 'change' },
        ]
      },
      personalRules: {
        welcome_info: [
          { max: 64, message: "脚注不可超过64位", trigger: "blur" }
        ],
        remark: [
          { max: 128, message: "备注不可超过128位", trigger: "blur" }
        ],
      },
      changePwShow: false, // 修改密码弹窗显示
      pwType: 1,
      accountData: {
        pw: "", // 密码
      },
      changePwRule: {
        pw: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 18) {
                callback(new Error("密码不可超过18位"));
              } else if (value == null || value == "") {
                callback(new Error("密码不可为空"));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
      },
      uiDisplay: {
        editTenant: true, // 是否可编辑租户信息
        changePw: false, // 是否可修改租户密码
      },
    }
  },
  computed: {
    // 修改密码时的登录名称
    userAdmin: {
      get: function () {
        return this.basic.subdomain + "admin";
      },
      set: function (newVal) {
      }
    },
  },
  mounted() {
    // if (this.$ls.get("userGradeName") == "运维操作员") {
    //   this.uiDisplay.editTenant = false;
    // }
    // if (this.$ls.get("userGradeName") == "超级管理员" || this.$ls.get("userGradeName") == "普通管理员") {
    //   this.uiDisplay.changePw = true;
    // } else {
    //   this.uiDisplay.changePw = false;
    // }
    this.pageInit();
  },
  methods: {
    pageInit() {
      if (this.$route.query && this.sp_id && this.$ls.get('tenantDetail_' + this.sp_id)) {
        let lsData = this.$ls.get('tenantDetail_' + this.sp_id);
        this.data = lsData;
        this.tenantId = lsData.id;
        this.realm = lsData.realm;
        this.baseInfoAbled = false;
        this.basicInit();
        this.business_configInit();
        // this.personalInit();
        // 是否可用
        this.is_enabled = lsData.is_enabled;
      } else {
        this.baseInfoAbled = true;
      }
    },
    // 格式化
    rn(value) {
      if (value) {
        return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "--"
      }
    },
    // 基础信息初始化
    basicInit() {
      // let lsData = this.data;
      // 获取最新的缓存
      let lsData = this.$ls.get('tenantDetail_' + this.sp_id)
      this.$refs['basic'] && this.$refs['basic'].clearValidate(); // 移除校验结果
      if (lsData.basic && lsData.basic.constructor === Object) {
        Object.keys(this.basic).map((key) => {
          if(key === 'customer_number') {
            if(lsData.hasOwnProperty('business_config')){
              if(lsData['business_config'].hasOwnProperty('customer_number')){
                this.basic['customer_number'] = lsData['business_config']['customer_number']
              }
            }else{
              this.basic['customer_number'] = lsData['basic']['customer_number']
            }
            return
          }
          if (lsData.basic.hasOwnProperty(key) && key !== 'customer_number') {
            this.basic[key] = lsData.basic[key];
          } else {
            this.basic[key] = "";
          }
        })
      }
      // 域名
      this.basic.subdomain = lsData.subdomain;
      // 租户名称
      this.basic.name = lsData.name;
      this.basic.create_time = lsData.create_time;
      if (this.basic.create_time) {
        this.cTime = dayjs(this.basic.create_time).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "--"
      }
      // 租户类型
      this.basic.tenant_type = lsData.realm;
    },
    // 参数信息初始化
    business_configInit() {
      let lsData = this.data;
      if (lsData.business_config && lsData.business_config.constructor === Object) {
        Object.keys(lsData.business_config).map((key) => {
          if(key === 'customer_number') {
            // this.basic['customer_number'] = lsData.business_config[key]
            return
          }
          if (this.business_config.hasOwnProperty(key)) {
            this.business_config[key] = lsData.business_config[key] == 1 ? '1' : '0';
          }
        })
      }
    },
    // 个性化设置初始化
    personalInit() {
      let lsData = this.data;
      this.$refs['personal'].clearValidate(); // 移除校验结果
      if (lsData.personal && lsData.personal.welcome_info) {
        this.personal.welcome_info = lsData.personal.welcome_info;
      } else {
        this.personal.welcome_info = "";
      }
      if (lsData.basic && lsData.basic.remark) {
        this.personal.remark = lsData.basic.remark;
      } else {
        this.personal.remark = "";
      }
    },
    // 切换编辑状态
    changeEditAble(flag, type) {
      // 编辑-切换为可编辑状态
      if (flag == 1) {
        this[type] = true;
      }
      // 取消-切换为不可编辑状态
      else if (flag == 0) {
        this[type] = false;
        if (type == 'baseInfoAbled') {
          this.basicInit();
        }
        else if (type == 'business_configAbled') {
          this.business_configInit();
        }
        else if (type == 'personalEnable') {
          // this.personalInit();
        }
      }
    },
    // 提交前确认
    submitVerify(type) {
      if (type == 'baseInfoAbled') {
        this.$refs['basic'].validate(valid => {
          if (valid) {
            if (this.tenantId == null) {
              this.newTenant(); // 新增租户
            } else {
              this.submit(type);
            }
          } else {
            this.$message.error("请修改页面中的错误信息")
          }
        })
      }
      // 参数设置
      else if (type == 'business_configAbled') {
        this.submit(type);
      }
      // 个性化设置
      else if (type == 'personalEnable') {
        this.$refs['personal'].validate(valid => {
          if (valid) {
            this.submit(type);
          } else {
            this.$message.error("请修改页面中的错误信息")
          }
        })
      }
    },
    // 新增租户
    newTenant() {
      console.log(this.basic.customer_number)
      let data = {};
      // 基本信息
      data.basic = {
        company_name: this.basic.company_name,
        contact: this.basic.contact,
        phone: this.basic.phone,
        customer_number:this.basic.customer_number
      }
      data.business_config = {
        customer_number:this.basic.customer_number,
      }
      data.subdomain = this.basic.subdomain
      data.name = this.basic.name;
      data.realm = this.basic.tenant_type;

      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      tenantCreate(data).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          if (res.data.id == null) {
            this.$message.error("租户ID为空");
            return;
          }
          this.tenantId = res.data.id;
          this.baseInfoAbled = false; // 去除编辑状态
          this.is_enabled = true; // 变成可用状态
          // this.updateLs('newTenant'); // 更新ls
          this.getTenantList(); // 更新租户信息中的创建时间
          this.$message.success("新增租户成功");
        } else {
          let msg = "新增租户失败-返回码错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          let msg = "新增租户时发生错误";
          if (err.response && err.response.data && err.response.data.message) {
            if (!this.hasLetter(err.response.data.message)) {
              msg = err.response.data.message;
            }
          }
          this.$message.error(msg);
          console.error(msg, err);
        }
      })
    },
    // 更新租户信息如创建时间
    getTenantList() {
      let params = {
        page: 0,
        paged: true,
        size: 10,
        sort:'id,desc'
      }
      if (this.basic.name) {
        params.nameLike = String(this.basic.name).trim();
      }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      tenantList(params).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          if (res.data.data && res.data.data.length) {
            this.basic.create_time = res.data.data[0].create_time;
            if (this.basic.create_time) {
              this.cTime = dayjs(this.basic.create_time).format("YYYY-MM-DD HH:mm:ss");
            } else {
              this.cTime = "--";
            }
            this.updateLs("newTenant");
            this.$store.commit("spTabReplace", {
              newValue: {
                sp_id: this.tenantId,
                name: "tenantConfigDetail_" + this.tenantId,
                title: "租户详情",
                query: {
                  sp_id: this.tenantId,
                }
              }
            })
            this.$store.commit("spTabAdd", {
              preName: "tenantConfigDetail",
              sp_id: this.tenantId,
              keepName: "tenantConfig-detail",
              title: "租户详情",
              path: "/tenantConfig-detail",
              query: {
                sp_id: this.tenantId
              }
            });
          }
        } else {
          let msg = "获取租户列表失败-返回码错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          console.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          console.error("获取租户列表时遇到了错误");
        }
      })
    },
    // 编辑租户提交
    submit(type) {
      let data = {};
      let lsData = this.$ls.get('tenantDetail_' + this.$route.query.sp_id);
      // 基本信息
      if (type == 'baseInfoAbled') {
        data.basic = {
          company_name: this.basic.company_name,
          contact: this.basic.contact,
          phone: this.basic.phone,
        }
        data.business_config = {
          ...this.business_config,
          customer_number:this.basic.customer_number,
        }
        data.subdomain = this.basic.subdomain
        data.name = this.basic.name;
        data.realm = this.basic.tenant_type;
      }
      // 参数设置
      else if (type == 'business_configAbled') {
        data.business_config = {
          ...this.business_config,
        }
      }
      // 个性化设置
      else if (type == 'personalEnable') {
        data.personal = {};
        data.basic = lsData.basic;
        data.personal.welcome_info = this.personal.welcome_info;
        data.basic.remark = this.personal.remark;
      }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      tenantModify(data, { params: { id: this.tenantId } }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          this[type] = false; // 去除编辑状态
          this.updateLs(type); // 更新ls
          this.$message.success("修改租户信息成功");
        } else {
          let msg = "修改租户信息失败-返回码错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          let msg = "修改租户信息时发生错误";
          if (err.response && err.response.data && err.response.data.message && !this.hasLetter(err.response.data.message)) {
            msg = err.response.data.message;
          }
          this.$message.error(msg);
          console.error(msg, err);
        }
      })
    },
    // 新增/编辑成功后同步更新ls中的数据
    updateLs(type) {
      // 新增租户
      if (type == 'newTenant') {
        this.$ls.set('tenantDetail_' + this.tenantId, {
          basic: {
            company_name: this.basic.company_name, //   企业名称
            contact: this.basic.contact, // 联系人
            phone: this.basic.phone, // 联系电话
            customer_number:this.basic.customer_number // 客户编号
          },
          create_time: this.basic.create_time, // 创建时间
          subdomain: this.basic.subdomain, // 子域名
          name: this.basic.name, // 租户名称
          is_enabled: true, // 新增租户后是可用状态
          id: this.tenantId,
          realm: this.basic.tenant_type,
          personal: {
            welcome_info: "", // 脚注
            remark: '', // 备注
          }
        })
        return;
      }
      let data = this.$ls.get('tenantDetail_' + this.$route.query.sp_id);
      // 基本信息
      if (type == 'baseInfoAbled') {
        data.basic = {
          ...data.basic,
          company_name: this.basic.company_name, //   企业名称
          contact: this.basic.contact, // 联系人
          phone: this.basic.phone, // 联系电话
          customer_number:this.basic.customer_number // 客户编号
        }
        data.business_config = {
          ...data.business_config,
          customer_number:this.basic.customer_number 
        }
        data.subdomain = this.basic.subdomain; // 子域名
        data.name = this.basic.name; // 租户名称
        data.realm = this.basic.tenant_type;//租户类型
      }
      // 参数设置
      else if (type == 'business_configAbled') {
        data.business_config = {
          ...data.business_config,
          ...this.business_config,
        }
      }
      // 个性化设置
      else if (type == 'personalEnable') {
        data.personal.welcome_info = this.personal.welcome_info;
        data.basic.remark = this.personal.remark;
      }
      // 启用或禁用租户
      else if (type = 'Enable') {
        this.is_enabled = !this.is_enabled;
        data.is_enabled = !data.is_enabled;
      }
      console.log(data)
      this.$ls.set('tenantDetail_' + this.$route.query.sp_id, data);
    },
    // 启用租户
    enableTenant() {
      if (!this.tenantId) {
        this.$message.error("无法操作：租户ID为空");
        return;
      }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      tenantEnable(null, { params: { id: this.tenantId } }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          this.updateLs('Enable');
          this.$message.success("启用租户成功");
        } else {
          let msg = "启用租户失败-返回码错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("启用租户时发生错误");
          console.error("启用租户时发生错误", err);
        }
      })
    },
    // 禁用租户
    disableTenant() {
      this.disableTenantShow = true;
      return;
      let that = this;
      if (!this.tenantId) {
        this.$message.error("无法操作：租户ID为空");
        return;
      }
      const h = this.$createElement;
      this.$prompt('', '请输入禁用原因', {
        inputValue: that.disableReason,
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入1~32个字符',
        inputValidator: (value) => {
          if (value.length <= 0) {
            return '禁用原因不可为空';
          } else if (value.length > 32) {
            return '原因不可超过32位';
          } else {
            return true;
          }
        },
        inputErrorMessage: '请输入1-32个字符'
      }).then(({ value }) => {

      }).catch(err => { })
    },
    // 确认禁用租户
    disableTenantSubmit() {
      let ok = false;
      this.$refs['disableReasonForm'].validate(valid => {
        ok = valid ? true : false;
      })
      if (!ok) { return; }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      tenantDisable({}, { params: { id: this.tenantId, disableReason: this.disableReason.trim() } }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          this.updateLs('Enable');
          this.$message.success("禁用租户成功");
          this.disableTenantCancel();
        } else {
          let msg = "禁用租户失败-返回码错误";
          if (res.data.message) { msg = res.data.message; }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("禁用租户时发生错误");
          console.error("禁用租户时发生错误", err);
        }
      })
    },
    // 取消禁用租户
    disableTenantCancel() {
      this.disableReason = "";
      this.$nextTick(function () {
        this.$refs['disableReasonForm'].clearValidate();
        this.disableTenantShow = false;
      })
    },
    // 租户修改密码弹窗显示/隐藏
    showChangePw(type) {
      if (type == 1) { // 修改密码按钮点击
        this.accountData.pw = "******";
        this.changePwShow = true;
      } else if (type == 0) { // 取消按钮点击
        // this.changePwShow = false;
        if (this.$refs['changePw']) {
          this.$refs['changePw'].resetFields();
        }
        this.changePwType(1);
      }
    },
    // 关闭修改密码弹窗
    closeChangePw(done) {
      this.showChangePw(0);
      done();
    },
    // 修改密码点击 切换输入框状态
    changePwType(flag) {
      this.pwType = flag;
      if (flag == 2) {
        this.accountData.pw = "";
        setTimeout(() => {
          this.$refs['changePw'].clearValidate();
        }, 10)
      }
    },
    // 修改密码校验与接口请求
    changePw(pw) {
      let password = this.accountData.pw;
      // 重置密码为默认密码
      if (pw == 0) {
        password = "000000";
      }
      let ok = false;
      if (this.pwType == 2) {
        this.$refs['changePw'].validate(valid => {
          ok = valid ? true : false;
        })
        if (!ok) { return; }
      }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      managePw(undefined, {
        params: {
          loginAccount: this.basic.subdomain + "admin",
          newPwd: password,
          tenantId: this.tenantId
        }
      }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          let msg = "修改密码成功";
          if (this.pwType == 1) { msg = "重置密码成功"; }
          this.changePwShow = false;
          this.showChangePw(0);
          this.$message.success(msg);
        } else {
          let msg = "修改密码失败-返回码错误";
          if (res.data.message) { msg = res.data.message; }
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        if (err != 401 && err != 403) {
          this.$message.error("修改密码时发生错误");
          console.error("修改密码时发生错误", err);
        }
      })
    },
  }
}