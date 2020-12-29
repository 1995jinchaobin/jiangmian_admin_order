<template>
  <div class="storeManageSearch">
    <!-- {{companyList}} -->
    <el-form :inline="true" :model="searchInfo" ref="searchForm">
      <el-form-item label="公司名:" prop="customerName">
        <!-- <el-input v-model="searchInfo.customerName" placeholder="请输入公司名" class="companyInput"></el-input> -->
        <el-autocomplete
          v-model="searchInfo.customerName"
          :fetch-suggestions="querySearch"
          clearable
          value-key="name"
          @clear="searchList"
          placeholder="请输入公司名"
          @select="searchList">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="面料规格:" prop="name">
        <!-- <el-select v-model="searchInfo.name" placeholder="请输入面料规格" @focus="getRegionlist" clearable>
          <el-option
            v-for="item in regionlist"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select> -->
        <el-autocomplete
          v-model="searchInfo.name"
          clearable
          :fetch-suggestions="querySearch1"
          value-key="name"
          placeholder="请输入面料名称"
          @clear="searchList"
          @select="searchList">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="日期" prop="time">
        <el-date-picker
         :clearable="false"
          v-model="time"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetSearch" plain>重&nbsp;&nbsp;置</el-button>
        <el-button @click="searchList" plain>搜&nbsp;&nbsp;索</el-button>
        <el-button @click="daochu" plain>导&nbsp;&nbsp;出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props:{
    companyList: Array,
    regionlist: Array
  },
  data() {
    return {
      searchInfo: {
        page:1,
        rows:10,
        customerName:'',
        name:'',
        startTime:'',
        endTime:''
      },
      time:[],
      // 面料规格数据列表
      // regionlist:[],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  methods: {
    // 搜索重置
    resetSearch(){
      this.searchInfo = {
        page:1,
        rows:10,
        customerName:'',
        name:'',
        startTime:'',
        endTime:''
      }
      this.time = []
      this.$refs.searchForm.resetFields()
      this.$emit('searchList',this.searchInfo)
    },
    // 搜索
    searchList() {
      if (this.searchInfo.time === undefined) {
        delete this.searchInfo.time
      }
      if (this.time[0]) {
        this.searchInfo.startTime = this.time[0]
        this.searchInfo.endTime = this.time[1]
      }
      this.$emit('searchList',this.searchInfo)
    },
    // getRegionlist(){
    //   if (this.regionlist.length > 0) return
    //   this.$get('/fabric',{
    //     page:1,
    //     rows:999999
    //   }).then((data)=>{
    //     this.regionlist = data.data.list
    //   })
    // },
    // 导出
    daochu(){
      if (this.searchInfo.time === undefined) {
        delete this.searchInfo.time
      }
      if (this.time[0]) {
        this.searchInfo.startTime = this.time[0]
        this.searchInfo.endTime = this.time[1]
      }
      this.$emit('daochu',this.searchInfo)
    },
    // 公司名联系搜索框
    querySearch(queryString, cb) {
      const companyList = this.companyList;
      const results = queryString ? companyList.filter(this.createFilter(queryString)) : companyList;
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      }
    },
     // 面料名联系搜索框
    querySearch1(queryString, cb) {
      const regionlist = this.regionlist;
      const results = queryString ? regionlist.filter(this.createFilter1(queryString)) : regionlist;
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter1(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      }
    }
    // handleSelect(item) {
    //   this.searchList()
    // }
  }
}
</script>

<style>
.storeManageSearch{
  width: 100%;
}
/* .storeManageSearch .el-select{
  width: 140px;
}
.storeManageSearch .companyInput{
  width: 120px;
} */
</style>