import { createConsoleUser, updateUserList, createAccessUser, addWhiteUser } from "@/api/systemUserSet.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      pageData: {}, // 当前用户的所有数据
      showConsoleAddBt: false, // 是否显示控制台登录新增账号的按钮
      consoleAddShow: false, // 控制台登录新增账号弹窗的显示
      consoleUser: {
        user: "", // 账号
        pw: "", // 密码
      },
      consoleUserRules: { // 控制台登录新增账号表单校验
        user: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 32) {
                callback(new Error("账号不可超过32位"));
              } else if (value.trim() == "") {
                callback(new Error("账号不可为空"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        pw: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 32) {
                callback(new Error("密码不可超过32位"));
              } else if (value.trim() == "") {
                callback(new Error("密码不可为空"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      },
      showAccessAddBt: false, // 是否显示编程访问新增账号按钮
      accessAddShow: false, // 编程访问新增账号弹窗显示
      programAccess: { // 编程访问
        id: "", // id
        secret: "", // 密钥
      },
      whiteListShow: true, // 是否显示白名单管理，禁用时不显示，开启时显示
      whiteListEdit: true, // 白名单管理是否为编辑状态，编辑状态下显示新增账号的输入框和移除按钮，否则隐藏
      whiteListUsername: "", // 白名单管理时新增的账号名
      whiteListUsernameRules: {
        username: [
          {
            validator: (rule, value, callback) => {
              value = this.whiteListUsername;
              /**
               * if (value.length > 32) {
                callback(new Error("账号名不可超过32位"));
              } else 
               */
              if (value.trim() == "") {
                callback(new Error("账号名不可为空"));
              } else {
                callback();
              }
            },
            trigger: 'none'
          }
        ]
      },
      whiteList: [], // 白名单账号列表
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.pageInit();
    new ClipboardJS('#copyIt');
  },
  methods: {
    // 子组件联动触发更新
    childTabActive() {
      // 现在无需联动更新了
      this.pageInit();
    },
    // 页面初始化
    pageInit() {
      let data = this.$ls.get("systemUserSetDetail_" + this.$route.query.sp_id);
      this.pageData = data;
      this.whiteListShow = data.isWhiteList; // 启用状态
      if (data.saccount) {
        this.consoleUser.user = data.saccount.loginAccount; // 控制台登录账号
        this.showConsoleAddBt = false; // 隐藏新增账号按钮
      } else {
        this.showConsoleAddBt = true; // 显示新增账号按钮
      }
      if (data.sapp) {
        this.programAccess.id = data.sapp.accessKeyID; // 编程访问账号id
        this.programAccess.secret = data.sapp.accessKeySecret; // 编程访问账号密钥
        this.showAccessAddBt = false; // 隐藏新增账号按钮
      } else {
        this.showAccessAddBt = true; // 显示新增账号按钮
      }
      if (data.whitelist) {
        this.whiteList = data.whitelist; // 白名单
      }
    },
    // 更新页面数据
    updatePageData(data) {
      let newData = Object.assign({}, this.pageData, data);
      this.$ls.set("systemUserSetDetail_" + this.$route.query.sp_id, newData);
      this.pageData = newData;
    },
    // 控制台登录-新增账号
    consoleAdd() {
      this.$refs['consoleUser'].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            background: "rgba(255,255,255,0.7)"
          });
          createConsoleUser({
            userId: this.pageData.userId,
            account: this.consoleUser.user,
            password: this.consoleUser.pw,
          }).then(res => {
            loading.close();
            if (res.data.code == 0) {
              this.$message.success("控制台登录-创建账号成功");
              this.showConsoleAddBt = false; // 隐藏新增按钮
              this.consoleAddShow = false; // 关闭弹窗
            } else {
              let msg = "控制台登录-创建账号失败";
              if (res.data.message) {msg = res.data.message}
              this.$message.error(msg);
            }
          }).catch(err => {
            loading.close();
            this.$message.error("控制台登录-创建账号出错");
            console.error("控制台登录-创建账号出错：", err);
          })
        }
      })
    },
    // 控制台登录-新增账号-弹窗关闭
    consoleAddClose() {
      this.$refs['consoleUser'].clearValidate(); // 重置表单
    },
    // 编程访问-新增账号
    accessAdd() {
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      createAccessUser({
        userId: this.pageData.userId
      }).then(res => {
        loading.close();
        if (res.data.code == 0) {
          this.programAccess = {
            id: res.data.data.accessKeyID,
            secret: res.data.data.accessKeySecret,
          }
          this.updatePageData({ sapp: res.data.data });
        } else {
          let msg = "编程访问-创建账号失败";
          if (res.data.message) {msg = res.data.message}
          this.$message.error(msg);
        }
      }).catch(err => {
        loading.close();
        this.$message.error("编程访问-创建账号出错");
        console.error("编程访问-创建账号出错：", err);
      })
      this.accessAddShow = true; // 弹窗显示
    },
    // 关闭编程访问新增账号弹窗
    closeAccessDialog() {
      this.accessAddShow = false;
      this.showAccessAddBt = false; // 隐藏新增账号按钮
    },
    // 修改白名单启用状态，与系统用户列表里的白名单启用状态保持一致
    enableUser() {
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      updateUserList({
        userId: this.pageData.userId,
        isWhiteList: !this.whiteListShow
      }).then(res => {
        loading.close();
        if (res.data.code == 0) {
          this.$message.success(this.whiteListShow ? "禁用成功" : "启用成功");
          this.whiteListShow = !this.whiteListShow; // 修改ui显示
          this.updatePageData({ isWhiteList: this.whiteListShow });
        } else {
          this.$message.error(this.whiteListShow ? "禁用失败" : "启用失败")
        }
      }).catch(err => {
        loading.close();
        console.error("操作出错", err)
        this.$message.error("操作出错")
      })
    },
    // 添加白名单账号
    addWhiteUser() {
      this.$refs['whiteListUsername'].validate(valid => {
        if (valid) {
          this.whiteList.splice(0, 0, this.whiteListUsername); // 向数组第一项前添加元素
          this.whiteListUsername = ""; // 重置白名单账号输入
          this.$nextTick(function () {
            this.$refs['whiteListUsername'].clearValidate(); // 在nextTick中重置表单校验
          })
        }
      })
    },
    // 移除白名单账号
    removeWhiteUser(index) {
      this.whiteList.splice(index, 1); // 删除数组对应项
    },
    // 保存白名单列表
    saveWhiteList() {
      if (this.whiteListEdit) { // 执行保存操作
        const loading = this.$loading({
          background: "rgba(255,255,255,0.7)"
        });
        addWhiteUser({
          userId: this.pageData.userId,
          whiteItems: this.whiteList,
        }).then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.updatePageData({ whitelist: this.whiteList });
            this.whiteListEdit = !this.whiteListEdit;
            this.$message.success("保存白名单成功");
          } else {
            this.$message.error("保存白名单失败");
          }
        }).catch(err => {
          loading.close();
          console.error("保存白名单时出错", err);
          this.$message.error("保存白名单时出错");
        })
      } else { // 切换为编辑状态
        this.whiteListEdit = !this.whiteListEdit; // 切换白名单的编辑状态
      }
    },
  }
}