<!--
 * @Author: spp
 * @Date: 2021-01-06 20:14:10
 * @LastEditors: spp
 * @LastEditTime: 2021-01-20 14:36:24
 * @FilePath: \ui\src\views\orgManagement\departStaffManage\certifym.vue
-->
<template>
    <div class="certifym-wrap">
        <div class="title" v-if="!hideTitle">
            <img
            class="columnIcon"
            v-if="!this.selectedData.tenant_organization.is_locked"
            src="@/assets/imgs/部门icon.png"
            />
            <img class="columnIcon" v-else src="@/assets/imgs/部门icon-灰.png" />
            <span
            :class="[{'span-isLocked-title': !!this.selectedData.tenant_organization.is_locked}]"
            >{{this.selectedData.name}}</span>
        </div>
      <el-row class="search-wrap">
          <!-- <el-col :span="18" :offset="0">
            <el-input
              placeholder="请输入搜索内容"
              v-model="selectValue"
              @keyup.enter.native="searchCodeList"
              class="input-with-select"
            >
              <template slot="prepend">机器码</template>
              <el-button slot="append" icon="el-icon-search" @click="searchCodeList"></el-button>
            </el-input>
          </el-col> -->
          <el-col :span="24" class="btn-wrap">
                <el-button type="default" @click="dialogVisible=true" v-if="btAuthList['新增证书']">新增登录证书</el-button>
          </el-col>
      </el-row>
      <div class="table-wrap">
          <div class="noData" v-if="!(tableData && tableData.length)">
              <img class="data-pic" src="@/assets/imgs/recharge/暂无缴费信息.png" />
              <p style="margin:0px;">暂无数据</p>
            </div>
             <el-table
              :data="tableData"
              class="tables"
              v-if="tableData && tableData.length"
              :row-style="handleRowStyle"
              :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
            >
           <el-table-column prop="req_code" label="机器码"></el-table-column>
           <el-table-column label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time && convertUTC(scope.row.create_time) }}</span>
                </template>
           </el-table-column>
           <el-table-column prop="prop" label="操作">
              <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small" @click="handelDel(scope.row)" v-if="btAuthList['删除证书']">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-dialog
          :visible.sync="dialogVisible"
          width="640px"
          >
            <div slot="title" class="header-title">
            <img class="columnIcon" src="@/assets/imgs/账户icon.png" />
            <span class="title-age">{{isAddCertify?'新增':'查看'}}登录证书</span>
            </div>
            <div class="d-content">
            <el-row :gutter="20" v-if="isAddCertify">
                <el-col :span="24" :offset="0">
                    <span class="label"><span class="requiredIcon">*</span>机器码:</span>
                    <el-input v-model="req_code" placeholder="请输入"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-else>
                <el-col :span="12" :offset="0" class="label"><span class="requiredIcon">*</span>证书密钥:</el-col>
                <el-col :span="12" :offset="0">{{selectedRow.cert_code}}</el-col>
            </el-row>

            </div>
          <div slot="footer">
              <el-button type="primary" v-if='!isAddCertify' v-clipboard:copy="selectedRow.cert_code" v-clipboard:success="onCopy">复制</el-button>
              <el-button v-if='isAddCertify' type="primary" @click="confirmDialog">确 定</el-button>
              <el-button @click="dialogVisible=false">取 消</el-button>
          </div>
      </el-dialog>
      <el-dialog
      :visible.sync="del_edialogVisible"
      width="300px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      class="exit-login"
    >
      <div class="exit-content">
        <img src="@/assets/imgs/alarm.png" alt />
        <span>您确定要删除该证书吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="delCertify">删除</el-button>
        <el-button size="small" @click="del_edialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
      </div>
    </div>
</template>

