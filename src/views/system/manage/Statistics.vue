<template>
  <div class="Statistics">
    <div class="note">
      <div class="noteText">数据统计</div>
    </div>
    <div class="data">
      <div class="dataContent">
        <el-row class="chartItem">
          <el-col class="itemEchart">
            <div class="sellCountContentTitle">
              <div class="titleBox">
                <span>下单与出货米数</span>
                <span>
                  <el-button
                    type="text"
                    v-for="(item, index) in orderCompleteType"
                    :key="index"
                    @click="orderCompleteChange(item.id)"
                    :style="{
                      color:
                        item.id == orderCompleteIndex
                          ? '#409EFE !important'
                          : 'rgba(0,0,0,0.45) !important',
                    }"
                    >{{ item.value }}</el-button
                  >
                </span>
                <span>
                  <el-date-picker
                    v-model="searchTime"
                    type="daterange"
                    size="small"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeSearchDate"
                  >
                  </el-date-picker>
                  <el-button plain @click="clearSearchInfo('order')" size="mini"
                    >重&nbsp;&nbsp;置</el-button
                  >
                </span>
              </div>
            </div>
            <el-row>
              <el-col :span="15">
                <div
                  class="echart-line"
                  id="orderCompleteData"
                  ref="orderCompleteData"
                  style="
                    width: 95%;
                    height: 320px;
                    margin-left: 20px;
                    margin-right: 10px;
                  "
                ></div>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-table
                  :data="flowerdata"
                  style="width: 100%; margin-bottom: 15px"
                  size="mini"
                >
                  <el-table-column prop="top" label="排名">
                    <template slot-scope="scope">
                      <span v-if="scope.row.top <= 3" class="top top3">{{
                        scope.row.top
                      }}</span>
                      <span v-else class="top">{{ scope.row.top }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="米样名称"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                  <el-table-column prop="num" label="数量"> </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="chartItem">
          <el-col :span="24" class="itemEchart">
            <div class="sellCountContentTitle">
              <div class="titleBox">
                <span>客户出货米数</span>
                <span>
                  <el-button
                    type="text"
                    v-for="(item, index) in orderCompleteType"
                    :key="index"
                    @click="customerOutChange(item.id)"
                    :style="{
                      color:
                        item.id == customerOutIndex
                          ? '#409EFE !important'
                          : 'rgba(0,0,0,0.45) !important',
                    }"
                    >{{ item.value }}</el-button
                  >
                </span>
                <span>
                  <el-date-picker
                    v-model="searchTime"
                    type="daterange"
                    size="small"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeCustomerSearchDate"
                  >
                  </el-date-picker>
                  <el-button
                    plain
                    @click="clearSearchInfo('customer')"
                    size="mini"
                    >重&nbsp;&nbsp;置</el-button
                  >
                </span>
              </div>
            </div>
            <div
              class="echart-line"
              id="customerOutData"
              ref="customerOutData"
              style="
                width: 95%;
                height: 350px;
                margin-left: 20px;
                margin-right: 10px;
              "
            ></div>
          </el-col>
        </el-row>
        <el-row class="chartItem">
          <el-col :span="24" class="itemEchart">
            <div class="sellCountContentTitle">
              <div class="titleBox">
                <span>面料品类出货米数</span>
                <span>
                  <el-button
                    type="text"
                    v-for="(item, index) in orderCompleteType"
                    :key="index"
                    @click="fabricOutChange(item.id)"
                    :style="{
                      color:
                        item.id == fabricOutIndex
                          ? '#409EFE !important'
                          : 'rgba(0,0,0,0.45) !important',
                    }"
                    >{{ item.value }}</el-button
                  >
                </span>
                <span>
                  <el-date-picker
                    v-model="searchTime"
                    type="daterange"
                    size="small"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeFabricSearchDate"
                  >
                  </el-date-picker>
                  <el-button
                    plain
                    @click="clearSearchInfo('fabric')"
                    size="mini"
                    >重&nbsp;&nbsp;置</el-button
                  >
                </span>
              </div>
            </div>
            <div
              class="echart-line"
              id="fabricOutData"
              ref="fabricOutData"
              style="
                width: 95%;
                height: 350px;
                margin-left: 20px;
                margin-right: 10px;
              "
            ></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import "echarts/lib/echarts.js";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import dateUtil from '../../../utils/js/DateUtil'
