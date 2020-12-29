<template>
  <div class="outboundList">
    <div class="tagSearchHebing">
      <storeManageSearch
        @searchList="searchList"
        @daochu="daochu"
        :companyList="companyList"
        :regionlist="regionlist"
      ></storeManageSearch>
      <!-- <div>
        <el-button @click="hebingDayin">合并打印</el-button>
      </div> -->
    </div>
    <div class="contentTable">
      <el-table
        ref="multipleTable"
        :data="chukuList"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" prop="createTime" label="日期">
        </el-table-column>
        <!-- <el-table-column align="center" prop="orderNo" label="订单号">
        </el-table-column> -->
        <el-table-column prop="customerName" label="客户名" align="center">
        </el-table-column>
        <el-table-column prop="fabricName" align="center" label="面料名">
        </el-table-column>
        <el-table-column label="数量(米)" prop="num" align="center">
        </el-table-column>
        <el-table-column prop="createByName" label="操作者" align="center">
        </el-table-column>
        <el-table-column label="备注" prop="note" align="center">
        </el-table-column>
        <!-- <el-table-column prop="statusName" label="状态" align="center">
        </el-table-column> -->
        <!-- <el-table-column label="操作" width="280px" align="center">
          <template slot-scope="scope">
            <el-button @click="mingXi(scope.row)" size="mini" type="primary"
              >明细</el-button
            >
            <el-button @click="chuku(scope.row)" size="mini" type="primary"
              >出库</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="daYinSelect(scope.row)"
              >打印</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- 底部分页 -->
    <div class="pagination" v-if="total > 10">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
        :current-page.sync="chukuParams.page"
      >
      </el-pagination>
    </div>
    <!-- 明细抽屉 -->
    <div class="mingXi">
      <el-drawer
        :title="'订单号:' + mingXiInfo.orderNo"
        :visible.sync="mingXiVisible"
        :before-close="closeMingXiDrawer"
        size="50%"
      >
        <div class="mingXiInfo">
          <el-table :data="mingxiTable" max-height="350" border>
            <el-table-column prop="roll" label="匹号"> </el-table-column>
            <el-table-column prop="num" label="合格米数"> </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">未出库</span>
                <span v-else>已出库</span>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注"> </el-table-column>
            <el-table-column prop="xiaci" label="瑕疵类型(位置)">
            </el-table-column>
          </el-table>
          <el-form label-width="140px" :model="mingXiInfo" :inline="true">
            <el-form-item label="创建时间:">
              <span>{{ mingXiInfo.createTime }}</span>
            </el-form-item>
            <el-form-item label="检测员:">
              <span>{{ mingXiInfo.createByName }}</span>
            </el-form-item>
            <el-form-item label="订单号:">
              <span>{{ mingXiInfo.orderNo }}</span>
            </el-form-item>
            <el-form-item label="客户名称:">
              <span>{{ mingXiInfo.customerName }}</span>
            </el-form-item>
            <el-form-item label="面料名称:">
              <span>{{ mingXiInfo.fabricName }}</span>
            </el-form-item>
            <el-form-item label="出库米数(米):">
              <span>{{ mingXiInfo.num }}</span>
            </el-form-item>
            <el-form-item label="已出库米数(米):">
              <span>{{ mingXiInfo.finishNum }}</span>
            </el-form-item>
            <el-form-item label="出库匹数(匹):">
              <span>{{ mingXiInfo.rollNum }}</span>
            </el-form-item>
            <el-form-item label="已出库匹数(匹):">
              <span>{{ mingXiInfo.finishRollNum }}</span>
            </el-form-item>
            <el-form-item label="打印状态:">
              <span>{{ mingXiInfo.isPrint }}</span>
            </el-form-item>
            <el-form-item label="出库状态:">
              <span v-if="mingXiInfo.status === 0">未出库</span>
              <span v-else-if="mingXiInfo.status === 1">已出库</span>
              <span v-else>出库中</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ mingXiInfo.note }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
    </div>
    <!-- 出库抽屉 -->
    <div class="chukuSite">
      <el-drawer
        :title="'订单号:' + chukuInfo.orderNo"
        :visible.sync="chukuVisible"
        :before-close="closeChukuDrawer"
        size="50%"
      >
        <div class="chukuContent">
          <el-table
            :data="chukuInfoTable"
            border
            stripe
            @selection-change="chukuSelectionChange"
            max-height="550"
          >
            <!-- <el-table-column type="selection" width="155" align="center" v-if="chukuSelect === true"></el-table-column> -->
            <el-table-column
              type="selection"
              width="55"
              align="center"
              :selectable="checkboxT"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="roll"
              label="匹号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="num"
              label="合格米数"
            ></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">未出库</span>
                <span v-else>已出库</span>
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item label="已选择匹号：">
              <span>{{ xuanzhePipao }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="chukuBtn"
                >出库并打印</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
    </div>
    <!-- 出库单打印选择 -->
    <div class="chukuSelect">
      <el-drawer
        :title="'订单号:' + chukuInfo.orderNo"
        :visible.sync="chukuSelectVisible"
        :before-close="chukuSelectDrawer"
        size="50%"
      >
        <div class="chukuContent">
          <el-table
            :data="chukuInfoTable"
            border
            stripe
            @selection-change="chukuSelectionChange"
            max-height="550"
          >
            <el-table-column
              type="selection"
              width="155"
              align="center"
            ></el-table-column>
            <!-- <el-table-column type="selection" width="55" align="center" :selectable='checkboxT'></el-table-column> -->
            <el-table-column
              align="center"
              prop="roll"
              label="匹号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="num"
              label="合格米数"
            ></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">未出库</span>
                <span v-else>已出库</span>
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item label="已选择匹号：">
              <span>{{ xuanzhePipao }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="chukuSelectBtn"
                >打印</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
    </div>
    <!-- 出库单打印页面 -->
    <div class="chuKuDialog" v-if="chukKuDialogVisible == true">
      <el-dialog title="" :visible.sync="chukKuDialogVisible" fullscreen>
        <!-- <el-row>
          <el-col :span="22" :offset="1"> -->
        <div class="dayinBuju">
          <div class="dayinBuju1">
            <div id="printChuKuArea">
              <div
                style="
                  font-size: 22px;
                  text-align: center;
                  letter-spacing: 10px;
                  line-height: 160%;
                "
              >
                测试
              </div>
              <div
                style="
                  font-size: 28px;
                  text-align: center;
                  letter-spacing: 10px;
                  line-height: 160%;
                "
              >
                出库单
              </div>
              <div class="kehuNameOut">
                <div class="kuhuNameOut">客户名称: {{ kehuName }}</div>
                <div class="kuhuNameOut">日期: {{ timeData }}</div>
              </div>
              <div class="tbodyDayin">
                <div class="titleThDayin">
                  <div class="n1 flexCenter borderR">订单号</div>
                  <div class="n2 flexCenter borderR">面料规格</div>
                  <div class="n3 flexCenter borderR">花号</div>
                  <div class="n4 flexCenter borderR">加工/经销</div>
                  <div class="n5 flexCenter borderR">匹数</div>
                  <div class="n6 flexCenter borderR">1</div>
                  <div class="n6 flexCenter borderR">2</div>
                  <div class="n6 flexCenter borderR">3</div>
                  <div class="n6 flexCenter borderR">4</div>
                  <div class="n6 flexCenter borderR">5</div>
                  <div class="n6 flexCenter borderR">6</div>
                  <!-- <div class="n6 flexCenter borderR">7</div>
                      <div class="n6 flexCenter borderR">8</div>
                      <div class="n6 flexCenter borderR">9</div> -->
                  <div class="n7 flexCenter borderR">米数</div>
                  <div class="n10 flexCenter">下单日期</div>
                  <div class="n8 flexCenter borderL">备注</div>
                </div>
                <div>
                  <div
                    v-for="(item, index) in tableDayin"
                    :key="index"
                    class="dayin"
                  >
                    <div class="n1 flexCenter borderTR">{{ item.orderNo }}</div>
                    <div class="n2 flexCenter borderTR">
                      {{ item.fabricName }}
                    </div>
                    <div class="n3 flexCenter borderTR">
                      <div
                        v-for="(item3, index3) in item.flowerNum"
                        :key="index3"
                      >
                        {{ item3
                        }}{{ item.flowerNum.length - 1 > index3 ? ";" : "" }}
                      </div>
                    </div>
                    <div class="n4 flexCenter borderTR">{{ item.origin }}</div>
                    <div class="n5 flexCenter borderTR">{{ item.rollNum }}</div>
                    <!-- <div v-else class="n5 flexCenter borderTR">{{item.rollNum-item.finishRollNum}}</div> -->
                    <div class="dayinChildren">
                      <div
                        v-for="(item2, index2) in item.nums"
                        :key="index2"
                        :class="
                          item2.status === 1
                            ? 'hui n9 flexCenter borderTR'
                            : 'n9 flexCenter borderTR'
                        "
                      >
                        <div>{{ item2.num }}</div>
                      </div>
                    </div>
                    <div class="n7 flexCenter borderTR">
                      {{ item.totalNum }}
                    </div>
                    <div class="n10 flexCenter borderTR">
                      {{ item.createTime }}
                    </div>
                    <div class="n8 flexCenter borderT">{{ item.note }}</div>
                  </div>
                </div>
              </div>
              <div class="footDatin">
                <div class="botH4First">
                  <h4>
                    注：如有质量问题7天内调换，一经开剪，我公司概不负责。谢谢合作！
                  </h4>
                </div>
                <div class="botH4two">
                  <h4 class="h4width">制单：</h4>
                  <h4 class="h4width">日期：</h4>
                  <h4 class="h4width">业务员：</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bottomDayin">
          <div class="wenzi">
            <!-- <span>打印机为针式打印机特点规格，高总提供</span> -->
            <el-button v-print="'#printChuKuArea'" plain>打印</el-button>
          </div>
        </div>
        <!-- </el-col>
        </el-row> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import StoreManageSearch from '../common/StoreManageSearch'
import axios from 'axios'
import format from '../../../utils/js/format'
import messageUtil from '../../../utils/js/MessageUtil'
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
      chukuParams: {
        page: 1,
        rows: 10,
        customerName: '',
        name: ''
      },
      chukuList: [],
      total: 0,
      files: [],
      sub: {
        file: [],
        type: 3
      },
      // 明细抽屉
      mingXiVisible: false,
      mingXiInfo: {},
      // orderId:'',
      // 出库
      chukuVisible: false,
      chukuInfo: {},
      chukuInfoTable: [],
      xuanzhePipao: '',
      chukuArr: [],
      fkOrderId: '',
      orderNo: '',
      createTime: '',
      note: '',
      fabricName: '',
      chukuSelectVisible: false,
      // 出库单打印
      chukKuDialogVisible: false,
      // 打印时间
      timeData: '',
      addnum: 0,
      // 客户名称
      kehuName: '',
      tableDayin: [],
      mingxiTable: []
    }
  },
  methods: {
    // 获取出库列表
    getChukuList () {
      this.$get('/inventory/out/list', {
        ...this.chukuParams
      }).then((data) => {
        this.chukuList = data.data.list
        this.total = data.data.total
      })
    },
    // 页码切换
    changePage (page) {
      this.chukuParams.page = page
      this.getChukuList()
    },
    // 触发搜索
    searchList (value) {
      this.chukuParams = value
      this.getChukuList()
    },
    // 明细按钮
    mingXi (value) {
      this.mingXiInfo = value
      const params = {
        id: value.id
      }
      this.$get('/inventory/out/detail/list', {
        ...params
      }).then(res => {
        this.mingxiTable = res.data
        const id = {
          id: value.fkOrderId
        }
        this.$get('/flaw/xcx/' + value.fkOrderId).then(res => {
          for (let a = 0; a < this.mingxiTable.length; a++) {
            this.mingxiTable[a]['xiaci'] = ''
          }
          for (let arr of res.data) {
            this.mingxiTable.map(i => {
              if (i.roll === arr.roll) {
                i.xiaci = i.xiaci + arr.flawName + '(' + arr.num + ');'
              }
            })
          }
          this.mingXiVisible = true
        })
      })
    },
    // 打开出库抽屉按钮
    chuku (a) {
      this.fkOrderId = a.fkOrderId
      this.orderNo = a.orderNo
      this.kehuName = a.customerName
      this.note = a.note
      this.createTime = a.createTime
      this.fabricName = a.fabricName
      this.chukuInfo = a
      const params = {
        id: a.id
      }
      this.$get('/inventory/out/detail/list', {
        ...params
      }).then(res => {
        this.chukuInfoTable = res.data
        this.chukuVisible = true
      })
    },
    // 出库选项改变
    chukuSelectionChange (a) {
      this.chukuArr = a
      let xuanzhePipao = a.map(i => {
        return i.roll
      })
      this.xuanzhePipao = xuanzhePipao.join(',')
    },
    // 出库选项禁用
    checkboxT (row, index) {
      if (row.status === 1) {
        return false
      } else {
        return true
      }
    },
    // 关闭出库抽屉
    closeChukuDrawer () {
      this.chukuInfo = {}
      this.chukuInfoTable = []
      this.xuanzhePipao = ''
      this.chukuArr = []
      this.chukuVisible = false
    },
    // 出库并打印确定按钮
    async chukuBtn () {
      if (this.chukuArr.length === 0) return messageUtil.message.error('请选择出库匹号')
      const arr = this.chukuArr.map(i => {
        return i.id
      })
      const id = this.chukuArr[0].fkInventoryOutId
      const chukuParams = [{
        inventoryOutId: id,
        detailIds: arr
      }]
      const res = await axios.put('/inventory/out', chukuParams)
      messageUtil.message.success(res.data.message)
      const a = {}
      this.tableDayin = []
      this.timeData = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
      a.orderNo = this.orderNo
      a.fabricName = this.fabricName
      // fkOrderId
      const orderParams = {
        id: this.fkOrderId
      }
      this.$get('/order/print/' + this.fkOrderId, {
        ...orderParams
      }).then(res => {
        a.flowerNum = res.data.flowerNums
        a.origin = res.data.origin
        a.nums = this.chukuArr
        a.rollNum = this.chukuArr.length
        a.finishRollNum = null
        a.note = this.note
        a.createTime = this.createTime
        let totalNum = 0
        for (let objs of a.nums) {
          totalNum += objs.num
        }
        a.totalNum = totalNum
        const numsLength = 6 - a.nums.length % 6
        for (let ab = 0; ab < numsLength; ab++) {
          a.nums.push({ num: '' })
        }
        this.tableDayin.push(a)
        this.chukuVisible = false
        this.getChukuList()
        this.chukKuDialogVisible = true
      })
    },
    // 打印选择框打开
    daYinSelect (a) {
      this.fkOrderId = a.fkOrderId
      this.orderNo = a.orderNo
      this.kehuName = a.customerName
      this.fabricName = a.fabricName
      this.note = a.note
      this.createTime = a.createTime
      this.chukuInfo = a
      const params = {
        id: a.id
      }
      this.$get('/inventory/out/detail/list', {
        ...params
      }).then(res => {
        this.chukuInfoTable = res.data
        this.chukuSelectVisible = true
      })
    },
    // 选择打印框关闭
    chukuSelectDrawer () {
      this.chukuInfo = {}
      this.chukuInfoTable = []
      this.xuanzhePipao = ''
      this.chukuArr = []
      this.chukuSelectVisible = false
    },
    // 打印选择框中的打印按钮
    chukuSelectBtn () {
      if (this.chukuArr.length === 0) return messageUtil.message.error('请选择打印匹号')
      const arr = this.chukuArr.map(i => {
        return i.id
      })
      // const id = this.chukuArr[0].fkInventoryOutId
      // const chukuParams = [{
      //   inventoryOutId: id,
      //   detailIds:arr
      // }]
      // const res = await axios.put('/inventory/out',chukuParams)
      // messageUtil.message.success(res.data.message)
      const a = {}
      this.tableDayin = []
      this.timeData = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
      a.orderNo = this.orderNo
      a.fabricName = this.fabricName
      // fkOrderId
      const orderParams = {
        id: this.fkOrderId
      }
      this.$get('/order/print/' + this.fkOrderId, {
        ...orderParams
      }).then(res => {
        a.flowerNum = res.data.flowerNums
        a.origin = res.data.origin
        a.nums = this.chukuArr
        a.rollNum = this.chukuArr.length
        a.finishRollNum = null
        a.note = this.note
        a.createTime = this.createTime
        let totalNum = 0
        for (let objs of a.nums) {
          totalNum += objs.num
        }
        a.totalNum = totalNum
        const numsLength = 6 - a.nums.length % 6
        if (numsLength < 6) {
          for (let ab = 0; ab < numsLength; ab++) {
            a.nums.push({ num: '' })
          }
        }
        this.tableDayin.push(a)
        this.chukuSelectVisible = false
        this.chukKuDialogVisible = true
      })
    },
    // 关闭明细抽屉
    closeMingXiDrawer () {
      this.mingXiInfo = {}
      this.mingXiVisible = false
    },
    //合并打印表格前选中
    handleSelectionChange (rows) {
      const length = rows.length
      if (length > 1) {
        if (rows[length - 1].customerName !== rows[length - 2].customerName) {
          this.$refs.multipleTable.toggleRowSelection(rows[length - 1])
          rows.pop()
          this.tableDayin = rows
          return messageUtil.message.error('请选择同一个客户')
        } else {
          this.tableDayin = rows
        }
      } else if (length === 1) {
        this.tableDayin = rows
      } else {
        this.tableDayin = []
      }
    },
    // 合并打印
    hebingDayin () {
      this.addnum = 0
      const hebingLength = this.tableDayin.length
      if (hebingLength > 0) {
        this.timeData = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        this.kehuName = this.tableDayin[0].customerName
        for (let timeS = 0; timeS < hebingLength; timeS++) {
          const orderParams = {
            id: this.tableDayin[timeS].fkOrderId
          }
          this.$get('/order/print/' + this.tableDayin[timeS].fkOrderId, {
            ...orderParams
          }).then(data => {
            this.tableDayin[timeS].flowerNum = data.data.flowerNums,
              this.tableDayin[timeS].origin = data.data.origin
            const params = {
              id: this.tableDayin[timeS].id
            }
            this.$get('/inventory/out/detail/list', {
              ...params
            }).then(res => {
              this.tableDayin[timeS].nums = res.data
              let totalNum = 0
              for (let obj of this.tableDayin[timeS].nums) {
                totalNum += obj.num
              }
              this.tableDayin[timeS].totalNum = totalNum
              const numsLength = 6 - this.tableDayin[timeS].nums.length % 6
              for (let abc = 0; abc < numsLength; abc++) {
                this.tableDayin[timeS].nums.push({ num: '' })
              }
              this.addnum += 1
              if (this.addnum === hebingLength) {
                this.chukKuDialogVisible = true
              }
            })
          })
        }
      } else {
        return messageUtil.message.info('请选择打印列表')
      }
    },
    //导出
    daochu () {
      const obj = JSON.parse(JSON.stringify(this.chukuParams))
      obj.rows = 9999
      this.$get('/inventory/out/list', {
        ...obj
      }).then((data) => {
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
        export_json_to_excel(tHeader, data, "出库记录");
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
    //     url = this.$baseUrl + '/inventory/out/order/export'
    //   } else {
    //     url = this.$baseUrl + '/inventory/out/order/export?' + urlAdd
    //   }
    //   window.open(url)
    // }
  },
  created () {
    this.getChukuList()
  }
}
</script>

<style>
.outboundList {
  padding: 10px;
}
.kuhuNameOut {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 160%;
}
.outboundList .pagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.kehuNameOut {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}
.titleThDayin,
.dayin {
  display: flex;
  text-align: center;
}
.dayinChildren {
  width: 30%;
  display: flex;
  flex-wrap: wrap;
}
.tbodyDayin {
  border: 1px solid #ccc;
}
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  /* border: 0.4px solid #ccc; */
  box-sizing: border-box;
  min-height: 30px;
}
.borderR {
  border-right: 1px solid #ccc;
}
.borderB {
  border-bottom: 1px solid #ccc;
}
.borderTR {
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.borderT {
  border-top: 1px solid #ccc;
}
.borderTL {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.borderL {
  border-left: 1px solid #ccc;
}
.n1 {
  width: 10%;
}
.n2 {
  width: 10%;
}
.n3 {
  width: 9%;
}
.n4 {
  width: 6%;
}
.n5 {
  width: 5%;
}
.n6 {
  width: 5%;
}
.n7 {
  width: 5%;
}
.n8 {
  width: 15%;
  /* box-sizing: border-box; */
}
.n9 {
  width: 16.66667%;
}
.n10 {
  width: 10%;
  /* box-sizing: border-box; */
}
.hui {
  /* background-color: #EEEEEE; */
  font-weight: 600;
  /* font-size: b; */
}
.contentTable .el-table__header-wrapper th:first-child .cell .el-checkbox {
  display: none;
}
.botH4First {
  margin-top: 15px;
}
.botH4two {
  margin: 10px;
  display: flex;
  justify-content: space-between;
}
.h4width {
  width: 220px;
}
.bottomDayin {
  width: 100%;
  height: 80px;
  background-color: #eee;
  display: flex;
  align-items: center;
  margin-top: 14cm;
}
.bottomDayin .wenzi {
  margin-left: 50%;
  position: absolute;
}
.wenzi .el-button {
  margin-left: 10px;
}
.outboundList .tagSearchHebing {
  display: flex;
}
.mingXiInfo {
  padding-left: 20px;
  padding-right: 20px;
}
.chukuContent {
  padding-left: 20px;
  padding-right: 20px;
}
#printChuKuArea {
  width: 18cm;
  height: 12cm;
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
}
.footDatin {
  position: absolute;
  bottom: 0;
}
.dayinBuju {
  width: 100%;
  /* display: flex;
  justify-content: center; */
}
.dayinBuju1 {
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>