<script>
import {loginverifyCreate,loginverifyDelete,loginverifyList} from '@/api/tenantConfigAPI.js'
import { convertUTC } from "@/utils/index.js";
export default {
    props: {
      "selectedData":{
          type:Object
      },
       "hideTitle":{
           type:Boolean,
           default:false
       },
       "tid":{
           type:[String, Number]
       },
       "org_code":{
           type:String,
           default:''
       },
    },
    data(){
        return {
            tableData:[],
            selectedRow:{}, 
            dialogVisible:false,
            selectValue:'', // 要搜索的机器码
            req_code:'', //提示框中机器码
            del_edialogVisible:false,
            btAuthList: this.$store.state.btAuthList, //按钮权限
        }
    },
    computed:{
        isAddCertify(){
            return !Boolean(Object.keys(this.selectedRow).length)
        },
        filterData(){
            return this.tableData.filter(it=>it.ishow)
        },
    },
    watch:{
       org_code(newv, oldv){
           console.log(newv,oldv)
           this.getCodeList()
       },
       dialogVisible(newv){
           if(!newv){
               this.selectedRow={};
               this.req_code=''
           }
       },
       del_edialogVisible(newv){
           if(!newv){
               this.selectedRow={};
           }
       },
    },
    mounted(){
        this.getCodeList()
    },
    methods:{
        convertUTC: convertUTC,
        getCodeList(){
            loginverifyList({tid:this.tid, org_code:this.org_code}).then(res=>{
                if(res.data.code==0){
                    this.tableData=res.data.data
                }else{
                    this.$message.error(res.data.message)
                }
            })
        },
        handleRowStyle(row,rowindex){
            if(row.isSelected){
                return {background:'yellow'}
            }
        },
        handleClick(row){
            this.dialogVisible=true
            this.selectedRow=row;
        },
        handelDel(row){
            this.del_edialogVisible=true
            this.selectedRow=row;
        },
        confirmDialog(){
            loginverifyCreate({tid:this.tid, org_code:this.org_code, req_code:this.req_code}).then(res=>{
                if(res.data.id){
                    this.$message.success('创建登录证书成功')
                    this.dialogVisible=false
                    this.req_code=''
                    this.getCodeList()
                }else{
                    this.$message.error(res.data.message || '创建登录证书失败')
                    this.dialogVisible=false
                }
            })
        },
        searchCodeList(){
          let index=this.tableData.findIndex(it=>it.req_code==this.selectValue)
          if(index>-1){
            this.tableData.map(it=>it.ishow = false)
            this.tableData[index].ishow=true;
          }else{
            this.tableData.map(it=>it.ishow = true)
          }
        },
        onCopy(e) {
            this.$message.success(`复制成功`)
        },
        delCertify(){
            loginverifyDelete({tid:this.tid,id:this.selectedRow.id}).then(res=>{
                if(res.data.code==0){
                    this.$message.success('删除登录证书成功');
                    this.del_edialogVisible=false;
                    this.getCodeList()
                }else{
                    this.$message.error(res.data.message)
                }
        })
    }
    }
}
</script>

<style lang="scss" scoped>
 .certifym-wrap{
    height: 100%;
  }
 .el-form-item__label{
        text-align: left;
        width: 200px;
    }
.title {
    height: 36px;
    border-bottom: 1px solid rgba(170, 178, 193, 0.2);
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 550;
    color: #222222;
    padding: 0 14px 13px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.search-wrap{
    padding: 20px 16px;
}
.btn-wrap{
    text-align: left;
    line-height: 40px;
    .el-button{
        padding: 0;
        width: 128px;
        height: 32px;
        line-height: 32px;
        background: #FFFFFF;
        color: #2F87FE;
        border-radius: 4px;
        border: 1px solid #2F87FE;
    }
}
.table-wrap{
    padding: 0 16px;
    height: calc(100% - 170px);
    margin-top: 12px;
    position: relative;
    min-height: 200px;
    overflow: scroll;
    .noData{
        height:100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        top:0;left:0;bottom:0;right:0;
        z-index: 1;
        color: #999;
    }
}
.columnIcon{
    vertical-align: middle;
    margin-right: 8px;
}
.d-content{
    padding: 23px 40px 50px;
    .label{
        display: inline-block;
        text-align: left;
        width: 100px;
        .requiredIcon{
            height: 4px;
            width: 4px;
            line-height: 8px;
            color: #F56C6C;
            margin-right: 4px;
        }
    }
    .el-input{
        width: 210px;
    }
}
.exit-login {
  ::v-deep {
    .el-dialog__header {
      height: 35px;
      border-bottom: none;
    }
    .el-dialog__body {
      padding: 0px 0 20px 60px;
      .exit-content {
        span {
          color: #222222;
          line-height: 16px;
          vertical-align: middle;
          margin-left: 8px;
        }
        img {
          vertical-align: middle;
        }
      }
    }
    .el-dialog__footer {
      text-align: left;
      padding: 14px 0 25px 60px;
      .el-button {
        width: 80px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        color: #EC6B60;
        border: 1px solid #EC6B60;
      }
    }
  }
}
</style>