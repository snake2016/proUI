<template>
  <el-dialog
      :visible.sync="isShowDialog"
      width="760px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @closed='closeDialog'
      custom-class="dialogInvoicePrint"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/taxIcon.png" />
        <span class="title-age">发票打印</span>
      </div>
     
      <div class="dialog-invoice-print-content">
         <vue-scroll :ops="ops" ref="modelScroll">
        <el-form
          ref="printInvoicePrintForm"
          label-width="140px"
          label-position="left"
          class="ruleForm"
          :model="detailsForm"
          :rules="tableRules"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="开票类型：" class="item item-right" prop='invoiceType'>
                <el-radio-group v-model="detailsForm.invoiceType">
                  <el-radio :label="0">个人/非企业单位</el-radio>
                  <el-radio :label="1">企业单位</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="发票抬头：" id="userName" class="item item-right" prop='userName'>
                <el-input v-model='detailsForm.userName' placeholder="请输入发票抬头"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="detailsForm.invoiceType == 1">
              <el-form-item label="纳税人识别号：" id="taxpayerIdentity" class="item item-right" prop='taxpayerIdentity'>
                  <el-input v-model='detailsForm.taxpayerIdentity'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址：" class="item item-right" prop='address'>
                  <el-input v-model='detailsForm.address'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="开户行：" class="item item-right" prop='openBank'>
                  <el-input v-model='detailsForm.openBank'></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="24">
              <el-form-item label="开户帐号：" class="item item-right" prop='bankAccount'>
                  <el-input v-model='detailsForm.bankAccount'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话：" class="item item-right" prop='phoneNumber'>
                  <el-input v-model='detailsForm.phoneNumber'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票人：" id="drawer" class="item item-right" style="padding-left: 16px" prop='drawer'>
                  <el-input v-model='detailsForm.drawer'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="operation">
          <div class="operation-title">
            费用明细
          </div>
          <div class="operation-content">
            <ul class="operation-list-ul" v-if="detailList.length > 0">
              <li v-for="(item,index) in detailList" :key="index+'19999002'">
                <div class="list-ul-item">
                  <span class="label">费用类型：</span><span class="content">{{modityT[item.costType]}}</span>
                </div>
                <div class="list-ul-item">
                  <span class="label">税率：</span><span class="content">{{item.taxRate}}</span>
                </div>
                <div class="list-ul-item">
                  <span class="label">税率编码：</span><span class="content">{{item.taxCode}}</span>
                </div>
                <div class="list-ul-item">
                  <span class="label">金额：</span><span class="content">{{item.paidAmount}}</span>
                </div>
              </li>
            </ul>
            <div class="empty-data-icon" v-else>
              暂无数据
            </div>
            <div class="operation-content-time">
              开票日期：{{nowDate}}
            </div>
          </div>
        </div>
        </vue-scroll>
      </div>
      
      <div slot="footer" class="invoice-dialog-footer">
        <el-button type="primary" size="small"   @click="openIntercept('pdf')" >打印PDF</el-button>
        <el-button size="small" type="primary"  @click="openIntercept" >二维码开票</el-button>
      </div>
    </el-dialog>
</template>
<script>
import {getInvoicebuyerInfo, openingIntercept,getInterceptPDF,getCostRecordsList,getTaxRateInfo} from "@/api/invoicePrint";
import { exportReport } from "@/api/reportAPI";
import { getLodop } from "@/api/LodopFuncs";
import {onPrint} from "./lodop.js"
import _ from 'lodash';