export default {
  data () {
    return {
      dataList: [],
      orderCompleteData: null,
      customerOutData: null,
      fabricOutData: null,
      flowerOutData: null,
      orderCompleteType: [{ id: 0, value: '天' }, { id: 1, value: '周' }, { id: 2, value: '月' }],
      orderCompleteIndex: 0,
      customerOutIndex: 0,
      fabricOutIndex: 0,
      customerOutType: 0,
      fabricOutType: 0,
      flowerOutType: 0,
      flowerdata: [],
      searchTime: '',
      searchParams: {
        type: 0,
        startTime: '',
        endTime: ''
      }
    }
  },
  methods: {
    async getData () {
      return this.$post('/count', this.searchParams).then((res) => {
        return this.dataList = res.data;
      })
    },
    orderCompleteChart () {
      let xAxisData = []
      let orderDataList = []
      let outDataList = []
      this.flowerdata = []
      if (this.orderCompleteIndex == 0) {
        for (let i = 0; i < this.dataList.order30Day.length; i++) {
          xAxisData.push(this.dataList.order30Day[i].time);
          orderDataList.push(this.dataList.order30Day[i].num)
        }
        for (let i = 0; i < this.dataList.out30Day.length; i++) {
          outDataList.push(this.dataList.out30Day[i].num)
        }
        for (let i = 0; i < this.dataList.flowerNumOrderBy30Day.length && i < 10; i++) {
          let regexp = /\.(png|jpg|gif)$/i;
          let list = {
            top: i + 1,
            name: this.dataList.flowerNumOrderBy30Day[i].name.replace(regexp, ''),
            num: this.dataList.flowerNumOrderBy30Day[i].num
          }
          this.flowerdata.push(list)
        }
      } else if (this.orderCompleteIndex == 1) {
        for (let i = 0; i < this.dataList.order12Week.length; i++) {
          xAxisData.push(this.dataList.order12Week[i].startTime + '~'
            + this.dataList.order12Week[i].endTime);
          orderDataList.push(this.dataList.order12Week[i].num)
        }
        for (let i = 0; i < this.dataList.out12Week.length; i++) {
          outDataList.push(this.dataList.out12Week[i].num)
        }
        for (let i = 0; i < this.dataList.flowerNumOrderBy12Week.length && i < 10; i++) {
          let list = {
            top: i + 1,
            name: this.dataList.flowerNumOrderBy12Week[i].name,
            num: this.dataList.flowerNumOrderBy12Week[i].num
          }
          this.flowerdata.push(list)
        }
      } else if (this.orderCompleteIndex == 2) {
        for (let i = 0; i < this.dataList.order12Month.length; i++) {
          xAxisData.push(this.dataList.order12Month[i].monthTime);
          orderDataList.push(this.dataList.order12Month[i].num)
        }
        for (let i = 0; i < this.dataList.out12Month.length; i++) {
          outDataList.push(this.dataList.out12Month[i].num)
        }
        for (let i = 0; i < this.dataList.flowerNumOrderBy12Month.length && i < 10; i++) {
          let list = {
            top: i + 1,
            name: this.dataList.flowerNumOrderBy12Month[i].name,
            num: this.dataList.flowerNumOrderBy12Month[i].num
          }
          this.flowerdata.push(list)
        }
      }
      return {
        color: ['#3398DB', '#0a0a0a'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: {
              show: true,
              readOnly: false,
              lang: ['数据视图', '关闭', '导出'],
              optionToContent: function (opt) {
                let axisData = opt.xAxis[0].data;
                let series = opt.series;
                let table = '<table border="1" style="width:100%;border-collapse:collapse;text-align:center"><tbody><tr>'
                  + '<td>时间</td>'
                  + '<td>' + series[0].name + '</td>'
                  + '<td>' + series[1].name + '</td>'
                  + '</tr>';
                for (let i = 0, l = axisData.length; i < l; i++) {
                  table += '<tr>'
                    + '<td>' + axisData[i] + '</td>'
                    + '<td>' + series[0].data[i] + '</td>'
                    + '<td>' + series[1].data[i] + '</td>'
                    + '</tr>';
                }
                table += '</tbody></table>';
                return table;
              },
              contentToOption (HTMLDomElement, opt) {
                require.ensure([], () => {
                  const { export_json_to_excel } = require('../../../excel/Export2Excel');
                  const tHeader = ['时间', '下单米数', '出货米数'];
                  // 上面设置Excel的表格第一行的标题
                  const filterVal = ['time', 'xiadan', 'chuhuo'];
                  // 上面的index、nickName、name是tableData里对象的属性
                  const i = opt.xAxis[0].data.length
                  let list = []
                  for (let a = 0; a < i; a++) {
                    const obj = {
                      time: opt.xAxis[0].data[a],
                      xiadan: opt.series[0].data[a],
                      chuhuo: opt.series[1].data[a]
                    }
                    list.push(obj)
                  }
                  //把data里的tableData存到list
                  const data = window.jsonData(filterVal, list);
                  export_json_to_excel(tHeader, data, '列表excel');
                })
              }
            },
            saveAsImage: { show: true }
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          top: '10px'
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#D9D9D9'
              },
            },
            axisLabel: {
              color: '#000'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            splitLine: {    //网格线
              lineStyle: {
                type: 'dashed'    //设置网格线类型 dotted：虚线   solid:实线
              },
              show: true //隐藏或显示
            }
          }
        ],
        series: [
          {
            name: '下单米数',
            type: 'bar',
            // barWidth: '60%',
            // stack: '总量',
            data: orderDataList
          },
          {
            name: '出货米数',
            type: 'bar',
            // barWidth: '60%',
            // stack: '总量',
            data: outDataList
          }
        ]
      };
    },
    orderCompleteChange (id) {
      this.orderCompleteIndex = id;
      this.setOrderEchart();
    },
    setTime (val) {
      this.searchParams.startTime = dateUtil.formatDate(val[0], 'YYYY-MM-dd') + ' 00:00:00';
      this.searchParams.endTime = dateUtil.formatDate(val[1], 'YYYY-MM-dd') + ' 23:59:59';
    },
    changeSearchDate (val) {
      this.setTime(val);
      this.setOrderEchart();
    },
    changeCustomerSearchDate (val) {
      this.setTime(val);
      this.setCustomerOutChart();
    },
    changeFabricSearchDate (val) {
      this.setTime(val);
      this.setFabricOutChart();
    },
    clearSearchInfo (type) {
      this.searchParams = {
        type: 0,
        startTime: '',
        endTime: ''
      }
      this.searchTime = '';
      if (type == 'order') {
        this.orderCompleteIndex = 0;
        this.setOrderEchart()
      } else if (type == 'customer') {
        this.customerOutIndex = 0;
        this.setCustomerOutChart()
      } else if (type == 'fabric') {
        this.fabricOutIndex = 0;
        this.setFabricOutChart()
      }
    },
    setOrderEchart () {
      this.getData().then((data) => {
        let sellCountOption = this.orderCompleteChart();
        this.$nextTick(() => {
          //处理
          this.orderCompleteData = echarts.init(document.getElementById('orderCompleteData'));
          this.orderCompleteData.setOption(sellCountOption);
        })
      });
    },
    //客户出货视图
    customerOutChart () {
      let orderDataList = []
      if (this.customerOutIndex == 0) {
        for (let i = 0; i < this.dataList.customerOut30Day.length; i++) {
          let list = {
            value: this.dataList.customerOut30Day[i].num,
            name: this.dataList.customerOut30Day[i].contacts
          }
          orderDataList.push(list)
        }
      } else if (this.customerOutIndex == 1) {
        for (let i = 0; i < this.dataList.customerOut12Week.length; i++) {
          let list = {
            value: this.dataList.customerOut12Week[i].num,
            name: this.dataList.customerOut12Week[i].contacts
          }
          orderDataList.push(list)
        }
      } else if (this.customerOutIndex == 2) {
        for (let i = 0; i < this.dataList.customerOut12Month.length; i++) {
          let list = {
            value: this.dataList.customerOut12Month[i].num,
            name: this.dataList.customerOut12Month[i].contacts
          }
          orderDataList.push(list)
        }
      }
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: {
              show: true,
              readOnly: false,
              lang: ['数据视图', '关闭', '导出'],
              optionToContent: function (opt) {
                let axisData = opt.series[0].data
                let series = opt.series;
                let table = '<table border="1" style="width:100%;border-collapse:collapse;text-align:center"><tbody><tr>'
                  + '<td>' + series[0].name + '</td>'
                  + '<td>' + '出货米数' + '</td>'
                  + '</tr>';
                for (let i = 0, l = axisData.length; i < l; i++) {
                  table += '<tr>'
                    + '<td>' + axisData[i].name + '</td>'
                    + '<td>' + axisData[i].value + '</td>'
                    + '</tr>';
                }
                table += '</tbody></table>';
                return table;
              },
              contentToOption (HTMLDomElement, opt) {
                require.ensure([], () => {
                  const { export_json_to_excel } = require('../../../excel/Export2Excel');
                  const tHeader = ['客户名', '出货米数'];
                  // 上面设置Excel的表格第一行的标题
                  const filterVal = ['name', 'value'];
                  // 上面的index、nickName、name是tableData里对象的属性
                  const list = opt.series[0].data;  //把data里的tableData存到list
                  const data = window.jsonData(filterVal, list);
                  export_json_to_excel(tHeader, data, '列表excel');
                })
              }
            },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '客户',
            type: 'pie',
            radius: '85%',
            center: ['45%', '52%'],
            data: orderDataList,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    customerOutChange (id) {
      this.customerOutIndex = id;
      this.setCustomerOutChart();
    },
    setCustomerOutChart () {
      this.getData().then((data) => {
        let customerOutOption = this.customerOutChart();
        this.$nextTick(() => {
          //处理
          this.customerOutData = echarts.init(document.getElementById('customerOutData'));
          this.customerOutData.setOption(customerOutOption);
        })
      });
    },
    //面料出货视图
    fabricOutChart () {
      let orderDataList = []
      if (this.fabricOutIndex == 0) {
        if (this.dataList.fabricOut30Day.length > 0) {
          for (let i = 0; i < this.dataList.fabricOut30Day.length; i++) {
            let list = {
              value: this.dataList.fabricOut30Day[i].num,
              name: this.dataList.fabricOut30Day[i].fabricName
            }
            orderDataList.push(list)
          }
        } else {
          for (let i = 0; i < 30; i++) {
            let list = {
              value: 0,
              name: 0
            }
            orderDataList.push(list)
          }
        }
      } else if (this.fabricOutIndex == 1) {
        for (let i = 0; i < this.dataList.fabricOut12Week.length; i++) {
          let list = {
            value: this.dataList.fabricOut12Week[i].num,
            name: this.dataList.fabricOut12Week[i].fabricName
          }
          orderDataList.push(list)
        }
      } else if (this.fabricOutIndex == 2) {
        for (let i = 0; i < this.dataList.fabricOut12Week.length; i++) {
          let list = {
            value: this.dataList.fabricOut12Week[i].num,
            name: this.dataList.fabricOut12Week[i].fabricName
          }
          orderDataList.push(list)
        }
      }
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            saveAsImage: { show: true },
            mark: { show: true },
            dataView: {
              show: true,
              readOnly: false,
              lang: ['数据视图', '关闭', '导出'],
              optionToContent: function (opt) {
                let axisData = opt.series[0].data
                let series = opt.series;
                let table = '<table border="1" style="width:100%;border-collapse:collapse;text-align:center"><tbody><tr>'
                  + '<td>' + series[0].name + '</td>'
                  + '<td>' + '出货米数' + '</td>'
                  + '</tr>';
                for (let i = 0, l = axisData.length; i < l; i++) {
                  table += '<tr>'
                    + '<td>' + axisData[i].name + '</td>'
                    + '<td>' + axisData[i].value + '</td>'
                    + '</tr>';
                }
                table += '</tbody></table>';
                return table;
              },
              contentToOption (HTMLDomElement, opt) {
                require.ensure([], () => {
                  const { export_json_to_excel } = require('../../../excel/Export2Excel');
                  const tHeader = ['面料品类', '出货米数'];
                  // 上面设置Excel的表格第一行的标题
                  const filterVal = ['name', 'value'];
                  // 上面的index、nickName、name是tableData里对象的属性
                  const list = opt.series[0].data;  //把data里的tableData存到list
                  const data = window.jsonData(filterVal, list);
                  export_json_to_excel(tHeader, data, '列表excel');
                })
              }
            }
          }
        },
        series: [
          {
            name: '面料',
            type: 'pie',
            radius: '85%',
            center: ['45%', '52%'],
            data: orderDataList,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    fabricOutChange (id) {
      this.fabricOutIndex = id;
      this.setFabricOutChart();
    },
    setFabricOutChart () {
      this.getData().then((data) => {
        let fabricOutOption = this.fabricOutChart();
        this.$nextTick(() => {
          //处理
          this.fabricOutData = echarts.init(document.getElementById('fabricOutData'));
          this.fabricOutData.setOption(fabricOutOption);
        })
      });
    }
  },
  mounted () {
    this.setOrderEchart();
    this.setCustomerOutChart();
    this.setFabricOutChart();
  },
  created () {
    window['jsonData'] = (filterVal, jsonData) => {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped>
.Statistics {
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100%);
  height: calc(100vh - 64px) !important;
  font-family: PingFangSC-Regular;
}

.Statistics .note {
  height: 64px;
}
.Statistics .noteText {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  height: 28px;
  padding-left: 32px;
  padding-top: 18px;
  font-weight: bold;
}
.Statistics .data {
  width: calc(100%);
  min-height: calc(100% - 64px);
  height: auto;
  padding: 24px 24px 24px 24px;
  background-color: #f0f3f7;
}

.Statistics .dataContent {
  width: calc(100% - 48px);
  border-radius: 2px;
  border-radius: 2px;
  padding-bottom: 32px;
}
.chartItem {
  margin-bottom: 10px;
}
.sellCountContentTitle {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 30px;
  margin-left: 10px;
  position: relative;
}
.titleBox {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.titleBox span:first-child {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}
.titleBox span:nth-child(2) {
  position: relative;
  right: -150px;
}
.titleBox span:nth-child(3) {
  margin-right: 32px;
}
.top {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-family: HelveticaNeue-Medium;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}
.top3 {
  background: #1890ff;
  color: #ffffff;
}
.sellCountContentTitle div:first-child {
  margin-bottom: 15px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}
.sellCountContentTitle div:nth-child(2) {
  margin-left: 20px;
}
.sellCountContentTitle div:nth-child(2) span {
  position: absolute;
  right: 20px;
}
.itemEchart {
  background-color: #fff;
}
</style>