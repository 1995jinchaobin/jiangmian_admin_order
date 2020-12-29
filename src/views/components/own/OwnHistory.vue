<template>
  <div class="history">
    <div class="header">
      <img src="../../../assets/image/searchPicturePC/addHeaderBg.png"/>
      <!--顶部个人信息-->
      <div class="userInfo">{{userName}}，您好</div>
      <!--花型管理按钮-->
      <div class="headerBtn flowerBtn" @click="goToManage">花型管理</div>
      <!--返回按钮-->
      <div class="headerBtn" @click="goToList">返回识图</div>
    </div>
    <div class="content">
      <div class="countBox">
        <p class="title">查询数据</p>
        <div class="searchBox">
          <span>用户名</span><input type="text" v-model="phone" ><span @click="clickBtn" class="btn">查询</span>
        </div>
        <el-table :data="searchData" height="457" border style="width: 1000px;">
          <el-table-column prop="userName" label="查询用户"></el-table-column>
          <el-table-column  label="查询图片">
            <template slot-scope="scope">
              <div class="itemImg">
                <img :src="scope.row.searchImgUrl" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="搜索结果图片">
            <template slot-scope="scope">
              <div class="itemImg">
                <img :src="scope.row.resultImgUrl" alt="">
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="address" label="结果图片"></el-table-column> -->
          <el-table-column prop="create_time" label="时间" sortable></el-table-column>
        </el-table>
        <div class="pageBox">
          <el-pagination
                  background
                  layout="prev, pager, next,sizes, jumper"
                  :total="total"
                  :page-size="pageSize"
                  :page-sizes="[8, 16, 32, 48]"
                  @prev-click="prevClick"
                  @next-click="nextClick"
                  @current-change = "currentChange"
                  @size-change = "sizeChange"
          >
          </el-pagination>
        </div>
      </div>
      <InfoBox  v-if="showInfo==1 || showInfo==0" :code="showInfo" :errMsg="errMsg" :succMsg="succMsg"></InfoBox>
    </div>
  </div>
</template>

<script>
import Scroll from "../../../assets/js/scroll";
import InfoBox from '../common/InfoBox';
import {mapMutations} from 'vuex'
import messageUtil from '../../../utils/js/MessageUtil'
import Cookie from '../../../utils/js/CookieUtil'
export default {
  name: 'OwnHistory',
  components:{
    InfoBox,
  },
  data(){
    return{
      showInfo:-1,
      errMsg:'',
      succMsg:'',
      userName:'',
      actions:{
        // 获取用户图像搜索历史
        getSearchData:'/pic/click'
      },
      page:1,
      pageSize:8,
      total:0,
      phone:'',
      searchData: [],
      showBindBox: false
    }
  },
  methods:{
      prevClick(){
        if(this.page==1){
            this.showInfo = 1;
            this.errMsg =  '已经是第一页了';
            setTimeout(function(){
                this.showInfo = -1;
                this.errMsg = '';
            },2000);
        }
        this.page-=1;
        this.getSearchData();
    },
    nextClick(){
        if(this.page==this.total){
            this.showInfo = 1;
            this.errMsg =  '已经是最后一页了';
            setTimeout(function(){
                this.showInfo = -1;
                this.errMsg = '';
            },2000);
        }
        this.page+=1;
        this.getSearchData();
    },
    currentChange(page){
        this.page=page;
        this.getSearchData();
    },
    sizeChange(pageSize){
        this.pageSize=pageSize;
        this.getSearchData();
    },
    goToList(){
        this.$router.push({
            path: '/Knowledge'
      });
    },
    goToManage(){
      this.$router.push({
          path: '/Addpicture'
      });
    },
    clickBtn(){
      this.getSearchData();
    },
    getSearchData(){
      let _this = this;
      this.$get(this.actions.getSearchData,{
        page:this.page,
        rows:this.pageSize,
        key:this.phone
      }).then((res)=>{
        _this.searchData = res.data.list;
        _this.searchData.forEach(item => {
          item.create_time = Scroll.changeDate(item.createTime);
          if(item.searchImgUrl.substring(0,4) != "http"){
            item.searchImgUrl = res.wwwFileBaseUrl + item.searchImgUrl;
          }
          if(item.resultImgUrl.substring(0,4) != 'http'){
            item.resultImgUrl = res.wwwFileBaseUrl + item.resultImgUrl;
          }
        })
      })
      // let formData = new FormData();
      // formData.append('page',this.page);
      // formData.append('pageSize',this.pageSize);
      // if(this.phone){
      //   formData.append('phone',this.phone);
      // };
      // let obj = {
      //   url: this.all.baseUrl + this.actions.getSearchData,
      //   formdata: formData
      // };
      // this.getData(obj).then(res=>{
      //   if(res.data.status == 0){
      //     _this.total = res.data.result.total;
      //     _this.searchData = res.data.result.list;
      //     for(let i = 0;i < _this.searchData.length;i++){
      //       _this.searchData[i].create_time = Scroll.changeDate(_this.searchData[i].create_time);
      //     }
      //   }else if(res.data.status == -95){
      //     _this.showInfo = 1;
      //     _this.errMsg =  res.data.msg;
      //     setTimeout(function(){
      //       _this.showInfo = -1;
      //       _this.errMsg =  '';
      //       localStorage.clear();
      //       _this.$router.push({
      //           path: '/OwnKnowledge/Pc/piclogin'
      //       });
      //     },1500)
      //   }else{
      //     _this.showInfo = 1;
      //     _this.errMsg =  res.data.msg;
      //     setTimeout(function(){
      //       _this.showInfo = -1;
      //       _this.errMsg =  '';
      //     },1500)
      //   }
      // })
    }
  },
  mounted(){
      this.userName= JSON.parse(Cookie.getItem("userInfo")).name;
      this.getSearchData();
  }
}
</script>

