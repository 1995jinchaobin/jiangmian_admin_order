<template>
  <div class="stockInfo">
    <div class="tagSearch">
      <storeManageSearch
        ref="storeSearch"
        @searchList="searchList"
        @daochu="daochu"
        :companyList="companyList"
        :regionlist="regionlist"
      >
        <!-- <el-button plain @daochu="daochuStockInfo">导&nbsp;&nbsp;出</el-button> -->
        <!-- <el-button @click="onSubmit" plain>导&nbsp;&nbsp;出</el-button> -->
      </storeManageSearch>
      <div>
        <el-button plain @click="openUpdateDrawer" class="addStock"
          >新增入库</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" border>
      <el-table-column align="center" prop="companyName" label="公司名">
      </el-table-column>
      <el-table-column align="center" prop="customerName" label="客户名">
      </el-table-column>
      <el-table-column prop="fabricName" label="面料规格" align="center">
      </el-table-column>
      <el-table-column label="底布(米)" align="center" prop="num1">
      </el-table-column>
      <el-table-column align="center" prop="num3" label="成品(米)">
      </el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template slot-scope="scope">
          <!-- <el-button
            @click="sizingAllocation(scope.row)"
            size="mini"
            type="primary"
            >新增</el-button
          > -->
          <el-button size="mini" type="primary" @click="checkStock(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-if="total > 10">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
        :current-page.sync="sreachpage.page"
      >
      </el-pagination>
    </div>
    <!-- 新增入库抽屉 -->
    <div>
      <el-drawer
        :visible.sync="drawer"
        :before-close="closeAddStockDrawer"
        title="新增入库"
      >
        <el-form
          label-width="120px"
          :model="addStockParams"
          :rules="addStockParamsRules"
          ref="addStockParamsRef"
        >
          <el-form-item label="公司名:" prop="fkCustomerId">
            <!-- <el-select v-model="addStockParams.fkCustomerId" placeholder="请选择" @change="getUserId">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> -->
            <el-autocomplete
              v-model="addStockUserName"
              clearable
              :fetch-suggestions="querySearch"
              value-key="companyName"
              placeholder="请输入公司名"
              @clear="getUserId"
              @select="getUserId"
            >
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="面料品类:" prop="fkFabricId">
            <el-select
              v-model="addStockParams.fkFabricId"
              placeholder="请选择"
              filterable
            >
              <div slot="empty" @click="toAddMianliao" class="toAddMianliao">
                添加面料
              </div>
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="米数:" prop="num">
            <el-input-number
              v-model="addStockParams.num"
              controls-position="right"
              :min="0"
              :precision="2"
              :step="1"
            ></el-input-number>
          </el-form-item>
          <!-- <el-form-item label="上传码单(选项):">
            <form
              id="myForm"
              enctype="multipart/form-data"
              name="fileinfo"
              ref="upBiaodan"
            >
              <div class="searchArea">
                <img
                  :src="lookUrl"
                  alt="#"
                  class="lookUrl"
                  v-show="lookUrl !== ''"
                />
                <img src="../../../assets/add.png" alt="#" />
                <input
                  @change="changeImg"
                  id="imgFile"
                  type="file"
                  class="fileInput"
                />
              </div>
            </form>
          </el-form-item> -->
        </el-form>
        <div class="btn">
          <el-button type="primary" @click="saveAddStock">保存</el-button>
          <el-button type="primary" @click="closeAddStockDrawer"
            >取消</el-button
          >
        </div>
      </el-drawer>
    </div>
    <!-- 新增抽屉 -->
    <div>
      <el-drawer
        :visible.sync="drawerShangJiang"
        :before-close="closeCheckShangJiang"
        :title="addSizingTitle + ':' + '新增'"
      >
        <el-form
          label-width="120px"
          :model="addShangJiangParams"
          :rules="addShangJiangParamsRules"
          ref="addShangJiangParamsRef"
        >
          <el-form-item label="米数:" prop="num">
            <el-input-number
              v-model="addShangJiangParams.num"
              controls-position="right"
              :min="0"
              :precision="2"
              :step="1"
              :max="shangJiangNumMax"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div class="shangjiangTiaoboBtn">
          <el-button type="primary" @click="saveAddShangJiang">保存</el-button>
          <el-button type="primary" @click="closeCheckShangJiang"
            >取消</el-button
          >
        </div>
      </el-drawer>
    </div>
    <!-- 编辑入库信息 -->
    <div>
      <el-drawer
        title="编辑"
        :visible.sync="checkVisible"
        :before-close="closeCheckDrawer"
      >
        <div class="bianjiKucunInfo">
          <!-- <el-divider content-position="left"></el-divider> -->
          <el-form
            :model="checkInfo"
            ref="checkInfoRef"
            label-width="140px"
            :rules="checkInfoRules"
          >
            <!-- <el-row> -->
            <!-- <el-col :span="12"> -->
            <el-form-item label="公司名:">
              <el-input
                v-model="checkInfo.customerName"
                type="text"
                placeholder="请输入公司名"
                disabled
              ></el-input>
              <!-- <label>{{detailInfo.id}}</label> -->
            </el-form-item>
            <el-form-item label="面料规格:">
              <el-input
                v-model="checkInfo.fabricName"
                type="text"
                placeholder="请输入面料规格"
                disabled
              ></el-input>
              <!-- <label>{{detailInfo.id}}</label> -->
            </el-form-item>
            <el-form-item label="底布(米):" prop="num1">
              <el-input
                v-model="checkInfo.num1"
                type="text"
                placeholder="请输入底布(米)"
              ></el-input>
              <!-- <label>{{detailInfo.id}}</label> -->
            </el-form-item>
            <el-form-item label="成品(米)" prop="num3">
              <el-input
                v-model="checkInfo.num3"
                type="text"
                placeholder="请输入成品仓(匹/米)"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="storeManageCheckStockBtn">
            <el-button @click="checkStockInfo" size="mini" type="primary"
              >保存</el-button
            >
            <el-button size="mini" type="primary" @click="closeCheckDrawer"
              >取消</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import messageUtil from '../../../utils/js/MessageUtil'
