<template>
  <el-dialog
    class="dialogAddResource"
    :visible.sync="isShowDialog"
    width="640px"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <div slot="title" class="header-title">
      <img class="columnIcon" src="@/assets/imgs/taxIcon.png" />
      <span class="title-age">票据打印</span>
    </div>
    <div class="dialog_resource--content">
      <el-form
        ref="addTaxForm"
        label-width="120px"
        label-position="left"
        class="ruleForm"
        :model="details"
      >
        <el-form-item label="选择打印机：" class="item item-right" prop="taxRate">
          <el-select v-model="printId" style="width:100%">
            <el-option key label="默认打印机" value></el-option>
            <el-option
              v-for="item in printList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="previewPrint">预览</el-button>
      <el-button size="small" type="primary" @click="onOkPrint">打印</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from "lodash";
import { onOkPrintLodop, previewPrintLodop } from "./lodop.js";
import { getChargePrintInfo, getUserInfo } from "@/api/paperPrint.js";
import { getLodop } from "@/api/LodopFuncs";

export default {
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      isShowDialog: false,
      details: {
        businessNo: "",
        costRecordId: ""
      },
      printId: "",
      printList: []
    };
  },
  props: {
    showPaperDialog: {
      type: Boolean,
      default: false
    },
    propDetails: {
      type: Object,
      default: {}
    }
  },
  created() {},
  watch: {
    showPaperDialog(newVal) {
      if (newVal) {
        let LODOP = getLodop();
        let count = 0;
        try {
          count = LODOP.GET_PRINTER_COUNT();
          let _list = [];
          for (let i = 0; i < count; i++) {
            let msg = LODOP.GET_PRINTER_NAME(i);
            let _json = {
              value: i,
              text: msg
            };
            _list.push(_json);
          }
          this.printList = _list;
          this.isShowDialog = newVal;
          this.details = {
            businessNo:
              this.propDetails.costOperationType == 3 ||
              this.propDetails.costOperationType == 4
                ? "reissue"
                : "charge",
            costRecordId: this.propDetails.costRecordId,
            reprintFlag:this.propDetails.reprintFlag
          };
          // 获取用户的企业信息
          getUserInfo().then(res => {
            if (res.data.code == "0") {
              this.$ls.set("userNameComp", res.data.data.name);
            }
          });
        } catch {
          this.closeFrormDialog();
        }
      }
    }
  },
  methods: {
    previewPrint() {
      // previewPrintLodop()
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getChargePrintInfo({
        businessNo: this.details.businessNo,
        costRecordId: this.details.costRecordId,
        reprintFlag:this.details.reprintFlag
      })
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            let _data = {};
            try {
              let _chargeReceiptData = res.data.data.chargeReceiptData
                .replace("{", "")
                .replace("}", "")
                .split(", ");

              (_chargeReceiptData || []).forEach(item => {
                // 对接发票平台，二维码特殊处理
                if(item.indexOf('qr_code=')>-1){
                    _data['qr_code'] = item.slice(8);
                }else{
                    let _itemData = item.split("=");
                    _data[_itemData[0]] = _itemData[1];
                }
              });
            } catch {
              this.$message.error("数据有问题，无法转化成正常数据");
            }
            res.data.data.templateStyle = res.data.data.templateStyle
            .replace("if(type == 'pre')","LODOP.SET_PRINTER_INDEX(printId);if(type == 'pre')")
            previewPrintLodop(_data, this.printId, res.data.data.templateStyle);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error(err.message);
        });
    },
    onOkPrint() {
      const loadingPrin = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getChargePrintInfo({
        businessNo: this.details.businessNo,
        costRecordId: this.details.costRecordId,
        reprintFlag:this.details.reprintFlag
      })
        .then(res => {
          loadingPrin.close();
          if (res.data.code == 0) {
            let _data = {};
            try {
              let _chargeReceiptData = res.data.data.chargeReceiptData
                .replace("{", "")
                .replace("}", "")
                .split(", ");

              (_chargeReceiptData || []).forEach(item => {
                // 对接发票平台，二维码特殊处理
                if(item.indexOf('qr_code=')>-1){
                    _data['qr_code'] = item.slice(8);
                }else{
                    let _itemData = item.split("=");
                    _data[_itemData[0]] = _itemData[1];
                }
              });
            } catch {
              this.$message.error("数据有问题，无法转化成正常数据");
            }
            res.data.data.templateStyle = res.data.data.templateStyle
            .replace("if(type == 'pre')","LODOP.SET_PRINTER_INDEX(printId);if(type == 'pre')")
            onOkPrintLodop(_data, this.printId, res.data.data.templateStyle);
            this.closeDialog();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loadingPrin.close();
          this.$message.error(err.message);
        });
    },
    closeDialog() {
      this.isShowDialog = false;
      this.$emit("concel");
    },
    closeFrormDialog() {
      this.isShowDialog = false;
      this.$emit("closeFrormCostDialog");
    }
  }
};
</script>
<style lang="scss" scoped>
.columnIcon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}

::v-deep .el-dialog__body {
  padding: 0 5px 0 0 !important;
  min-height: 210px;
}
.dialog_resource--content {
  padding: 24px 35px 0 40px;
  height: 164px;
  position: relative;
  .operation {
    color: #ababab;
    position: absolute;
    bottom: 0px;
    left: 40px;
    font-size: 14px;
    margin-top: 30px;
    // padding-left: 10px;
    .operation_div {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
.dialog-footer {
  text-align: left;
  // padding-left: 20px;
}
</style>