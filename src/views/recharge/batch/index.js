const XLSX = require("xlsx");
const { export_json_to_excel } = require("@/utils/excel/Export2Excel");
import {NumToFix} from "@/utils/index.js"
import {
  batchRecharge,
  batchReissue,
  batchRechargeRecordAdd as batchRecordAdd,
  batchRecordList,
  downFailRecord
} from "@/api/archivesAPI.js";
import {
  openPayTypeQuery,
  operatorTypeQueryList,
} from "@/utils/queryList/queryList.js";
import { splitArr, excelDateFormat } from "@/utils/index.js";
import { excelVerYList } from "@/utils/index.js";
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      tabIndex: 1,
      uploadStep: 1, // 当前上传步骤 1选择文件时 2选择文件后上传文件前 3上传成功 4上传失败
      loading: false, // loading服务实例，单例
      dialog_selectFile: false, // 上传文件弹窗
      uploadMsgShow: false, // 上传文件时信息展示
      uploadMsg: "", // 上传文件时的信息
      selectBtShow: true, // 选择文件的按钮显示
      selectText: "浏览文件", // 选择文件按钮的文本
      uploadBtShow: false, // 上传文件的按钮显示
      sheetData: null, // 存放解析出的excel数组
      excelVerT: null, // excel里的版本号
      recordId: null, // 下载失败记录时的记录id
      failData: [], // 保存行号和错误记录

      recordList_loading: false, // 建档记录加载状态
      recordList: [], // 批量缴费记录列表
      record_page: 1, // 当前页
      record_total: 1, // 总页数
      record_size: 10, // 每页条数
      ops: window.scrollOps, // 滚动条
    };
  },
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {
    // 批量缴费按钮点击
    showCreate() {
      this.dialog_selectFile = true;
    },
    // 选择文件监听
    fileChange(e) {
      let that = this;
      const file = e;
      if (!/\.(xlsm)$/.test(file.name.toLowerCase())) {
        this.$message.error("上传文件格式不正确，请上传xlsm格式文档。");
        this.uploadMsgShow = false;
        return false;
      }
      this.loading = this.$loading({
        text: "Excel读取中...",
        background: "rgba(255,255,255,0.7)"
      });
      this.uploadStep = 2;
      this.uploadMsgShow = true;
      this.uploadMsg = "已选择文件:" + file.name;
      this.selectText = "重选文件";
      this.uploadBtShow = true;
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
            raw: true,
            cellFormula: true,
            cellHTML: true,
            cellNF: true,
            cellText: true,
            cellDates: false,
            // bookProps和bookSheets存在任一true值则报错
            // bookProps: true,
            // bookSheets: true,
            bookVBA: true,
            WTF: true
          }); // 读取数据
          const wsname = workbook.SheetNames[0]; // 取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容
          this.sheetData = ws;
          let sheets = workbook.SheetNames;
          let verIndex; // 版本号在sheet里的index
          sheets.map((value, index) => {
            if (value == "版本号") {
              verIndex = index;
            }
          })
          let verSheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[verIndex]]); // 版本号
          if (verSheet && verSheet instanceof Array && verSheet.length) {
            this.excelVerT = verSheet[0]["版本号"];
          } else {
            this.excelVerT = null;
          }
          console.info(file.name + "--Ver:", this.excelVerT);
          this.loading.close();
        } catch (e) {
          this.loading.close();
          this.$message.error("excel读取发生错误");
          return false;
        }
      };
      fileReader.readAsBinaryString(file.raw);
    },
    testRequiredField(itemData, flagType) {

      let testFlag = true;
      let itemDataKeys = Object.keys(itemData);
      const templateFieldObj = {
        bq: ['补气金额', '补气原因'],
        chongzhi: ['充值金额', '付款方式'],
      };
      let templateFieldArr = templateFieldObj[flagType];
      for (let i = 0, len = templateFieldArr.length; i < len; i++) {
        if (itemDataKeys.indexOf(templateFieldArr[i]) < 0) {
          testFlag = false;
          break;
        }
      };
      return testFlag;
    },
    // 档案模板解析,模板要符合区分特征
    completeFile(sheetData, flag) {
      if (!(sheetData && sheetData instanceof Array)) {
        this.$message.error("Excel内容错误");
        return false;
      }
      //校验上传文件是否含有必填字段
      if(!this.testRequiredField(sheetData[0], flag)) {
        this.$message.error("上传的Excel与模板不匹配");
        return false;
      };
      let recordList = [];   
      try {
        sheetData.forEach((i, index) => {
          let obj = {};
          obj.meterNo = i["表具编号"];
          obj.archivesNo = i["档案编号"];
          obj.userName = i["用户名称"] ? i["用户名称"] : undefined;
          obj.archivesIdentity = i["档案标识"] ? i["档案标识"] : undefined;
          if (flag == "chongzhi") {
            obj.rechargeAmount = NumToFix(i["充值金额"], 2);
            obj.payMode = openPayTypeQuery[i["付款方式"]];
            obj.addressName = i["地址名称"] ? i["地址名称"] : undefined;
          } else {
            obj.rechargeAmount = NumToFix(i["补气金额"], 2);
            obj.reason = i["补气原因"];
          }
          obj.rowNum = i.rowNum;
          recordList.push(obj);
        });
        return recordList;
      } catch (error) {
        return false;
      }
    },
    // 上传excel
    uploadSheet() {
      if (
        !(this.sheetData && this.sheetData instanceof Array)
      ) {
        this.$message.error("Excel内容解析错误");
        return;
      } else if (this.sheetData.length <= 0) {
        this.$message.error("Excel内容为空");
        return;
      } else if (this.sheetData.length > 500) {
        // this.$message.error("一次上传不得超过500条");
        // return;
      }
      this.loading = this.$loading({
        text: "Excel验证及上传...",
        background: "rgba(255,255,255,0.7)"
      });
      this.sheetData = this.sheetData.map((v, index) => {
        v.rowNum = index + 2;
        return v;
      })
      let flag = "chongzhi";
      if (this.sheetData[0]["充值金额"]) {
        flag = "chongzhi"; // 充值模板
        if (this.excelVerT != excelVerYList["批量充值模板"]) {
          this.$message.error("文件校验未通过，请从页面上下载最新的模板！");
          this.loading.close();
          return;
        }
      } else {
        flag = "bq"; // 补气模板
        if (this.excelVerT != excelVerYList["批量补气模板"]) {
          this.$message.error("文件校验未通过，请从页面上下载最新的模板！");
          this.loading.close();
          return;
        }
      }
      // 以每500条数据分割上传
      let recordSplit = splitArr(this.sheetData, 500);
      let validate = true; // 验证分段数据
      let splitAjax = recordSplit.map(item => {
        let data = this.completeFile(item, flag);
        if (!data) {
          validate = false;
        }
        if (flag == "chongzhi") {
          return batchRecharge({
            records: data
          });
        } else {
          return batchReissue({
            records: data
          });
        }
      });
      if (!validate) {
        this.$message.error("上传已终止：Excel分段数据存在错误");
        this.loading.close();
        return;
      }
      let that = this;
      this.axios
        .all(splitAjax)
        .then(
          that.axios.spread(function () {
            that.loading.close();
            that.uploadMsgShow = true;
            that.failData = []; // 失败记录，记录行号和错误信息
            for (let i = 0; i < arguments.length; i++) {
              let item = arguments[i].data;
              if (item.code == 0) {
                if (item.data && item.data.records) {
                  that.failData = that.failData.concat(item.data.records);
                } else {
                  that.$message.error("上传发生错误-数据格式错误");
                }
              } else {
                let msg = res.data && res.data.message ? res.data.message : "返回码错误";
                that.$message.error("上传发生错误：" + msg);
              }
            }
            if (that.failData.length) {
              that.uploadStep = 4;
              that.uploadMsg = `已上传${that.sheetData.length}条数据：${that
                .sheetData.length - that.failData.length}条成功, ${
                that.failData.length
                }条失败`;
            } else {
              that.uploadStep = 3;
              that.uploadMsg = `已上传${that.sheetData.length}条数据：全部成功`;
            }
            // 入库
            that.batchRecordAdd(flag);
          })
        )
        .catch(err => {
          that.loading.close();
          that.$message.error("Excel上传失败");
        });
    },
    // 记录入库
    batchRecordAdd(flag) {
      this.loading = this.$loading({
        text: "正在汇总并保存记录...",
        background: "rgba(255,255,255,0.7)"
      });
      let data = {}; // 待传数据
      data.records = this.failData;
      data.total = this.sheetData.length;
      data.fail = this.failData.length;
      data.success = this.sheetData.length - this.failData.length;
      data.operatorType = flag == 'chongzhi' ? 4 : 5;
      batchRecordAdd(data)
        .then(res => {
          this.loading.close();
          if (res.data.code == 0) {
            this.$message.success("记录保存成功");
            this.recordId = res.data.data.recordId;
          } else {
            let msg = res.data && res.data.message ? res.data.message : "返回码错误";
            this.$message.error("记录保存失败：" + msg);
          }
        })
        .catch(err => {
          this.loading.close();
          this.$message.error("记录保存失败-请求失败");
        });
    },
    // 下载失败记录
    downFailRecord(id) {
      // 区分操作记录中的下载和弹窗中的下载
      if (!id) {
        id = this.recordId;
        if (!id && id != 0) {
          this.$message.error("无法下载失败记录-recordId为空");
          return;
        }
      }
      // 表头标题
      const tHeader = ["错误行数", "错误原因"];
      // 数据key
      const filterVal = ["rowNum", "errorMsg"];
      downFailRecord({ recordId: id })
        .then(res => {
          if (res.data.code == 0) {
            // 数据集
            const list = res.data.data.records;
            const data = this.formatJson(filterVal, list);
            let name = "";
            let date = "";
            if (res.data.data.createStaffName) {
              name = " - " + res.data.data.createStaffName;
            }
            if (res.data.data.createTime) {
              date = " - " + res.data.data.createTime;
            }
            // excel名称 后缀默认xlsx
            const excelName = `错误记录${name}${date}`;
            // tHeader:表头数据 data:表数据 excelName:文件名
            export_json_to_excel(tHeader, data, excelName);
          } else {
            let msg = res.data && res.data.message ? res.data.message : "返回码错误";
            this.$message.error("下载错误记录失败：" + msg);
          }
        })
        .catch(err => {
          this.$message.error("下载错误记录失败-请求失败");
        });
    },
    // 上传弹窗关闭
    dialog_upload_close() {
      this.uploadStep = 1;
      this.uploadMsgShow = false;
      this.uploadMsg = "";
      this.selectText = "浏览文件";
      this.uploadBtShow = false;
      this.dialog_selectFile = false;
    },
    // 切换tab
    sw_tab(index) {
      this.tabIndex = index;
      if (index == 2) {
        this.getRecordList(); // 查询批量缴费记录
      }
    },
    // 每页条数变化
    sizeChange(size) {
      this.record_size = size;
      this.getRecordList(1);
    },
    // 查询批量缴费记录
    getRecordList(init) {
      this.recordList = [];
      this.recordList_loading = true;
      if (init == 1) { this.record_page = 1; }
      batchRecordList({
        current: this.record_page,
        size: this.record_size,
        operatorTypes: "4,5"
      })
        .then(res => {
          this.recordList_loading = false;
          if (res.data.code == 0) {
            if (res.data && res.data.data && res.data.data.records) {
              this.record_total = res.data.data.total;
              this.recordList = res.data.data.records;
            } else {
              this.$message.error("批量缴费记录查询发生错误-数据格式错误");
            }
          } else {
            let msg = res.data && res.data.message ? res.data.message : "返回码错误";
            this.$message.error("批量缴费记录查询失败：" + msg);
          }
        })
        .catch(err => {
          this.recordList_loading = false;
          this.$message.error("批量缴费记录查询遇到错误而中断");
        });
    },
    // 批量缴费类型转字符串
    operatorTypeFormat(row, column, cellValue) {
      if (cellValue) {
        return operatorTypeQueryList[String(cellValue)];
      } else {
        return "";
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};