<template>
  <div class="storeManagement">
    <div class="note">
      <div class="noteText">仓库管理</div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <div class="searchForm">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="库存信息" name="StockInfo">
                <Stock-info
                  :companyList="companyList"
                  :regionlist="regionlist"
                ></Stock-info>
              </el-tab-pane>
              <el-tab-pane label="入库" name="InboundList">
                <InboundList
                  :companyList="companyList"
                  :regionlist="regionlist"
                ></InboundList>
              </el-tab-pane>
              <el-tab-pane label="出库" name="OutboundList">
                <OutboundList
                  :companyList="companyList"
                  :regionlist="regionlist"
                ></OutboundList>
              </el-tab-pane>
            </el-tabs>
            <!--:is 的作用：会将div标签转换成 currentView 变量绑定的这个组件-->
            <!-- <div :is="currentView" keep-alive></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StockInfo from '../../../views/components/content/StockInfo'
import InboundList from '../../../views/components/content/InboundList'
import OutboundList from '../../../views/components/content/OutboundList'
export default {
  components: {
    StockInfo,
    InboundList,
    OutboundList
    // StockInfo: resolve => {
    //   require(['../../../views/components/content/StockInfo'], resolve)
    // },
    // InboundList: resolve => {
    //   require(['../../../views/components/content/InboundList'], resolve)
    // },
    // OutboundList: resolve => {
    //   require(['../../../views/components/content/OutboundList'], resolve)
    // }
  },
  data () {
    return {
      activeName: 'StockInfo',
      // currentView: 'StockInfo', //当前组件
      // activeName: 'first',
      drawer: false,
      companyList: [],
      regionlist: []
    };
  },
  methods: {
    handleClick (tab, event, name) {
      // console.log(tab)
      // console.log(event)
      // console.log(name)
    },
    // 获取客户
    getUserList () {
      this.$get('/customer', {
        page: 1,
        rows: 99999
      }).then((data) => {
        this.companyList = data.data.list;
      })
    },
    // 获取面料列表
    getRegionlist () {
      // if (this.regionlist.length > 0) return
      this.$get('/fabric/select', {
        page: 1,
        rows: 999999,
        fkCustomerId: -10
      }).then((data) => {
        this.regionlist = data.data
      })
    },
  },
  created () {
    this.getUserList()
    this.getRegionlist()
  }
}
</script>

<style>
span {
  outline: none;
}
.storeManagement {
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100%);
  height: calc(100vh - 64px) !important;
}

.storeManagement .note {
  height: 64px;
}
/* tr.trStyle{
    height: 60px !important;
  } */
.storeManagement .noteText {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  height: 28px;
  padding-left: 32px;
  padding-top: 18px;
  font-weight: bold;
}
.storeManagement .data {
  width: calc(100%);
  min-height: calc(100% - 64px);
  height: auto;
  padding: 24px 24px 24px 24px;
  background-color: #f0f3f7;
}
.storeManagement .dataContent {
  width: calc(100% - 48px);
  background-color: #fff;
  border-radius: 2px;
  border-radius: 2px;
  /* padding-bottom: 32px; */
}
.storeManagement .searchArea {
  width: calc(100%);
  margin: 0px 24px 0px 0px;
}
</style>