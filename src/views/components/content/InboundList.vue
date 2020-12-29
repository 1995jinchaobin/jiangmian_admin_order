<template>
  <div class="inboundList">
    <storeManageSearch
      @searchList="searchList"
      @daochu="daochu"
      :companyList="companyList"
      :regionlist="regionlist"
    ></storeManageSearch>
    <el-table :data="rukuList" style="width: 100%" border stripe>
      <el-table-column align="center" prop="createTime" label="日期">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名" align="center">
      </el-table-column>
      <!-- <el-table-column
        label="半票仓(匹/米)"
        prop
        align="center">
        <el-table-column
          prop="rollNum"
          align="center">
        </el-table-column>
        <el-table-column
          prop="num1"
          align="center">
        </el-table-column>
      </el-table-column> -->
      <el-table-column prop="fabricName" align="center" label="面料名">
      </el-table-column>
      <el-table-column label="数量(米)" prop="num" align="center">
      </el-table-column>
      <el-table-column label="操作者" prop="createByName" align="center">
      </el-table-column>
      <el-table-column label="备注" prop="note" align="center">
      </el-table-column>
      <!-- <el-table-column label="操作" width="280px" align="center">
        <template slot-scope="scope">
          <el-button @click="rukuInfoBtn(scope.row)" size="mini" type="primary"
            >明细</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="upLoadMadan(scope.row)"
            v-if="scope.row.url === ''"
            >上传码单</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="lookMadan(scope.row)"
            v-else
            >查看码单</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 底部分页 -->
    <div class="pagination" v-if="total > 10">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
        :current-page.sync="rukuParams.page"
      >
      </el-pagination>
    </div>
    <!-- 入库明细抽屉 -->
    <div>
      <el-drawer :visible.sync="rukuDrawer" :before-close="closeRukuDrawer">
        <div class="rukeInfo">
          <el-form label-width="120px" :model="rukuParamsInfo">
            <el-form-item label="日期:">
              <span>{{ rukuParamsInfo.createTime }}</span>
            </el-form-item>
            <el-form-item label="客户名:">
              <span>{{ rukuParamsInfo.customerName }}</span>
            </el-form-item>
            <el-form-item label="面料规格:">
              <span>{{ rukuParamsInfo.fabricName }}</span>
            </el-form-item>
            <el-form-item label="未漂仓米数(米):">
              <span>{{ rukuParamsInfo.num }}</span>
            </el-form-item>
            <el-form-item label="未漂仓匹数(匹):">
              <span>{{ rukuParamsInfo.rollNum }}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span>{{ rukuParamsInfo.statusName }}</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ rukuParamsInfo.note }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
    </div>
    <!-- 查看码单 -->
    <div class="lookMadan">
      <el-drawer
        :visible.sync="madanDrawer"
        :before-close="closeMadanDrawer"
        :title="'查看码单：' + lookMadanName"
        size="50%"
      >
        <div>
          <img :src="$imgUrl + madanUrl" alt="#" />
        </div>
      </el-drawer>
    </div>
    <!-- 上传码单 -->
    <div class="upMadan">
      <el-drawer
        :visible.sync="upmadanDrawer"
        :before-close="closeupMadanDrawer"
        :title="'上传码单：' + upMadan"
      >
        <el-form label-width="75px">
          <!-- <el-form-item label="上传码单:">
            <form id="myForm" enctype="multipart/form-data" name="fileinfo" ref="upBiaodan">
              <div class="searchArea">
                <span>上传图片</span>
                <input @change='changeImg' id='imgFile' type='file' class="fileInput"/>
              </div>
            </form>
          </el-form-item> -->
          <el-form-item label="上传码单:">
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
          </el-form-item>
        </el-form>
        <el-button @click="baocunMadan" type="primary">保存</el-button>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import messageUtil from '../../../utils/js/MessageUtil'
