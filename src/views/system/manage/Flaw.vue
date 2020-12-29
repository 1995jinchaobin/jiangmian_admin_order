<template>
  <div class="flaw">
    <div class="note">
      <div class="noteText">
        瑕疵管理
      </div>
    </div>
    <div class="data">
      <div class="dataContent">
        <!-- 瑕疵搜索 -->
        <div class="searchArea">
          <div class="searchForm">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="关键字:">
                <el-input v-model="flawParams.key" placeholder="请输入瑕疵名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button plain @click="clearSearchInfo">重&nbsp;&nbsp;置</el-button>
                <el-button plain @click="getData">搜&nbsp;&nbsp;索</el-button>
                <el-button plain @click="openUpdateDrawer">新&nbsp;&nbsp;增</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 瑕疵列表 -->
        <div class="dataListArea">
          <el-table
            :data="flawList"
            stripe
            border>
            <el-table-column
              prop="name"
              align="center"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="num"
              align="center"
              label="扣除积分">
            </el-table-column>
            <el-table-column
              label="状态"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status===0">存在</span>
                <span v-else>删除</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button @click="bianJi(scope.row)" type="primary" size="mini">编辑</el-button>
                <el-button @click="del(scope.row)" type="primary" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page" v-if="total > 10">
             <el-pagination background layout="prev, pager, next" @current-change="changePage" :total="total" :current-page.sync="flawParams.page">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增瑕疵抽屉 -->
    <div class="add">
      <el-drawer
        :title="title"
        :visible.sync="drawerAdd"
        :before-close="drawerAddClose">
        <el-form :model="addFlawParams" ref="addFlawParamsRef" :rules="addFlawParamsRules" label-width="100px">
          <el-form-item label="瑕疵名称:" prop="name">
            <el-input v-model="addFlawParams.name" type="text" placeholder="请输入瑕疵名称"></el-input>
          </el-form-item>
          <el-form-item label="扣除积分:" prop="num">
            <el-input v-model="addFlawParams.num" type="text" placeholder="请输入扣除积分"></el-input>
          </el-form-item>
        </el-form>
        <div class="addBottomBtn">
          <el-button @click="postAddFlawForm" type="primary">保存</el-button>
          <el-button @click="drawerAddClose" type="primary">取消</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import messageUtil from '../../../utils/js/MessageUtil'
export default {
  data () {
    return {
      flawParams: {
        page: 1,
        rows: 10,
        key: ''
      },
      total:0,
      flawList: [],
      // 添加瑕疵
      addFlawParams: {
        name: '',
        num: ''
      },
      drawerAdd: false,
      title: '',
      addFlawParamsRules: {
        name: [{ required: true, message: '请输入瑕疵名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入扣除积分', trigger: 'blur' }]
      },
      bianJiId: ''
    }
  },
  created () {
    this.getFlawList()
  },
  methods: {
    async getFlawList () {
      const res = await this.$get('/flaw',{
        ...this.flawParams
      })
      if (res.code!==0) return messageUtil.message.error(res.message)
      this.flawList = res.data.list
      this.total = res.data.total
    },
    changePage(page) {
      this.flawParams.page = page;
      this.getFlawList();
    },
    // 重置
    clearSearchInfo () {},
    // 搜索
    getData () {},
    // 新增按钮
    openUpdateDrawer () {
      this.title = '新增瑕疵'
      this.drawerAdd = true
    },
    // 关闭新增瑕疵窗口
    drawerAddClose () {
      this.$refs.addFlawParamsRef.resetFields()
      this.drawerAdd = false
    },
    // 保存新增瑕疵按钮
    postAddFlawForm () {
      this.$refs.addFlawParamsRef.validate(async value=>{
        if (!value) return
        if (this.title === '新增瑕疵') {
          const res = await this.$post('/flaw', this.addFlawParams)
          messageUtil.message.success(res.message)
        } else {
          const res = await this.$put('/flaw/' + this.bianJiId, this.addFlawParams)
          messageUtil.message.success(res.message)
        }
        this.getFlawList()
        this.drawerAddClose()
      })
    },
    // 编辑
    bianJi (value) {
      this.title = '编辑瑕疵'
      this.noteshow = true
      this.addFlawParams.name = value.name
      this.addFlawParams.num = value.num
      this.bianJiId = value.id
      this.drawerAdd = true
    },
    // 删除
    del (value) {
      messageUtil.confirm('确认要删除该瑕疵吗？', async a=>{
        const res = await this.$deletefn('/flaw/'+value.id,{})
        messageUtil.message.success(res.message)
        this.getFlawList()
      })
    }
  }
}
</script>

<style>
.flaw {
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100%);
  height: calc(100vh - 64px) !important;
}
.flaw .note {
  height: 64px;
}
.flaw .noteText {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  height: 28px;
  padding-left: 32px;
  padding-top: 18px;
  font-weight: bold;
}
.flaw .data {
  width: calc(100%);
  min-height: calc(100% - 112px);
  height: auto;
  padding: 24px 24px 24px 24px;
  background-color: #F0F3F7;
}
.flaw .dataContent {
  width: calc(100% - 48px);
  background-color: #fff;
  border-radius: 2px;
  border-radius: 2px;
  padding-bottom: 32px;
}
.flaw .searchArea {
  width: calc(100%);
  margin: 0px 24px 0px 0px;
}

.flaw .searchForm {
  padding-top: 24px;
  padding-left: 32px;
}

.flaw .dataListArea {
  margin: 0px 24px 24px 24px;
}

.flaw .tableData {
  height: 100%;
}
.flaw .addBottomBtn{
  display: flex;
  justify-content: center;
}
.flaw .addBottomBtn .el-button{
  margin: auto 20px;
}
.flaw .page{
    display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>