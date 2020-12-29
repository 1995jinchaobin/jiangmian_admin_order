<template>
  <div class="userManageContent">
    <div class="note">
      <div class="noteText">员工管理</div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <div class="searchForm">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="关键字:">
                <el-input
                  v-model="searchParams.key"
                  placeholder="请输入姓名或账号"
                ></el-input>
              </el-form-item>
              <el-form-item label="角色:">
                <el-select v-model="searchParams.role">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="(item, index) in roleTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.role"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button plain @click="clearSearchInfo"
                  >重&nbsp;&nbsp;置</el-button
                >
                <el-button plain @click="getData">搜&nbsp;&nbsp;索</el-button>
                <el-button plain @click="openUpdateDrawer"
                  >新&nbsp;&nbsp;增</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="dataListArea">
          <el-table
            row-class-name="trStyle"
            class="tableData"
            :data="tableData"
            border
            stripe
            width="100%"
          >
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="id"
              label="编号"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="account"
              label="账号"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="name"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              label="角色"
            >
              <template slot-scope="scope">
                <label v-if="scope.row.role !== 7">
                  {{ roleTypeList[scope.row.role - 1].name }}</label
                >
                <label v-else>{{ roleTypeList[3].name }}</label>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="500px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showDetail(scope.row)"
                  >查看详情</el-button
                >
                <el-button type="primary" size="mini" @click="check(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  v-if="scope.row.role == 1"
                  size="mini"
                  @click="showBind(scope.row)"
                  >绑定客户</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="HandlerDelete(scope.row)"
                  >删除</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="HandlerResetPwd(scope.row)"
                  >重置密码</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="page"
            background
            layout="prev, pager, next"
            @current-change="changePage"
            :total="page.total"
            :current-page.sync="page.page"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div>
      <el-drawer
        size="50%"
        title="员工详情"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="closeDrawer"
      >
        <div class="checkDrawer">
          <el-divider content-position="left"></el-divider>
          <el-form>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="编号:">
                    <label>{{ detailInfo.id }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="账号:">
                    <label>{{ detailInfo.account }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="姓名:">
                    <label>{{ detailInfo.name }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="角色:">
                    <label v-if="detailInfo.role !== 7">
                      {{ roleTypeList1[detailInfo.role - 1] }}</label
                    >
                    <label v-else>{{ roleTypeList1[4] }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="备注:">
                    <label>{{ detailInfo.remark }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="创建时间:">
                    <label>{{ detailInfo.createTime }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="drawer = false"
                      style="width: 100%"
                      >取消</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-drawer>
    </div>
    <div>
      <el-drawer
        size="50%"
        :title="drawerTitle"
        :visible.sync="updateDrawer"
        direction="rtl"
        :before-close="closeCheckDrawer"
      >
        <div class="checkDrawer">
          <el-divider content-position="left"></el-divider>
          <el-form
            :model="detailInfo"
            ref="userForm"
            :rules="rules"
            label-width="100px"
          >
            <el-row>
              <el-col :span="12" v-if="operateType == 'update'">
                <el-form-item label="编号:">
                  <label>{{ detailInfo.id }}</label>
                </el-form-item>
              </el-col>
              <el-col
                :span="operateType == 'update' ? 11 : 12"
                :offset="operateType == 'update' ? 1 : 0"
              >
                <el-form-item label="账号:" prop="account">
                  <label v-if="operateType == 'update'">{{
                    detailInfo.account
                  }}</label>
                  <el-input
                    v-else
                    v-model="detailInfo.account"
                    type="text"
                    placeholder="请输入账号"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名:" prop="name">
                  <el-input
                    v-model="detailInfo.name"
                    type="text"
                    placeholder="请输入姓名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="角色:">
                  <el-select v-model="detailInfo.role">
                    <el-option
                      v-for="(item, index) in roleTypeList"
                      :key="index"
                      :label="item.name"
                      :value="item.role"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="备注:">
                  <el-input
                    type="textarea"
                    v-model="detailInfo.remark"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1" v-if="operateType == 'add'">
                <el-form-item label="密码:" prop="password">
                  <el-input
                    v-model="detailInfo.password"
                    autocomplete="new-password"
                    type="password"
                    placeholder="请输入密码"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item>
                    <el-button type="primary" @click="add">{{
                      operateType == "add" ? "保存" : "修改"
                    }}</el-button>
                    <el-button type="primary" @click="closeCheckDrawer"
                      >取消</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-drawer>
    </div>
    <div>
      <el-dialog title="绑定客户" :visible.sync="bindDrawer" width="100%">
        <el-row>
          <el-col :span="11">
            <div class="bindTitle">已绑定客户</div>
            <div class="searchArea">
              <div class="searchForm">
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="关键字:">
                    <el-input
                      v-model="bindSearchParamsKey"
                      placeholder="请输入姓名或账号"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button plain @click="getBindedCustomer"
                      >搜&nbsp;&nbsp;索</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <el-table
              row-class-name="trStyle"
              class="tableData"
              :data="bindedCustomerList"
              border
              stripe
              width="100%"
            >
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="id"
                label="编号"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="companyName"
                label="公司"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="address"
                label="地址"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="contacts"
                label="联系人"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="phone"
                label="联系电话"
              >
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handlerUnbind(scope.row)"
                    >解绑</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="11" :offset="1">
            <div class="bindTitle">未绑定客户列表</div>
            <div class="searchArea">
              <div class="searchForm">
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="关键字:">
                    <el-input
                      v-model="unbindSearchParamsKey"
                      placeholder="请输入姓名或账号"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button plain @click="getCustomerList"
                      >搜&nbsp;&nbsp;索</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <el-table
              row-class-name="trStyle"
              class="tableData"
              :data="customerList"
              border
              stripe
              width="100%"
            >
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="id"
                label="编号"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="companyName"
                label="公司"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="address"
                label="地址"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="contacts"
                label="联系人"
              >
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="phone"
                label="联系电话"
              >
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handlerBind(scope.row)"
                    >绑定</el-button
                  >
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
import { mapGetters } from 'vuex'
import messageUtil from '../../../utils/js/MessageUtil'
import dateUtil from '../../../utils/js/DateUtil'
export default {
  data () {
    return {
      //请求的接口
      actions: {
        updateFlowerPattern: "/flowerPattern/updateFlowerPattern",
        // 获取用户地址
        getAddressByIp: '/system/ip/getAddressByIp'
      },
      //查询参数
      searchParams: {
        //关键字：姓名/账号
        key: "",
        //0客户1业务员2厂长3仓库管理员4检验员7跟单员
        role: ""
      },
      unbindSearchParamsKey: '',
      bindSearchParamsKey: '',
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
      defaultInfo: {
        account: '',
        password: '123456',
        name: '',
        role: 1,
        remark: ''
      },
      roleTypeList1: ['业务员', '厂长', '仓库管理员', '检验员', '跟单员'],
      roleTypeList: [
        { name: '业务员', role: 1 },
        { name: '厂长', role: 2 },
        { name: '仓库管理员', role: 3 },
        // { name: '检验员', role: 4 },
        { name: '跟单员', role: 7 }
      ],
      drawerTitle: '新增用户',
      updateDrawer: false,
      //编辑类型：add,update
      operateType: 'add',
      rules: {
        pass: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else {
                var _reg = /^(?![0-15]+$)(?![a-zA-Z]+$)[0-15A-Za-z]{6,}$/
                if (!_reg.test(value)) {
                  callback(new Error('请输入6-16位密码'));
                }
                callback();
              }
            }, trigger: 'blur'
          }
        ],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      bindDrawer: false,
      //做绑定操作的业务员id
      userId: 0,
      //已绑定客户列表
      bindedCustomerList: [],
      //未绑定客户列表
      customerList: []
    }
  },
  methods: {
    getData () {
      this.$get('/user', {
        ...this.searchParams, ...this.page
      }).then((data) => {
        this.tableData = data.data.list;
        this.page.total = data.data.total;
      })
    },
    search () {
      this.page.page = 1;
      this.getData()
    },
    changePage (page) {
      this.page.page = page;
      this.getData();
    },
    //重置
    clearSearchInfo () {
      this.page.page = 1;
      this.page.rows = 10;
      this.page.total = 0;
      this.searchParams = {}
      this.getData()
    },
    //点击查看详情按钮，显示用户详细信息弹框
    showDetail (row) {
      this.drawer = true;
      this.detailInfo = row;
      this.detailInfo.createTime = dateUtil.formatDate(this.detailInfo.createTime, 'YYYY-MM-dd HH:mm:ss')
    },
    //点击新增按钮，显示编辑弹框
    openUpdateDrawer () {
      this.updateDrawer = true;
      this.detailInfo = {
        account: '',
        password: '123456',
        name: '',
        role: 1,
        remark: ''
      };
      this.drawerTitle = '新增用户';
      this.operateType = 'add';
    },
    //点击编辑按钮，显示编辑弹框
    check (row) {
      this.updateDrawer = true;
      this.detailInfo = {
        id: row.id,
        name: row.name,
        account: row.account,
        remark: row.remark,
        role: row.role
      };
      this.drawerTitle = '编辑用户';
      this.operateType = 'update';
    },
    //关闭抽屉清空数据
    closeCheckDrawer () {
      this.drawer = false;
      this.updateDrawer = false;
      this.detailInfo = {
        account: '',
        password: '123456',
        name: '',
        role: 1,
        remark: ''
      };
      this.$refs['userForm'].resetFields();
    },
    //关闭详情
    closeDrawer () {
      this.drawer = false
    },
    //点击保存按钮
    add () {
      //判断
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          if (this.operateType == 'add') {
            this.$post('/user', this.detailInfo).then((data) => {
              messageUtil.message.success(data.message)
              this.closeCheckDrawer();
              this.getData();
            })
          } else {
            this.$put('/user/' + this.detailInfo.id, this.detailInfo).then((data) => {
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
    HandlerDelete (userInfo) {
      messageUtil.confirm('确认要删除该员工吗？', () => {
        this.$deletefn('/user/' + userInfo.id, {}).then((data) => {
          messageUtil.message.success(data.message)
          this.getData();
        })
      })
    },
    //重置密码
    HandlerResetPwd (userInfo) {
      messageUtil.confirm('确认要将该员工密码重置吗？', () => {
        this.$put('/user/password/' + userInfo.id, { 'id': userInfo.id }).then((data) => {
          messageUtil.message.success(data.message)
          this.getData();
        })
      })
    },
    showBind (val) {
      this.userId = val.id;
      this.getBindedCustomer();
      this.bindDrawer = true;
      this.unbindSearchParamsKey = '';
      this.bindSearchParamsKey = '';
    },
    //绑定客户
    handlerBind (customerInfo) {
      this.$post('/user/bind/customer', {
        //业务员id
        fkUserId: this.userId,
        //客户id
        fkCustomerId: customerInfo.fkUserId
      }).then((data) => {
        messageUtil.message.success(data.message)
        this.getBindedCustomer();
        // this.getUserList();
      })
    },
    //解绑客户
    handlerUnbind (customerInfo) {
      this.$post('/user/unbind/customer', {
        //业务员id
        fkUserId: this.userId,
        //客户id
        fkCustomerId: customerInfo.fkUserId
      }).then((data) => {
        messageUtil.message.success(data.message)
        this.getBindedCustomer();
      })
    },
    //查询已绑定客户
    getBindedCustomer () {
      this.$get('/user/bind/customer', {
        page: 0,
        rows: 99999,
        key: this.bindSearchParamsKey,
        //0当前登录人(业务员使用),其他代表指定业务员（后台管理使用）
        userId: this.userId
      }).then((data) => {
        this.bindedCustomerList = data.data.list;
        this.getCustomerList();
      })
    },
    //查询未绑定客户
    getCustomerList (val) {
      this.$get('/customer/unbind', {
        page: 1,
        rows: 99999,
        key: this.unbindSearchParamsKey,
        role: 1
      }).then((data) => {
        var customerList = data.data.list;
        var resultList = []
        for (var i = 0; i < customerList.length; i++) {
          if (JSON.stringify(this.bindedCustomerList).indexOf(JSON.stringify(customerList[i])) == -1) {
            resultList.push(customerList[i])
          }
        }
        this.customerList = resultList;
      })
    }
  },
  mounted () {
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
span {
  outline: none;
}
.userManageContent {
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100%);
  height: calc(100vh - 64px) !important;
}

.userManageContent .note {
  height: 64px;
}
tr.trStyle {
  height: 60px !important;
}
.userManageContent .noteText {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  height: 28px;
  padding-left: 32px;
  padding-top: 18px;
  font-weight: bold;
}

.userManageContent .data {
  width: calc(100%);
  min-height: calc(100% - 64px);
  height: auto;
  padding: 24px 24px 24px 24px;
  background-color: #f0f3f7;
}

.userManageContent .dataContent {
  width: calc(100% - 48px);
  background-color: #fff;
  border-radius: 2px;
  border-radius: 2px;
  padding-bottom: 32px;
}

.userManageContent .searchArea {
  width: calc(100%);
  margin: 0px 24px 0px 0px;
}

.userManageContent .searchForm {
  padding-top: 24px;
  padding-left: 32px;
}

.userManageContent .dataListArea {
  margin: 0px 24px 24px 24px;
}

.userManageContent .tableData {
  height: 100%;
}

.userManageContent .page {
  margin: 15px 15px;
  float: right;
}

.userManageContent .el-drawer__header {
  margin-bottom: 0px !important;
}
.userManageContent .checkDrawer {
  height: calc(90vh);
  margin-bottom: 100px;
  overflow-y: auto;
  overflow-x: hidden;
}
.userManageContent .userHeaderImg {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
.userManageContent .bindTitle {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
