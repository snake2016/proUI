import {
  getSysDataList
} from "@/api/archivesAPI";
const basisDataMixin = {
  data() {
    return {
      enableFlagEnum: [
        //状态枚举
        { k: "在用", v: "1" },
        { k: "禁用", v: "2" },
        { k: "已删除", v: "3" },
        { k: "停用", v: "9" }
      ],
      userSubclass: [],
      billingTypeEnum: [],
      timeUnitCodeEnum:[],
      ops: window.scrollOps, // 滚动条
    }
  },
  methods: {
   
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
  basisDataMixin
}