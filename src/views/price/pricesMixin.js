import {
  getSysDataList
} from "@/api/archivesAPI";
const pricesMixin = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10, //每页多少条
      pages: 0,
      total: 0,
      enableFlagEnum: [
        //状态枚举
        { k: "在用", v: "1" },
        { k: "禁用", v: "2" },
        { k: "已删除", v: "3" },
        { k: "停用", v: "9" }
      ],
      userSubclass: [],
      billingTypeEnum: [],
      timeUnitCodeEnum:[ ],
      
       //新增价格弹框==
       show: false,
       attr: {
       },
       //调价弹窗=====
       adjustShow: false,
       adjustShowAttr: {
       },
    }
  },
  methods: {
    openAddPriceDialog(){
      this.show = true;
    },
    openAdjustPriceDialog(){
      this.adjustShow = true;
      setTimeout(()=>{
        this.$refs.adjustDialog.changeEffictive();//阶梯价触发生效时间选择范围
      },10)
     
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPricesVersionList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if(this.total/val>this.currentPage-1){
         
      }else{
         this.currentPage = Math.floor(this.total/val);
      }
      this.getPricesVersionList();
    }
  },
  created(){
    let _billingTypeEnum = []
    let _billingType = this.$ls.get('DataList').billingType
    for(let i in _billingType.ids){
      _billingTypeEnum.push({
        k: _billingType.ids[i],
        v: i
      })
    }
    this.billingTypeEnum = _billingTypeEnum
    getSysDataList().then((res)=>{
      if (res.data.code == 0) {
        let _business = res.data.data.business.map((item)=>{
          return {
            v:item.sortValue,
            k:item.sortName,
            isMark: 1
          }
        })
        let _resident = res.data.data.resident.map((item)=>{
          return {
            v:item.sortValue,
            k:item.sortName,
            isMark: 2
          }
        })
        this.userSubclass = _business.concat(
          _resident
        )
        this.timeUnitCodeEnum = res.data.data.timeUnitCode.map((item)=>{
          return {
            v:item.sortValue,
            k:item.sortName
          }
        });
      } else {
      }
    })
  }
}

export {
  pricesMixin
}