<template>
  <div class="slurry">
    <div class="note">
      <div class="noteText">
        浆料管理
      </div>
    </div>
    <div class="main">
      <div class="searchKey">
        <el-form :inline="true">
          <el-form-item label="关键字:">
            <el-input v-model="searchParams.key" placeholder="请输入浆料名称或备注" clearable @clear="clearSearchInfo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button plain @click="clearSearchInfo">重&nbsp;&nbsp;置</el-button>
            <el-button plain @click="getTableList">搜&nbsp;&nbsp;索</el-button>
            <el-button plain @click="openUpdateDrawer">新增浆料</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tableList">
        <el-table :data="tableData" border stripe width="100%">
          <el-table-column align="center" :show-overflow-tooltip="true" prop="id" label="编号" >
          </el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" prop="name" label="浆料名称">
          </el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
          </el-table-column>
          <el-table-column label="操作" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openChangeDrawer(scope.row)">编辑</el-button>
              <el-button type="primary" size="mini" @click="HandlerDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="page" background layout="prev, pager, next" @current-change="changePage" :total="total" :current-page.sync="searchParams.page">
        </el-pagination>
      </div>
    </div>
    <!-- 新增浆料 -->
    <div class="addjiangliaoMianliao">
      <el-drawer
        :title="jiangliaoId===''?'新增浆料配方':'编辑浆料配方'"
        size="50%"
        :visible.sync="jiangliaoDrawer"
        :before-close="jiangliaoClose">
        <div class="jiangliaoDrawer">
           <el-form :model="jiangliaoInfo" ref="jiangliaoForm" :rules="jiangliaoRules" label-width="100px">
             <el-form-item label="编号:" v-if="jiangliaoId">
                <span>{{jiangliaoId}}</span>
              </el-form-item>
             <el-form-item label="浆料名称:"  prop="name">
              <!-- <el-autocomplete
                v-model="jiangliaoInfo.name"
                :fetch-suggestions="querySearch1"
                placeholder="请输入面料名称"
                value-key="name"
                @select="handleSelect"
              ></el-autocomplete> -->
                <el-input v-model="jiangliaoInfo.name"></el-input>
             </el-form-item>
             <el-form-item label="备注:">
                <el-input type="textarea" v-model="jiangliaoInfo.note"></el-input>
              </el-form-item>
           </el-form>
           <div class="jiangliaoDrawerBtn">
              <el-button type="primary" @click="addjiangliaoBtn">保存</el-button>
              <el-button type="primary" @click="jiangliaoClose">取消</el-button>
           </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import messageUtil from '../../../utils/js/MessageUtil'
export default {
  name: 'Slurry',
  data () {
    return {
      searchParams: {
        key: '',
        page: 1,
        rows: 10,
      },
      tableData: [],
      total: 0,
      jiangliaoDrawer: false,
      jiangliaoInfo: {
        name: '',
        note: ''
      },
      jiangliaoRules: {
        name:[{ required: true, message: '请输入浆料名称', trigger: 'change' }],
      },
      jiangliaoId: ''
    }
  },
  methods: {
    // 获取浆料列表
    getTableList () {
      this.$get('/sizing/sizing',this.searchParams).then((data)=>{
        this.tableData = data.data.list
        this.total = data.data.total
      })
    },
    //搜索重置按钮
    clearSearchInfo () {
      this.searchParams.key = ''
      this.searchParams.page = 1
      this.searchParams.rows = 10
      this.getTableList()
    },
    //切换页码
    changePage(page) {
      this.searchParams.page = page
      this.getTableList()
    },
    // 新增浆料按钮
    openUpdateDrawer () {
      this.jiangliaoDrawer = true
    },
    //编辑浆料按钮
    openChangeDrawer (value) {
      this.jiangliaoInfo.name = value.name
      this.jiangliaoInfo.note = value.note
      this.jiangliaoId = value.id
      this.jiangliaoDrawer = true
    },
    //删除浆料按钮
    HandlerDelete (value) {
      messageUtil.confirm('确认要删除该浆料吗？',()=>{
        this.$deletefn('/sizing/sizing/'+value.id,{}).then((data)=>{
          messageUtil.message.success(data.message)
          this.getTableList();
        })
      })
    },
    //关闭新增浆料窗口
    jiangliaoClose () {
      this.$refs['jiangliaoForm'].resetFields()
      this.jiangliaoInfo.name = ''
      this.jiangliaoInfo.note = ''
      this.jiangliaoId = ''
      this.jiangliaoDrawer =false
    },
    //保存新增浆料按钮
    addjiangliaoBtn () {
      this.$refs['jiangliaoForm'].validate((valid) => {
        if (!valid) return
        if (this.jiangliaoId === '') {
          this.$post('/sizing/sizing',this.jiangliaoInfo).then((data)=>{
            messageUtil.message.success(data.message)
            if (data.code === 0) {
              this.getTableList()
              this.jiangliaoClose()
            }
          })
        } else {
          const updata = {
            ...this.jiangliaoInfo,
            id: this.jiangliaoId
          }
          this.$post('/sizing/sizing/update',updata).then((data)=>{
            messageUtil.message.success(data.message)
            if (data.code === 0) {
              this.getTableList()
              this.jiangliaoClose()
            }
          })
        }
      })
    }
  },
  created () {
    this.getTableList()
  }
}
</script>

<style scoped>
.noteText{
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  height: 28px;
  padding-left: 32px;
  padding-top: 18px;
  margin-bottom: 18px;
  font-weight: bold;
}
.main{
  border: 20px solid #F0F3F7;
  min-height: calc(100vh - 128px);
  box-sizing: border-box;
  padding:20px
}
.jiangliaoDrawer{
  width: 80%;
}
.jiangliaoDrawerBtn{
  margin-left: 40px;
}
.page{
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>