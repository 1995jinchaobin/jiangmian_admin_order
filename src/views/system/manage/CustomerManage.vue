<template>
  <div class="customerManageContent">
    <div class="note">
      <div class="noteText">
        客户管理
      </div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <div class="searchForm">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="关键字:">
                <el-input v-model="searchParams.key" placeholder="请输入姓名或账号"></el-input>
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
            <el-table-column align="center" :show-overflow-tooltip="true" prop="userDetail.phone" label="联系电话">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="userDetail.contacts" label="联系人 ">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="userDetail.companyName" label=" 公司名 ">
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="userDetail.address" label="地址 ">
            </el-table-column>
            <el-table-column align="center" label="操作" width="400px" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
                <el-button type="primary" size="mini" @click="check(scope.row)">编辑</el-button>
                <el-button type="primary" size="mini" @click="HandlerDelete(scope.row)">删除</el-button>
                <el-button type="primary" size="mini" @click="HandlerResetPwd(scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="page" background layout="prev, pager, next" @current-change="changePage" :total="page.total" :current-page.sync="page.page">
          </el-pagination>
        </div>
      </div>
    </div>
    <div>
      <el-drawer size="50%" title="客户详情" :visible.sync="drawer" direction="rtl">
        <div class="checkDrawer" >
          <el-divider content-position="left"></el-divider>
          <el-form>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="编号:">
                    <label>{{detailInfo.id}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="所属业务员:">
                    <label>{{detailInfo.bindUserName}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="姓名:">
                    <label>{{detailInfo.name}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="账号:">
                    <label>{{detailInfo.account}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="联系人:">
                    <label>{{detailInfo.contacts}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="联系电话:">
                    <label>{{detailInfo.phone}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="公司名:">
                    <label>{{detailInfo.companyName}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="地址:">
                    <label>{{detailInfo.address}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="备注:">
                    <label>{{detailInfo.remark}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="创建时间:">
                    <label>{{detailInfo.createTime}}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
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
          <el-form :model="detailInfo" ref="customerForm" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="11" :offset="1" v-if="operateType=='update'">
                <el-form-item label="编号:">
                  <label>{{detailInfo.id}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="operateType=='update'?11:12" :offset="operateType=='update'?0:1">
                <el-form label-width="100px">
                  <el-form-item label="所属业务员:">
                    <el-select v-model="detailInfo.bindUserId">
                      <el-option v-for="(item,index) in userList" :key="'user'+index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="姓名:"  prop="name">
                  <el-input @change="nameChange" v-model="detailInfo.name" type="text" placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号:" prop="account">
                  <label  v-if="operateType=='update'">{{detailInfo.account}}</label>
                  <el-input @change="accountChange" v-else v-model="detailInfo.account" type="text" placeholder="请输入账号" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="联系人:"  prop="contacts">
                  <el-input v-model="detailInfo.contacts" type="text" placeholder="请输入联系人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话:"  prop="phone">
                  <el-input v-model="detailInfo.phone" type="text" placeholder="请输入联系电话名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="公司名:"  prop="companyName">
                  <el-input v-model="detailInfo.companyName" type="text" placeholder="请输入公司名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址:"  prop="address">
                  <el-input v-model="detailInfo.address" type="text" placeholder="请输入地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="备注:">
                  <el-input type="textarea" v-model="detailInfo.remark"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="operateType=='add'">
                <el-form-item label="密码:" prop="password">
                  <el-input v-model="detailInfo.password" autocomplete="new-password" type="password" placeholder="请输入密码"></el-input>
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
          //关键字：姓名/账号
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
          account:'',
          password:'123456',
          name:'',
          remark:'',
          companyName:'',
          contacts:'',
          phone:'',
          address:'',
          bindUserId:1
        },
        drawerTitle:'新增客户',
        updateDrawer:false,
        //编辑类型：add,update
        operateType:'add',
        rules:{
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入密码'));
                } else {
                  var _reg=/^(?![0-15]+$)(?![a-zA-Z]+$)[0-15A-Za-z]{6,}$/
                  if(!_reg.test(value)){
                    callback(new Error('请输入6-16位密码'));
                  }
                  callback();
                }
              }, trigger: 'blur' }
          ],
          account:[{ required: true, message: '请输入账号', trigger: 'blur' }],
          name:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
          phone:[
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入联系电话'));
                } else {
                  var _reg=/^[1][3,4,5,7,8,9][0-9]{9}$/
                  if(!_reg.test(value)){
                    callback(new Error('请输入正确的联系电话'));
                  }
                  callback();
                }
              }, trigger: 'blur' }],
          contacts:[{ required: true, message: '请输入联系人', trigger: 'blur' }],
          address:[{ required: true, message: '请输入地址', trigger: 'blur' }],
          companyName:[{ required: true, message: '请输入公司名', trigger: 'blur' }]
        },
        //业务员列表
        userList:[]
      }
    },
    methods: {
      getData() {
        this.$get('/customer',{
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
      //点击查看详情按钮，显示客户详细信息弹框
      showDetail(row) {
        this.drawer = true;
        this.detailInfo = {
          id:row.id,
          name:row.name,
          account:row.account,
          remark:row.remark,
          role:row.role,
          companyName:row.userDetail.companyName,
          contacts:row.userDetail.contacts,
          phone:row.userDetail.phone,
          address:row.userDetail.address,
          bindUserId:row.bindSalesman?row.bindSalesman.id:0,
          bindUserName:row.bindSalesman?row.bindSalesman.name:'无',
          createTime: row.createTime
        };
        this.detailInfo.createTime  = dateUtil.formatDate(this.detailInfo.createTime,'YYYY-MM-dd HH:mm:ss')
      },
      //点击新增按钮，显示编辑弹框
      openUpdateDrawer() {
        this.updateDrawer = true;
        this.detailInfo = {
          account:'',
          password:'123456',
          name:'',
          remark:'',
          companyName:'',
          contacts:'',
          phone:'',
          address:'',
          bindUserId:this.userList[0].id
        };
        this.drawerTitle = '新增客户';
        this.operateType = 'add';
      },
      //点击编辑按钮，显示编辑弹框
      check(row) {
        this.updateDrawer = true;
        this.detailInfo = {
          id:row.id,
          name:row.name,
          account:row.account,
          remark:row.remark,
          role:row.role,
          companyName:row.userDetail.companyName,
          contacts:row.userDetail.contacts,
          phone:row.userDetail.phone,
          address:row.userDetail.address,
          bindUserId:row.bindSalesman.id
        };
        this.drawerTitle = '编辑客户';
        this.operateType = 'update';
      },
      //关闭抽屉清空数据
      closeCheckDrawer() {
        this.drawer = false;
        this.updateDrawer = false;
        this.detailInfo = this.defaultInfo;
        this.$refs['customerForm'].resetFields();
      },
      //点击保存按钮
      add(){
        //判断
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            if(this.operateType=='add'){
              this.$post('/customer',this.detailInfo).then((data)=>{
                messageUtil.message.success(data.message)
                this.closeCheckDrawer();
                this.getData();
              })
            }else{
              this.$put('/customer/'+this.detailInfo.id,this.detailInfo).then((data)=>{
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
      HandlerDelete(customerInfo){
        messageUtil.confirm('确认要删除该客户吗？',()=>{
          this.$deletefn('/customer/'+customerInfo.id,{}).then((data)=>{
            messageUtil.message.success(data.message)
            this.getData();
          })
        })
      },
      //重置密码
      HandlerResetPwd(customerInfo){
        messageUtil.confirm('确认要将该客户密码重置吗？',()=>{
          this.$put('/user/password/'+customerInfo.id,{'id':customerInfo.id}).then((data)=>{
            messageUtil.message.success(data.message)
            this.getData();
          })
        },()=>{},{})
      },
      //当填写姓名时，联系人字段为空时，自动填写联系人字段为姓名
      nameChange(val){
        if(!this.detailInfo.contacts){
          this.detailInfo.contacts = val;
        }
      },
      //当填写账号时，联系电话字段为空时，自动填写联系电话字段为账号
      accountChange(val){
        if(!this.detailInfo.phone){
          this.detailInfo.phone = val;
        }
      },
      //查询业务员列表
      getUserData() {
        this.$get('/user',{
          page:1,
          rows:9999,
          role:1,
          key:''
        }).then((data)=>{
          this.userList=data.data.list;
        })
      }
    },
    mounted() {
      this.getData();
      this.getUserData();
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
  .customerManageContent {
    overflow-y: auto;
    overflow-x: hidden;
    width: calc(100%);
    height: calc(100vh - 64px) !important;
  }

  .customerManageContent .note {
    height: 64px;
  }
  tr.trStyle{
    height: 60px !important;
  }
  .customerManageContent .noteText {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    height: 28px;
    padding-left: 32px;
    padding-top: 18px;
    font-weight: bold;
  }

  .customerManageContent .data {
    width: calc(100%);
    min-height: calc(100% - 64px);
    height: auto;
    padding: 24px 24px 24px 24px;
    background-color: #F0F3F7;
  }

  .customerManageContent .dataContent {
    width: calc(100% - 48px);
    background-color: #fff;
    border-radius: 2px;
    border-radius: 2px;
    padding-bottom: 32px;
  }

  .customerManageContent .searchArea {
    width: calc(100%);
    margin: 0px 24px 0px 0px;
  }

  .customerManageContent .searchForm {
    padding-top: 24px;
    padding-left: 32px;
  }

  .customerManageContent .dataListArea {
    margin: 0px 24px 24px 24px;
  }

  .customerManageContent .tableData {
    height: 100%;
  }

  .customerManageContent .page {
    margin: 15px 15px;
    float: right;
  }

  .customerManageContent .el-drawer__header {
    margin-bottom: 0px !important;
  }
  .customerManageContent .checkDrawer {
    height: calc(90vh);
    margin-bottom: 100px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .customerManageContent .checkDrawer .el-form{
    width: 90% !important;
  }
  .customerManageContent .customerHeaderImg{
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
</style>
