<template>
  <div class="userManageContent">
    <div class="note">
      <div class="noteText">订单管理</div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <div class="searchForm">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="公司名:" width="400px">
                <el-input
                  v-model="searchParams.companyName"
                  placeholder="请输入公司名"
                ></el-input>
              </el-form-item>
              <el-form-item label="大货订单号:" width="400px">
                <el-input
                  v-model="searchParams.bigOrderNum"
                  placeholder="请输入大货订单号"
                ></el-input>
              </el-form-item>
              <el-form-item label="客户订单号:" width="400px">
                <el-input
                  v-model="searchParams.productNum"
                  placeholder="请输入客户订单号"
                ></el-input>
              </el-form-item>
              <el-form-item label="订单号:" width="400px">
                <el-input
                  v-model="searchParams.orderId"
                  placeholder="请输入订单号"
                ></el-input>
              </el-form-item>
              <el-form-item label="订单状态:">
                <el-select v-model="searchParams.type">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="(item, index) in typeList"
                    :key="index"
                    :label="item"
                    :value="index - 1"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单分类:">
                <el-select v-model="searchParams.type1">
                  <el-option
                    v-for="(item, index) in type1List"
                    :key="index"
                    :label="item"
                    :value="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单日期:">
                <el-date-picker
                  v-model="searchTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="changeSearchDate"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button plain @click="clearSearchInfo"
                  >重&nbsp;&nbsp;置</el-button
                >
                <el-button plain @click="getData">搜&nbsp;&nbsp;索</el-button>
                <el-button plain @click="outExe">导&nbsp;&nbsp;出</el-button>
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
              prop="orderId"
              label="订单编号"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="companyName"
              label="公司名"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="phone"
              label="联系电话"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="orderDetails"
              label="产品拉钩"
            >
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.orderDetails"
                  :key="index"
                  >{{ item.flowerNum
                  }}{{
                    scope.row.orderDetails.length > index + 1 ? "," : ""
                  }}</span
                >
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="okMeter"
              label="合格米数"
            >
            </el-table-column> -->
            <!-- <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="badMeter"
              label="次品米数"
            >
            </el-table-column> -->
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="unitPrice"
              label="单价"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="meter"
              label="数量"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="extraCharges"
              label="包缸费"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="totalPrice"
              label="总价"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              label="是否含税"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.tax === 0">不含税</span>
                <span v-else>含税</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="orderNeededTime"
              label="订单用时"
            >
            </el-table-column> -->
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="fabricCustom"
              label="面料品名"
            >
            </el-table-column>
            <!-- <el-table-column align="center" prop="meter" label="打印数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="unfinishMeter"
              label="未完成米数"
            >
            </el-table-column> -->
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="companyName"
              label="业务员"
            >
              <template slot-scope="scope">
                {{ scope.row.salesMan.name }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              label="订单状态"
            >
              <template slot-scope="scope">
                {{
                  scope.row.type != 100
                    ? typeList[scope.row.type + 1]
                    : "订单已取消"
                }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="340px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showDetail(scope.row)"
                  >查看详情</el-button
                >
                <el-button
                  type="primary"
                  v-if="userType == 2 && scope.row.type != 100"
                  size="mini"
                  @click="check(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  v-if="scope.row.type == 0 && userType == 2"
                  size="mini"
                  @click="review(scope.row)"
                  >审核</el-button
                >
                <!-- <el-button
                  type="primary"
                  v-if="scope.row.type != 100"
                  size="mini"
                  @click="showPrint(scope.row)"
                  >打印</el-button
                > -->
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
        :title="drawerTitle"
        :visible.sync="drawer"
        :destroy-on-close="true"
        direction="rtl"
      >
        <div class="checkDrawer">
          <el-divider content-position="left"></el-divider>
          <el-form>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="订单编号:">
                    <label>{{ detailInfo.orderId }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="公司:">
                    <label>{{ detailInfo.companyName }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="联系人:">
                    <label>{{ detailInfo.contacts }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="联系电话:">
                    <label>{{ detailInfo.phone }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="大货订单号:">
                    <label>{{ detailInfo.bigOrderNum }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="客户订单号:">
                    <label>{{ detailInfo.productNum }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="跟单员">
                    <label>{{ detailInfo.colorName }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="跟单用时">
                    <label>{{ detailInfo.colorNeededTime }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="地址:">
                    <label>{{ detailInfo.address }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="面料品名:">
                    <label>{{ detailInfo.fabricCustom }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-form label-width="100px">
                <el-form-item label="产品:">
                  <el-col
                    style="overflower: hidden"
                    :span="4"
                    :offset="1"
                    v-for="(item, index) in detailInfo.orderDetails"
                    :key="index"
                  >
                    <img style="width: 100%" :src="baseUrl + item.flowerUrl" />
                    <div
                      style="width: 100%; text-align: center; line-height: 0px"
                    >
                      {{ item.flowerNum }}
                    </div>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="单价:">
                    <label>{{ detailInfo.unitPrice }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="数量:">
                    <label
                      >{{ detailInfo.meter
                      }}{{ priceDanweiList[detailInfo.unit] }}</label
                    >
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="包缸费:">
                    <label>{{ detailInfo.extraCharges }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="总价:">
                    <label>{{ detailInfo.totalPrice }}</label>
                    <label v-if="detailInfo.tax === 0">(不含税)</label>
                    <label v-else>(含税)</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="损益(%):">
                    <label>{{ detailInfo.otherChargesRate }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12" v-if="detailInfo.type >= 8">
                <el-form label-width="100px">
                  <el-form-item label="码单:">
                    <img style="width: 90%" :src="baseUrl + detailInfo.mdUrl" />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="下单时间:">
                    <label>{{ detailInfo.createTime }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="交货时间:">
                    <label
                      >{{ detailInfo.deliveryTime | timeTrim }}~{{
                        detailInfo.deliveryTimeStart | timeTrim
                      }}</label
                    >
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="配置方案:">
                    <label>{{ detailInfo.configName }}</label>
                  </el-form-item>
                </el-form>
              </el-col> -->
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="订单状态:">
                    <label>{{
                      detailInfo.type != 100
                        ? typeList[detailInfo.type + 1]
                        : "订单已取消"
                    }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col v-if="detailInfo.type == -1" :span="12">
                <el-form label-width="100px">
                  <el-form-item label="驳回原因:">
                    <label>{{ detailInfo.reason }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col v-if="detailInfo.type == 3" :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="分配机器:">
                    <label>{{ detailInfo.machineName }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row> -->
            <!-- <el-row v-if="detailInfo.type == 3 || detailInfo.type == 4">
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="完成米数:">
                    <label>{{ detailInfo.finishMeter }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="未完成米数:">
                    <label>{{ detailInfo.unfinishMeter }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row> -->
            <!-- <el-row v-if="detailInfo.type == 6">
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="正常米数:">
                    <label>{{ detailInfo.okMeter }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="次品米数:">
                    <label>{{ detailInfo.badMeter }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col
                :span="11"
                :offset="1"
                v-if="detailInfo.transportationType"
              >
                <el-form label-width="100px">
                  <el-form-item label="运输方式:">
                    <label>{{ detailInfo.transportationType }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="发货方式:">
                    <label>{{ detailInfo.deliveryType }}</label>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-form label-width="100px">
                <el-form-item label="花型路径:">
                  <label>{{ detailInfo.filePath }}</label>
                </el-form-item>
              </el-form>
            </el-row> -->
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="备注:">
                    <label>{{ detailInfo.note }}</label>
                    <div v-if="detailInfo.note2">
                      交货预警备注：{{ detailInfo.note2 }}
                    </div>
                    <div v-if="detailInfo.type == 8">
                      退货备注：{{ detailInfo.note3 }}
                    </div>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" :offset="1">
                <el-form label-width="100px">
                  <el-form-item label="操作记录:">
                    <el-table
                      row-class-name="trStyle"
                      class="tableData"
                      :data="detailInfo.orderOperations"
                      border
                      stripe
                      width="100%"
                    >
                      <el-table-column
                        align="center"
                        :show-overflow-tooltip="true"
                        prop="fkUserId"
                        label="操作人编号"
                      >
                      </el-table-column>
                      <el-table-column
                        align="center"
                        :show-overflow-tooltip="true"
                        prop="userName"
                        label="操作人"
                      >
                      </el-table-column>
                      <el-table-column
                        align="center"
                        prop="type"
                        label="操作类型"
                      >
                        <template slot-scope="scope">
                          {{
                            scope.row.type >= 0
                              ? operateTypeList[scope.row.type]
                              : scope.row.note
                              ? scope.row.note
                              : operateTypeList[scope.row.type]
                          }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row v-if="operateType == 'update'">
              <el-col :span="11" :offset="1">
                <el-form-item label="厂长备注:">
                  <el-input
                    type="textarea"
                    v-model="detailInfo.note2"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form label-width="100px">
                  <el-form-item>
                    <el-button
                      v-if="operateType == 'update'"
                      type="primary"
                      @click="add"
                      >保存</el-button
                    >
                    <el-button type="primary" @click="drawer = false"
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
    <!--驳回理由输入框-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>请输入驳回理由</span>
      <el-input type="textarea" v-model="detailInfo.reason"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureReturn">确 定</el-button>
      </span>
    </el-dialog>
    <!--打印表格-->
    <!--订单打印-->
    <div
      class="orderPrintDialog"
      id="orderPrintDialog"
      v-if="orderPrintDialogVisible == true"
    >
      <el-dialog title="" :visible.sync="orderPrintDialogVisible" fullscreen>
        <el-row>
          <el-col :span="22" :offset="1">
            <div id="printArea">
              <table
                cellspacing="0"
                cellpadding="0"
                style="
                  font-size: 16px;
                  border: 1px solid #000;
                  overflow: hidden;
                  border-collapse: collapse;
                  margin: 0 auto;
                  width: 90%;
                "
              >
                <thead>
                  <tr>
                    <th colspan="8">
                      <div
                        style="
                          font-size: 20px;
                          text-align: center;
                          letter-spacing: 2px;
                          line-height: 160%;
                        "
                      >
                        测试工艺流程单{{ detailInfo.orderId }}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width="12%">客户：</td>
                    <td width="15%">{{ detailInfo.companyName }}</td>
                    <td width="12%">面料规格：</td>
                    <td width="19%">{{ detailInfo.fabricName }}</td>
                    <td width="12%">下单数量：</td>
                    <td colspan="3" width="40%">{{ detailInfo.meter }}米</td>
                  </tr>
                  <tr>
                    <td width="12%">业务员：</td>
                    <td width="15%">{{ detailInfo.salesMan.name }}</td>
                    <td width="12%">下单时间：</td>
                    <td width="19%">{{ detailInfo.createTime }}</td>
                    <td width="12%">面料来源：</td>
                    <td colspan="3" width="30%">{{ detailInfo.origin }}</td>
                  </tr>
                  <tr>
                    <td colspan="8">
                      <div class="memo" style="width: 100%">
                        <span style="font-size: 16px"
                          >备注：{{ detailInfo.note }}</span
                        >
                      </div>
                      <div
                        class="imgBox"
                        style="
                          display: flex;
                          width: 100%;
                          align-items: center;
                          justify-content: center;
                          margin-top: 50px;
                          margin-bottom: 50px;
                        "
                      >
                        <div
                          style="width: 40%; margin-right: 1%"
                          v-for="(item, index) in detailInfo.orderDetails"
                          :key="index"
                        >
                          <img
                            style="width: 100%"
                            :src="baseUrl + item.flowerUrl"
                          />
                          <div
                            style="
                              font-size: 16px;
                              width: 100%;
                              text-align: center;
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis;
                            "
                          >
                            {{ item.flowerNum }}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td width="12%">花型路径：</td>
                    <td colspan="7" width="46%">{{ detailInfo.filePath }}</td>
                  </tr>
                  <tr>
                    <td width="12%">配置方案：</td>
                    <td colspan="3" width="46%">{{ detailInfo.configName }}</td>
                    <td width="12%">打印组长：</td>
                    <td colspan="3" width="30%">
                      <label
                        style="font-size: 16px"
                        v-for="(printItem, index) in detailInfo.orderOperations"
                        :key="index"
                        >{{
                          printItem.type == "3" ? printItem.userName : ""
                        }}</label
                      >
                    </td>
                  </tr>
                  <tr>
                    <td width="12%">开单：</td>
                    <td width="15%">{{ detailOperateInfo.userName }}</td>
                    <td width="12%">时间：</td>
                    <td width="19%">{{ detailOperateInfo.createTime }}</td>
                    <td width="12%">审批：</td>
                    <td colspan="3" width="30%">
                      {{ detailOperateInfo.reseverName }}
                    </td>
                  </tr>
                  <tr>
                    <td width="12%">领面料：</td>
                    <td width="15%">{{ detailOperateInfo.getFUser }}</td>
                    <td width="12%">时间：</td>
                    <td width="19%">{{ detailOperateInfo.getFTime }}</td>
                    <td width="12%">米数：</td>
                    <td colspan="3" width="30%">
                      {{
                        detailOperateInfo.getFUser
                          ? detailInfo.meter + "米"
                          : ""
                      }}
                    </td>
                  </tr>
                  <tr
                    v-for="(item, index) in detailOperateInfo.printList"
                    :key="index + 'print'"
                  >
                    <td width="12%">打印：</td>
                    <td width="15%">{{ item.printUser }}</td>
                    <td width="12%">时间：</td>
                    <td width="19%">{{ item.printTime }}</td>
                    <td width="12%">米数：</td>
                    <td colspan="3" width="30%">
                      {{ item.printMeter ? item.printMeter + "米" : "" }}
                    </td>
                  </tr>
                  <tr>
                    <td width="12%">蒸花：</td>
                    <td width="15%">{{ detailOperateInfo.flowerUser }}</td>
                    <td width="12%">时间：</td>
                    <td colspan="5" width="61%">
                      {{ detailOperateInfo.flowerTime }}
                    </td>
                  </tr>
                  <tr>
                    <td width="12%">出库：</td>
                    <td width="15%">{{ detailOperateInfo.outUser }}</td>
                    <td width="12%">时间：</td>
                    <td width="19%">{{ detailOperateInfo.outTime }}</td>
                    <td width="12%">出库米数：</td>
                    <td width="9%">
                      {{ detailInfo.okMeter ? detailInfo.okMeter + "米" : "" }}
                    </td>
                    <td width="12%">次品米数：</td>
                    <td width="9%">
                      {{
                        detailInfo.badMeter ? detailInfo.badMeter + "米" : ""
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="8" style="position: relative">
                      <div
                        class="memo"
                        style="width: 100%; padding-bottom: 100px"
                      >
                        <span style="font-size: 16px"
                          >备注：{{ detailInfo.note2 }}</span
                        >
                        <vue-qr
                          v-if="qrCodeUrl != ''"
                          style="
                            width: 100px;
                            height: 100px;
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                          "
                          :text="qrCodeUrl"
                          :size="200"
                        ></vue-qr>
                        <div v-if="detailInfo.note3" style="font-size: 16px">
                          退货备注：{{ detailInfo.note3 }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <el-row>
              <div style="margin: 20px auto; width: 200px">
                <el-button
                  type="success"
                  style="cursor: pointer"
                  v-print="'#printArea'"
                  >打印</el-button
                >
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui';
import messageUtil from '../../../utils/js/MessageUtil'
import dateUtil from '../../../utils/js/DateUtil'
import vueQr from 'vue-qr'
export default {
  components: {
    vueQr
  },
  data () {
    return {
      //查询参数
      searchParams: {
        //关键字：姓名/账号
        key: "",
        //空全部 -1审核不通过0待审核1已审核2已上浆3已分配4已打印5已蒸花6已检验7已发货8退货9发货审核
        type: "",
        //0全部1待处理2已完成
        type1: 0,
        startTime: '',
        endTime: '',
        bigOrderNum: '',
        productNum: '',
        orderId: '',
        companyName: ''
      },
      searchTime: '',
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
      detailOperateInfo: {},
      //订单状态数组
      typeList: ['审核不通过', '下单', '已下单', '大货确认', '底布进仓', '底部检验', '底布出库', '做货加工', '成品入库', '成品检验', '确认码单', '成品出货', '客户收货', '客户退货'],
      //订单类型数组
      type1List: ['全部', '待处理', '已完成'],
      drawerTitle: '新增用户',
      updateDrawer: false,
      //编辑类型：add,update
      operateType: 'add',
      bindDrawer: false,
      //做绑定操作的业务员id
      userId: 0,
      //已绑定客户列表
      bindedCustomerList: [],
      //未绑定客户列表
      customerList: [],
      roleTypeList: [],
      baseUrl: '',
      operateTypeList: ['下单', '已审核', '大货确认', '底布进仓', '底部检验', '底布出库', '做货加工', '成品入库', '成品检验', '码单确认', '成品出货', '客户收货', '客户退货'],
      dialogVisible: false,
      //是否显示订单打印
      orderPrintDialogVisible: false,
      excelData: [],
      userType: '',
      qrCodeUrl: '',
      priceDanweiList: ['米', '码', '片', '件']
    }
  },
  methods: {
    getData () {
      let searchParams = {
        key: this.searchParams.key,
        type: this.searchParams.type,
        type1: this.searchParams.type1,
        startTime: this.searchParams.startTime,
        endTime: this.searchParams.endTime,
        bigOrderNum: this.searchParams.bigOrderNum,
        productNum: this.searchParams.productNum,
        orderId: this.searchParams.orderId,
        companyName: this.searchParams.companyName
      }
      if (searchParams.type == 10) {
        searchParams.type = 100;
      }
      this.$get('/order', {
        ...searchParams, ...this.page
      }).then((data) => {
        this.tableData = data.data.list;
        console.log(this.tableData)
        this.tableData.forEach(item => {
          item.orderDetails.forEach(list => {
            let regexp = /\.(png|jpg|gif)$/i;
            list.flowerNum = list.flowerNum.replace(regexp, '')
          })
        })
        this.page.total = data.data.total;
        this.baseUrl = data.wwwFileBaseUrl;
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
      this.searchParams = {
        key: "",
        //空全部 -1审核不通过0待审核1已审核2已上浆3已分配4已打印5已蒸花6已检验7已发货8退货9发货审核
        type: "",
        //0全部1待处理2已完成
        type1: 0,
        startTime: '',
        endTime: '',
        bigOrderNum: '',
        productNum: '',
        orderId: '',
        companyName: ''
      }
      this.getData()
    },
    //点击查看详情按钮，显示用户详细信息弹框
    showDetail (row) {
      this.drawer = true;
      this.detailInfo = row;
      this.detailInfo.createTime = dateUtil.formatDate(this.detailInfo.createTime, 'YYYY-MM-dd HH:mm:ss')
      this.detailInfo.deliveryTime = dateUtil.formatDate(this.detailInfo.deliveryTime, 'YYYY-MM-dd HH:mm:ss');
      this.operateType = 'detail';
      this.drawerTitle = '订单信息';
    },
    //点击编辑按钮，显示编辑弹框
    check (row) {
      this.drawer = true;
      this.detailInfo = row;
      this.detailInfo.createTime = dateUtil.formatDate(this.detailInfo.createTime, 'YYYY-MM-dd HH:mm:ss')
      this.drawerTitle = '编辑订单';
      this.operateType = 'update';
    },
    //点击保存按钮
    add () {
      //判断
      if (this.detailInfo.note2) {
        this.$put('/order/' + this.detailInfo.id, {
          'note2': this.detailInfo.note2
        }).then((data) => {
          messageUtil.message.success(data.message);
          this.drawer = false;
          this.getData();
        })
      }
    },
    //删除
    HandlerDelete (orderInfo) {
      messageUtil.confirm('确认要删除该员工吗？', () => {
        this.$deletefn('/user/' + orderInfo.id, {}).then((data) => {
          messageUtil.message.success(data.message)
          this.getData();
        })
      })
    },
    changeSearchDate (val) {
      this.searchParams.startTime = dateUtil.formatDate(val[0], 'YYYY-MM-dd') + ' 00:00:00';
      this.searchParams.endTime = dateUtil.formatDate(val[1], 'YYYY-MM-dd') + ' 23:59:59';
    },
    //点击审核按钮
    review (orderInfo) {
      let self = this;
      self.detailInfo = orderInfo;
      self.$confirm('请选择审核结果?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '通过',
        cancelButtonText: '驳回'
      }).then(() => {
        self.$post('/flow/' + orderInfo.id, {
          'type': 1,
          'id': orderInfo.id
        }).then((data) => {
          messageUtil.message.success(data.message);
          self.drawer = false;
          self.getData();
        })
      }).catch((action) => {
        if (action === 'cancel') {
          self.dialogVisible = true;
        }
      });
    },
    sureReturn () {
      let self = this;
      self.$post('/flow/' + self.detailInfo.id, {
        'type': -1,
        'id': self.detailInfo.id,
        'note': self.detailInfo.reason
      }).then((data) => {
        messageUtil.message.success(data.message);
        self.dialogVisible = false;
        self.getData();
      })
    },
    showPrint (orderInfo) {
      let printList = [];
      this.detailInfo = orderInfo;
      this.detailOperateInfo = {};
      this.qrCodeUrl = 'https://www.yinhuachaoshi.com/qrcode?id=' + orderInfo.id;
      this.detailInfo.createTime = dateUtil.formatDate(this.detailInfo.createTime, 'YYYY-MM-dd HH:mm')
      this.detailInfo.deliveryTime = dateUtil.formatDate(this.detailInfo.deliveryTime, 'YYYY-MM-dd HH:mm');
      for (var i = 0; i < this.detailInfo.orderOperations.length; i++) {
        //开单员
        if (this.detailInfo.orderOperations[i].type == '0') {
          this.detailOperateInfo.userName = this.detailInfo.orderOperations[i].userName;
          this.detailOperateInfo.createTime = dateUtil.formatDate(this.detailInfo.orderOperations[i].createTime, 'YYYY-MM-dd HH:mm');
        } else if (this.detailInfo.orderOperations[i].type == '1') {
          //审核
          this.detailOperateInfo.reseverName = this.detailInfo.orderOperations[i].userName;
        } else if (this.detailInfo.orderOperations[i].type == '2') {
          //领面料：仓库管理员
          this.detailOperateInfo.getFUser = this.detailInfo.orderOperations[i].userName;
          this.detailOperateInfo.getFTime = dateUtil.formatDate(this.detailInfo.orderOperations[i].createTime, 'YYYY-MM-dd HH:mm');
        } else if (this.detailInfo.orderOperations[i].type == '4') {
          //打印
          printList.push({
            'printUser': this.detailInfo.orderOperations[i].userName,
            'printTime': dateUtil.formatDate(this.detailInfo.orderOperations[i].createTime, 'YYYY-MM-dd HH:mm'),
            'printMeter': this.detailInfo.orderOperations[i].meter
          })
        } else if (this.detailInfo.orderOperations[i].type == '5') {
          //蒸花
          this.detailOperateInfo.flowerUser = this.detailInfo.orderOperations[i].userName;
          this.detailOperateInfo.flowerTime = dateUtil.formatDate(this.detailInfo.orderOperations[i].createTime, 'YYYY-MM-dd HH:mm');
        } else if (this.detailInfo.orderOperations[i].type == '7') {
          //出库
          this.detailOperateInfo.outUser = this.detailInfo.orderOperations[i].userName;
          this.detailOperateInfo.outTime = dateUtil.formatDate(this.detailInfo.orderOperations[i].createTime, 'YYYY-MM-dd HH:mm');
        }
      }
      if (printList.length == 0) {
        printList.push({
          'printUser': '',
          'printTime': '',
          'printMeter': ''
        })
      }
      this.detailOperateInfo.printList = printList;
      this.orderPrintDialogVisible = true;
    },
    outExe () {
      if (!this.searchParams.startTime) {
        Message({ message: "请选择开始时间！", type: "error" })
      } else if (!this.searchParams.endTime) {
        Message({ message: "请选择结束时间", type: "error" })
      } else {
        // let baseUrl = 'http://192.168.1.115:9911'//线下地址
        let baseUrl = 'https://yc.jiangmiantex.com/jiangjin'//线上地址
        let url = `/order/export?startTime=${this.searchParams.startTime}&endTime=${this.searchParams.endTime}`;
        window.open(baseUrl + url, '_block');
      }
    }
  },
  mounted () {
    this.getData();
    this.userType = localStorage.getItem("userType");
  },
  computed: {
    ...mapGetters([
      'user'
    ]),

  },
  filters: {
    timeTrim (a) {
      if (a) {
        return a.substring(0, a.indexOf(' '))
      }
    }
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
  font-family: PingFangSC-Regular;
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
  font-size: 13px;
  margin-bottom: 5px;
}
.orderPrintDialog td {
  border: 1px solid #000;
  height: 25px;
  text-indent: 2px;
  overflow: hidden;
}
.orderPrintDialog table {
  width: 100% !important;
}
.orderPrintDialog th {
  border-bottom: 1px solid #000;
  border-top: 1px solid #000;
  text-align: center;
  border-collapse: collapse;
}
.orderPrintDialog th div {
  font-size: 30px !important;
}
#printArea td {
  border: 1px solid #000;
  height: 25px;
  text-indent: 2px;
  overflow: hidden;
  font-size: 13px !important;
  padding: 5px 0;
}
#printArea th {
  border-bottom: 1px solid #000;
  border-top: 1px solid #000;
  width: 24px !important;
  text-align: center;
  border-collapse: collapse;
}
</style>
<style media="print only">
@page {
  size: auto; /* auto is the initial value */
  margin: 3mm; /* this affects the margin in the printer settings */
  height: 90%;
}
@media print {
  html {
    background-color: #ffffff;
    margin: 0px; /* this affects the margin on the html before sending to printer */
    font-weight: lighter;
  }

  body {
    margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
    height: 90%;
  }
}
</style>