export default {
  data(){
    return {
      ops: window.scrollOps, // 滚动条
      Operator:'',
      nowDate:'',
      isShowDialog: false,
      invoiceType: 0,
      modityT: this.$ls.get('DataList').costType.ids,
      modityChinece: {
        "气费":11,
        "清水费":21 ,
        "污水费":22,
        "垃圾费":91,
        "开户费":92,
        "过户费":93,
        "IC卡费":94,
        "安装费":95,
        "改装费":96,
        "维修费": 97
      },
      detailsForm:{
        invoiceType:0,// 发票类型
        userName: '',// 发票抬头
        taxpayerIdentity:'',// 纳税人识别号
        address: '', // 地址
        openBank: '',// 开户行
        bankAccount: '',// 开户账号
        archivesNo: '',//档案编号
        costRecordIdStr: '',//  费用明细记录ID，costRecordIdStr长度不能超过128位
        invoiceBuyerId:'', //发票购方信息ID，第一次开具可不填，后面需要必填
        phoneNumber: '', //购方联系电话，phoneNumber长度不能超过12位
        drawer:'', //发票人
      },
       tableRules: {
         invoiceType:[{
            required: true,message: "请选择发票类型", trigger: "change" 
          }],
        userName: [{ required: true, message: "请输入发票抬头", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if(value==null||value.toString().trim()==''){
                return callback('请输入发票抬头')
              }
              if(value.toString().trim().length>32){
                return callback('请勿超过32字数')
              }
              callback();
            }
          }
        ],
        taxpayerIdentity: [{
          required: true,message: "请输入纳税人识别号", trigger: "change"
        },{
          validator: (rule, value, callback) => {
              if(value==null||value.toString().trim()==''){
                return callback('请输入纳税人识别号')
              }
              if(value.toString().trim().length>20){
                return callback('请勿超过20字数')
              }
              callback();
            }
        }],
        drawer: [{
          required: true,message: "请输入开票人", trigger: "change"
        },{
          validator: (rule, value, callback) => {
              if(value==null||value.toString().trim()==''){
                return callback('请输入开票人')
              }
              if(value.toString().trim().length>8){
                return callback('请勿超过8字数')
              }
              callback();
            }
        }],
        address: [{
          validator: (rule, value, callback) => {
            if(value==null||value.toString().trim()==''){
                return callback()
              }
              if(value.toString().trim().length>32){
                return callback('请勿超过32字数')
              }
              callback();
            }
        }],
        openBank:[{
          validator: (rule, value, callback) => {
              if(value==null||value.toString().trim()==''){
                return callback()
              }
              if(value.toString().trim().length>32){
                return callback('请勿超过32字数')
              }
              callback();
            }
        }],
        bankAccount:[{
          validator: (rule, value, callback) => {
              if(value==null||value.toString().trim()==''){
                return callback()
              }
              if(!/^[0-9]*$/g.test(value)){
                 return callback('开户账号为数字格式')
              }
              if(value.toString().trim().length>32){
                return callback('请勿超过32字数')
              }
              callback();
            }
        }],
        phoneNumber:[{
          validator: (rule, value, callback) => {
            if(value==null||value.toString().trim()==''){
                return callback()
              }
              if(value.toString().trim().length>12){
                return callback('请勿超过12字数');
              }
              callback();
            }
        }]
      },
      detailList:[],
      radio: '',
      pdfloading: false,
      erLoading: false
    }
  },
  props:{
    showInvoiceDialog:{
        type: Boolean,
        default: false
    },
    details:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    feeDetails:{
      type: Boolean,
      default: false
    }
  },
  watch:{
    showInvoiceDialog(newVal){
      this.isShowDialog = newVal;
      if(newVal){
        this.getInvoiceInfo();
        if(this.feeDetails){
          this.getCostRecords();
        }else{
          getTaxRateInfo({costItemType:this.details.costType}).then((res)=>{
            if(res.data.code ==0){
              let _details = _.cloneDeep(this.details);
              _.set(_details,'taxCode',res.data.data.taxCode)
              _.set(_details,'taxRate',res.data.data.taxRate)
              this.detailList = [_details]
            }else{
              this.detailList = [];
              this.$message.error(res.data.message)
            }
          }).catch(err=>{
            this.$message.error(err.message)
          })
        }
        
      } 
    }
  },
  created(){
    let date = new Date().toLocaleDateString().replace(/\//g, "-");
    this.nowDate = date; //操作人
    let user = this.$ls.get("userInfo");
    this.Operator = user.staffName; //操作时间
  },
  methods:{
    //  购方信息
    getInvoiceInfo(){
      getInvoicebuyerInfo({
        archivesNo:this.details.archivesNo
      }).then((res)=>{
        if(res.data.code ==0){
          if(res.data.data&&res.data.data.taxpayerIdentity){
            this.invoiceType = 1;
          }
          this.detailsForm = {
            invoiceType: this.invoiceType,
            address: _.get(res.data.data,'address',''), // 地址
            archivesNo: this.details.archivesNo,
            bankAccount:  _.get(res.data.data,'bankAccount',''),
            costRecordIdStr: this.details.costRecordIdStr,
            invoiceBuyerId: _.get(res.data.data,'invoiceBuyerId',''),
            openBank:  _.get(res.data.data,'openBank',''),
            phoneNumber:  _.get(res.data.data,'phoneNumber',''),
            taxpayerIdentity: _.get(res.data.data,'taxpayerIdentity',''),
            userName: _.get(res.data.data,'userName',''),
            drawer: _.get(res.data.data,'drawer','')
          }
        }
      })
    },
    //获取缴费详情
    getCostRecords(){
      getCostRecordsList({
        payRecordId: this.details.payRecordId
      }).then((res)=>{
        if(res.data.code == 0){
          this.detailList = (res.data.data || [])
        }
      })
    },
    //发票开具
    openIntercept(attr){
      for (let i in this.detailsForm) {
        if (
          typeof this.detailsForm[i] == "string" &&
          this.detailsForm[i].constructor == String
        ) {
          this.detailsForm[i] = this.detailsForm[i].trim();
        }
      }
      this.$refs.printInvoicePrintForm.validate(valid => {
        if(valid){
          
          let _attr = {
            address: this.detailsForm.address, // 地址
            archivesNo: this.details.archivesNo,
            bankAccount: this.detailsForm.bankAccount,
            costRecordIdStr: this.detailsForm.costRecordIdStr,
            invoiceBuyerId:this.detailsForm.invoiceBuyerId,
            openBank: this.detailsForm.openBank,
            phoneNumber: this.detailsForm.phoneNumber,
            taxpayerIdentity:this.detailsForm.invoiceType==0?"":this.detailsForm.taxpayerIdentity,
            userName: this.detailsForm.userName,
            drawer: this.detailsForm.drawer
          }
          if(attr !=='pdf'){
             let LODOP = getLodop();
            let count =  0;
            try{
              count = LODOP.GET_PRINTER_COUNT();
            }catch{
              return this.closeFrormDialog();
            }
          }
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          openingIntercept(_attr).then((res)=>{
            loading.close();
            if(res.data.code == 0){
              if(attr === 'pdf'){
                this.getPDF(res.data.data)
              }else{
                onPrint(res.data.data);
                if(!this.feeDetails){
                  this.$emit('resetListData')
                }
                this.$emit('onOkAfterConcel');
                this.closeDialog()
              }
            }else{
              this.$message.error(res.data.message)
            }
          }).catch((err)=>{
            loading.close();
            if(err&&err.toString().indexOf('timeout') != -1){
              this.$message.error('请求超时');
            }else{
              this.$message.error(err.message);
            }
          })
        }else{
          if(this.detailsForm.invoiceType == 1){
            if(!this.detailsForm.userName || !this.detailsForm.taxpayerIdentity){
              this.$refs["modelScroll"].scrollIntoView("#userName", 500); //将滚动条定位到出错的位置 
            }else{
                this.$refs["modelScroll"].scrollIntoView("#drawer", 500); //将滚动条定位到出错的位置
            }                
          };
          if(this.detailsForm.invoiceType == 0){
            if(!this.detailsForm.userName){
              this.$refs["modelScroll"].scrollIntoView("#userName", 500); //将滚动条定位到出错的位置 
            }else{
                this.$refs["modelScroll"].scrollIntoView("#drawer", 500); //将滚动条定位到出错的位置
            }                
          };
            
        }
      })
      
    },
    //  获取pdf
    getPDF(attr){
      let myObj = {
        method: "get",
        url: "/cpm/invoice/getPDF?invoiceNo="+attr.invoiceNo,
        fileName: "发票打印.pdf"
      };
      exportReport(myObj, "pdf")
      this.$message.success('正在打印，请稍后');
      if(!this.details.noShowRecordList){
        this.$emit('resetListData')
      }
      this.closeDialog()
    },
    onPri(){
      let _data = {
        tenantName:"wxqtenant",
        userName:"cf-202004220006",
        invoiceCode:"150000020026",
        invoiceNo:"00428517",
        createDate:"2020-05-11",
        wechatUrl:"http://wxqyh.51fapiao.cn/eyun/scan/eZ2t5tVoAFs9lK11RJj1kI5x3gC95Q5Qerct7X9x4cSw1bpnIzQmFnhwsQ0tH0i_4dbXOhcGrtXIckEbEX7bjzNXxt3YMd3Lz5hRUDPQsDveNrqweUnWKfpJ3lUZPMXYJo1iF7WOyiiyVhJ5LuRKQU4uLKAiyeKmmpAKF0YkxlM|offline:v1.0.do?fpdm=150000020026&fphm=00428517&fpje=200.00",
        invoiceAmt:"200.00",
        realAmt:"200.00",
        otherCostAmt:"0",
        qrcode:null
      }
      onPrint(_data)
    },
    closeFrormDialog(){
      this.isShowDialog = false;
      this.$emit('closeFrormCostDialog')
    },
    closeDialog(){
      this.detailsForm={
        invoiceType:0,// 发票类型
        userName: '',// 发票抬头
        taxpayerIdentity:'',// 纳税人识别号
        address: '', // 地址
        openBank: '',// 开户行
        bankAccount: '',// 开户账号
        archivesNo: '',//档案编号
        costRecordIdStr: '',//  费用明细记录ID，costRecordIdStr长度不能超过128位
        invoiceBuyerId:'', //发票购方信息ID，第一次开具可不填，后面需要必填
        phoneNumber: '', //购方联系电话，phoneNumber长度不能超过12位
        drawer:'', //发票人
      };
      this.$refs.printInvoicePrintForm.resetFields()
      this.isShowDialog = false;
      this.$emit('concel')  
    }
  }
}
</script>
<style lang="scss" scoped>
dialogInvoicePrint
::v-deep .el-dialog__header{
  border-bottom: 1px solid #ddd;
}
::v-deep .el-dialog__body{
  padding: 0 5px 0 0!important;
}
::v-deep .el-dialog__footer{
  box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
}
 .columnIcon {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-right: 8px;
  }
  .dialog-invoice-print-content{
    padding: 10px 15px;
    height: 380px;
    // overflow: auto;
    .ruleForm{
      padding: 0 20px;
    }
  }
  
  .operation {
    background: #F5F8FF;
    padding: 10px;
    margin:0 20px;
    .operation-title{
      width:56px;
      height: 40px;
      font-size:14px;
      font-family:SourceHanSansCN-Medium,SourceHanSansCN;
      font-weight:550;
      color:rgba(34,34,34,1);
      line-height:40px;
    }
    .operation-content{
      .operation-list-ul{
        width: 100%;
        padding: 0 0 16px;
        li{
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .list-ul-item{
            width: 20%;
            color:rgba(102,102,102,1);
            padding-right: 4px; 
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .label{
              width:70px;  
            }
            .content{
              flex: 1;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            &:nth-of-type(3){
              flex: 1
            }
          }
        }
      }
    }
    .operation-content-time{
      width: 100%;
      height: 20px;
      line-height: 20px;
      color:rgba(153,153,153,1);
      text-align: right;
    }
    .empty-data-icon{
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: rgba(153,153,153,1);
    }
  }
</style>