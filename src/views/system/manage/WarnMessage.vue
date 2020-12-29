<template>
  <div class="warnMessage">
    <el-table
      :data="warnMessageList"
      style="width: 100%"
      border
      stripe>
      <!-- <el-table-column
        align="center"
        prop="createTime"
        label="日期">
      </el-table-column> -->
      <el-table-column
        prop="customerName"
        label="客户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="fabricName"
        align="center"
        label="面料名">
      </el-table-column>
      <el-table-column
        prop="sizingExpectNum"
        align="center"
        label="上浆预期存量">
      </el-table-column>
      <el-table-column
        prop="threshold"
        align="center"
        label="警报阀值">
      </el-table-column>
      <el-table-column
        label="操作"
        width="280px"
        align="center">
        <template slot-scope="scope">
          <el-button @click="toMianliao(scope.row)" size="mini" type="primary">面料</el-button>
          <el-button size="mini" type="primary" @click="toCangchu(scope.row)">仓储</el-button>
          <!-- <el-button size="mini" type="primary" @click="lookMadan(scope.row)" v-else>查看码单</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <div class="pagination" v-if="total > 10">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
        :current-page.sync="getWarnMessageParams.page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      getWarnMessageParams:{
        page:1,
        rows:10
      },
      total:0,
      warnMessageList:[]
    }
  },
  created() {
    this.getWarnMessageList()
  },
  methods:{
    // 获取警报列表
    getWarnMessageList () {
      // console.log(this.rukuParams)
      this.$get('/inventory/alarm',{
        ...this.getWarnMessageParams
      }).then((data)=>{
        // console.log(data.data.list)
        // console.log(data)
        // this.rukuList = data.data.list
        this.warnMessageList = data.data.list
        this.total = data.data.total
        // console.log(this.total)
      })
    },
     // 页码切换
    changePage(page) {
      this.getWarnMessageParams.page = page;
      this.getWarnMessageList();
    },
    // 点击面料按钮
    toMianliao(a){
      // console.log(a,'面料按钮')
      this.$router.push({  
        path: '/fabricManage',
        name:'FabricManage',
        params: {  
          key: a.fabricId
        }
      })
      window.sessionStorage.setItem('defaultActive','/fabricManage')
    },
    // 点击仓储按钮
    toCangchu(a) {
      this.$router.push({  
        path: '/storeManagement',
        name:'StoreManagement',
        params: {  
          key: a.inventoryId
        }
      })
      window.sessionStorage.setItem('defaultActive','/storeManagement')
    }
  }
}
</script>

<style>
.warnMessage{
  padding: 10px;
}
.warnMessage .pagination{
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>