import StoreManageSearch from '../common/StoreManageSearch'
export default {
  components: {
    StoreManageSearch
  },
  props: {
    companyList: Array,
    regionlist: Array
  },
  data () {
    return {
      // 查看码单
      madanDrawer: false,
      lookMadanName: '',
      madanUrl: '',
      // 上传图片
      file: '',
      formData: '',
      lookUrl: '',
      // 上传码单
      upmadanDrawer: false,
      upMadan: '',
      upMadanParamsId: '',
      upMadanParams: {
        url: ''
      },
      rukuParams: {
        page: 1,
        rows: 10,
        customerName: '',
        name: '',
        startTime: '',
        endTime: ''
      },
      rukuList: [],
      total: 0,
      rukuDrawer: false,
      rukuParamsInfo: {}
    }
  },
  methods: {
    // 获取入库列表
    getRukuList () {
      this.$get('/inventory/in/list', {
        ...this.rukuParams
      }).then((data) => {
        this.rukuList = data.data.list
        this.total = data.data.total
      })
    },
    // 页码切换
    changePage (page) {
      this.rukuParams.page = page;
      this.getRukuList();
    },
    // 搜索触发
    searchList (value) {
      this.rukuParams = value
      this.getRukuList()
    },
    // 入库明细按钮
    rukuInfoBtn (value) {
      this.rukuParamsInfo = value
      this.rukuDrawer = true
    },
    // 入库上传码单按钮
    upLoadMadan (a) {
      this.upMadanParamsId = a.id
      this.upMadan = a.customerName
      this.upmadanDrawer = true
    },
    // 查看码单按钮
    lookMadan (a) {
      this.lookMadanName = a.customerName
      this.madanUrl = a.url
      this.madanDrawer = true
    },
    // 关闭查看码单
    closeMadanDrawer () {
      this.madanDrawer = false
    },
    // 关闭上传码单
    closeupMadanDrawer () {
      this.upMadanParams.url = ''
      this.file = ''
      this.formData = ''
      this.lookUrl = ''
      this.$refs.upBiaodan.reset()
      this.upmadanDrawer = false
    },
    // 上传码单
    changeImg (a) {
      // 获取图片
      const fr = new FileReader()
      fr.readAsDataURL(a.target.files[0])
      fr.onload = e => {
        this.lookUrl = e.target.result
      }
      this.file = document.getElementById("imgFile").files[0]
      this.formData = new FormData()
      this.formData.append('file', this.file);
      this.formData.append('type', 3)
    },
    // 获取码单url地址
    getMadanUrl () {
      axios.post('/file', this.formData).then(res => {
        if (res.data.code === 0) {
          this.upMadanParams.url = res.data.data
        }
      })
    },
    // 保存上传码单
    baocunMadan () {
      axios.post('/file', this.formData).then(res => {
        if (res.data.code === 0) {
          this.upMadanParams.url = res.data.data
          this.$put('/inventory/in/' + this.upMadanParamsId, this.upMadanParams).then((data) => {
            messageUtil.message.success(data.message)
            this.closeupMadanDrawer();
            this.getRukuList();
          })
        }
      })
    },
    // 关闭入库抽屉
    closeRukuDrawer () {
      this.rukuDrawer = false
    },
    //导出
    daochu () {
      const obj = JSON.parse(JSON.stringify(this.rukuParams))
      obj.rows = 9999
      this.$get('/inventory/in/list', {
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
        const tHeader = ["时间", "客户名", '面料', '操作者', '米数', '备注']
        // 上面设置Excel的表格第一行的标题
        const filterVal = ["createTime", "customerName", 'fabricName', 'createByName', 'num', 'note']
        // 上面的index、nickName、name是tableData里对象的属性
        // const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "入库记录");
      });
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
    // 导出按钮
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
    //     url = this.$baseUrl + '/inventory/in/order/export'
    //   } else {
    //     url = this.$baseUrl + '/inventory/in/order/export?' + urlAdd
    //   }
    //   window.open(url)
    // }
  },
  created () {
    this.getRukuList()
  }
}
</script>

<style>
.inboundList {
  padding: 10px;
}
.inboundList .rukeInfo {
  display: flex;
  justify-content: center;
}
.inboundList .el-form-item__label {
  text-align: justify;
}
.inboundList .lookMadan img {
  width: 100%;
}
.inboundList .upMadan .el-form {
  padding-left: 20px;
  padding-right: 20px;
}
.inboundList .upMadan span {
  word-wrap: break-word;
}
.inboundList .upMadan .el-button {
  margin-left: 20px;
}
.inboundList .fileInput {
  position: absolute;
  width: 120px;
  height: 80px;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
.inboundList .searchArea {
  position: absolute;
  width: 120px;
  height: 80px;
  top: 0;
  left: 0;
  /* background-color: #409EFF; */
  text-align: center;
  color: #fff;
  border-radius: 5%;
  cursor: pointer;
}
.inboundList .searchArea .lookUrl {
  width: 100%;
  position: absolute;
}
.inboundList .upMadan .el-button {
  /* position: absolute; */
  /* bottom: 40px; */
  margin-top: 50px;
}
/* .el-table__header-wrapper th:first-child .cell .el-checkbox{
    display: none;
  } */
</style>