<style scoped>
    .history{
        min-width: 1200px;
        width: 100vw;
        background-color: #fff;
    }
    .userInfo{
        position: absolute;
        top: 21px;
        right: 113px;
        display: flex;
        align-items: right;
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #FFFFFF;
    }
    .header{
      width: 100%;
      height: auto;
      position: relative;
      text-align: center;
      margin-bottom: -4px;
    }
  .headerBtn{
    width: 89px;
    height: 29px;
    border: 1px solid #FFFFFF;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
    position: absolute;
    top: 58px;
    right: 113px;
    border-radius: 4px;
    text-align: center;
    line-height: 29px;
    cursor: pointer;
  }
  .content{
    width: 100%;
    float: left;
    min-width: 1200px;
    background: #F0F2F5;
    position: relative;
  }
  .countBox{
    width: 1200px;
    background: #fff;
    height: 760px;
    margin: 0 auto;
    padding-left: 187.8px;
  }
  .title{
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #333333;
    text-align: left;
    position: relative;
    top: 13.7px;
    margin-bottom: 33px;
    font-weight: bold;
  }
  .searchBox{
    text-align: left;
    position: relative;
    top: 15px;
    margin-bottom: 52px;
  }
  .searchBox>span:first-child{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
  }
  .searchBox>input{
    width: 154px;
    height: 28px;
    font-size: 16px;
    border: 1px solid#000;
    padding: 0px;
    padding-left: 5px;
    margin: 0 19px;
    outline: none;
  }
  .searchBox>span:last-child{
    display: inline-block;
    width: 96px;
    height: 32px;
    background: #ffe300;
    font-size: 14px;
    color: #333333;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
  }
  .searchBox>span:last-child:hover{
    background: #ffd000;
  }
  .active{
    background-color: #ffe300 !important;
    color: #000 !important;
  }
  .itemImg{
    width: 84px;
    height: 121px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .itemImg img{
    width: 84px;
    height: auto;
  }
  .pageBox{
    margin-top: 23px;
    padding-right: 187.8px;
  }
  .bindBtn{
    right: 210px;
  }
  .flowerBtn{
    right: 210px;
  }
</style>