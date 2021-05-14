import { getRoleDictionary, getPermissionTree, createRole, updateRole, setPermissionTree } from "@/api/systemUserSet.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      roleList: [], // 角色列表
      seletedRow: {}, // 已选择的角色，用于取消时恢复
      roleActiveIndex: -1, // 角色名称列表当前选择的角色，用户激活高亮状态
      // 角色名称
      roleName: {
        name: "", // 角色名称
        roleId: "", // roleId
      },
      // 角色名称校验规则
      roleNameRules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 32) {
                callback(new Error("角色名称不可超过32位"));
              } else if (value.trim() == "") {
                callback(new Error("角色名称不可为空"));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      },
      permissionTree: [], // 权限列表
      permissionDefaultKey: [], // 默认勾选项
      permissionProps: {
        children: 'children',
        label: function (data, node) {
          return data.description;
        },
        disabled: function (data, node) {
          return false;
        }
      }, // 权限列表配置
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      getRoleDictionary().then(res => {
        loading.close();
        if (res.data.code == 0) {
          this.roleList = res.data.data;
        } else {
          this.$message.error("获取角色列表失败");
        }
      }).catch(err => {
        loading.close();
        console.error("获取角色列表时出错", err);
        this.$message.error("获取角色列表时出错");
      })
    },
    // 创建角色
    createRole() {
      if (this.roleList[0].roleId == -99) {
        this.$message.info("已有角色在创建中，请先完成或取消当前的角色创建");
        return;
      }
      this.roleList.splice(0, 0, {
        isCrossDomain: false,
        name: "新角色",
        roleId: "-99"
      })
      this.roleActiveIndex = 0; // 修改高亮项
      this.roleName.name = "新角色"; // 角色名称
      this.roleName.roleId = "-99"; // 角色id
      this.permissionTree = []; // 权限分配置空
      this.$nextTick(function () {
        this.$refs['roleName'].clearValidate(); // 重置表单校验
      })
    },
    // 保存角色
    saveRole() {
      let ok = false;
      this.$refs['roleName'].validate(valid => {
        ok = valid ? true : false;
      })
      if (!ok) { return; }
      if (this.roleName.roleId == null || this.roleName.roleId == -99) { // 新建角色
        const loading = this.$loading({
          background: "rgba(255,255,255,0.7)"
        });
        createRole({
          name: this.roleName.name,
        }).then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.roleName.roleId = res.data.data; // 更新roleId
            let role = {
              name: this.roleName.name,
              roleId: this.roleName.roleId
            }
            this.roleList.splice(this.roleActiveIndex, 1, role); // 更新左侧列表
            this.getTree(); // 获取权限树
            this.$message.success("新建角色成功");
          } else {
            this.$message.error("新建角色失败");
          }
        }).catch(err => {
          loading.close();
          console.error("新建角色时出错", err);
          this.$message.error("新建角色时出错");
        })
      } else { // 编辑角色
        const loading = this.$loading({
          background: "rgba(255,255,255,0.7)"
        });
        updateRole({
          name: this.roleName.name,
          roleId: this.roleName.roleId
        }).then(res => {
          loading.close();
          if (res.data.code == 0) {
            let role = {
              name: this.roleName.name,
              roleId: this.roleName.roleId
            }
            this.roleList.splice(this.roleActiveIndex, 1, role); // 更新左侧列表
            this.$message.success("编辑角色成功");
          } else {
            this.$message.error("编辑角色失败");
          }
        }).catch(err => {
          loading.close();
          console.error("新建角色时出错", err);
          this.$message.error("新建角色时出错");
        })
      }
    },
    // 获取权限树
    getTree() {
      if (this.roleName.roleId == null || this.roleName.roleId == -99) {
        this.permissionTree = [];
        return;
      }
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      getPermissionTree({ roleId: this.roleName.roleId }).then(res => {
        loading.close();
        if (res.data.code == 0) {
          this.permissionTree = res.data.data.children;
          this.permissionDefaultKey = []; // 默认选中项
          // 递归获取选择项
          let dg = (arr) => {
            arr.forEach(item => {
              if (item.check) {
                this.permissionDefaultKey.push(item.groupName);
              }
              if (item.children && item.children instanceof Array && item.children.length) {
                dg(item.children);
              }
            })
          }
          dg(res.data.data.children);
        } else {
          this.$message.error("获取权限树失败");
        }
      }).catch(err => {
        loading.close();
        console.error("获取权限树时出错", err);
        this.$message.error("获取权限树时出错");
      })
    },
    // 编辑角色、角色点击事件
    editRole(row, index) {
      this.seletedRow = row;
      this.roleActiveIndex = index; // 修改高亮项
      this.roleName.name = row.name; // 角色名称
      this.roleName.roleId = row.roleId; // 角色id
      this.getTree(); // 获取权限树
      this.$nextTick(function () {
        this.$refs['roleName'].clearValidate(); // 重置表单校验
      })
    },
    // 权限分配保存
    savePermission() {
      let checkedKeys = this.$refs.permissionTree.getCheckedKeys();
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)"
      });
      setPermissionTree({
        roleId: this.roleName.roleId,
        permissionGroupNames: checkedKeys
      }).then(res => {
        loading.close();
        if (res.data.code == 0) {
          this.$message.success("权限分配成功");
        } else {
          this.$message.error("权限分配失败");
        }
      }).catch(err => {
        loading.close();
        console.error("权限分配时出错", err);
        this.$message.error("权限分配时出错");
      })
    },
    // 右侧取消保存
    cancel() {
      if (this.roleName.roleId == null || this.roleName.roleId == -99) {
        this.roleList.splice(0, 1);
        let row = this.roleList[0];
        this.editRole(row, 0);
        this.roleActiveIndex = 0; // 修改高亮项
        this.roleName.name = row.name; // 角色名称
        this.roleName.roleId = row.roleId; // 角色id
      } else {
        this.editRole(this.seletedRow, this.roleActiveIndex);
      }
    },
  }
}