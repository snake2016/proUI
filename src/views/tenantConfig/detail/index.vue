<template>
  <div class="fill">
    <div class="head-section">
      <div class="name-box">
        <img src="@/assets/imgs/tenantConfig/icon-租户.png" alt />
        租户名称：
        <span v-if="tenantId == null">未知</span>
        <span v-if="tenantId != null">{{basic.name}}</span>
      </div>
      <div class="state">
        租户状态：
        <span v-if="tenantId == null">尚未创建</span>
        <span v-if="tenantId != null && is_enabled">正常</span>
        <span v-if="tenantId != null && !is_enabled">已禁用</span>
      </div>
      <div class="jy-box" v-if="tenantId">
        <div class="bt t1" v-has="'修改租户密码'" @click="showChangePw(1)">账户管理</div>
        <div class="bt" v-if="is_enabled" v-has="'禁用租户'" @click="disableTenant">禁用</div>
        <div class="bt" v-if="!is_enabled" v-has="'启用租户'" @click="enableTenant">启用</div>
      </div>
    </div>
    <div class="tab-section">
      <div class="c">
        <div
          class="item-box"
          @click="switchTab(item.value)"
          :class="curTab == item.value ? 'active' : ''"
          v-for="item in tabs"
          :key="item.value"
        >{{item.name}}</div>
      </div>
    </div>
    <div class="content box-base" v-if="curTab == 1">
      <div class="left-box">
        <div class="panel" style="margin-bottom: 14px;">
          <div class="title-box">
            <img src="@/assets/imgs/tenantConfig/icon-租户.png" alt />
            基础信息
          </div>
          <el-form ref="basic" :model="basic" :rules="basicRules">
            <div class="box" :class="baseInfoAbled ? '' : 'showMode'">
              <div class="r33">
                <span class="label" :class="baseInfoAbled?'required':''">租户名称：</span>
                <el-form-item class="value2" prop="name">
                  <el-input
                    v-model="basic.name"
                    :title="basic.name"
                    :disabled="!baseInfoAbled"
                    class
                    size="small"
                  ></el-input>
                </el-form-item>
              </div>

             

              <div class="r33">
                <span class="label" :class="baseInfoAbled?'required':''">企业名称：</span>
                <div
                  class="div value2"
                  v-if="!baseInfoAbled"
                  :title="basic.company_name"
                >{{basic.company_name}}</div>
                <el-form-item class="value2" v-if="baseInfoAbled" prop="company_name">
                  <el-input
                    v-model="basic.company_name"
                    :disabled="!baseInfoAbled"
                    class
                    size="small"
                  ></el-input>
                </el-form-item>
              </div>

              <div class="r33">
                <span class="label">联系人：</span>
                <el-form-item class="value2" prop="contact">
                  <el-input
                    v-model="basic.contact"
                    :title="basic.contact"
                    :disabled="!baseInfoAbled"
                    class
                    size="small"
                  ></el-input>
                </el-form-item>
              </div>

              <div class="r33">
                <span class="label">联系电话：</span>
                <el-form-item class="value2" prop="phone">
                  <el-input v-model="basic.phone" :disabled="!baseInfoAbled" class size="small"></el-input>
                </el-form-item>
              </div>

              <div class="r33 r33-2">
                <span class="label" :class="baseInfoAbled?'required':''">子域名：</span>
                <div class="div value2" v-if="!baseInfoAbled">{{basic.subdomain}}.cis.jinka.cn</div>
                <el-form-item class="value2" v-if="baseInfoAbled" prop="subdomain">
                  <el-input v-model="basic.subdomain" :disabled="!baseInfoAbled" class size="small">
                    <template slot="append">.cis.jinka.cn</template>
                  </el-input>
                </el-form-item>
              </div>

               <div class="r33">
                <span class="label">客户编号</span>
                <div
                  class="div value2"
                  v-if="!baseInfoAbled"
                  :title="basic.customer_number"
                >{{basic.customer_number}}</div>
                <el-form-item class="value2" v-if="baseInfoAbled" prop="customer_number">
                  <el-input
                    v-model="basic.customer_number"
                    :disabled="!baseInfoAbled"
                    class
                    size="small"
                  ></el-input>
                </el-form-item>
              </div>

              <div class="r33 r33-3 tenant">
                <span class="label" :class="baseInfoAbled?'required':''">租户类型：</span>
                <div
                  class="div value2"
                  v-if="!baseInfoAbled"
                >{{basic.tenant_type=='water'?'水务':'燃气'}}</div>
                <el-form-item class="value2" v-if="baseInfoAbled" prop="tenant_type">
                  <el-select
                    v-model="basic.tenant_type"
                    placeholder="请选择租户类型"
                    :disabled="basic.create_time!==''"
                  >
                    <el-option
                      v-for="item in tenantTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="r33" v-if="tenantId != null">
                <span class="label">创建时间：</span>
                <div class="div value2">{{cTime}}</div>
              </div>
            </div>
          </el-form>
          <div class="bt" v-if="tenantId == null">
            <div @click="submitVerify('baseInfoAbled')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#el-icon-revise" />
              </svg>
              <span class>保存</span>
            </div>
          </div>
          <div class="bt" v-if="tenantId != null && !baseInfoAbled" v-has="'修改租户'">
            <div @click="changeEditAble(1, 'baseInfoAbled')" style="margin-top: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#el-icon-revise" />
              </svg>
              <span class>编辑</span>
            </div>
          </div>
          <div class="bt" v-if="tenantId != null && baseInfoAbled">
            <el-button
              type="primary"
              size="small"
              class="b-bt"
              @click="submitVerify('baseInfoAbled')"
            >保存</el-button>
            <el-button
              type="plain"
              size="small"
              class="b-bt"
              @click="changeEditAble(0, 'baseInfoAbled')"
            >取消</el-button>
          </div>
        </div>
        <div class="panel">
          <div class="title-box">
            <img src="@/assets/imgs/tenantConfig/参数设置.png" alt />
            参数设置
          </div>
          <div class="box radio" :class="baseInfoAbled ? '' : 'showMode'">
            <!-- <div class="r33">
              <div class="label">是否允许自定义各阶余量重置策略：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || Number(business_config.is_allow_define_cyc_surplus) == 1"
                  v-model="business_config.is_allow_define_cyc_surplus"
                  label="1"
                  :disabled="!business_configAbled"
                >允许</el-radio>
                <el-radio
                  v-if="business_configAbled || Number(business_config.is_allow_define_cyc_surplus) == 0"
                  v-model="business_config.is_allow_define_cyc_surplus"
                  label="0"
                  :disabled="!business_configAbled"
                >禁止</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否允许自定义初始周期累积量：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.is_allow_define_initial_cyc_qty == 1"
                  v-model="business_config.is_allow_define_initial_cyc_qty"
                  :disabled="!business_configAbled"
                  label="1"
                >允许</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.is_allow_define_initial_cyc_qty) == 0"
                  v-model="business_config.is_allow_define_initial_cyc_qty"
                  :disabled="!business_configAbled"
                  label="0"
                >禁止</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否允许阶梯价开启按月均摊：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.is_allow_month_avg == 1"
                  v-model="business_config.is_allow_month_avg"
                  :disabled="!business_configAbled"
                  label="1"
                >允许</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.is_allow_month_avg) == 0"
                  v-model="business_config.is_allow_month_avg"
                  :disabled="!business_configAbled"
                  label="0"
                >禁止</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否允许阶梯价开启人口阶梯：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.is_allow_population_ladder == 1"
                  v-model="business_config.is_allow_population_ladder"
                  :disabled="!business_configAbled"
                  label="1"
                >允许</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.is_allow_population_ladder) == 0"
                  v-model="business_config.is_allow_population_ladder"
                  :disabled="!business_configAbled"
                  label="0"
                >禁止</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否开通短信：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.is_need_sms == 1"
                  v-model="business_config.is_need_sms"
                  :disabled="!business_configAbled"
                  label="1"
                >是</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.is_need_sms) == 0"
                  v-model="business_config.is_need_sms"
                  :disabled="!business_configAbled"
                  label="0"
                >否</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否开通微信：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.is_need_wechat == 1"
                  v-model="business_config.is_need_wechat"
                  :disabled="!business_configAbled"
                  label="1"
                >是</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.is_need_wechat) == 0"
                  v-model="business_config.is_need_wechat"
                  :disabled="!business_configAbled"
                  label="0"
                >否</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否需要补气收据：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.need_gas_receipt == 1"
                  v-model="business_config.need_gas_receipt"
                  :disabled="!business_configAbled"
                  label="1"
                >是</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.need_gas_receipt) == 0"
                  v-model="business_config.need_gas_receipt"
                  :disabled="!business_configAbled"
                  label="0"
                >否</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否需要点火操作：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.need_open_operator == 1"
                  v-model="business_config.need_open_operator"
                  :disabled="!business_configAbled"
                  label="1"
                >是</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.need_open_operator)  == 0"
                  v-model="business_config.need_open_operator"
                  :disabled="!business_configAbled"
                  label="0"
                >否</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否开通发票：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.is_invoice_enabled == 1"
                  v-model="business_config.is_invoice_enabled"
                  :disabled="!business_configAbled"
                  label="1"
                >是</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.is_invoice_enabled) == 0"
                  v-model="business_config.is_invoice_enabled"
                  :disabled="!business_configAbled"
                  label="0"
                >否</el-radio>
              </div>
            </div>
            <div class="r33">
              <div class="label">是否合并网厅数据：</div>
              <div class="value3">
                <el-radio
                  v-if="business_configAbled || business_config.is_merge_olbh_enabled == 1"
                  v-model="business_config.is_merge_olbh_enabled"
                  :disabled="!business_configAbled"
                  label="1"
                >是</el-radio>
                <el-radio
                  v-if="business_configAbled || parseInt(business_config.is_merge_olbh_enabled) == 0"
                  v-model="business_config.is_merge_olbh_enabled"
                  :disabled="!business_configAbled"
                  label="0"
                >否</el-radio>
              </div>
            </div> -->
            <div class="r33" v-for="item in basic_temple_config" :key="item.key">
              <div class="label">{{item.label}}：</div>
              <div class="value3">
                  <template 
                  v-for="it in item.typeOptions">
                <el-radio
                  :key="it.value"
                  v-if="business_configAbled || business_config[item.key] == it.value"
                  v-model="business_config[item.key]"
                  :disabled="!business_configAbled"
                  :label="it.value"
                >{{it.label}}</el-radio> 
                </template>
              </div>
            </div>
            <br />
          </div>
          <div class="bt" v-if="tenantId == null">
            <div>
              <i class="icon el-icon-warning"></i>
              <span>租户尚未创建 - 请先完善基本信息</span>
            </div>
          </div>
          <div class="bt" v-if="tenantId != null && !business_configAbled" v-has="'修改租户'">
            <div @click="changeEditAble(1, 'business_configAbled')" style="margin-top: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#el-icon-revise" />
              </svg>
              <span class>编辑</span>
            </div>
          </div>
          <div class="bt" v-if="tenantId != null && business_configAbled" key="1">
            <el-button
              type="primary"
              size="small"
              class="b-bt"
              @click="submitVerify('business_configAbled')"
            >保存</el-button>
            <el-button
              type="plain"
              size="small"
              class="b-bt"
              @click="changeEditAble(0, 'business_configAbled')"
            >取消</el-button>
          </div>
        </div>
      </div>
      <!-- <div class="right-box">
        <div class="title-box">
          <img src="@/assets/imgs/tenantConfig/个性化设置.png" alt />
          个性化设置
        </div>

        <div class="box">
          <el-form ref="personal" :model="personal" :rules="personalRules">
            <div class="r">登录页脚注：</div>
            <div
              v-if="!personalEnable"
              class="value2 div m2"
              :class="personal.welcome_info ? '' : 'c9'"
            >{{personal.welcome_info ? personal.welcome_info : "暂无"}}</div>
            <el-form-item class="value2 m2" prop="welcome_info" v-if="personalEnable">
              <el-input
                v-model="personal.welcome_info"
                :disabled="!personalEnable"
                class
                size="small"
              ></el-input>
            </el-form-item>

            <div class="r">备注：</div>
            <div
              v-if="!personalEnable"
              class="value2 div m2 area"
              :class="personal.remark ? '' : 'c9'"
            >{{personal.remark ? personal.remark : '暂无'}}</div>
            <el-form-item class="value2 m2" prop="remark">
              <el-input
                v-if="personalEnable"
                v-model="personal.remark"
                :disabled="!personalEnable"
                type="textarea"
                resize="none"
                :autosize="{ minRows: 2, maxRows: 4}"
                :rows="2"
                class
                size="small"
              ></el-input>
            </el-form-item>
          </el-form>
          <span class="bt" v-if="tenantId == null">
            <div>
              <i class="icon el-icon-warning"></i>
              <span class>租户尚未创建 - 请先完善基本信息</span>
            </div>
          </span>
          <span class="bt" v-if="tenantId != null && !personalEnable" v-has="'修改租户'">
            <div @click="changeEditAble(1, 'personalEnable')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#el-icon-revise" />
              </svg>
              <span class>编辑</span>
            </div>
          </span>
          <div class="bt" v-if="tenantId != null && personalEnable">
            <el-button
              type="primary"
              size="small"
              class="b-bt"
              @click="submitVerify('personalEnable')"
            >保存</el-button>
            <el-button
              type="plain"
              size="small"
              class="b-bt"
              @click="changeEditAble(0, 'personalEnable')"
            >取消</el-button>
          </div>
        </div>
      </div>-->
    </div>
    <div class="content JGQX" v-if="curTab == 2" key="2">
      <div class="box left">
        <div class="title-box">
          <img src="@/assets/imgs/tenantConfig/结构.png" alt />
          组织机构分配
        </div>
        <div class="main-box">
          <el-tree
            v-if="curTab==2"
            ref="orgTree"
            :data="orgsTemplateTree"
            :props="leftProps"
            :default-expanded-keys="[2, 3, 4]"
            :default-checked-keys="orgDefaultKey"
            node-key="id"
            show-checkbox
            highlight-current
            :check-strictly="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
          ></el-tree>
        </div>
        <div class="title-box b" v-has="'组织机构分配'">
          <el-button size="small" type="primary" @click="orgstrutureSet" :disabled="orgDisabled">确定</el-button>
          <el-button size="small" @click="clearTreeChecked('left')" :disabled="orgDisabled">清空</el-button>
          <el-button size="small" @click="setAllkeys('left')" :disabled="orgDisabled">全选</el-button>
        </div>
      </div>
    </div>
    <div class="content JGQX" v-if="curTab == 7" key="7">
      <div class="box right r1">
        <div class="title-box">
          <img src="@/assets/imgs/tenantConfig/权限.png" alt />
          权限模板
        </div>
        <div class="main-box">
            <div class="templateList">
                <div class="template" @click="handleTemplateCheck(item)" :class="templateId == item.templateId?'sel':''" v-for="item in templateList" :key="item.templateId">
                    <div class="icon"><img :src="templateId == item.templateId?iconList[item.realm].sel : iconList[item.realm].nor" alt=""></div>
                    <div class="name">{{item.name}}</div>
                    <div class="selIcon" v-show="templateId == item.templateId">
                        <img src="../../../assets/imgs/tenantConfig/1.5.0/selected.svg" alt="">
                    </div>
                </div>
            </div>
            <div class="templateTree">
                <!-- <el-tree
                    ref="permissionTree"
                    :data="permissionTree"
                    :props="rightProps"
                    :default-checked-keys="permissionDefaultKey"
                    node-key="keyId"
                    show-checkbox
                    highlight-current
                    :expand-on-click-node="false"
                    :check-on-click-node="true"
                ></el-tree> -->
                <el-tree
                    ref="permissionTree"
                    :data="permissionTree"
                    show-checkbox
                    node-key="keyId"
                    :default-checked-keys="permissionDefaultKey">
                    </el-tree>
            </div>
          
        </div>
        <div class="title-box b" v-has="'权限分配'">
          <el-button size="small" @click="bindTemplateToTenant" >保存</el-button>
          <!-- <el-button size="small" @click="clearTreeChecked('right')">清空</el-button>
          <el-button size="small" @click="setAllkeys('right')">全选</el-button> -->
        </div>
      </div>
    </div>
    <div class="content meterList list1" v-if="curTab == 3 || curTab == 4" key="3">
      <div class="left-box">
        <div class="title-box">
          <img src="@/assets/imgs/batchCreate/batchCreate-bj.png" alt />
          {{ungrantDevice_searchData.type == 1 ? '可选表类型列表' : '可选DTU类型列表'}}
        </div>
        <div class="main-box">
          <div class="tj-box">
            <el-input
              placeholder="请输入内容"
              @keyup.enter.native.stop="getUngrantDevice(1)"
              v-model="ungrantDevice_searchData.deviceTypeName"
              class="search-box"
              size="small"
            >
              <div slot="prepend">{{ungrantDevice_searchData.type == 1 ? '表类型名称' : 'DTU类型名称'}}</div>
              <el-button @click="getUngrantDevice(1)" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="tb-box null-box" v-if="!ungrantDeviceList.length">
            <div class="none-box">
              <img src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
              <div>暂无数据</div>
            </div>
          </div>
          <div class="tb-box" v-if="ungrantDeviceList.length">
            <el-table
              class="table"
              height="calc(100% - 52px)"
              :data="ungrantDeviceList"
              v-if="ungrantDeviceList.length"
            >
              <el-table-column prop="deviceTypeName" :label="meterListLabel_deviceTypeName"></el-table-column>
              <el-table-column
                prop="deviceTypeCategoryTxt"
                label="表类别"
                v-if="ungrantDevice_searchData.type == 1"
              ></el-table-column>
              <el-table-column prop="manufacturerName" label="厂商名称"></el-table-column>
              <el-table-column label="操作" width="130" v-if="btAuthList['表类型授予']">
                <template slot-scope="scope">
                  <div class="spanBt" @click="beforeGrant(scope.row.deviceTypeId, scope.$index)">授予</div>
                </template>
              </el-table-column>
            </el-table>

            <div class="fenye" v-if="ungrantDeviceList.length">
              <el-pagination
                class="pageLeft"
                background
                @size-change="sizeChange_meterList"
                @current-change="getUngrantDevice"
                :current-page.sync="ungrantDevicePD.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="ungrantDevicePD.size"
                layout="slot,sizes,total"
                :total="ungrantDevicePD.total"
              >
                <span class="fontSize">显示</span>
              </el-pagination>
              <el-pagination
                background
                layout="prev, pager, next, jumper"
                :current-page.sync="ungrantDevicePD.page"
                @current-change="getUngrantDevice"
                :total="ungrantDevicePD.total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="title-box">
          <img src="@/assets/imgs/batchCreate/batchCreate-bj.png" alt />
          {{ungrantDevice_searchData.type == 1 ? '已开通表类型' : '已开通DTU类型'}}
        </div>
        <div class="granted-box null-box" v-if="!grantedList.length">
          <div class="none-box">
            <img src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
            <div>暂无数据</div>
          </div>
        </div>
        <div class="granted-box" v-if="grantedList.length">
          <div class="granted-item" v-for="(item, index) in grantedList" :key="index">
            <div class="row1">
              <div class="type-name">
                <span class="index">{{index + 1}}.</span>
                {{item.deviceTypeName}}
              </div>
              <div class="del spanBt" v-has="'表类型撤销'" @click="ungrant(item.deviceTypeId, index)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#el-icon-shanchu" />
                </svg>
              </div>
            </div>
            <div class="row2">
              <span v-if="ungrantDevice_searchData.type == 1">{{item.deviceTypeCategoryTxt}} |</span>
              {{item.manufacturerName}}
            </div>
          </div>
        </div>
      </div>
      <el-dialog
          title="授权"
          :visible.sync="grantDialogVisible"
          width="30%"
          :before-close="grantDialogBeforeClose"
          >
          <div class="grantWrap">
              <span>数据来源：</span>
              <el-select v-model="third_part_id" placeholder="">
                  <el-option
                      v-for="item in third_part_list"
                      :key="item.thirdPartId"
                      :label="item.name"
                      :value="item.thirdPartId">
                  </el-option>
              </el-select>
          </div>
          <div slot="footer" class="grantfooter">
              <el-button @click="grantDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="gotoGrant">确 定</el-button>
          </div>
      </el-dialog>
    </div>
    <div class="content operation-record" v-if="curTab == 5" key="5">
      <div class="main-box">
        <div class="none-box" v-if="!operationRecords.length">
          <img src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
          <div>暂无记录</div>
        </div>

        <el-table
          class="table"
          height="calc(100% - 52px)"
          :data="operationRecords"
          v-if="operationRecords.length"
        >
          <el-table-column prop="action" label="操作" width="170"></el-table-column>
          <el-table-column prop="beforeJSON" label="操作前内容"></el-table-column>
          <el-table-column prop="afterJSON" label="操作后内容"></el-table-column>
          <el-table-column prop="operator" label="操作人" width="100"></el-table-column>
          <el-table-column prop="operate_time" label="操作时间" width="180"></el-table-column>
        </el-table>

        <div class="fenye" v-if="operationRecords.length">
          <el-pagination
            class="pageLeft"
            background
            @size-change="sizeChange_operate"
            @current-change="getOperationRecords"
            :current-page.sync="operationRecordsPD.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="operationRecordsPD.size"
            layout="slot,sizes,total"
            :total="operationRecordsPD.total"
          >
            <span class="fontSize">显示</span>
          </el-pagination>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :current-page.sync="operationRecordsPD.page"
            @current-change="getOperationRecords"
            :page-size="operationRecordsPD.size"
            :total="operationRecordsPD.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="content message-service" v-if="curTab == 6&&userGrade!=2" key="6">
      <div class="meaasge-service-header">
        <span :class="[activeService == 1 ? 'active':'']" @click="weixinChange">微信</span>
        <span :class="[activeService == 2 ? 'active':'']" @click="duanxinChange">短信</span>
      </div>
      <div class="meaasge-service-content">
        <div class="add-empty-box" v-if="messageServiceTable.length==0">
          <img class="empty-pic" src="~@/assets/imgs/temp/noData.png" alt />
          <div>暂无数据</div>
        </div>
        <el-table
          :data="messageServiceTable"
          height="calc(100% - 52px)"
          ref="tableHeight"
          v-if="messageServiceTable.length!=0"
        >
          <el-table-column label="业务名称" min-width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.bizName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="消息模板编号" min-width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.msgTemplateCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="消息模板名称" min-width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.msgTemplateName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签名名称" min-width="180" v-if="activeService==2">
            <template slot-scope="scope">
              <span>{{ scope.row.msgSignName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
              <span
                class="operation"
                v-if="scope.row.msgTemplateCode!='--'"
                @click="openDialog(scope.$index,scope.row)"
              >编辑</span>
              <span class="operation" v-else @click="openDialog(scope.$index,scope.row)">业务配置</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye meaasge-service-page" v-if="messageServiceTable.length">
          <el-pagination
            @size-change="handleSizeChange"
            :current-page="messageServicePD.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="messageServicePD.pageSize"
            layout="slot,sizes,total"
            :total="messageServicePD.total"
          >
            <span class="fontSize">显示</span>
          </el-pagination>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="messageServicePD.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="messageServicePD.pageSize"
            layout="prev, pager, next, jumper"
            :total="messageServicePD.total"
          ></el-pagination>
        </div>
        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          width="640px"
          :before-close="handleClose"
        >
          <span slot="title" class="dialog-title">
            <img src="~@/assets/imgs/infoIcon.png" alt />
            <i v-if="currentRow['msgTemplateCode']!='--'">修改</i>
            <i v-else>业务配置</i>
          </span>
          <!-- dialog的内容区 -->
          <vue-scroll :ops="ops" ref="vs">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              :validate-on-rule-change="false"
              v-if="dialogVisible"
            >
              <el-form-item label="业务编号：" prop="number" class="fixed is-required">
                <span>{{currentRow.bizCode}}</span>
              </el-form-item>
              <el-form-item label="业务名称：" class="fixed is-required">
                <span>{{currentRow.bizName}}</span>
              </el-form-item>
              <el-form-item label="模板类型：" prop="templateType">
                <el-radio-group v-model="ruleForm.templateType">
                  <el-radio :label="1">微信</el-radio>
                  <el-radio :label="2">短信</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="消息模板编号：" prop="templateNumber">
                <el-select
                  v-model="ruleForm.templateNumber"
                  placeholder="请选择消息模板编号"
                  popper-class="select-option"
                  :popper-append-to-body="false"
                  @visible-change="getTemplateNo"
                  @change="selectChange"
                >
                  <template>
                    <div class="optionHeader">
                      <span>消息模板编号</span>
                      <span>消息模板名称</span>
                    </div>
                  </template>
                  <el-option
                    v-for="item in templateNoOptions"
                    :key="item.msgTemplateCode"
                    :label="item.msgTemplateCode"
                    :value="item.msgTemplateId"
                    :disabled="item.disabled"
                  >
                    <span style="float: left">{{ item.msgTemplateCode}}</span>
                    <span style="float: left">{{ item.msgTemplateName }}</span>
                  </el-option>
                  <div class="fenye-block">
                    <div class="total">
                      <span>共</span>
                      <i>{{messageTemplateNoPage.total}}</i>条
                    </div>
                    <div class="pagenation">
                      <img
                        src="@/assets/imgs/fenye/left-unavaiable.png"
                        alt
                        v-if="messageTemplateNoPage.page==1"
                        :class="[messageTemplateNoPage.page==1?'unavaiable':'']"
                      />
                      <img
                        src="@/assets/imgs/fenye/left-avaiable.png"
                        alt
                        v-else
                        @click="preChange"
                      />
                      <span class="currentpage">{{messageTemplateNoPage.page}}</span>
                      <span>/</span>
                      <span class="totalpage">{{messageTemplateNoPage.pages}}</span>
                      <img
                        src="@/assets/imgs/fenye/right-unavaiable.png"
                        v-if="messageTemplateNoPage.page == messageTemplateNoPage.pages"
                        :class="[messageTemplateNoPage.page == messageTemplateNoPage.pages?'unavaiable':'']"
                        alt
                      />
                      <img
                        src="@/assets/imgs/fenye/right-avaiable.png"
                        alt
                        v-else
                        @click="nextChage"
                      />
                    </div>
                  </div>
                </el-select>
              </el-form-item>
              <el-form-item label="消息模板名称：" class="fixed is-required">
                <span v-if="msgTemplateName!=''">{{msgTemplateName}}</span>
                <span v-else>根据模板编号的选择自动带出</span>
              </el-form-item>
              <el-form-item label="短信签名名称：" prop="signName" v-if="ruleForm.templateType==2">
                <el-select
                  v-model="ruleForm.signName"
                  placeholder="请选择短信签名名称"
                  @visible-change="getMsgSignName"
                  :popper-append-to-body="false"
                  popper-class="select-option"
                >
                  <template>
                    <div class="optionHeader">
                      <span>短信签名名称</span>
                    </div>
                  </template>
                  <el-option
                    v-for="item in signNameOptions"
                    :key="item.msgSignId"
                    :label="item.msgSignName"
                    :value="item.msgSignId"
                    :disabled="item.disabled"
                  ></el-option>
                  <div class="fenye-block">
                    <div class="total">
                      <span>共</span>
                      <i>{{msgSignNamePage.total}}</i>条
                    </div>
                    <div class="pagenation">
                      <img
                        src="@/assets/imgs/fenye/left-unavaiable.png"
                        alt
                        v-if="msgSignNamePage.page==1"
                        :class="[msgSignNamePage.page==1?'unavaiable':'']"
                      />
                      <img
                        src="@/assets/imgs/fenye/left-avaiable.png"
                        alt
                        v-else
                        @click="preChange2"
                      />
                      <span class="currentpage">{{msgSignNamePage.page}}</span>
                      <span>/</span>
                      <span class="totalpage">{{msgSignNamePage.pages}}</span>
                      <img
                        src="@/assets/imgs/fenye/right-unavaiable.png"
                        v-if="msgSignNamePage.page == msgSignNamePage.pages"
                        :class="[msgSignNamePage.page == msgSignNamePage.pages?'unavaiable':'']"
                        alt
                      />
                      <img
                        src="@/assets/imgs/fenye/right-avaiable.png"
                        alt
                        v-else
                        @click="nextChage2"
                      />
                    </div>
                  </div>
                </el-select>
              </el-form-item>
            </el-form>
          </vue-scroll>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')">确定配置</el-button>
            <el-button @click="cancel">取 消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div class="content vertify-m" v-if="curTab == 8" key="8">
        <div class="main-box">
            <div class="title-box">
            <img src="@/assets/imgs/账户icon.png" alt />
            证书管理
          </div>
          <certify-manage :selectedData="selectedData" :hideTitle="true" :tid="this.$route.query.sp_id"/>
        </div>
    </div>
    <el-dialog
      class="changePw"
      :visible.sync="changePwShow"
      :closeOnClickModal="false"
      :before-close="closeChangePw"
      width="640px"
    >
      <div slot="title" class="title">
        <img src="@/assets/imgs/账户icon.png" alt />
        <span>账户管理</span>
      </div>
      <div class="content">
        <el-form :rules="changePwRule" ref="changePw" :model="accountData" class="noStyle my-form">
          <div class="row">
            <div class="label required">登录账号：</div>
            <el-form-item label prop="userName">
              <el-input v-model="userAdmin" size="small" class="inp" disabled></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <div class="label required">登录密码：</div>
            <el-form-item label prop="pw">
              <el-input
                v-model="accountData.pw"
                size="small"
                class="inp"
                type="password"
                show-password
                :disabled="pwType==1"
              ></el-input>
            </el-form-item>
            <el-popover
              style="margin-left: 10px;"
              placement="top"
              title
              width="120"
              trigger="hover"
              content="新建租户的初始密码为000000"
            >
              <i class="el-icon-info" slot="reference" style="color: #999999"></i>
            </el-popover>
          </div>
        </el-form>
      </div>
      <span class="dialog-footer" slot="footer">
        <template v-if="pwType==1">
          <el-button type="primary" size="small" @click="changePwType(2)">修改密码</el-button>
        </template>
        <template v-if="pwType==2">
          <el-button type="primary" size="small" @click="changePw">保存</el-button>
          <el-button size="small" @click="showChangePw(0)">取消</el-button>
        </template>
      </span>
    </el-dialog>
    <!-- 禁用租户 -->
    <el-dialog
      class="jy-dialog"
      :visible.sync="disableTenantShow"
      :close-on-click-modal="false"
      :before-close="disableTenantCancel"
      width="640px"
    >
      <span slot="title" class="dialog-title">
        <img src="~@/assets/imgs/tenantConfig/icon-租户.png" alt />
        禁用租户
      </span>
      <div class="d-box">
        <el-form :rules="disableReasonRule" ref="disableReasonForm" :model="{}" class="noStyle jy">
          <div class="label required">禁用原因：</div>
          <el-form-item class="jy-in" prop="disableReason">
            <el-input
              v-model="disableReason"
              type="textarea"
              resize="none"
              :autosize="{ minRows: 3, maxRows: 5}"
              :rows="3"
              class="in"
              maxlength="32"
              show-word-limit
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="disableTenantSubmit">确定禁用</el-button>
        <el-button @click="disableTenantCancel" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import index from "./index.js"; // 主要js
import baseInfo from "./baseInfo.js"; // 基本信息
import authority from "./authority.js"; // 结构和权限
import meterTypeList from "./meterTypeList.js"; // 表类型
import operationRecord from "./operationRecord.js"; // 操作记录
import messageService from "./messageService"; //消息业务配置
import CertifyManage from '@/views/orgManagement/departStaffManage/certifym.vue'
import certifyM from "./certifyM.js"; //证书管理
export default {
  name: "tenantConfig-detail",
  components: {CertifyManage},
  mixins: [
    index,
    baseInfo,
    authority,
    meterTypeList,
    operationRecord,
    messageService,
    certifyM
  ],
  props: {},
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
@import "./baseInfo.scss"; // 基础信息
@import "./authority.scss"; // 结构和权限
@import "./meterTypeList.scss"; // 表类型和DTU类型
@import "./operationRecord.scss"; // 操作记录
@import "./messageService.scss"; //消息业务配置
@import "./certifyM.scss"; //证书管理
</style>