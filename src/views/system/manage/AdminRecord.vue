<template>
  <div class="adminRecord">
    <div class="note">操作记录</div>
    <div class="content">
      <div class="search">
        <el-form :inline="true" ref="searchForm">
          <el-form-item label="客户:">
            <el-input
              v-model="searchParams.customerName"
              placeholder="请输入客户名称"
              clearable
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="面料:">
            <el-input v-model="searchParams.name" placeholder="请输入面料名称" clearable></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="操作:">
            <el-select
              v-model="searchParams.status"
              placeholder="请输入操作状态"
              clearable
            >
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="操作时间">
            <el-date-picker
              clearable
              v-model="time"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetSearch" plain>重&nbsp;&nbsp;置</el-button>
            <el-button @click="getData" plain>搜&nbsp;&nbsp;索</el-button>
            <el-button @click="daochu" plain>导&nbsp;&nbsp;出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <el-table :data="tableData" border stripe width="100%">
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            prop="createTime"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            prop="createByName"
            label="操作者"
          >
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            prop="customerName"
            label="客户"
          >
          </el-table-column>
          <!-- <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            prop="fabricName"
            label="面料"
          >
          </el-table-column> -->
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            label="操作状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">上浆</span>
              <span v-else-if="scope.row.status === 1">产生生成流通</span>
              <span v-else-if="scope.row.status === 2">清除生成流通</span>
              <span v-else-if="scope.row.status === 3">检验</span>
              <span v-else-if="scope.row.status === 4">出库</span>
              <span v-else-if="scope.row.status === 5">手动强制修改库存</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="400px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="showDetail(scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :total="page.total"
          :current-page.sync="page.page"
        >
        </el-pagination>
      </div>
      <div>
        <el-drawer size="50%" title="查看详情" :visible.sync="drawer">
          <div>
            <el-divider content-position="left"></el-divider>
            <el-form>
              <el-row>
                <el-col :span="11" :offset="1">
                  <el-form label-width="140px">
                    <el-form-item label="原来底布米数:">
                      <label>{{ detailInfo.snum1 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form label-width="140px">
                    <el-form-item label="现底布米数:">
                      <label>{{ detailInfo.nnum1 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col :span="11" :offset="1">
                  <el-form label-width="140px">
                    <el-form-item label="原来未漂匹:">
                      <label>{{ detailInfo.srollNum }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form label-width="140px">
                    <el-form-item label="现未漂匹:">
                      <label>{{ detailInfo.nrollNum }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row> -->
              <!-- <el-row>
                <el-col :span="11" :offset="1">
                  <el-form label-width="140px">
                    <el-form-item label="原来上浆仓:">
                      <label>{{ detailInfo.snum2 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form label-width="140px">
                    <el-form-item label="现上浆仓:">
                      <label>{{ detailInfo.nnum2 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row> -->
              <!-- <el-row>
                <el-col :span="11" :offset="1">
                  <el-form label-width="140px">
                    <el-form-item label="原来生产流通量:">
                      <label>{{ detailInfo.snum4 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form label-width="140px">
                    <el-form-item label="现生产流通量:">
                      <label>{{ detailInfo.nnum4 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row> -->
              <el-row>
                <el-col :span="11" :offset="1">
                  <el-form label-width="140px">
                    <el-form-item label="原来成品米数:">
                      <label>{{ detailInfo.snum3 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form label-width="140px">
                    <el-form-item label="现成品米数:">
                      <label>{{ detailInfo.nnum3 }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11" :offset="1">
                  <el-form label-width="140px">
                    <el-form-item label="客户:">
                      <label>{{ detailInfo.customerName }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form label-width="140px">
                    <el-form-item label="面料:">
                      <label>{{ detailInfo.fabricName }}</label>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row>
                <el-form label-width="140px">
                  <el-form-item label="备注:">
                    <div class="noteHight">{{ detailInfo.note }}</div>
                  </el-form-item>
                </el-form>
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
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchParams: {
        // 名称&备注&面料名称
        key: '',
        // 客户名称
        customerName: '',
        // 面料名称
        name: '',
        // 库存操作状态0:上浆1:产生生成流通2:清除生成流通3:检验4:出库5：手动强制修改库存
        status: '',
        startTime: '',
        endTime: ''
      },
      page: {
        page: 1,
        rows: 10,
        total: 0
      },
      tableData: [],
      drawer: false,
      detailInfo: {},
      time: [],
      statusList: [
        { id: '0', name: '上浆' },
        { id: '1', name: '产生生成流通' },
        { id: '2', name: '清除生成流通' },
        { id: '3', name: '检验' },
        { id: '4', name: '出库' },
        { id: '5', name: '手动强制修改库存' }
      ]
    }
  },
  methods: {
    getData () {
      if (this.time !== [] && this.time !== null) {
        this.searchParams.startTime = this.time[0]
        this.searchParams.endTime = this.time[1]
      } else {
        this.searchParams.startTime = this.searchParams.endTime = ''
      }
      this.$get('/inventory/detail/list', {
        ...this.searchParams, ...this.page
      }).then((data) => {
        this.tableData = data.data.list;
        this.page.total = data.data.total;
      })
    },
    resetSearch () {
      this.searchParams.customerName = ''
      this.searchParams.name = ''
      this.time = []
      this.searchParams.status = ''
      this.searchParams.startTime = ''
      this.searchParams.endTime = ''
      this.page.page = 1
      this.getData()
    },
    showDetail (value) {
      this.detailInfo = value
      this.drawer = true
    },
    changePage (page) {
      this.page.page = page;
      this.getData();
    },
    daochu () {
      const pageDaochu = {
        page: 1,
        rows: 9999
      }
      this.$get('/inventory/detail/list', {
        ...this.searchParams, ...pageDaochu
      }).then((data) => {
        this.exportExcel(data.data.list)
      })
    },
    exportExcel (list) {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../../excel/Export2Excel");
        const tHeader = ["操作时间", "操作者", "客户", '面料',
          '原来底布米数', '现底布米数', '原来成品米数', '现成品米数', '备注'];
        // 上面设置Excel的表格第一行的标题
        const filterVal = ["createTime", "createByName", "customerName", 'fabricName', 'snum1', 'nnum1', 'snum3', 'nnum3', 'note'];
        // 上面的index、nickName、name是tableData里对象的属性
        // const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "操作记录");
      });
    },

    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }

  },
  created () {
    this.getData()
  }
}
</script>

<style>
.adminRecord .note {
  height: 64px;
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 64px;
  padding-left: 32px;
  font-weight: bold;
}
.adminRecord .content {
  padding: 24px;
  background-color: #f0f3f7;
}
.adminRecord .search {
  background-color: #fff;
  padding-left: 20px;
  padding-top: 20px;
}
.adminRecord .table {
  padding-left: 20px;
  padding-right: 20px;
  background-color: #fff;
}
.adminRecord .noteHight {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 25vh;
}
.adminRecord .noteHight::-webkit-scrollbar {
  display: none;
}
.adminRecord .el-pagination {
  /* margin-right: 0;
  padding-right: 0;
  right: 0; */
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>