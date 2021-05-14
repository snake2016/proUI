import {
  messageList,
  messageTemplateNo,
  msgSignName,
  configure
} from "@/api/tenant.js"
export default {
  data() {
    return {
      activeService: 2,//当前活跃的模块1.微信 2.短信
      // 消息业务配置对应的表格
      messageServiceTable: [],
      // 分页器
      messageServicePD: {
        page: 1,
        total: 0,
        pageSize: 10
      },
      // 修改和业务配置的弹窗
      dialogVisible: false,
      // 存储当前的弹窗对应的item
      currentRow: '',
      // 表单
      ruleForm: {
        templateType: '',    //模板类型
        templateNumber: '',  //消息模板编号
        signName: '',        //短信签名名称
      },
      rules: {
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
      // 获取用户名
      userName: this.$ls.get("userInfo").staffName || "",
      // 消息模板下拉选择
      templateNoOptions: [],
      // 消息模板编号下拉框中分页器
      messageTemplateNoPage: {
        page: 1, //当前页
        total: 0, //总条数
        pageSize: 5, //一页显示的条数
        pages: 0 //总页数
      },
      // 存储当前的消息模板名称
      msgTemplateName: '',
      // 短信签名名称下拉选择
      signNameOptions: [],
      // 短信签名名称下拉框中的分页器
      msgSignNamePage: {
        page: 1, //当前页
        total: 0, //总条数
        pageSize: 5, //一页显示的条数
        pages: 0 //总页数
      },
      ops: window.scrollOps, // 滚动条
    }
  },
  methods: {
    // 分页的操作
    handleSizeChange(size) {
      this.messageServicePD.pageSize = size;
      this.messageServicePD.page = 1;
      this.getMessageList(true);
    },
    handleCurrentChange(page) {
      this.messageServicePD.page = page;
      this.getMessageList(true);
    },
    // 获取消息模板列表
    getMessageList(flag) {
      var loading;
      if (flag) {
        loading = this.$loading({
          target: ".meaasge-service-content",
          background: "rgba(255,255,255,0.7)"
        });
      }
      return messageList({
        current: this.messageServicePD.page,
        size: this.messageServicePD.pageSize,
        categoryId: this.activeService,
        tenantId: this.tenantId
      }).then(res => {
        if (flag) {
          loading.close();
        }
        if (res.data.code == 0) {
          if (res.data && res.data.data) {
            this.messageServicePD.page = res.data.data.current;
            this.messageServicePD.pageSize = res.data.data.size;
            this.messageServicePD.total = res.data.data.total;
            if (res.data.data.records) {
              // this.messageServiceTable = res.data.data.records;
              let middleData = res.data.data.records;
              // 处理数据
              middleData.map(item => {
                for (let key in item) {
                  if (item[key] == null || item[key] === '') {
                    item[key] = '--'
                  }
                }
              })
              this.messageServiceTable = middleData
            } else {
              this.messageServiceTable = []
            }
          } else {
            this.$message.error(`消息模板列表查询失败`);
          }
        } else {
          let msg = "返回码错误";
          res.data && res.data.message ? msg = res.data.message : 0;
          this.$message.error(`消息模板列表查询失败-${msg}`);
        }
      }).catch(err => {
        if (flag) {
          loading.close();
        }
        this.$message.error("消息模板列表查询失败-接口请求错误");
      })
    },
    // 切换微信
    weixinChange() {
      this.activeService = 1;
      this.messageServicePD = {
        page: 1,
        total: 0,
        pageSize: 10
      }
      this.getMessageList(true);
    },
    //切换短信
    duanxinChange() {
      this.activeService = 2;
      this.messageServicePD = {
        page: 1,
        total: 0,
        pageSize: 10
      }
      this.getMessageList(true);
      // setTimeout(() => {
      this.$nextTick(() => {
        this.$refs["tableHeight"].doLayout()
      })
      // }, 1)
    },
    // 关闭弹窗
    handleClose(done) {
      this.dialogVisible = false;
      // 重置表单，重新开始校验
      // this.$refs.ruleForm.resetFields();
      // $('.v-modal').css({
      //   "display": "none"
      // });
    },
    cancel() {
      this.dialogVisible = false;
      // this.$refs.ruleForm.resetFields();
      // $('.v-modal').css({
      //   "display": "none"
      // });
    },
    // 开启弹窗
    openDialog(index, row) {
      this.dialogVisible = true;
      this.currentRow = row;
      // console.log(row, 'row');
      if (row.msgTemplateCode != '--') {
        this.ruleForm["templateType"] = this.activeService;
        // this.ruleForm["templateNumber"] = row.msgTemplateId;
        // this.ruleForm["signName"] = row.msgSignName;
        // this.msgTemplateName = row.msgTemplateName;
        this.getMessageTemplateNo({
          templateCategory: this.ruleForm.templateType,
          size: 999
        }).then(() => {
          this.templateNoOptions.map(item => {
            if (item.msgTemplateId == row.msgTemplateId) {
              this.ruleForm["templateNumber"] = item.msgTemplateId;
              this.msgTemplateName = item.msgTemplateName;
            }
          })
        })
        if (row.msgSignName != '--') {
          this.getMessageSignName({
            size: 999
          }).then(() => {
            this.signNameOptions.map(item => {
              if (item.msgSignId == row.msgSignId) {
                this.ruleForm["signName"] = item.msgSignId;
              }
            })
          })
        }
      } else {
        this.msgTemplateName = '';
        // 单选框所在的状态
        this.ruleForm = {
          templateType: this.activeService,    //模板类型
          templateNumber: '',  //消息模板编号
          signName: '',        //短信签名名称
        };
      }
    },
    // 业务配置提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.toConfigure({
            notifyBizId: this.currentRow.notifyBizId,
            tenantIds: [this.tenantId],
            msgTemplateId: this.ruleForm.templateNumber != '--' ? this.ruleForm.templateNumber : '',
            msgSignId: this.ruleForm.signName != '--' ? this.ruleForm.signName : '',
            bizMsgTemplateId: this.currentRow.bizMsgTemplateId != '--' ? this.currentRow.bizMsgTemplateId : ''
          });
          // this.$refs.ruleForm.resetFields();
        } else {
          return false;
        }
      });
    },
    //请求消息模板编号列表
    getMessageTemplateNo(obj) {
      return messageTemplateNo(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data && res.data.data) {
            this.messageTemplateNoPage.page = res.data.data.current;
            this.messageTemplateNoPage.pageSize = res.data.data.size;
            this.messageTemplateNoPage.total = res.data.data.total;
            this.messageTemplateNoPage.pages = res.data.data.pages;
            if (res.data.data.records) {
              this.templateNoOptions = res.data.data.records
            } else {
              this.templateNoOptions = []
            }
          } else {
            this.$message.error(`消息模板编号列表查询失败`);
          }
        } else {
          let msg = "返回码错误";
          res.data && res.data.message ? msg = res.data.message : 0;
          this.$message.error(`消息模板编号列表查询失败-${msg}`);
        }
      }).catch(err => {
        this.$message.error("消息模板编号列表查询失败-接口请求错误");
      })
    },
    // 消息模板编号下拉触发获取消息模板列表
    getTemplateNo(visible) {
      if (visible) {
        this.messageTemplateNoPage = {
          page: 1, //当前页
          total: 0, //总条数
          pageSize: 5, //一页显示的条数
          pages: 0 //总页数
        };
        this.getMessageTemplateNo({
          templateCategory: this.ruleForm.templateType,
          current: this.messageTemplateNoPage.page,
          size: this.messageTemplateNoPage.pageSize
        })
      }
    },
    // 消息模板编号select选中的值发生改变时候触发
    selectChange(val) {
      this.templateNoOptions.find(item => {
        if (item.msgTemplateId == val) {
          this.msgTemplateName = item.msgTemplateName;
        }
      });
    },
    // 消息模板编号翻页
    preChange() {
      if (this.messageTemplateNoPage.page > 1) {
        this.messageTemplateNoPage.page = this.messageTemplateNoPage.page - 1;
        this.getMessageTemplateNo({
          templateCategory: this.ruleForm.templateType,
          current: this.messageTemplateNoPage.page,
          size: this.messageTemplateNoPage.pageSize
        })
      } else {
        this.messageTemplateNoPage.page = 1
      }
    },
    nextChage() {
      if (this.messageTemplateNoPage.page < this.messageTemplateNoPage.pages) {
        this.messageTemplateNoPage.page = this.messageTemplateNoPage.page + 1;
        this.getMessageTemplateNo({
          templateCategory: this.ruleForm.templateType,
          current: this.messageTemplateNoPage.page,
          size: this.messageTemplateNoPage.pageSize
        })
      } else {
        this.messageTemplateNoPage.page = this.messageTemplateNoPage.pages
      }
    },
    // 获取短信签名名称
    getMessageSignName(obj) {
      return msgSignName(obj).then(res => {
        if (res.data.code == 0) {
          if (res.data && res.data.data) {
            this.msgSignNamePage.page = res.data.data.current;
            this.msgSignNamePage.pageSize = res.data.data.size;
            this.msgSignNamePage.total = res.data.data.total;
            this.msgSignNamePage.pages = res.data.data.pages;
            if (res.data.data.records) {
              this.signNameOptions = res.data.data.records
            } else {
              this.signNameOptions = []
            }
          } else {
            this.$message.error(`短信签名名称列表查询失败`);
          }
        } else {
          let msg = "返回码错误";
          res.data && res.data.message ? msg = res.data.message : 0;
          this.$message.error(`短信签名名称列表列表查询失败-${msg}`);
        }
      }).catch(err => {
        this.$message.error("短信签名名称列表查询失败-接口请求错误");
      })
    },
    // 短信签名名称下拉触发获取签名名称列表
    getMsgSignName(visible2) {
      if (visible2) {
        this.msgSignNamePage = {
          page: 1, //当前页
          total: 0, //总条数
          pageSize: 5, //一页显示的条数
          pages: 0 //总页数
        };
        this.getMessageSignName({
          current: this.msgSignNamePage.page,
          size: this.msgSignNamePage.pageSize,
          // signName: this.currentRow.msgSignName != '--' ? this.currentRow.msgSignName : ''
        })
      }
    },
    // 短信名称翻页
    preChange2() {
      if (this.msgSignNamePage.page > 1) {
        this.msgSignNamePage.page = this.msgSignNamePage.page - 1;
        this.getMessageSignName({
          current: this.msgSignNamePage.page,
          size: this.msgSignNamePage.pageSize,
          // signName: this.currentRow.msgSignName != '--' ? this.currentRow.msgSignName : ''
        })
      } else {
        this.msgSignNamePage.page = 1
      }
    },
    nextChage2() {
      if (this.msgSignNamePage.page < this.msgSignNamePage.pages) {
        this.msgSignNamePage.page = this.msgSignNamePage.page + 1;
        this.getMessageSignName(
          {
            current: this.msgSignNamePage.page,
            size: this.msgSignNamePage.pageSize,
            // signName: this.currentRow.msgSignName != '--' ? this.currentRow.msgSignName : ''
          }
        )
      } else {
        this.msgSignNamePage.page = this.msgSignNamePage.pages
      }
    },
    // 修改或者进行配置
    toConfigure(obj) {
      return configure(obj).then(res => {
        if (res.data.code == 0) {
          this.dialogVisible = false;
          this.$message.success("业务配置成功");
          // $('.v-modal').css({
          //   "display": "none"
          // });
          this.getMessageList(true);
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
    }
  },
  created() {
    // this.getMessageList()
  },
  watch: {
    'ruleForm.templateType': function (newVal, oldVal) {
      if (!(newVal == this.activeService && this.ruleForm.templateNumber == this.currentRow.msgTemplateId)) {
        this.ruleForm.templateNumber = '';
        this.msgTemplateName = '';
        this.ruleForm.signName = ''
      }
    },
    $route(to, from) {
      if (this.curTab == 6 && this.sp_id == to.query.sp_id) {
        this.getMessageList(false);
      }
    }
  }
}