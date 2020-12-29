<template>
  <div class="userManageContent">
    <div class="note">
      <div class="noteText">
        IP设定
      </div>
    </div>
    <div class="data">
      <div class="dataContent">
        <div class="searchArea">
          <el-form>
            <el-form-item label="关键字：">
              <el-input v-model="requestParams.key" placeholder="请输入关键字" style="width: 200px"></el-input>
              <el-button plain @click="getList">搜&nbsp;&nbsp;索</el-button>
              <el-button plain @click="dialogTableVisible = true">新&nbsp;&nbsp;增</el-button>
            </el-form-item>
            <el-dialog title="新增IP地址" :visible.sync="dialogTableVisible">
              <el-form :model="setIpData">
                <el-form-item label="机器码" label-width="90px">
                  <el-input v-model="setIpData.machine" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" label-width="90px">
                  <el-input v-model="setIpData.ip" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="90px">
                  <el-input v-model="setIpData.note" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="addIp">确 定</el-button>
              </div>
            </el-dialog>
          </el-form>
        </div>
        <div class="dataListArea">
          <el-table row-class-name="trStyle" class="tableData" :data="ipList" border stripe width="100%">
            <el-table-column align="center" :show-overflow-tooltip="true" prop="ip" label="允许登陆的IP地址" >
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="machine" label="机器码" >
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注" >
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="deleteIp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="page"
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="changePage"
            :current-page.sync="page.page"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import messageUtil from '../../../utils/js/MessageUtil'
export default {
  data(){
    return{
      requestUrl:{
        ip:'/ip'
      },
      requestParams:{
        key:''
      },
      page:{
        page:1,
        rows:10
      },
      setIpData:{
        ip:'',
        machine:'',
        note:''
      },
      total:0,
      ipList:[],
      formLabelWidth:'80px',
      dialogTableVisible:false
    }
  },
  methods:{
    addIp(){
      if(this.setIpData.machine){
        let _this = this;
        this.$post(this.requestUrl.ip,{
          ...this.setIpData
        }).then((data)=>{
          messageUtil.message.success(data.message);
          _this.getList();
          _this.requestParams.key = '';
          _this.dialogTableVisible = false;
          _this.setIpData = {
            ip:'',
            machine:''
          }
        })
      }else{
        this.$message.error('请输入机器码')
      }
    },
    deleteIp(ip){
      let _this = this;
      this.$confirm('是否要删除该IP地址', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.$deletefn(this.requestUrl.ip,{...ip}).then((data)=>{
          if(data.code == 0){
            messageUtil.message.success(data.message);
            _this.getList();
          }
        })
      }).catch(() => {
      
      });

    },
    changePage(page){
      this.page.page = page;
      this.getList();
    },
    getList(){
      let _this = this;
      this.$get(this.requestUrl.ip,{
        ...this.requestParams,...this.page
      }).then((data)=>{
          let list = [];
          _this.ipList = data.data.list;
          _this.total = data.data.total;
      })
    }
  },
  mounted(){
    this.getList();
  }
}
</script>

<style>
  .userManageContent .page {
    margin: 15px 15px;
    float: right;
  }
</style>
<style scoped>
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
  tr.trStyle{
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
  .searchArea{
    padding-top: 24px;
    padding-left: 32px;
  }
  .dataListArea{
    margin-bottom: 20px;
  }
</style>