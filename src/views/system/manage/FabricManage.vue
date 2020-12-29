<template>
  <div class="fabricManageContent">
    <div class="note">
      <div class="noteText">面料管理</div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <div class="searchForm">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="关键字:">
                <el-input
                  v-model="searchParams.key"
                  placeholder="请输入面料名称"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button plain @click="clearSearchInfo"
                  >重&nbsp;&nbsp;置</el-button
                >
                <el-button plain @click="getData">搜&nbsp;&nbsp;索</el-button>
                <!-- <el-button plain @click="openUpdateDrawer">新增客户面料</el-button> -->
                <el-button plain @click="showJIngxiaoDraw">新增面料</el-button>
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
              prop="name"
              label="面料名称"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="note"
              label="备注"
            >
            </el-table-column>
            <!-- <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="customerName"
              label="客户名称"
            >
            </el-table-column> -->
            <!-- <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="percent"
              label="缩水比例"
            >
            </el-table-column> -->
            <!-- <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="threshold"
              label="警报阀值"
            >
            </el-table-column> -->
            <!-- <el-table-column align="center" :show-overflow-tooltip="true" prop="num1" label="半漂仓数量">
              <template slot-scope="scope">
                <span v-if="scope.row.num1 > scope.row.threshold">{{scope.row.num1}}</span>
                <span v-else style="color: red;">{{scope.row.num1 + '(已低于警报阀值！)'}}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" :show-overflow-tooltip="true" prop="num2" label="上浆仓数量">
            </el-table-column> -->
            <!-- <el-table-column align="center" :show-overflow-tooltip="true" prop="num3" label="成品仓数量">
            </el-table-column> -->
            <!-- <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
            </el-table-column> -->
            <el-table-column
              align="center"
              label="操作"
              width="400px"
              fixed="right"
            >
              <template slot-scope="scope">
                <!-- <el-button
                  type="primary"
                  size="mini"
                  @click="showDetail(scope.row)"
                  >查看详情</el-button
                > -->
                <el-button type="primary" size="mini" @click="check(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="HandlerDelete(scope.row)"
                  >删除</el-button
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
    <!-- 面料详情 -->
    <div>
      <el-drawer
        size="50%"
        title="面料详情"
        :visible.sync="miaoliaoIofo"
        direction="rtl"
        :destroy-on-close="openSet"
        :before-close="closeMiaoliaoIofo"
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
                  <el-form-item label="面料名称:">
                    <label>{{ detailInfo.name }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="备注:">
                    <label>{{ detailInfo.note }}</label>
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
    <!-- 添加修改面料 -->
    <div>
      <el-drawer
        size="50%"
        :title="drawerTitle"
        :visible.sync="updateDrawer"
        direction="rtl"
        :destroy-on-close="openSet"
        :before-close="closeCheckDrawer"
      >
        <div class="checkDrawer">
          <el-divider content-position="left"></el-divider>
          <el-form
            :model="detailInfo"
            ref="fabricForm"
            :rules="rules"
            label-width="100px"
          >
            <el-row>
              <el-col :span="12" v-if="drawerTitle !== '编辑面料'"> </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="operateType == 'update'">
                <el-form-item label="编号:">
                  <label>{{ detailInfo.id }}</label>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="operateType == 'update' ? 1 : 0">
                <el-form-item label="面料名称:" prop="name">
                  <el-autocomplete
                    v-model="detailInfo.name"
                    v-if="radio === '1'"
                    :disabled="drawerTitle === '编辑面料'"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入面料名称"
                    value-key="name"
                    @select="handleSelect"
                  ></el-autocomplete>
                  <el-autocomplete
                    v-model="detailInfo.name"
                    v-if="radio === '2'"
                    :disabled="drawerTitle === '编辑面料'"
                    :fetch-suggestions="querySearch1"
                    placeholder="请输入面料名称"
                    value-key="name"
                    @select="handleSelect"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="备注:">
                  <el-input
                    type="textarea"
                    v-model="detailInfo.note"
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
    <!-- 新增经销面料 -->
    <div class="addJingxiaoMianliao">
      <el-drawer
        title="新增面料"
        size="50%"
        :visible.sync="jingxiaoDrawer"
        :before-close="jingxiaoClose"
      >
        <div class="jingxiao">
          <el-form
            :model="jingxiaoInfo"
            ref="jingxiaoForm"
            :rules="jingxiaoRules"
            label-width="100px"
          >
            <el-form-item label="面料名称:" prop="name">
              <el-autocomplete
                v-model="jingxiaoInfo.name"
                :fetch-suggestions="querySearch1"
                placeholder="请输入面料名称"
                value-key="name"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input type="textarea" v-model="jingxiaoInfo.note"></el-input>
            </el-form-item>
          </el-form>
          <div class="jingxiaoBtn">
            <el-button type="primary" @click="addJingxiaoBtn">保存</el-button>
            <el-button type="primary" @click="jingxiaoClose">取消</el-button>
          </div>
        </div>
      </el-drawer>
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
      radio: '1',
      dataKey: null,
      openSet: true,
      //查询参数
      searchParams: {
        //关键字：面料名称
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
      defaultInfo: {
        name: '',
        note: ''
      },
      drawerTitle: '新增面料',
      // 业务员客户列表
      userList: [],
      customerName: '',
      updateDrawer: false,
      //编辑类型：add,update
      operateType: 'add',
      rules: {
        name: [{ required: true, message: '请输入面料名称', trigger: 'change' }],
        num1: [{ required: true, message: '请输入半漂仓仓数量', trigger: 'blur' }],
        num2: [{ required: true, message: '请输入上浆仓数量', trigger: 'blur' }],
        num3: [{ required: true, message: '请输入成品仓数量', trigger: 'blur' }],
        percent: [{ required: true, message: '请输入缩水比例', trigger: 'blur' }],
        threshold: [{ required: true, message: '请输入警报阀值', trigger: 'blur' }]
      },
      fabricList: [],
      miaoliaoIofo: false,
      jingxiaoDrawer: false,
      jingxiaoInfo: {
        fkCustomerId: '-10',
        customerName: '经销',
        note: '',
        percent: 0
      },
      jiagongMiaoliaolist: [],
      jingxiaoMiaoliaoList: [],
      jingxiaoRules: {
        name: [{ required: true, message: '请输入面料名称', trigger: 'change' }],
        percent: [{ required: true, message: '请输入缩水比例', trigger: 'blur' }],
        threshold: [{ required: true, message: '请输入警报阀值', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getData () {
      this.$get('/fabric', {
        ...this.searchParams, ...this.page
      }).then((data) => {
        this.tableData = data.data.list;
        this.page.total = data.data.total;
      })
    },
    // 获取客户
    getUserList () {
      this.$get('/customer', {
        page: 1,
        rows: 99999
      }).then((data) => {
        this.userList = data.data.list;
      })
    },
    // 选择加工面料
    querySearch (queryString, cb) {
      let restaurants = this.jiagongMiaoliaolist;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 选择经销面料选择框
    querySearch1 (queryString, cb) {
      let restaurants = this.jingxiaoMiaoliaoList;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // handleSelect(item) {
    //   this.detailInfo.name = item.name
    // },
    handleSelect (item) {
      this.detailInfo.name = item.name
      // if (this.detailInfo.percent ==='') {
      //   this.detailInfo.percent = item.percent
      // }
      // if (!this.detailInfo.threshold==='') {
      //   this.detailInfo.threshold = item.threshold
      // }
    },
    // 获取面料列表
    getFabricList () {
      this.$get('/fabric', {
        page: 1,
        rows: 9999
      }).then((data) => {
        this.fabricList = data.data.list
        function compare (property) {
          return function (a, b) {
            let value1 = a[property];
            let value2 = b[property];
            return value2 - value1;
          }
        }
        const arrAll = data.data.list.sort(compare('sort'))
        let obj = {}
        let arr = []
        arr = arrAll.reduce(function (item, next) {
          obj[next.name] ? '' : obj[next.name] = true && item.push(next);
          return item;
        }, [])
        this.fabricList = arr
        this.fabricListFenlei()
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
      this.miaoliaoIofo = true;
      this.detailInfo = row;
    },
    //点击新增按钮，显示新增弹框
    openUpdateDrawer () {
      this.radio = '1'
      this.updateDrawer = true;
      this.detailInfo = {
        name: '',
        note: ''
      };
      this.drawerTitle = '新增面料';
      this.operateType = 'add';
    },
    //点击编辑按钮，显示编辑弹框
    check (row) {
      if (row.fkCustomerId === -10) {
        this.radio = '2'
      } else {
        this.radio = '1'
      }
      this.updateDrawer = true;
      this.detailInfo = {
        id: row.id,
        name: row.name,
        note: row.note,
        num1: row.num1,
        num2: row.num2,
        num3: row.num3,
        percent: 0,
        threshold: row.threshold,
        customerName: row.customerName
      };
      this.drawerTitle = '编辑面料';
      this.operateType = 'update';
    },
    //关闭抽屉清空数据
    closeCheckDrawer () {
      this.drawer = false;
      this.updateDrawer = false;
      this.detailInfo = {
        id: '',
        name: '',
        note: '',
        num1: '',
        num2: '',
        num3: '',
        percent: 0,
        threshold: '',
        customerName: ''
      };
      this.customerName = '';
      this.$refs['fabricForm'].resetFields()
    },
    closeMiaoliaoIofo () {
      this.miaoliaoIofo = false
    },
    // 新增经销面料按钮
    showJIngxiaoDraw () {
      this.jingxiaoDrawer = true
    },
    // 关闭经销面料窗口
    jingxiaoClose () {
      this.$refs['jingxiaoForm'].resetFields()
      this.jingxiaoInfo.note = ''
      this.jingxiaoDrawer = false
    },
    // 保存经销数据按钮
    addJingxiaoBtn () {
      this.$refs['jingxiaoForm'].validate((valid) => {
        if (!valid) return
        this.$post('/fabric', this.jingxiaoInfo).then((data) => {
          messageUtil.message.success(data.message)
          if (data.code === 0) {
            this.jingxiaoClose()
            this.getData()
            this.getFabricList()
          }
        })
      })
    },
    //点击保存按钮
    add () {
      //判断
      this.$refs['fabricForm'].validate((valid) => {
        if (valid) {
          const num = Number(this.detailInfo.percent)
          if (num < 0 || num >= 100) return this.$message.error('缩水比例应为0~100')
          if (this.operateType == 'add') {
            if (this.customerName != '') {
              this.userList.forEach(item => {
                if (item.name == this.customerName) {
                  this.detailInfo.customerName = item.name;
                  this.detailInfo.fkCustomerId = item.id;

                }
              })
            };
            const obj = this.fabricList.find(item => item.name === this.detailInfo.name)
            if (obj) {
              this.$put(`/fabric/sort?id=${obj.id}`, {}).then((data) => {
              })
            }
            this.$post('/fabric', this.detailInfo).then((data) => {
              messageUtil.message.success(data.message)
              this.closeCheckDrawer();
              this.getData();
              this.getFabricList()
            })
          } else {
            if (this.detailInfo.customerName != '') {
              this.userList.forEach(item => {
                if (item.name == this.detailInfo.customerName) {
                  this.detailInfo.customerName = item.name;
                  this.detailInfo.fkCustomerId = item.id;
                }
              })
            };
            this.$put('/fabric/' + this.detailInfo.id, this.detailInfo).then((data) => {
              messageUtil.message.success(data.message)
              this.closeCheckDrawer();
              this.getData();
              this.getFabricList()
            })
          }
        } else {
          return false;
        }
      })
    },
    //删除
    HandlerDelete (fabricInfo) {
      messageUtil.confirm('确认要删除该面料吗？', () => {
        this.$deletefn('/fabric/' + fabricInfo.id, {}).then((data) => {
          messageUtil.message.success(data.message)
          this.getData();
        })
      })
    },
    // 根据id查找面料列表
    getDataOfKey () {
      this.$get('/fabric/' + this.dataKey).then((data) => {
        const a = new Array()
        a[0] = data.data
        this.tableData = a
      })
    },
    // 面料列表分成加工和经销2个数组
    fabricListFenlei () {
      const arrA = []
      const arrB = []
      const lenght = this.fabricList.length
      for (let a = 0; a < lenght; a++) {
        if (this.fabricList[a].fkCustomerId === -10) {
          arrB.push(this.fabricList[a])
        } else {
          arrA.push(this.fabricList[a])
        }
      }
      this.jiagongMiaoliaolist = arrA
      this.jingxiaoMiaoliaoList = arrB
    }
  },
  created () {
    if (this.$route.params.key !== undefined) {
      this.dataKey = this.$route.params.key
      this.getDataOfKey()
    } else {
      this.getData()
    }
    if (this.$route.params.addKey) {
      this.customerName = this.$route.params.addKey
      this.updateDrawer = true
    }
    if (this.$route.params.toKey) {
      this.updateDrawer = true
    }
    // this.getUserList()
    // this.getFabricList()
  },
  mounted () {
    this.getUserList()
    this.getFabricList()
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
.fabricManageContent {
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100%);
  height: calc(100vh - 64px) !important;
}

.fabricManageContent .note {
  height: 64px;
}
tr.trStyle {
  height: 60px !important;
}
.fabricManageContent .noteText {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  height: 28px;
  padding-left: 32px;
  padding-top: 18px;
  font-weight: bold;
}

.fabricManageContent .data {
  width: calc(100%);
  min-height: calc(100% - 112px);
  height: auto;
  padding: 24px 24px 24px 24px;
  background-color: #f0f3f7;
}

.fabricManageContent .dataContent {
  width: calc(100% - 48px);
  background-color: #fff;
  border-radius: 2px;
  border-radius: 2px;
  padding-bottom: 32px;
}

.fabricManageContent .searchArea {
  width: calc(100%);
  margin: 0px 24px 0px 0px;
}

.fabricManageContent .searchForm {
  padding-top: 24px;
  padding-left: 32px;
}

.fabricManageContent .dataListArea {
  margin: 0px 24px 24px 24px;
}

.fabricManageContent .tableData {
  height: 100%;
}

.fabricManageContent .page {
  margin: 15px 15px;
  float: right;
}

.fabricManageContent .el-drawer__header {
  margin-bottom: 0px !important;
}
.fabricManageContent .checkDrawer {
  height: calc(90vh);
  margin-bottom: 100px;
  overflow-y: auto;
  overflow-x: hidden;
}
.fabricManageContent .fabricHeaderImg {
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
.fabricManageContent .addJingxiaoMianliao .jingxiao {
  margin: 20px;
  width: 70%;
}
.jingxiaoBtn {
  margin-left: 40px;
}
</style>