import StoreManageSearch from '../common/StoreManageSearch'
// import { delete } from 'vue/types/umd'
// import { delete } from 'vue/types/umd'
// import ImgUpload from '../common/ImgUpload'
export default {
  components: {
    StoreManageSearch
    // ImgUpload
  },
  name: 'StockInfo',
  props: {
    companyList: Array,
    regionlist: Array
  },
  data () {
    return {
      addStockUserName: '',
      selectName: '',
      dataKey: null,
      drawer: false,
      sreachpage: {
        page: 1,
        rows: 10,
        customerName: '',
        name: '',
        startTime: '',
        endTime: ''
      },
      total: 0,
      // 仓库列表
      tableData: [],
      // 新增入库
      addStockParams: {
        // 半漂仓米数
        num: '',
        // 客户id
        fkCustomerId: '',
        // 面料id
        fkFabricId: ''
      },
      // 码单上传
      file: '',
      formData: '',
      lookUrl: '',
      // 客户选择
      userList: [],
      // 面料选择
      categoryList: [],
      // 入库验证
      addStockParamsRules: {
        // fkCustomerId: [
        //   { required: true, message: '请选择客户', trigger: 'blur' }
        // ],
        fkFabricId: [
          { required: true, message: '请选择面料品类', trigger: 'change' }
        ],
        rollNum: [
          { required: true, message: '请输入半票仓匹数', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请输入半票仓米数', trigger: 'change' }
        ]
      },
      // 上浆调拨抽屉
      drawerShangJiang: false,
      // 标题
      addSizingTitle: '',
      addShangJiangParams: {
        rollNum: '',
        num: '',
        inventoryId: ''
      },
      addShangJiangParamsRules: {
        rollNum: [
          { required: true, message: '请输入上浆匹数', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入上浆米数', trigger: 'blur' }
        ]
      },
      shangJiangRollNumMax: '',
      shangJiangNumMax: '',
      // 编辑入库信息
      checkVisible: false,
      checkInfo: {},
      checkInfoRules: {
        rollNum: [
          { required: true, message: '请选择半票仓匹数', trigger: 'change' }
        ],
        num1: [
          { required: true, message: '请选择半票仓米数', trigger: 'change' }
        ],
        num2: [
          { required: true, message: '请输入上浆仓米数', trigger: 'blur' }
        ]
        // sizingExpectNum: [
        //   { required: true, message: '请输入上浆预期存量米数', trigger: 'blur' }
        // ],
        // num4: [
        //   { required: true, message: '请输入生产流通量米数', trigger: 'blur' }
        // ],
        // num3: [
        //   { required: true, message: '请输入成品仓', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    // 获取仓库列表数据
    getData () {
      this.$get('/inventory/list', {
        ...this.sreachpage
      }).then((data) => {
        this.tableData = data.data.list
        this.total = data.data.total
      })
    },
    // 搜索
    searchList (value) {
      this.sreachpage = value
      this.getData()
    },
    // 页码切换
    changePage (page) {
      this.sreachpage.page = page;
      this.getData();
    },
    // 打开新增入库
    openUpdateDrawer () {
      this.drawer = true
    },
    // 跳转到面料管理页面
    toAddMianliao () {
      if (this.addStockParams.fkCustomerId !== '') {
        // const index = this.userList.findIndex(item => {
        //   return item.id === this.addStockParams.fkCustomerId
        // })
        // const key = this.userList[index].name
        const key = this.addStockUserName
        this.$router.push({
          path: '/fabricManage',
          name: 'FabricManage',
          params: {
            addKey: key
          }
        })
      } else {
        this.$router.push({
          path: '/fabricManage',
          name: 'FabricManage',
          params: {
            toKey: '1'
          }
        })
      }
      window.sessionStorage.setItem('defaultActive', '/fabricManage')
    },
    // 关闭新增入库清空数据
    closeAddStockDrawer () {
      this.$refs.addStockParamsRef.resetFields()
      // this.$refs.upBiaodan.reset()
      this.file = ''
      this.formData = ''
      this.lookUrl = ''
      this.addStockUserName = ''
      this.drawer = false
    },
    // 获取客户名
    getUserList () {
      this.$get('/customer', {
        page: 1,
        rows: 99999
      }).then((data) => {
        const arr = data.data.list
        arr.map(item => {
          return item.companyName = item.userDetail.companyName
        })
        this.userList = data.data.list;
      })
    },
    // 公司名联系搜索框
    querySearch (queryString, cb) {
      const userList = this.userList;
      const results = queryString ? userList.filter(this.createFilter(queryString)) : userList;
      // const results = this.userList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.companyName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      }
    },
    // 选择客户名获取其ID
    getUserId (a) {
      if (a) {
        this.addStockParams.fkCustomerId = a.id + ''
        this.selectName = a.companyName
      }
    },
    // 面料品类
    getCategory () {
      this.$get('/fabric/select', {
        fkCustomerId: -10
      }).then((data) => {
        this.categoryList = data.data;
      })
    },
    // 保存新增入库（无码单）
    saveAddStockNo () {
      if (this.addStockUserName !== this.selectName) return this.$message.error('请点击下拉框输入公司名,不要手动输入')
      this.$post('/inventory/in/add/db', this.addStockParams).then((data) => {
        if (data.code !== 0) return messageUtil.message.error(data.message)
        messageUtil.message.success(data.message)
        this.closeAddStockDrawer()
        this.getData();
      })
      // })
    },
    // 保存新增入库
    saveAddStock () {
      if (this.addStockUserName === '') return this.$message.error('请选择公司名')
      this.$refs.addStockParamsRef.validate(value => {
        if (!value) return
        if (this.file !== '') {
          this.changChuanImg()
          setTimeout(() => {
            this.saveAddStockNo()
          }, 500
          )
        } else {
          this.saveAddStockNo()
        }
      })
    },
    // 上传图片(缓存)
    changeImg (a) {
      const fr = new FileReader()
      fr.readAsDataURL(a.target.files[0])
      fr.onload = e => {
        this.lookUrl = e.target.result
      }
      // 获取图片
      this.file = document.getElementById("imgFile").files[0]
      this.formData = new FormData()
      // if (file) {
      this.formData.append('file', this.file);
      this.formData.append('type', 3)
    },
    // 上传图片
    changChuanImg () {
      axios.post('/file', this.formData).then(res => {
        if (res.data.code === 0) {
          this.addStockParams.url = res.data.data
        }
      })
    },
    // 上浆调拨
    sizingAllocation (value) {
      this.addSizingTitle = value.customerName
      this.shangJiangRollNumMax = value.rollNum
      this.shangJiangNumMax = value.num1
      this.addShangJiangParams.inventoryId = value.id
      this.drawerShangJiang = true
    },
    // 关闭上浆调拨
    closeCheckShangJiang () {
      this.$refs.addShangJiangParamsRef.resetFields()
      this.drawerShangJiang = false
    },
    // 保存上浆调拨
    saveAddShangJiang () {
      this.$refs.addShangJiangParamsRef.validate(value => {
        if (!value) return
        this.$post('/inventory/transfer', this.addShangJiangParams).then((data) => {
          messageUtil.message.success(data.message)
          this.closeCheckShangJiang()
          this.getData()
        })
      })
    },
    // 编辑入库信息按钮
    checkStock (value) {
      this.checkInfo = JSON.parse(JSON.stringify(value))
      this.checkVisible = true
    },
    // 关闭编辑抽屉
    closeCheckDrawer () {
      this.checkVisible = false
    },
    // 保存编辑
    checkStockInfo () {
      const a = {
        // id: this.checkInfo.id,
        num1: this.checkInfo.num1,
        num3: this.checkInfo.num3,
      }
      this.$put('/inventory/' + this.checkInfo.id, a).then((data) => {
        messageUtil.message.success(data.message)
        this.closeCheckDrawer()
        this.getData()
      })
    },
    // 根据id查找仓储列表
    getDataOfKey () {
      this.$get('/inventory/' + this.dataKey).then((data) => {
        const a = new Array()
        a[0] = data.data
        this.tableData = a
      })
    },
    //导出
    daochu () {
      const obj = JSON.parse(JSON.stringify(this.sreachpage))
      obj.rows = 9999
      this.$get('/inventory/list', {
        ...obj
      }).then((data) => {
        // this.tableData = data.data.list
        // this.total = data.data.total
        this.exportExcel(data.data.list)
      })
    },
    exportExcel (list) {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../../excel/Export2Excel");
        const tHeader = ["时间", "公司名", "客户名", '面料', '底布米数', '成品米数', '备注']
        // 上面设置Excel的表格第一行的标题
        const filterVal = ["createTime", "companyName", "customerName", 'fabricName', 'num1', 'num3', 'note']
        // 上面的index、nickName、name是tableData里对象的属性
        // const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "库存信息");
      });
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
    // 导出库存信息
    // daochu (a) {
    //   delete a.page
    //   delete a.rows
    //   for (let para in a) {
    //     if (a[para].trim() === '') {
    //       delete a[para]
    //     }
    //   }
    //   let urlAdd = ''
    //   if (a.customerName) {
    //     urlAdd += 'customerName=' + a.customerName
    //     if (a.name) {
    //       urlAdd += '&name=' + a.name
    //     }
    //     if (a.startTime) {
    //       urlAdd += '&startTime=' + a.startTime
    //       urlAdd += '&endTime=' + a.endTime
    //     }
    //   } else {
    //     urlAdd = ''
    //     if (a.name) {
    //       urlAdd += 'name=' + a.name
    //       if (a.startTime) {
    //         urlAdd += '&startTime=' + a.startTime
    //         urlAdd += '&endTime=' + a.endTime
    //       }
    //     } else {
    //       urlAdd = ''
    //       if (a.startTime) {
    //         urlAdd += 'startTime=' + a.startTime
    //         urlAdd += '&endTime=' + a.endTime
    //       }
    //     }
    //   }
    //   let url = ''
    //   if (urlAdd === '') {
    //     url = this.$baseUrl + '/inventory/order/export'
    //   } else {
    //     url = this.$baseUrl + '/inventory/order/export?' + urlAdd
    //   }
    //   window.open(url)
    // }
  },
  created () {
    // if (!sessionStorage.getItem("to")) {
    //   sessionStorage.setItem("to", "1")
    //   this.$router.go(0)
    // }
    if (this.$route.params.key !== undefined) {
      this.dataKey = this.$route.params.key
      this.getDataOfKey()
    } else {
      this.getData()
    }
  },
  mounted () {
    // this.$refs.storeSearch.getRegionlist()
    this.getUserList()
    this.getCategory()
  },
  computed: {
    name () {
      return 1
    }
  }
}
</script>

<style>
.stockInfo {
  padding: 10px;
}
.el-table thead.is-group th {
  background-color: #fff;
}
.stockInfo .tagSearch {
  display: flex;
}
.stockInfo .addStock {
  margin-right: 10px;
}
.stockInfo .pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.stockInfo .fileInput {
  position: absolute;
  width: 120px;
  height: 140px;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
.stockInfo .searchArea {
  position: absolute;
  width: 120px;
  height: 140px;
  top: 0;
  left: 0;
  text-align: center;
  color: #fff;
  border-radius: 5%;
  cursor: pointer;
}
.stockInfo .btn {
  padding-left: 120px;
  position: absolute;
  bottom: 40px;
}
.stockInfo .lookUrl {
  width: 100%;
  position: absolute;
}
.toAddMianliao {
  padding: 10px;
  padding-left: 20px;
  cursor: pointer;
}
.toAddMianliao:hover {
  color: red;
}
.stockInfo .storeManageCheckStockBtn,
.shangjiangTiaoboBtn {
  display: flex;
  justify-content: center;
}
.stockInfo .storeManageCheckStockBtn .el-button,
.shangjiangTiaoboBtn .el-button {
  margin: auto 30px;
}
.stockInfo .bianjiKucunInfo .el-form {
  margin: auto 10px;
}
</style>