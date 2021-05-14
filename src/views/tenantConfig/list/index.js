import { tenantList, configure, businessName } from "@/api/tenant.js";
import { hasLetter, convertUTC } from "@/utils/index.js"
export default {
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        // state: '-1', // 租户状态
        // create_time: "", // 创建时间
        nameLike: "", // 租户简称
      },
      stateListQL: {
        '-1': '全部',
        '0': '禁用',
        '1': '正常',
      },
      searchRules: {
        nameLike: [
          { max: 64, message: "租户简称不可超过32个字符", trigger: "change" }
        ],
      },
      tenantList: [], // 租户列表
      page: 1, // 当前页(后端接口页码第一页为0)
      total: 1, // 总条数
      size: 10, // 每页条数
      // 复选框显示复选还是取消复选
      multipleStatus: true, //true为复选
      // 复选框
      multipleSelection: [],
      //抽屉效果
      drawer: false,
      // 修改和业务配置的弹窗
      dialogVisible: false,
      // 表单
      ruleForm2: {
        businessName: '',    //业务名称
        templateType: 2,    //模板类型
        templateNumber: '',  //消息模板编号
        signName: '',        //短信签名名称
      },
      rules2: {
        businessName: [
          { required: true, message: '请选择业务名称', trigger: 'change' }
        ],
        templateType: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        templateNumber: [
          { required: true, message: '请选择消息模板编号', trigger: 'change' }
        ],
        signName: [
          { required: true, message: '请选择短信签名名称', trigger: 'change' }
        ],
      },
      // 业务名称分页器
      businessNamePage: {
        page: 1, //当前页
        total: 0, //总条数
        pageSize: 5, //一页显示的条数
        pages: 0 //总页数
      },
      // 业务名称下拉选择
      businessOptions: [],
      // 取登录用户的等级
      userGrade: this.$ls.get("userGrade"),
      // uiDisplay: {
      //   addTenant: true,
      // }
    }
  },
  mounted() {
    // if (this.$ls.get("userGradeName") == "运维操作员") {
    //   this.uiDisplay.addTenant = false;
    // }
  },
  methods: {
    // 每页页码变化
    sizeChange(size) {
      this.size = size;
      this.getList(1);
    },
    // 租户状态格式化
    tenantStateFormat(row, column, cellValue) {
      if (cellValue) {
        return this.stateListQL[String(cellValue)];
      } else {
        return "";
      }
    },
    // 获取租户列表
    getList(init) {
      if (init === 1) { this.page = 1 } // 初始化页码
      this.$refs['search'].validate(valid => {
        if (valid) {
          let params = {
            page: this.page - 1,
            paged: true,
            size: this.size,
            sort:'id,desc'
          }
          if (this.searchData.nameLike) {
            params.nameLike = String(this.searchData.nameLike).trim();
          }
          const loading = this.$loading({
            target: ".tenant-list.content",
            background: "rgba(255,255,255,0.7)"
          });
          tenantList(params).then(res => {
            loading.close();
            if (res.data && res.data.code == 0) {
              let list = [];
              if (res.data.data && res.data.data.length) {
                res.data.data.forEach(item => {
                  let data = item;
                  data.name = item.name;
                  data.state = item.is_enabled ? "正常" : "已禁用";
                  data.subdomain = item.subdomain;
                  data.create_time = convertUTC(item.create_time);
                  if (item.basic) {
                    // 备注
                    if (item.basic.remark) {
                      data.remark = item.basic.remark;
                    }
                    // 企业名称
                    if (item.basic.company_name) {
                      data.company_name = item.basic.company_name;
                    }
                    // 联系人
                    if (item.basic.contact) {
                      data.contact = item.basic.contact;
                    }
                    // 联系电话
                    if (item.basic.phone) {
                      data.phone = item.basic.phone;
                    }
                  }
                  list.push(data);
                })
              }
              this.tenantList = list;
              this.total = res.data.total_count;
              if (!list.length) {
                this.$message.info("未查询到相关租户");
              }
            } else {
              let msg = "获取租户列表失败-返回码错误";
              if (res.data.message) {
                msg = res.data.message;
              }
              this.$message.error(msg);
            }
          }).catch(err => {
            loading.close();
            if (err != 401 && err != 403) {
              this.$message.error("获取租户列表时遇到了错误");
            }
          })
        }
      })
    },
    // 新增租户
    addTenant() {
      this.$store.commit("spTabAdd", {
        preName: "tenantConfigDetail",
        sp_id: String(Date.parse(new Date())),
        isBlank: true,
        keepName: "tenantConfig-detail",
        title: "新增租户",
        path: "/tenantConfig-detail"
      });
    },
    // 跳转到租户详情
    goDetail(row, column, event) {
      let key = "tenantDetail_" + row.id;
      // 由于详情页的租户信息已经在档案列表接口中，需要传递到档案详情
      this.$ls.set(key, row);
      this.$store.commit('spTabAdd', {
			preName: 'tenantConfigDetail',
			sp_id: row.id,
			keepName: 'tenantConfig-detail',
			title: '租户详情',
			path: '/tenantConfig-detail',
			query: {
				sp_id: row.id,
				realm: row.realm,
			},
		});
    },
    // 表格中的复选框事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 操作取消复选按钮
    cancelSelect() {
      this.multipleStatus = true;
      // 清空复选框的状态
      this.$refs.multipleTable.clearSelection();
      this.drawer = false
    },
    // 控制drawer的出现
    drawerShow() {
      // 当选中的有元素的时候出现
      if (this.multipleSelection.length != 0) {
        this.drawer = true
      }
    },
    // 一键清除
    removeAll() {
      this.multipleSelection = [];
      this.$refs.multipleTable.clearSelection();
      this.drawer = false
    },
    // 单项移除
    removeItem(index, item) {
      // 删除相应index的元素
      this.multipleSelection.splice(index, 1);
      this.tenantList.map((item2, index2) => {
        if (item2.id == item.id) {
          this.$refs.multipleTable.toggleRowSelection(this.tenantList[index2], false)
        }
      })
      if (this.multipleSelection.length == 0) {
        this.drawer = false;
      }
    },
    // 弹窗关闭
    handleClose2(done) {
      this.dialogVisible = false;
      // this.$refs.ruleForm.resetFields();
      // this.msgTemplateName = '';
      // $('.v-modal').css({
      //   "display": "none"
      // });
    },
    // 弹窗取消按钮
    cancel2() {
      this.dialogVisible = false;
    },
    // 消息模板编号下拉触发获取消息模板列表
    getTemplateNo2(visible) {
      if (visible) {
        this.messageTemplateNoPage = {
          page: 1, //当前页
          total: 0, //总条数
          pageSize: 5, //一页显示的条数
          pages: 0 //总页数
        };
        this.getMessageTemplateNo({
          templateCategory: this.ruleForm2.templateType,
          current: this.messageTemplateNoPage.page,
          size: this.messageTemplateNoPage.pageSize
        })
      }
    },
    // 修改或者进行配置
    toConfigure2(obj) {
      return configure(obj).then(res => {
        if (res.data.code == 0) {
          this.dialogVisible = false;
          this.drawer = false;
          this.multipleStatus = true;
          this.$refs.multipleTable.clearSelection();
          this.$message.success("业务配置成功");
        } else if (res.data.code == 330011) {
          this.dialogVisible = false;
          this.$message.error("该报警业务对应的模板配置已经存在");
        } else {
          this.dialogVisible = false;
          this.$message.error("业务配置失败");
        }
      }).catch(err => {
        this.$message.error("业务配置失败-接口请求错误");
      })
    },
    // 表单提交
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let tenantIds = []
          this.multipleSelection.map(item => {
            for (let key in item) {
              if (key == 'id') {
                tenantIds.push(item[key])
              }
            }
          })
          this.toConfigure2({
            notifyBizId: this.ruleForm2.businessName,
            tenantIds: tenantIds,
            msgTemplateId: this.ruleForm2.templateNumber,
            msgSignId: this.ruleForm2.signName,
          })
        } else {
          return false;
        }
      });
    },
    // 获取业务名称
    getBusinessNameList(obj) {
      return businessName(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data && res.data.data) {
            this.businessNamePage.page = res.data.data.current;
            this.businessNamePage.pageSize = res.data.data.size;
            this.businessNamePage.total = res.data.data.total;
            this.businessNamePage.pages = res.data.data.pages;
            if (res.data.data.records) {
              this.businessOptions = res.data.data.records
            } else {
              this.businessOptions = []
            }
          } else {
            this.$message.error(`业务名称列表获取失败`);
          }
        } else {
          let msg = "返回码错误";
          res.data && res.data.message ? msg = res.data.message : 0;
          this.$message.error(`业务名称列表获取失败-${msg}`);
        }
      }).catch(err => {
        this.$message.error("业务名称列表获取失败-接口请求错误");
      })
    },
    getBusinessName(visible) {
      if (visible) {
        this.businessNamePage = {
          page: 1, //当前页
          total: 0, //总条数
          pageSize: 5, //一页显示的条数
          pages: 0 //总页数
        }
        this.getBusinessNameList({
          current: this.businessNamePage.page,
          size: this.businessNamePage.pageSize,
          notifyType: this.ruleForm2.templateType
        })
      }
    },
    // 业务名称翻页
    preChange3() {
      if (this.businessNamePage.page > 1) {
        this.businessNamePage.page = this.businessNamePage.page - 1;
        this.getBusinessNameList({
          current: this.businessNamePage.page,
          size: this.businessNamePage.pageSize,
          notifyType: this.ruleForm2.templateType
        })
      } else {
        this.businessNamePage.page = 1
      }
    },
    nextChage3() {
      if (this.businessNamePage.page < this.businessNamePage.pages) {
        this.businessNamePage.page = this.businessNamePage.page + 1;
        this.getBusinessNameList({
          current: this.businessNamePage.page,
          size: this.businessNamePage.pageSize,
          notifyType: this.ruleForm2.templateType
        })
      } else {
        this.businessNamePage.page = this.businessNamePage.pages
      }
    },
    //开启弹窗，数据初始化
    openDialog2() {
      this.dialogVisible = true;
      this.ruleForm2 = {
        businessName: '',    //业务名称
        templateType: 2,    //模板类型
        templateNumber: '',  //消息模板编号
        signName: '',        //短信签名名称
      };
      this.msgTemplateName = '';
    }
  },
  watch: {
    'ruleForm2.templateType': function (val) {
      this.ruleForm2.templateNumber = '';
      this.msgTemplateName = '';
      this.ruleForm2.signName = ''
    }
  },
  activated() {
    // 刷新列表，避免数据覆盖
    this.getList();
    // 隐藏列表
    this.drawer = false
  }
}