import { getRoleDictionary, getUserList, updateUserList, createUserList } from "@/api/systemUserSet.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      roleQL: {}, // 角色列表 id->name
      userList: [], // 用户列表
      pageData: {
        current: 1, // 当前页码
        size: 10, // 每页条数
        total: 1, // 总条数
      },
      editDialogShow: false, // 新增或编辑用户弹窗的显示
      isAdd: true, // 是新增用户还是编辑用户
      userData: {
        name: "", // 用户名称
        roleId: "", // 角色
        mobile: "", // 手机号
        department: "", // 部门
        remark: "", // 备注
      },
      userDataRules: { // 系统用户数据校验
        name: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (value.length > 32) {
                callback(new Error("用户名称不可超过32个字符"));
              } else if (value.trim() == "") {
                callback(new Error("用户名称不可为空"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            validator: (rule, value, callback) => {
              if (value.trim() == "") {
                callback(new Error("角色不可为空"));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        mobile: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (value.length > 16) {
                callback(new Error("手机号不可超过16个字符"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        department: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (value.length > 32) {
                callback(new Error("部门不可超过32个字符"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        remark: [
          {
            validator: (rule, value, callback) => {
              value = value.trim();
              if (value.length > 255) {
                callback(new Error("备注不可超过255个字符"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
      },
    }
  },
  computed: {},
  watch: {},
  activated() {
    // 修改白名单状态时列表里需要对应更新
    this.getList();
  },
  created() { },
  mounted() {
    this.getRoleQL(this.getList); // 获取角色列表后再获取系统用户列表
  },
  methods: {
    // 获取角色列表
    getRoleQL(cb) {
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      getRoleDictionary().then(res => {
        loading.close();
        if (res.data.code == 0) {
          this.roleQL = {};
          res.data.data.forEach(item => {
            this.roleQL[item.roleId] = item.name;
          })
          if (cb && typeof (cb) === 'function') {
            cb();
          }
        } else {
          this.$message.error("获取角色字典失败");
        }
      }).catch(err => {
        loading.close();
        console.error("获取角色字典时出错", err);
        this.$message.error("获取角色字典时出错");
      })
    },
    // 每页页码变化
    sizeChange(size) {
      this.pageData.current = 1; // 重置为第一页
      this.pageData.size = size;
      this.getList(1);
    },
    // 获取系统用户列表
    getList(init) {
      if (init === 1) { this.pageData.page = 1 } // 初始化页码
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      getUserList({
        current: this.pageData.current, // 第几页
        size: this.pageData.size, // 每页条数
      }).then(res => {
        loading.close();
        if (res.data.code == 0) {
          if (res.data.data.records instanceof Array && res.data.data.records.length) {
            this.userList = res.data.data.records;
            this.pageData.total = res.data.data.total;
          } else {
            this.userList = [];
            this.pageData.total = 0;
            this.$message.info("系统用户列表为空");
          }
        } else {
          this.$message.error("获取系统用户列表失败");
        }
      }).catch(err => {
        loading.close();
        console.error("获取系统用户列表时出错", err);
        this.$message.error("获取系统用户列表时出错");
      })
    },
    // 启用/禁用
    enableUser(row) {
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      updateUserList({
        userId: row.userId,
        isEnabled: !row.isEnabled
      }).then(res => {
        loading.close();
        if(res.data.code == 0) {
          this.$message.success(row.isEnabled ? "禁用成功" : "启用成功")
          this.getList();
        } else {
          this.$message.error(row.isEnabled ? "禁用失败" : "启用失败")
        }
      }).catch(err => {
        loading.close();
        console.error("操作出错", err)
        this.$message.error("操作出错")
      })
    },
    // 查看详情
    goDetail(row) {
      let key = "systemUserSetDetail_" + row.userId;
      // 由于详情页的租户信息已经在档案列表接口中，需要传递到档案详情
      this.$ls.set(key, row);
      this.$store.commit("spTabAdd", {
        preName: "systemUserSetDetail",
        sp_id: row.userId,
        keepName: "system-user-set-detail",
        title: "系统用户详情",
        path: "/system-user-set-detail",
        query: {
          sp_id: row.userId
        }
      });
    },
    // 显示弹窗
    showDialog(isAdd) {
      this.isAdd = isAdd; // 代表是新增操作
      this.editDialogShow = true; // 显示弹窗
    },
    // 编辑按钮点击
    showEdit(row) {
      this.userData = {
        name: row.name, // 用户名称
        roleId: String(row.roleId), // 角色id
        mobile: row.mobile ? row.mobile : "", // 手机号
        department: row.department ? row.department : "", // 部门
        remark: row.remark ? row.remark : "", // 备注
        userId: row.userId, // userId
      }
      this.showDialog(false); // 显示弹窗，参数表示非新增操作，而是编辑
    },
    // 弹窗关闭
    editDialogClosed() {
      this.userData = {
        name: "", // 用户名称
        roleId: "", // 角色id
        mobile: "", // 手机号
        department: "", // 部门
        remark: "", // 备注
      }
      this.$nextTick(function () {
        this.$refs['userData'].clearValidate(); // 重置弹窗里的表单
      })
    },
    // 保存用户
    saveUser() {
      let ok = false;
      this.$refs['userData'].validate(valid => {
        ok = valid ? true : false;
      })
      if (!ok) { return; }
      let resData = {};
      for(let i in this.userData) {
        if (typeof this.userData[i] == 'string' && this.userData[i].constructor == String) {
          resData[i] = this.userData[i].trim(); // 去除两端的空格
        } else {
          resData[i] = this.userData[i];
        }
      }
      if (!this.isAdd) { // 编辑操作
        resData.userId = this.userData.userId;
        const loading = this.$loading({
          background: "rgba(255,255,255,0.7)"
        });
        updateUserList(resData).then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.$message.success("保存成功");
            this.editDialogShow = false;
            this.getList(); // 更新列表
          } else {
            this.$message.error("保存失败")
          }
        }).catch(err => {
          loading.close();
          console.error("保存出错", err)
          this.$message.error("保存出错")
        })
      } else { // 新增操作
        const loading = this.$loading({
          background: "rgba(255,255,255,0.7)"
        });
        createUserList(resData).then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.$message.success("新增成功");
            this.editDialogShow = false;
            this.getList(); // 更新列表
          } else {
            this.$message.error("新增失败")
          }
        }).catch(err => {
          loading.close();
          console.error("新增出错", err)
          this.$message.error("保存出错")
        })
      }
    },
  }
}