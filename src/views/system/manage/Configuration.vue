<template>
  <div class="configurationManageContent">
    <div class="note">
      <div class="noteText">
        配置方案管理
      </div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <div class="searchForm">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="关键字:">
                <el-input v-model="searchParams.key" placeholder="请输入配置方案名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button plain @click="clearSearchInfo">重&nbsp;&nbsp;置</el-button>
                <el-button plain @click="getData">搜&nbsp;&nbsp;索</el-button>
                <el-button plain @click="openUpdateDrawer">新&nbsp;&nbsp;增</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="dataListArea">
          <el-table row-class-name="trStyle" class="tableData" :data="tableData" border stripe width="100%">
            <el-table-column align="center" :show-overflow-tooltip="true" prop="id" label="编号" >
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="name" label="配置方案名称">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
            </el-table-column>
            <el-table-column align="center" label="操作" width="400px" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
                <el-button type="primary" size="mini" @click="check(scope.row)">编辑</el-button>
                <el-button type="primary" size="mini" @click="HandlerDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="page" background layout="prev, pager, next" @current-change="changePage" :total="page.total" :current-page.sync="page.page">
          </el-pagination>
        </div>
      </div>
    </div>
    <div>
      <el-drawer size="50%" title="配置方案详情" :visible.sync="drawer" direction="rtl" :before-close="closeCheckDrawer">
        <div class="checkDrawer" >
          <el-divider content-position="left"></el-divider>
          <el-form>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="130px">
                  <el-form-item label="编号:">
                    <label>{{detailInfo.id}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="130px">
                  <el-form-item label="配置方案名称:">
                    <label>{{detailInfo.name}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="130px">
                  <el-form-item label="备注:">
                    <label>{{detailInfo.note}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="130px">
                  <el-form-item>
                    <el-button type="primary" @click="drawer=false" style="width: 100%">取消</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-drawer>
    </div>
    <div>
      <el-drawer size="50%" :title="drawerTitle" :visible.sync="updateDrawer"  direction="rtl" :before-close="closeCheckDrawer">
        <div class="checkDrawer">
          <el-divider content-position="left"></el-divider>
          <el-form :model="detailInfo" ref="configForm" :rules="rules" label-width="130px">
            <el-row>
              <el-col :span="12" v-if="operateType=='update'">
                <el-form-item label="编号:">
                  <label>{{detailInfo.id}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="配置方案名称:"  prop="name">
                  <el-input v-model="detailInfo.name" type="text" placeholder="请输入配置方案名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="备注:">
                  <el-input type="textarea" v-model="detailInfo.note"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item>
                    <el-button type="primary" @click="add">{{operateType=='add'?'保存':'修改'}}</el-button>
                    <el-button type="primary" @click="closeCheckDrawer">取消</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-drawer>
    </div>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import messageUtil from '../../../utils/js/MessageUtil'
  import dateUtil from '../../../utils/js/DateUtil'
  export default {
    data() {
      return {
        //查询参数
        searchParams: {
          //关键字：配置方案名称
          key: ""
        },
        //分页参数
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        tableData: [],
        //抽屉
        drawer: false,
        //某条详情的信息
        detailInfo: {},
        defaultInfo:{
          name:'',
          note:''
        },
        drawerTitle:'新增配置方案',
        updateDrawer:false,
        //编辑类型：add,update
        operateType:'add',
        rules:{
          name:[{ required: true, message: '请输入配置方案名称', trigger: 'blur' }]
        }
      }
    },
    methods: {
      getData() {
        this.$get('/config',{
          ...this.searchParams,...this.page
        }).then((data)=>{
          this.tableData=data.data.list;
          this.page.total = data.data.total;
        })
      },
      search(){
        this.page.page=1;
        this.getData()
      },
      changePage(page) {
        this.page.page = page;
        this.getData();
      },
      //重置
      clearSearchInfo() {
        this.page.page = 1;
        this.page.rows = 10;
        this.page.total = 0;
        this.searchParams = {}
        this.getData()
      },
      //点击查看详情按钮，显示用户详细信息弹框
      showDetail(row) {
        this.drawer = true;
        this.detailInfo = row;
      },
      //点击新增按钮，显示新增弹框
      openUpdateDrawer() {
        this.updateDrawer = true;
        this.detailInfo = {
          name:'',
          note:''
        };
        this.drawerTitle = '新增配置方案';
        this.operateType = 'add';
      },
      //点击编辑按钮，显示编辑弹框
      check(row) {
        this.updateDrawer = true;
        this.detailInfo = {
          id:row.id,
          name:row.name,
          note:row.note
        };
        this.drawerTitle = '编辑配置方案';
        this.operateType = 'update';
      },
      //关闭抽屉清空数据
      closeCheckDrawer() {
        this.drawer = false;
        this.updateDrawer = false;
        this.detailInfo = {
          name:'',
          note:''
        };
        this.$refs['configForm'].resetFields();
      },
      //点击保存按钮
      add(){
        //判断
        this.$refs['configForm'].validate((valid) => {
          if (valid) {
            if(this.operateType=='add'){
              this.$post('/config',this.detailInfo).then((data)=>{
                messageUtil.message.success(data.message)
                this.closeCheckDrawer();
                this.getData();
              })
            }else{
              this.$put('/config/'+this.detailInfo.id,this.detailInfo).then((data)=>{
                messageUtil.message.success(data.message)
                this.closeCheckDrawer();
                this.getData();
              })
            }
          } else {
            return false;
          }
        });
      },
      //删除
      HandlerDelete(configInfo){
        messageUtil.confirm('确认要删除该配置方案吗？',()=>{
          this.$deletefn('/config/'+configInfo.id,{}).then((data)=>{
            messageUtil.message.success(data.message)
            this.getData();
          })
        })
      }
    },
    mounted() {
      this.getData();
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    }
  }
</script>

<style >
  span{outline:none}
  .configurationManageContent {
    overflow-y: auto;
    overflow-x: hidden;
    width: calc(100%);
    height: calc(100vh - 64px) !important;
  }

  .configurationManageContent .note {
    height: 64px;
  }
  tr.trStyle{
    height: 60px !important;
  }
  .configurationManageContent .noteText {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    height: 28px;
    padding-left: 32px;
    padding-top: 18px;
    font-weight: bold;
  }

  .configurationManageContent .data {
    width: calc(100%);
    min-height: calc(100% - 64px);
    height: auto;
    padding: 24px 24px 24px 24px;
    background-color: #F0F3F7;
  }

  .configurationManageContent .dataContent {
    width: calc(100% - 48px);
    background-color: #fff;
    border-radius: 2px;
    border-radius: 2px;
    padding-bottom: 32px;
  }

  .configurationManageContent .searchArea {
    width: calc(100%);
    margin: 0px 24px 0px 0px;
  }

  .configurationManageContent .searchForm {
    padding-top: 24px;
    padding-left: 32px;
  }

  .configurationManageContent .dataListArea {
    margin: 0px 24px 24px 24px;
  }

  .configurationManageContent .tableData {
    height: 100%;
  }

  .configurationManageContent .page {
    margin: 15px 15px;
    float: right;
  }

  .configurationManageContent .el-drawer__header {
    margin-bottom: 0px !important;
  }
  .configurationManageContent .checkDrawer {
    height: calc(90vh);
    margin-bottom: 100px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .configurationManageContent .configHeaderImg{
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
</style>
