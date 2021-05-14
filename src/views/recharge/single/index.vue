<template>
  <div class="fill">
    <!-- <vue-scroll :ops="ops" ref="vs"> -->
    <div class="contain">
      <div class="sec-left">
        <div class="conditionBox">
          <div class="cd-box">
            <div class="lableBox">
              <el-select
                size="small"
                v-model="cdValue"
                placeholder="请选择"
                @change="searchDataChange"
              >
                <el-option
                  v-for="item in cdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <el-form
              :model="searchData"
              :rules="searchDataRules"
              @submit.native.prevent
              ref="searchData"
              class="centerBox searchBox-loading"
            >
              <el-form-item label prop="userName" v-if="cdValue == 'userName'">
                <el-input
                  size="small"
                  v-model="searchData.userName"
                  @keyup.enter.native.stop="initPage"
                  placeholder="请输入用户名称"
                ></el-input>
              </el-form-item>
              <el-form-item label prop="tel" v-if="cdValue == 'tel'">
                <el-input
                  size="small"
                  v-model="searchData.tel"
                  @keyup.enter.native.stop="initPage"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
              <div class="cd-addrBox" v-if="cdValue == 'address'">
                <div class="col8 c1">
                  <el-form-item label prop="regionCode">
                    <el-select
                      v-model="searchData.regionCode"
                      filterable
                      placeholder="区/县"
                      size="small"
                      class="addrItem load-area"
                      @change="areaChange"
                      :disabled="areaList.length == 0"
                    >
                      <el-option
                        v-for="item in areaList"
                        :key="item.regionCode"
                        :label="item.regionName"
                        :value="item.regionCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col8 c2">
                  <el-form-item label prop="addressAreaCode">
                    <el-select
                      v-model="searchData.addressAreaCode"
                      filterable
                      placeholder="街道/小区/乡镇/村庄"
                      size="small"
                      class="addrItem load-street"
                      :disabled="streetList.length == 0"
                    >
                      <el-option
                        v-for="item in streetList"
                        :key="item.addressAreaCode"
                        :label="item.addressAreaName"
                        :value="item.addressAreaCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col8 c3">
                  <el-form-item label prop="addressName">
                    <el-input
                      v-model="searchData.addressName"
                      placeholder="详细地址"
                      size="small"
                      class="addrItem load-detail"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <el-form-item label prop="meterNo" v-if="cdValue == 'meterNo'">
                <el-input
                  size="small"
                  v-model="searchData.meterNo"
                  @keyup.enter.native.stop="initPage"
                  placeholder="请输入表具编号"
                ></el-input>
              </el-form-item>
              <el-form-item label prop="archivesNo" v-if="cdValue == 'archivesNo'">
                <el-input
                  size="small"
                  v-model="searchData.archivesNo"
                  @keyup.enter.native.stop="initPage"
                  placeholder="请输入档案编号"
                ></el-input>
              </el-form-item>
              <el-form-item label prop="archivesIdentity" v-if="cdValue == 'archivesIdentity'">
                <el-input
                  size="small"
                  v-model="searchData.archivesIdentity"
                  @keyup.enter.native.stop="initPage"
                  placeholder="请输入档案标识"
                ></el-input>
              </el-form-item>

              <div class="result-box searchLoading" v-show="searchResult.length > 0 && showResult">
                <div
                  class="list-box"
                  v-infinite-scroll="addPage"
                  infinite-scroll-delay="800"
                  infinite-scroll-distance="80"
                  immediate="false"
                  :infinite-scroll-disabled="loadDisabled"
                >
                  <div
                    class="item-box"
                    v-for="(item, index) in searchResult"
                    :key="index"
                    @click="fillInfo(item.archives.archivesId)"
                  >
                    <div
                      class="aMsg"
                      :class="cdValue == 'userName' ? 'curS' : ''"
                    >用户名称：{{ cd_resolve(item.user, "userName", 1) }}</div>
                    <div
                      class="aMsg"
                      :class="cdValue == 'tel' ? 'curS' : ''"
                    >手机号：{{ cd_resolve(item.user, "userMobile", 1) }}</div>
                    <div
                      class="aMsg"
                      :class="cdValue == 'address' ? 'curS' : ''"
                    >表具地址：{{ cd_resolve(item.address, "address", 2) }}</div>
                    <div
                      class="aMsg"
                      :class="cdValue == 'meterNo' ? 'curS' : ''"
                    >表具编号：{{ cd_resolve(item.meter, "meterNo", 1) }}</div>
                    <div
                      class="aMsg"
                      :class="cdValue == 'archivesNo' ? 'curS' : ''"
                    >档案编号：{{ cd_resolve(item.archives, "archivesNo", 1) }}</div>
                    <div class="aMsg" :class="cdValue == 'archivesIdentity' ? 'curS' : ''">
                      档案标识：{{
                      cd_resolve(item.archives, "archivesIdentity", 1)
                      }}
                    </div>
                    <div class="aMsg">
                      状态：
                      <span>
                        {{
                        archiveStateQL[item.archives.archivesStatus]
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="closeBox" @click="closeSearch">
                  <i class="el-icon-arrow-up"></i>
                  收起
                </div>
              </div>
            </el-form>
            <div class="rBt" @click="initPage">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#el-icon-sousuo" />
              </svg>
            </div>
          </div>
        </div>

        <template v-if="archivesId">
          <div class="box1 dangan">
            <div class="box-header">
              <img src="@/assets/imgs/recharge/archives.png" alt />
              <span>档案信息</span>
            </div>
            <div class="box-body">
              <el-row type="flex" justify="center" align="middle" :gutter="10" class="row-da">
                <el-col :span="8" class="box-da-item">
                  <div class="lab">用户名称：</div>
                  <div class="val">{{ archivesData.userName }}</div>
                </el-col>

                <el-col :span="8" class="box-da-item">
                  <div class="lab">用户类型：</div>
                  <div class="val">{{ archivesData.userType }}</div>
                </el-col>

                <el-col :span="8" class="box-da-item">
                  <div class="lab">手机号：</div>
                  <div class="val">
                    <span v-if="archivesData.userMobile">
                      {{
                      archivesData.userMobile
                      }}
                    </span>
                    <span class="c9" v-else>暂无</span>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center" align="middle" :gutter="10" class="row-da">
                <el-col :span="8" class="box-da-item">
                  <div class="lab">身份证号：</div>
                  <div class="val">
                    <span v-if="archivesData.certificateNo">
                      {{
                      archivesData.certificateNo
                      }}
                    </span>
                    <span class="c9" v-else>暂无</span>
                  </div>
                </el-col>

                <el-col :span="8" class="box-da-item">
                  <div class="lab">表具编号：</div>
                  <div class="val">{{ archivesData.meterNo }}</div>
                </el-col>

                <el-col :span="8" class="box-da-item">
                  <div class="lab">表类型：</div>
                  <div class="val">{{ archivesData.meterTypeName }}</div>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center" align="middle" :gutter="10" class="row-da last">
                <el-col :span="24" class="box-da-item">
                  <div class="lab">表具地址：</div>
                  <div class="val">{{ archivesData.address }}</div>
                </el-col>
              </el-row>
              <div class="row-info end">
                <div class="go" @click="gotoArchiveDetail">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#el-icon-tiaozhuan" />
                  </svg>
                  <span class="txt">跳转至档案缴费明细</span>
                </div>
              </div>
            </div>
          </div>
          <div class="box1" v-show="meterCategory == 1 || meterCategory == 3">
            <div class="box-header">
              <img src="@/assets/imgs/recharge/IC卡icon.png" alt />
              <span>IC卡信息</span>
            </div>
            <div class="box-body">
              <div class="lv">
                <div class="header-ic">
                  <div class="bt">
                    {{
                    icInfo.icCardNo != null
                    ? icInfo.icCardNo
                    : "尚未读取到IC卡信息"
                    }}
                  </div>
                  <div class="right">
                    <div class="bt">卡内余额：</div>
                    <span class="jin_e">{{ calc_balance }}</span>
                    <div class="dwei">{{ gasOrMoney == 1 ? "m³" : "元" }}</div>
                  </div>
                </div>
                <div class="body-ic">
                  <div class="row-info">
                    <div class="lab">厂家码：</div>
                    <div class="val">{{ icInfo.code != null ? icInfo.code : "--" }}</div>
                  </div>
                  <div class="row-info">
                    <div class="row-left">
                      <div class="lab">卡内次数：</div>
                      <div
                        class="val"
                      >{{icInfo.dataByRead.orderNum && icInfo.dataByRead.orderNum !=null ? icInfo.dataByRead.orderNum + "次" : "--"}}</div>
                    </div>
                    <div class="row-right">
                      <div class="lab">累购次数：</div>
                      <div
                        class="val"
                      >{{icInfo.icBuyNumber && icInfo.icBuyNumber !=null ? icInfo.icBuyNumber : 0}}</div>
                    </div>
                  </div>
                  <div class="row-info end">
                    <div class="go" @click="gotoIcDetail">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#el-icon-tiaozhuan" />
                      </svg>
                      <span class="txt">跳转至IC卡详情页</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box1">
            <div class="box-header">
              <img src="@/assets/imgs/batchCreate/batchCreate-price.png" alt />
              <span>费用信息</span>
            </div>
            <div class="box-body">
              <div class="body-fee lv">
                <div class="header-fee">
                  <div class="l">
                    <div class="bt">{{ priceData.priceName }}</div>
                    <div class="type">计费类型：{{ priceData.billingType }}</div>
                  </div>
                  <div class="l je">
                    <div class="box">
                      <div class="big">余额：</div>
                      <div class="big num">{{ priceData.meterBalanceAmount }}</div>
                      <div class="small">元</div>
                    </div>
                  </div>
                </div>
                <div class="box-jieti" v-if="archivesId">
                  <div class="row-info" v-if="billingTypeId == 1">
                    <span class="first-title">单一价格：</span>
                    {{ priceData.singlePrice }} 元/m³
                  </div>
                  <template v-if="billingTypeId == 2">
                    <div class="row-info" v-for="(item, index) in levelPriceList_left" :key="index">
                      <div class="jt">
                        <span v-if="index == 0">阶梯价：</span>
                      </div>
                      <div class="jt">{{ item.border }}</div>
                      <div class="jt">{{ item.price }}</div>
                    </div>
                    <div class="row-info">
                      <span class="first-title">各阶余量：</span>
                      {{ cycSurplusText }} (m³)
                    </div>
                  </template>
                  <template v-if="billingTypeId == 3">
                    <div class="row-info">
                      <div class="lab">时间单位：</div>
                      <div class="val">{{ priceData.timePrice_title }}</div>
                    </div>
                    <div
                      class="row-info"
                      v-for="(item, index) in priceData.timePrice_arr"
                      :key="index"
                    >
                      <div class="jt">
                        <span v-if="index == 0">分时价：</span>
                      </div>
                      <div class="jt">{{ item.time }}</div>
                      <div class="jt">{{ item.price }}</div>
                    </div>
                  </template>
                </div>
                <div class="box-other">
                  <div class="firstTitle">其他费用：</div>
                  <template v-for="item in otherCostList">
                    <div class="row-info" v-if="item.costType != 91" :key="item.costRecordId">
                      <span class="first-title"></span>
                      <span class="fee">
                        {{ item.type2 }}
                        <span>{{ item.receivableAmount }}</span>元
                      </span>
                      <span class="state no">{{ dsTitle_zd }}</span>
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">
                          <span class="tip-bt" @click="otherCostEdit(item)">修改</span>
                          <span
                            class="tip-bt"
                            @click="otherCostDel(item.costRecordId, item.type2)"
                          >撤销</span>
                        </div>
                        <svg class="icon set" aria-hidden="true">
                          <use xlink:href="#el-icon-shezhi" />
                        </svg>
                      </el-tooltip>
                    </div>
                  </template>
                  <div class="row-info" v-if="rubbishList.length">
                    <span class="first-title"></span>
                    <span class="fee">
                      {{ ljTitle_zd }}
                      <span>{{ rubbishTotal }}元</span>
                    </span>
                    <span class="openMore" @click="rubbishListOpen = !rubbishListOpen">
                      展开详情
                      <i v-if="rubbishListOpen" class="el-icon-arrow-up"></i>
                      <i v-else class="el-icon-arrow-down"></i>
                    </span>
                  </div>
                  <!-- 垃圾费列表 -->
                  <div v-if="rubbishListOpen" class="rubbishBox">
                    <div class="row-info" v-for="(item, index) in rubbishList" :key="index">
                      <span class="first-title">{{ item.modifyTime }}</span>
                      <span class="fee">
                        {{ ljTitle_zd }}
                        <span >{{ item.receivableAmount }}元</span>
                      </span>
                      <span class="state no">{{ dsTitle_zd }}</span>
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">
                          <span class="tip-bt" @click="otherCostEdit(item)">修改</span>
                          <span
                            class="tip-bt"
                            @click="otherCostDel(item.costRecordId, item.type2)"
                          >撤销</span>
                        </div>
                        <svg class="icon set" aria-hidden="true">
                          <use xlink:href="#el-icon-shezhi" />
                        </svg>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="row-info end">
                    <div class="go" @click="otherCostBtAction">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#el-icon-tianjia1" />
                      </svg>
                      <span class="txt">登记其他费用</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="!archivesId">
          <div class="kongBox">
            <img src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
            <div class="kong1">暂无缴费信息</div>
            <div class="kong2">请在搜索框内搜索相关档案</div>
          </div>
        </template>
      </div>
      <div class="sec-right">
        <div class="dkBox" @click="ICCard_read('afterIcRead')">
          <img src="@/assets/imgs/recharge/读卡icon.png" alt />
          <span>读卡</span>
        </div>
        <div class="store-contain">
          <div class="tab-head-box">
            <div class="tab" :class="storeTab == 1 ? 'active' : ''" @click="changeStoreTab(1)">
              <div class="fang">充值</div>
              <i class="sj"></i>
            </div>
            <div class="tab sec" :class="storeTab == 2 ? 'active' : ''" @click="changeStoreTab(2)">
              <div class="fang">补气</div>
              <i class="sj"></i>
            </div>
          </div>
          <div class="s-qi-body">
            <div class="store-tab-body" v-if="storeTab == 1">
              <el-row class="single-row" type="flex" justify="space-between">
                <el-col  v-show="gasOrMoney == 0">充值金额 (元)</el-col>
              </el-row>
              <div class="white-box">
                <div class="white-row no-b" v-show="gasOrMoney == 0">
                  <div class="white-row no-b t-1">
                    <div class="bt-box w-box">
                      <div class="bt unit-tip-text">{{rechargeMoney|numTip}}</div>
                      <el-form
                        :rules="rechargeRules"
                        ref="rechargeForm"
                        :model="{}"
                        class="noStyle w-fill-width w-form"
                        @submit.native.prevent
                      >
                        <el-form-item prop="rechargeMoney">
                          <el-input
                            v-model="rechargeMoney"
                            :disabled="rechargeDisable || blackFlag"
                            @blur="rechargeMoneyChange"
                            @keyup.enter.stop.native="rechargeMoneyChange"
                            type="number"
                            step="0.01"
                            class="num w-fill-width w-input"
                          >
                          </el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </div>
                <div class="white-row no-b sec2" v-show="gasOrMoney == 1">
                  <div class="white-row no-b t-1">
                    <div class="bt-box">
                      <div class="bt">充值气量</div>
                      <el-form
                        :rules="rechargeGasRules"
                        ref="rechargeGasForm"
                        :model="{}"
                        class="noStyle"
                        @submit.native.prevent
                      >
                        <el-form-item prop="rechargeAmount">
                          <el-input
                            v-model="rechargeAmount"
                            :disabled="rechargeDisable || blackFlag"
                            @blur="rechargeAmountChange"
                            @keyup.enter.stop.native="rechargeAmountChange"
                            type="number"
                            step="0.0001"
                            class="num"
                          ></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                  <div class="danWei">立方</div>
                </div>
              </div>
              <!--显示试算条件：ic卡表或ic卡远传表+气量表+阶梯计价+阶梯价数据不为空-->
              <div
                class="store-fee-box"
                v-if="
                  (meterCategory == 1 || meterCategory == 3) &&
                  gasOrMoney == 1 &&
                  this.billingTypeId == 2 &&
                  this.levelPriceList.length
                "
              >
                <div class="title">阶梯试算</div>
                <table>
                  <tr>
                    <th>阶梯</th>
                    <th>购气量(m³)</th>
                    <th>价格(元/m³)</th>
                    <th>应缴金额(元)</th>
                  </tr>
                  <tr v-for="(item, index) in levelPriceList" :key="index">
                    <td>{{ item.num }}</td>
                    <td>{{ item.curAmount }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.pay }}</td>
                  </tr>
                </table>
              </div>

              <div class="store-fee-box mb-none" v-if="otherPayCostList.length">
                <div class="title" style="font-size: 12px">其他费用</div>
                <div
                  class="check-contain"
                  style="
                    max-height: 280px;
                    overflow-y: scroll;
                    padding-right: 8px;
                  "
                >
                  <el-checkbox-group
                    v-model="otherFee"
                    @change="otherCostChange"
                    :disabled="rechargeDisable || blackFlag"
                    class="check-group"
                    v-for="(item, index) in otherPayCostList"
                    :key="index"
                  >
                    <el-checkbox :label="item.costRecordId">
                      {{
                      item.all
                      }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <el-row class="single-row" type="flex" justify="space-between">
                <el-col>实收金额 (元)</el-col>
              </el-row>
              <el-row>
                <el-form
                  :rules="shishouRules"
                  ref="shishouMoney"
                  :model="{}"
                  class="noStyle"
                  @submit.native.prevent
                >
                  <el-form-item prop="shishouMoney" class="yl">
                    <el-input
                      size="small"
                      :disabled="rechargeDisable || blackFlag"
                      @blur="paidInChange"
                      @keyup.enter.stop.native="paidInChange"
                      v-model="paidIn"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row class="single-row" type="flex" justify="space-between">
                <el-col>付款方式</el-col>
              </el-row>
              <el-row class type="flex" justify="space-between">
                <el-select
                  v-model="payType"
                  :disabled="rechargeDisable || blackFlag"
                  placeholder="请选择付款方式"
                  size="small"
                  class="pay-box"
                >
                  <el-option
                    v-for="item in payModeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-row>
              <el-row v-show="payType == 4" class="single-row small-jianxi">
                <el-input size="small" v-model="checkNo" placeholder="请输入支票号"></el-input>
              </el-row>
            </div>
            <div class="store-tab-body" v-if="storeTab == 2">
              <el-row class="single-row" type="flex" justify="space-between">
                <el-col>补气金额 (元)</el-col>
              </el-row>
              <el-form
                :rules="bqFormRules"
                ref="bqForm"
                :model="bqForm"
                class="noStyle"
                @submit.native.prevent
                style="width:100%"
                
              >
                <div class="white-box bq-ycb">
                  <div class="white-row no-b">
                    <div class="white-row no-b" v-show="gasOrMoney == 0">
                      <div class="bt-box w-box">
                        <div class="bt unit-tip-text">{{bqForm.bqMoney|numTip}}</div>
                        <el-form-item class="w-fill-width w-form" prop="bqMoney">
                          <el-input
                            style="width:100%"
                            v-model="bqForm.bqMoney"
                            :disabled="rechargeDisable"
                            @blur="bqBlur"
                            @keyup.enter.stop.native="bqBlur"
                            type="number"
                            class="num w-fill-width w-input"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="white-row no-b" v-show="gasOrMoney == 1">
                      <div class="bt-box">
                        <div class="bt">补气量</div>
                        <el-form-item prop="bqAmount">
                          <el-input
                            v-model="bqForm.bqAmount"
                            :disabled="rechargeDisable"
                            @blur="bqBlur"
                            @keyup.enter.stop.native="bqBlur"
                            type="number"
                            class="num"
                          ></el-input>
                        </el-form-item>
                      </div>
                      <div class="danWei">立方</div>
                    </div>
                  </div>
                </div>
                <div class="store-fee-box bqm yl">
                  <div
                    v-show="
                      meterCategory == 1 ||
                      (meterCategory == 3 && icInfo.icCardNo)
                    "
                  >
                    <div class="title">补气类型</div>
                    <el-form-item prop="bqType">
                      <el-select
                        v-model="bqForm.bqType"
                        :disabled="rechargeDisable"
                        placeholder="请选择付款方式"
                        size="small"
                        class="pay-box bqlx"
                      >
                        <el-option key="1" label="丢气补气" value="1"></el-option>
                        <el-option
                          key="2"
                          label="换表补气"
                          value="2"
                          v-show="icInfo && icInfo.icBuyNumber == 0"
                        ></el-option>
                        <el-option key="3" label="赠送补气" value="3"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="title">补气原因</div>
                  <el-form-item prop="reissueReason">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 5 }"
                      resize="none"
                      placeholder="请输入内容"
                      :disabled="rechargeDisable"
                      v-model="bqForm.reissueReason"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          <el-row class="single-row czbq-box" v-if="storeTab == 1">
            <div
              class="bt"
              size="small"
              :class="rechargeDisable || blackFlag ? 'disable' : ''"
              @click="rechargeVerify"
            >充值</div>
          </el-row>
          <el-row class="single-row czbq-box" v-if="storeTab == 2">
            <div
              class="bt"
              size="small"
              :class="rechargeDisable ? 'disable' : ''"
              @click="buqiVerify"
            >补气</div>
          </el-row>
        </div>
      </div>
    </div>
    <!-- </vue-scroll> -->
    <!-- 确认是否充值的弹窗 -->
    <el-dialog
      :visible.sync="confirmDialogVisible"
      :close-on-click-modal="false"
      width="300px"
      :show-close="false"
      class="recharge-confirm"
    >
      <div class="content">
        <div class="confirm">
          <img src="~@/assets/imgs/temp/alarm-blue.png" alt />
          <span>
            您的{{ storeTab == 1 ? "实收" : confirmTitle
            }}{{ storeTab == 1 ? "金额" : gasOrMoney == 0 ? "金额" : "量" }}为
            <i>
              {{
              storeTab == 1
              ? paidIn
              : gasOrMoney == 0
              ? bqForm.bqMoney
              : bqForm.bqAmount
              }}
            </i>
            {{ storeTab == 1 ? "元" : gasOrMoney == 0 ? "元" : "立方" }}，确定{{
            confirmTitle
            }}吗？
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rechargeGo">确 定</el-button>
        <el-button @click="confirmDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 缴费成功弹窗 -->
    <el-dialog
      class="payDialog"
      title
      @closed="goOn"
      :visible.sync="payStateShow"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
    >
      <div class="dialog-msgBox">
        <img src="@/assets/imgs/batchCreate/上传成功.png" alt />
        <div class="title">{{ sucMsg.title }}</div>
      </div>
      <div class="info-box">
        <div class="sec" v-if="sucMsg.number">
          <div class="title">{{ sucMsg.subTitle }}</div>
          <div class="numBox">
            <div class="num">{{ sucMsg.number }}</div>
            <div class="danwei" v-show="gasOrMoney == 0">元</div>
            <div class="danwei" v-show="gasOrMoney == 1">立方</div>
          </div>
        </div>
        <div class="sec" v-if="storeTab == 1 && otherFeeTotal">
          <div class="title">其他费用</div>
          <div class="numBox">
            <div class="num">{{ otherFeeTotal }}</div>
            <div class="danwei">元</div>
          </div>
        </div>
      </div>
      <el-row class="annius" type="flex" align="center" justify="center">
        <el-button type="primary" size="small" @click="goOn">继续</el-button>
        <el-button
          size="small"
          v-if="
            storeTab == 1 && this.paperCostRecordIds.costRecordIds && invoice
          "
          @click="printInvoice"
        >打印发票</el-button>
        <el-button
          size="small"
          v-if="storeTab == 1 && this.paperCostRecordIds.gasCostRecordId"
          @click="printPaper"
        >打印票据</el-button>
      </el-row>
    </el-dialog>
    <!-- 其他费用弹窗 -->
    <el-dialog
      class="otherCostDialog"
      :visible.sync="otherCostShow"
      :close-on-click-modal="false"
      @closed="otherDialogCancle"
      width="640px"
    >
      <div slot="title" class="title">
        <img src="@/assets/imgs/batchCreate/batchCreate-price.png" alt />
        <span>{{ otherCostDialogTitle }}</span>
      </div>
      <el-form
        label-position="left"
        :model="otherCostForm"
        :rules="otherCostRules"
        ref="otherCostForm"
        label-width="100px"
        class="otherCostForm"
      >
        <el-form-item label="费用类型：" prop="costType" required>
          <el-select
            v-model="otherCostForm.costType"
            placeholder="请选择类型"
            class="otherType"
            size="small"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in costTypeList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用金额：" prop="receivableAmount" required>
          <el-input
            v-model="otherCostForm.receivableAmount"
            placeholder="单位：元"
            class="otherType"
            size="small"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="reason">
          <el-input
            class="remarksp-input-area"
            style="height: 96px"
            type="textarea"
            rows="4"
            @input="onInput()"
            placeholder="请输入内容"
            v-model="otherCostForm.reason"
            maxlength="64"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="otherSubmitVarify">提交</el-button>
        <el-button size="small" @click="otherDialogCancle">取消</el-button>
      </span>
    </el-dialog>
    <!--下载IC卡组件弹窗-->
    <el-dialog
      class="ic-down-box"
      :visible.sync="ICDownLoadShow"
      :closeOnClickModal="false"
      :show-close="false"
      width="640px"
    >
      <div slot="title" class="title">
        <img src="@/assets/imgs/recharge/IC卡icon.png" alt />
        <span>下载IC卡组件</span>
      </div>
      <div class="com-box">
        <div class="r" v-for="(item, index) in icDownLoadUrls" :key="index">
          <img src="@/assets/imgs/ic-manager/读卡器icon@2x.png" alt class="co" />
          <div class="zi">{{ item.title }}</div>
          <a
            class="dl"
            :download="item.title"
            :href="`${publicPath}${item.url}`"
            :title="item.md"
          >下载</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refreshAfterDl" size="small">刷新</el-button>
        <el-button @click="closeDl" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 打印票据 -->
    <PaperPrintDialog
      :showPaperDialog="showPaperDialog"
      @concel="concel"
      :propDetails="paperPrintDetails"
    />
    <!-- 打印发票 -->
    <InvoicePrintDialog
      :showInvoiceDialog="showInvoiceDialog"
      @concel="closeInvoiceConcel"
      :details="invoicePrintDetails"
      :feeDetails="true"
      @onOkAfterConcel="onOkAfterConcel"
    />
  </div>
</template>

<script>
import cdMix from "./condition.js";
import archiveDetail from "./archiveDetail.js";
import otherCost from "./otherCost.js";
import recharge from "./recharge.js";
import icMix from "@/views/icManager/icClient/ic-mix.js"; // ic卡动态库
import icRechargeLib from "@/views/icManager/icClient/recharge.js"; // ic卡充值和补气动态库
import icRecharge from "./icRecharge.js";
import PaperPrintDialog from "@/views/print/paperPrint/index.vue";
import InvoicePrintDialog from "@/views/print/invoicePrint/index.vue";

export default {
  name: "single-recharge-index",
  components: { PaperPrintDialog, InvoicePrintDialog },
  mixins: [
    cdMix,
    archiveDetail,
    otherCost,
    recharge,
    icRecharge,
    icMix,
    icRechargeLib
  ],
  props: {
    sp_id: {
      type: String,
      required: true,
      default() {
        return this.$route.query.sp_id;
      }
    }
  },
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      showPaperDialog: false,
      paperPrintDetails: {
        costOperationType: 3,
        costRecordId: ""
      },
      showInvoiceDialog: false,
      invoicePrintDetails: {
        archivesNo: "",
        costRecordIdStr: "",
        payRecordId: ""
      },
      invoice: false
    };
  },
  filters:{
    numTip(num){
      let num_number = num * 1
      if(num_number> 20000000) return
      let num_string = num_number + ''
      num_string = num_string.split('.')[0]
      if(num_string.length<3) return
      let unit = ["", "十", "百", "千", "万","十万","百万","千万"];
      return 　`|　${unit[num_string.length - 1]}`
    }
  },
  watch: {
    $route() {
      if (
        this.$route.path == "/single-recharge" &&
        this.$route.query.sp_id == this.sp_id
      ) {
        // 从档案详情页进入时刷新其他费用
        if (this.archivesId) {
          this.getOtherCost();
        }
        // 修改再次进入页面为空不显示的问题
        if (this.rechargeFlag2) {
          this.storeTab = this.$route.query.storeTab;
          if (this.sp_id && this.sp_id.indexOf("?sign") == -1) {
            this.archivesId = this.sp_id;
          }
          if (this.$route.query.archivesId) {
            this.archivesId = this.$route.query.archivesId;
          }
          if (this.archivesId) {
            this.fillInfo(this.archivesId);
          }
          this.$store.commit("updateRechargeFlag", {
            key: "rechargeFlag",
            val: false
          });
        }
      }
      // console.log(this.$route, "route");
      // console.log(this.sp_id, "sp_id");
    }
  },
  created() {},
  mounted() {
    let isInvoice = this.$ls.get("tenantBasicConfig").is_invoice_enabled;
    isInvoice == true ? (this.invoice = true) : (this.invoice = false);
  },
  methods: {
    printPaper() {
      this.paperPrintDetails = {
        costOperationType: this.storeTab == 2 ? 3 : 1,
        costRecordId: this.paperCostRecordIds.gasCostRecordId || "",
        reprintFlag:1 //reprintFlag 用于标识是否是补打票据，1不是2是
      };
      this.showPaperDialog = true;
      this.payStateShow = false;
    },
    printInvoice() {
      this.invoicePrintDetails = {
        archivesNo: this.archivesData.archivesNo || "",
        costRecordIdStr: this.paperCostRecordIds.costRecordIds || "",
        payRecordId: this.paperCostRecordIds.payRecordId || "",
        noShowRecordList: true
      };
      this.showInvoiceDialog = true;
      this.payStateShow = false;
    },
    onOkAfterConcel() {
      this.payStateShow = false;
    },
    closeInvoiceConcel() {
      this.showInvoiceDialog = false;
    },
    concel() {
      this.showPaperDialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
@import "./condition.scss"; // 档案搜索栏
@import "./archiveDetail.scss"; // 档案信息
@import "./otherCost.scss"; // 其他费用
@import "./recharge.scss"; // 储值和补气
@import "@/views/icManager/icClient/ic-mix.scss"; // IC卡下载组件弹窗
@import './style.scss'; // 迭代

</style>