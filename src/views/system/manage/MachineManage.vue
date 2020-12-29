<template>
  <div class="machineManageContent">
    <div class="note">
      <div class="noteText">
        机器管理
      </div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <div class="searchForm">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="关键字:">
                <el-input v-model="searchParams.key" placeholder="请输入机器名称"></el-input>
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
            <el-table-column align="center" :show-overflow-tooltip="true" prop="name" label="机器名称">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="capacity" label="机器产能">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="percentage" label="普通机器产能比例">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="urgentPercentage" label="加急机器产能比例">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
            </el-table-column>
            <el-table-column align="center" label="操作" width="400px" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
                <el-button type="primary" size="mini" @click="check(scope.row)">编辑</el-button>
                <el-button type="primary" size="mini" @click="showBind(scope.row)">绑定打印员</el-button>
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
      <el-drawer size="50%" title="机器详情" :visible.sync="drawer" direction="rtl">
        <div class="checkDrawer" >
          <el-divider content-position="left"></el-divider>
          <el-form>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="140px">
                  <el-form-item label="编号:">
                    <label>{{detailInfo.id}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="140px">
                  <el-form-item label="机器名称:">
                    <label>{{detailInfo.name}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="140px">
                  <el-form-item label="机器产能:">
                    <label>{{detailInfo.capacity}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="140px">
                  <el-form-item label="普通机器产能比例:">
                    <label>{{detailInfo.percentage}}%</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="140px">
                  <el-form-item label="加急机器产能比例:">
                    <label>{{detailInfo.urgentPercentage}}%</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="140px">
                  <el-form-item label="备注:">
                    <label>{{detailInfo.note}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="140px">
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
          <el-form :model="detailInfo" ref="machineForm" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="12" v-if="operateType=='update'">
                <el-form-item label="编号:">
                  <label>{{detailInfo.id}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器名称:"  prop="name">
                  <el-input v-model="detailInfo.name" type="text" placeholder="请输入机器名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="产能:" prop="capacity">
                  <el-input v-model.number="detailInfo.capacity" type="text" placeholder="请输入机器产能"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="1">
                <el-form-item label="普通产能比例:" prop="percentage">
                  <el-slider
                    v-model.number="detailInfo.percentage"
                    show-input>
                  </el-slider>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="1">
                <el-form-item label="加急产能产能:" prop="urgentPercentage">
                  <el-slider
                    v-model.number="detailInfo.urgentPercentage"
                    show-input>
                  </el-slider>
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
    <div>
      <el-dialog
        title="绑定打印员"
        :visible.sync="bindDrawer"
        width="80%">
        <el-row>
          <el-col :span="11" :offset="1">
            <div class="bindTitle">已绑定打印员</div>
            <el-table row-class-name="trStyle" class="tableData" :data="bindedUserList" border stripe width="100%">
              <el-table-column align="center" :show-overflow-tooltip="true" prop="id" label="编号" >
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="name" label="打印员姓名">
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="account" label="账号">
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handlerUnbind(scope.row)">解绑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="11" :offset="1">
            <div class="bindTitle">打印员列表</div>
            <el-table row-class-name="trStyle" class="tableData" :data="userList" border stripe width="100%">
              <el-table-column align="center" :show-overflow-tooltip="true" prop="id" label="编号" >
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="name" label="打印员姓名">
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="account" label="账号">
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handlerBind(scope.row)">绑定</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bindDrawer = false">取 消</el-button>
        </span>
      </el-dialog>
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
          //关键字：机器名称
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
        //是否显示绑定打印员弹框
        bindDrawer:false,
        //某条详情的信息
        detailInfo: {},
        defaultInfo:{
          name:'',
          note:''
        },
        drawerTitle:'新增机器',
        updateDrawer:false,
        //编辑类型：add,update
        operateType:'add',
        rules:{
          name:[{ required: true, message: '请输入机器名称', trigger: 'blur' }],
          capacity:[{required: true, message: '请输入机器产能', trigger: 'blur'},{ type: 'number', message: '机器产能必须为数字值'}],
          percentage:[{required: true, message: '请输入机器普通产能比例',trigger: 'blur'}],
          urgentPercentage:[{required: true, message: '请输入机器加急产能比例',trigger: 'blur'}]
        },
        //做绑定操作的机器id
        machineId:0,
        //已绑定打印员列表
        bindedUserList:[],
        //打印员列表
        userList:[]
      }
    },
    methods: {
      getData() {
        this.$get('/machine',{
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
      //点击新增按钮，显示编辑弹框
      openUpdateDrawer() {
        this.updateDrawer = true;
        this.detailInfo = {
          name:'',
          capacity:0,
          percentage:0,
          urgentPercentage:0,
          note:''
        };
        this.drawerTitle = '新增机器';
        this.operateType = 'add';
      },
      //点击编辑按钮，显示编辑弹框
      check(row) {
        this.updateDrawer = true;
        this.detailInfo = {
          id:row.id,
          name:row.name,
          capacity:row.capacity,
          percentage:row.percentage,
          urgentPercentage:row.urgentPercentage,
          note:row.note
        };
        this.drawerTitle = '编辑机器';
        this.operateType = 'update';
      },
      //关闭抽屉清空数据
      closeCheckDrawer() {
        this.drawer = false;
        this.updateDrawer = false;
        this.detailInfo ={
          name:'',
          note:''
        };
        this.$refs['machineForm'].resetFields();
      },
      //点击保存按钮
      add(){
        //判断
        this.$refs['machineForm'].validate((valid) => {
          if (valid) {
            if(this.detailInfo.percentage+this.detailInfo.urgentPercentage != 100){
              messageUtil.message.error("普通产能比例和加急产能比例相加不为100！")
              return;
            }else{
                if(this.operateType=='add'){
                this.$post('/machine',this.detailInfo).then((data)=>{
                  messageUtil.message.success(data.message)
                  this.closeCheckDrawer();
                  this.getData();
                })
              }else{
                this.$put('/machine/'+this.detailInfo.id,this.detailInfo).then((data)=>{
                  messageUtil.message.success(data.message)
                  this.closeCheckDrawer();
                  this.getData();
                })
              }
            }
          } else {
            return false;
          }
        });
      },
      //删除
      HandlerDelete(machineInfo){
        messageUtil.confirm('确认要删除该机器吗？',()=>{
          this.$deletefn('/machine/'+machineInfo.id,{}).then((data)=>{
            messageUtil.message.success(data.message)
            this.getData();
          })
        })
      },
      showBind(val){
        this.machineId = val.id;
        this.getBindedUser();
        // this.getUserList();
        this.bindDrawer = true;
      },
      //绑定打印员
      handlerBind(userInfo){
        this.$post('/machine/bind/user',{
          //机器id
          fkMachineId:this.machineId,
          //打印员id
          fkUserId:userInfo.id
        }).then((data)=>{
          messageUtil.message.success(data.message)
          this.getBindedUser();
          // this.getUserList();
        })
      },
      //解绑打印员
      handlerUnbind(userInfo){
        this.$post('/machine/unbind/user',{
          //机器id
          fkMachineId:this.machineId,
          //打印员id
          fkUserId:userInfo.id
        }).then((data)=>{
          messageUtil.message.success(data.message)
          this.getBindedUser();
          // this.getUserList();
        })
      },
      //查询已绑定打印员
      getBindedUser(){
        this.$get('/machine/bind/user',{
          page:0,
          rows:99999,
          key:'',
          fkMachineId:this.machineId
        }).then((data)=>{
          this.bindedUserList=data.data.list;
          this.getUserList();
        })
      },
      //查询打印员
      getUserList(val){
        this.$get('/user',{
          page:1,
          rows:99999,
          key:'',
          role:5
        }).then((data)=>{
          var userList=data.data.list;
          var resultList = []
          for(var i=0;i<userList.length;i++){
            if(JSON.stringify(this.bindedUserList).indexOf(JSON.stringify(userList[i]))==-1){
              resultList.push(userList[i])
            }
          }
          this.userList = resultList;
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
  .machineManageContent {
    overflow-y: auto;
    overflow-x: hidden;
    width: calc(100%);
    height: calc(100vh - 64px) !important;
  }

  .machineManageContent .note {
    height: 64px;
  }
  tr.trStyle{
    height: 60px !important;
  }
  .machineManageContent .noteText {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    height: 28px;
    padding-left: 32px;
    padding-top: 18px;
    font-weight: bold;
  }

  .machineManageContent .data {
    width: calc(100%);
    min-height: calc(100% - 64px);
    height: auto;
    padding: 24px 24px 24px 24px;
    background-color: #F0F3F7;
  }

  .machineManageContent .dataContent {
    width: calc(100% - 48px);
    background-color: #fff;
    border-radius: 2px;
    border-radius: 2px;
    padding-bottom: 32px;
  }

  .machineManageContent .searchArea {
    width: calc(100%);
    margin: 0px 24px 0px 0px;
  }

  .machineManageContent .searchForm {
    padding-top: 24px;
    padding-left: 32px;
  }

  .machineManageContent .dataListArea {
    margin: 0px 24px 24px 24px;
  }

  .machineManageContent .tableData {
    height: 100%;
  }

  .machineManageContent .page {
    margin: 15px 15px;
    float: right;
  }

  .machineManageContent .el-drawer__header {
    margin-bottom: 0px !important;
  }
  .machineManageContent .checkDrawer {
    height: calc(90vh);
    margin-bottom: 100px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .machineManageContent .machineHeaderImg{
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
  .machineManageContent .bindTitle{
    font-size: 16px;
    margin-bottom: 5px;
  }
</style>
