<template>
    <div class="addPicture">
        <!--头部-->
        <div class="header">
            <img src="../../../assets/image/searchPicturePC/addHeaderBg.png"/>
            <!--顶部个人信息-->
            <div class="userInfo">{{userName}}，您好</div>
            <!-- 查询历史页面 -->
            <div class="headerBtn flowerBth" @click="goToHistory">查询历史</div>
            <!--花型管理按钮-->
            <div class="headerBtn" @click="goToList">返回识图</div>
            <!--上传按钮-->
            <div class="uploadBtnArea">
                <div class="searchArea">
                    <div class="searchBg" v-if="!isStartUpload">
                        <input v-model="name" class="searchInput" placeholder="请输入图片名"  @keyup.enter="searchList"/>
                        <img class="searchBtn" src="../../../assets/image/searchPicturePC/searchBtn.png" @click="searchList"/>
                    </div>
                    <div class="uploadBtn"  v-if="!isStartUpload">上传花型</div>
                    <input class="fileInput" type="file"  ref="file" id="file" placeholder="" @change="chooseFile" accept="image/*" multiple="multiple"/>
                </div>
            </div>
            <!--提示-->
            <div class="tips" v-if="!isStartUpload">
                <div class="tipsContent">
                    <div class="tip">您已上传{{uploadTotal}}个花型</div>
                    <div class="loginOut" @click="loginOut">退出登录</div>
                </div>
            </div>
            <!--搜索中-->
            <div class="searchLodingBg" v-if="isStartUpload">
                <div class="searchLoding">
                    正在上传中，请稍后  {{succNum}}/{{totalNum}}
                </div>
                <img class="closeBtn" src="../../../assets/image/searchPicturePC/close.png"/>
            </div>
        </div>
        <div class="content">
            <div class="box">
                <div  class="col" ref="col1">
                    <div :class="{item:true,itemLast:(index+1)%4==0}" v-for="(item,index) in mainMenuList" :key="item.id"  v-if="(index+1)%4==1" @mouseover="showDetailId=item.id" @mouseleave="showDetailId=-1">
                        <img :src="item.customContent"  @click="handleView(item)"/>
                        <div class="imgName" :title="item.picName">{{item.picName}}</div>
                        <div class="deleteArea" v-show="item.id==showDetailId" @click="deleteP(item)">删除</div>
                    </div>
                </div>
                <div  class="col" ref="col1">
                    <div :class="{item:true,itemLast:(index+1)%4==0}" v-for="(item,index) in mainMenuList" :key="item.id"  v-if="(index+1)%4==2" @mouseover="showDetailId=item.id" @mouseleave="showDetailId=-1">
                        <img :src="item.customContent"  @click="handleView(item)"/>
                        <div class="imgName" :title="item.picName">{{item.picName}}</div>
                        <div class="deleteArea" v-show="item.id==showDetailId" @click="deleteP(item)">删除</div>
                    </div>
                </div>
                <div  class="col" ref="col1">
                    <div :class="{item:true,itemLast:(index+1)%4==0}" v-for="(item,index) in mainMenuList" :key="item.id"  v-if="(index+1)%4==3" @mouseover="showDetailId=item.id" @mouseleave="showDetailId=-1">
                        <img :src="item.customContent"  @click="handleView(item)"/>
                        <div class="imgName" :title="item.picName">{{item.picName}}</div>
                        <div class="deleteArea" v-show="item.id==showDetailId" @click="deleteP(item)">删除</div>
                    </div>
                </div>
                <div  class="col" ref="col1"  style="margin-right: 0px">
                    <div :class="{item:true,itemLast:(index+1)%4==0}" v-for="(item,index) in mainMenuList" :key="item.id"  v-if="(index+1)%4==0" @mouseover="showDetailId=item.id" @mouseleave="showDetailId=-1">
                        <img :src="item.customContent"  @click="handleView(item)"/>
                        <div class="imgName" :title="item.picName">{{item.picName}}</div>
                        <div class="deleteArea" v-show="item.id==showDetailId" @click="deleteP(item)">删除</div>
                    </div>
                </div>
            </div>
        </div>
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
        <InfoBox  v-if="showInfo==1 || showInfo==0" :code="showInfo" :errMsg="errMsg" :succMsg="succMsg"></InfoBox>
        <div style="display: none" ref="images"><img ref="image" :src="imgSrc" :alt="imgName"></div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="20%"
                @closed="sure">
            <div style="text-align: left">上传完成，成功上传{{fileList.length}}张图片，</div>
            <div style="text-align: left">失败{{errorImg.length}}张图片，分别是：</div>
            <div style="height: 150px;overflow-y: scroll;margin-top: 10px;">
                <div v-for="(item,index) in errorImg" :key="index" :title="item.name" style="display: flex;height: 35px;align-items:center;width: 100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"><img style="width: 16px;height: 16px;margin-right: 5px;" src="../../../assets/image/searchPicturePC/resultClose.png"/>{{item}}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import InfoBox from '../common/InfoBox';
    import Viewer from 'viewerjs'
    import 'viewerjs/dist/viewer.css'
    import {mapMutations} from 'vuex'
    import messageUtil from '../../../utils/js/MessageUtil'
    import Cookie from '../../../utils/js/CookieUtil'
    import {Message} from 'element-ui';
    export default {
        name: "OwnKnowledgePcAddPicture",
        data(){
            return{
                uploadResult:{},
                requestURL:{
                    // 文件接口
                    file:'/file',
                    // 识图接口
                    pic: '/pic',
                    // 识图结果点击
                    picClick:'/pic/click'
                },
                showInfo:-1,
                errMsg:'',
                succMsg:'',
                page:1,
                pageSize:8,
                total:0,
                name:'',
                mainMenuList: [],
                dataList1: [],
                dataList2: [],
                dataList3: [],
                dataList4: [],
                isStartUpload:false,
                showDetailId:-1,
                userName:'',
                succNum:0,
                totalNum:0,
                imgName:'',
                imgSrc:'',
                uploadTotal:0,
                img:{
                    width:0,
                    height:0
                },
                imgUrlList:[],
                errorImg:[],
                filePass:[],
                index:0,
                fileList:[],
                dialogVisible:false
            }
        },
        components:{
            InfoBox
        },
        methods:{
            setSuccessNum(num){
                this.succNum = num;
            },
            chooseFile(){
                let self = this;
                this.isStartUpload=true;
                let files = this.$refs.file;
                var types = 'jpg,jpeg,png,JPG,PNG,JPEG'
                if(files.files==null){
                    self.errMsg = '请上传选择要上传的文件';
                    self.showInfo = 1;
                    setTimeout(function(){
                        self.showInfo = -1;
                        self.errMsg = '';
                        self.setIsStartUpload();
                    },2000);
                    return;
                }else if(files.files.length>100){
                    self.errMsg = '一次最多上传100张图片';
                    self.showInfo = 1;
                    setTimeout(function(){
                        self.showInfo = -1;
                        self.errMsg = '';
                        self.setIsStartUpload();
                    },2000);
                    return;
                }
                this.totalNum = files.files.length;
                self.filesList = files.files;
                var num=0;
                for(var i =0;i<files.files.length;i++){
                    let file = files.files[i];
                    self.createReader(file, function (w, h, src) {
                        self.img.width=w;
                        self.img.height=h;
                        self.imgUrlList.push(src)
                        if(types.indexOf(file.name.substring(file.name.indexOf('.')+1,file.name.length))<=-1||
                            file.size/1024/1024>2||
                            parseInt(self.img.width)<448||
                            parseInt(self.img.width)>1024||
                            parseInt(self.img.height)>1024||
                            parseInt(self.img.height)<448 ){
                            self.errorImg.push(file.name);
                            if((self.filePass.length+self.errorImg.length)==files.files.length &&self.filePass!=undefined&&self.filePass.length!=0){
                                let fileDetail = self.filePass[self.index]
                                self.createReader(fileDetail, function (w, h, src) {
                                    self.img.width=w;
                                    self.img.height=h;
                                    self.imgUrlList.push(src);
                                    //self.file = file
                                    self.getUpLoadUrl(fileDetail);
                                    self.index++;
                                });
                            }
                            var d =1
                            if(self.filesList.length == self.errorImg.length){
                                self.dialogVisible=true
                            }
                        }else{
                            self.filePass.push(file)
                            if((self.filePass.length+self.errorImg.length)==files.files.length &&self.filePass!=undefined&&self.filePass.length!=0){
                                let fileDetail = self.filePass[self.index]
                                self.createReader(fileDetail, function (w, h, src) {
                                    self.img.width=w;
                                    self.img.height=h;
                                    self.imgUrlList.push(src)
                                    var fileEnd = fileDetail.name.substring(fileDetail.name.indexOf('.'),fileDetail.name.length)
                                    //self.file = file
                                    var fileSize = fileDetail.size/1024/1024;
                                    self.getUpLoadUrl(fileDetail);
                                    self.index++;
                                });
                            }
                        }
                    });
                }

            },
            createReader (file, whenReady) {
                var reader = new FileReader;
                reader.onload = function (evt) {
                    var image = new Image();
                    image.src = evt.target.result;
                    image.onload = function () {
                        var width = this.width;
                        var height = this.height;
                        if (whenReady) whenReady(width, height,evt.target.result);
                    };
                };
                if(file){
                    reader.readAsDataURL(file);
                }
            },
            getUpLoadUrl(file){
                let self = this;
                this.$post(this.requestURL.pic,{
                    file:file
                }).then((res)=>{
                    Message({message:"上传成功！",type:"success"})
                    self.fileList.push(file);
                    self.succNum = self.fileList.length+self.errorImg.length;
                    self.index++;
                    if(self.index-1<self.filePass.length){
                        let file = self.filePass[self.index-1];
                        setTimeout(function(){
                            self.createReader(file, function (w, h, src) {
                                self.img.width=w;
                                self.img.height=h;
                                self.imgUrlList.push(src)
                                var fileEnd = file.name.substring(file.name.indexOf('.'),file.name.length)
                                var fileSize = file.size/1024/1024;
                                self.getUpLoadUrl(file);
                            });
                        },1000)
                    }
                    if(self.filesList.length==self.fileList.length+self.errorImg.length){
                        self.dialogVisible=true
                        self.getList();
                    }
                })
            },
            setImgPath(result){
                this.isStartUpload=false;
                this.page=1;
                this.getList();
                this.$refs.file.value = '';
            },
            // 待修改
            upload(fileUrl,name,file){
                let self = this;
                let formData = new FormData();
                formData.append('name',name);
                formData.append('url',fileUrl);
                let obj = {}
                obj.formdata = formData;
                obj.url = self.all.baseUrl + '/own/userPicSearch/upload';
                self.getData(obj).then(res => {
                    self.num++
                    if(res.data.status==0){
                        let formData = new FormData();
                        formData.append('file',file);
                        let obj2 = {
                            url: self.all.baseUrl + '/pic/upload',
                            formdata: formData
                        }
                        self.getData(obj2).then(res=>{})
                        self.fileList.push(file);
                        self.succNum = self.fileList.length+self.errorImg.length;
                        // console.log(self.index)
                        // console.log(self.filePass.length)
                        self.index++;
                        if(self.index-1<self.filePass.length){
                            let file = self.filePass[self.index-1]
                            self.createReader(file, function (w, h, src) {
                                self.img.width=w;
                                self.img.height=h;
                                self.imgUrlList.push(src)
                                var fileEnd = file.name.substring(file.name.indexOf('.'),file.name.length)
                                //self.file = file
                                var fileSize = file.size/1024/1024
                                self.getUpLoadUrl(file);
                            });
                        }
                    }else if(res.data.status==-95){
                        self.showInfo = 1;
                        self.errMsg = res.data.msg;
                        setTimeout(function(){
                            self.showJump = false;
                            self.errMsg = '';
                            localStorage.clear();
                            self.$router.push({
                                path: '/Knowledge/Pc/piclogin'
                            });
                        },2000);
                    }else{
                        self.errorImg.push(name)
                        self.index++;
                        if(self.index-1<self.filePass.length){
                            let file = self.filePass[self.index-1]
                            self.createReader(file, function (w, h, src) {
                                self.img.width=w;
                                self.img.height=h;
                                self.imgUrlList.push(src)
                                var fileEnd = file.name.substring(file.name.indexOf('.'),file.name.length)
                                //self.file = file
                                var fileSize = file.size/1024/1024
                                self.getUpLoadUrl(file);
                            });
                        }

                    }
                    // console.log(self.filesList.length==self.fileList.length+self.errorImg.length)
                    // console.log(self.filesList.length)
                    // console.log(self.fileList.length+self.errorImg.length)
                    if(self.filesList.length==self.fileList.length+self.errorImg.length){
                        self.dialogVisible=true
                        self.succNum = self.fileList.length+self.errorImg.length;
                        self.getList();
                    }
                });
            },
            goToHistory(){
                this.$router.push({
                    path: '/History'
                })
            },
            getList(){
                let self = this;
                this.$get(this.requestURL.pic,{
                    page:self.page,
                    rows:self.pageSize,
                    key:self.name
                }).then((res)=>{
                    self.dataList1=[];
                    self.dataList2=[];
                    self.dataList3=[];
                    self.dataList4=[];
                    let url = res.wwwFileBaseUrl;
                    res.data.list.forEach(item => {
                        item.customContent = url + item.customContent;
                    });
                    self.mainMenuList = res.data.list
                    self.total=res.data.total;
                    if(self.name==''){
                        self.uploadTotal=res.data.total
                    }
                    // self.mountMenu()
                })
            },
            mountMenu(arg) {
                var temp = this.mainMenuList
                var index = arg || 0
                var refName = this.selectCol()
                if (temp.length > index) {
                    this[refName].push(this.mainMenuList[index])
                    this.$nextTick(() => {
                        this.mountMenu(index + 1)
                    })
                }
            },
            selectCol() {
                var getHeight = (ref) => {
                    return this.$refs[ref].offsetHeight
                }
                var height1 = getHeight('col1')
                var height2 = getHeight('col2')
                var height3 = getHeight('col3')
                var height4 = getHeight('col4')
                switch (Math.min(height1, height2, height3, height4)) {
                    case height1:
                        return 'dataList1'
                        break
                    case height2:
                        return 'dataList2'
                        break
                    case height3:
                        return 'dataList3'
                    case height4:
                        return 'dataList4'
                        break
                    default:
                        break;
                }
            },
            prevClick(){
                if(this.page==1){
                    self.showInfo = 1;
                    self.errMsg =  '已经是第一页了';
                    setTimeout(function(){
                        self.showInfo = -1;
                        self.errMsg = '';
                    },2000);
                }
                self.dataList1=[];
                self.dataList2=[];
                self.dataList3=[];
                self.dataList4=[];
                this.page-=1;
                this.getList();
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
                this.getList();
            },
            currentChange(page){
                this.page=page;
                this.getList();
            },
            sizeChange(pageSize){
                this.pageSize=pageSize;
                this.getList();
            },
            setIsStartUpload(){
                this.isStartUpload=false;
            },
            loginOut(){
                Cookie.removeItem('userInfo');
                Cookie.removeItem('token');
                this.$router.push({
                    path: "/picLogin"
                });
            },
            deleteP(item){
                this.$confirm('确认删除该图片吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let self = this;
                    this.$deletefn(this.requestURL.pic,{
                        ids: item.productId
                    }).then((res)=>{
                        if(res.message == '删除失败'){
                            Message({message:res.message,type:"error"})
                        }else{
                            Message({message:res.message,type:"success"})
                        }
                        self.getList();
                    });
                }).catch(() => {
                });
            },
            goToList(){
                this.$router.push({
                    path: '/Knowledge'
                });
            },
            handleView (item) {
                this.imgName=item.picName
                this.imgSrc = item.customContent
                const viewer = new Viewer(this.$refs.images, {
                    url: 'data-original',
                    hidden: () => {
                        viewer.destroy()
                    },
                    title:true,
                    navbar: false,
                    toolbar: false
                })
                // 模拟点击事件
                this.$refs.image.click();
            },
            searchList(){
                this.page=1;
                this.getList();
            },
            sure(){
                // console.log(this.fileList)
                // console.log(this.errorImg)
                this.dialogVisible=false;
                this.fileList=[];
                this.errorImg=[];
                this.filePass=[];
                this.index=0;
                this.setIsStartUpload();
                this.setImgPath(this.fileList);
                this.setSuccessNum = 0;
                this.setTotalNum = 0;
            }
        },
        mounted(){
            this.getList();
            this.userName = JSON.parse(Cookie.getItem('userInfo')).name;
        }
    }
</script>

<style scoped>
    .addPicture{
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
    .header{
        width: 100%;
        height: auto;
        position: relative;
        text-align: center;
    }
    .header img{
        width: 100%;
    }
    .uploadBtnArea{
        position: absolute;
        top: 12rem;
        width: 100%;
        text-align: center;
    }
    .uploadBtn{
        width: 221px;
        height: 55px;
        background-color: #3f8ff7;
        color: #fff;
        line-height: 55px;
        font-size: 22px;
        font-family: PingFangSC-Regular;
        margin: 0 auto;
        cursor: pointer;
    }
    .tips{
        width: 100%;
        position: absolute;
        top: 17.25rem;
        text-align: center;
    }
    .tipsContent{
        display: flex;
        justify-content:center;
        align-items:center;
    }
    .tip{
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: #FFFFFF;
        position: relative;
        left: -12px;
    }
    .loginOut{
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #1890FF;
        position: relative;
        left: 12px;
        cursor: pointer;
    }
    .fileInput{
        position: absolute;
        width: 221px;
        height: 55px;
        top: 0;
        left: calc(50% + 268px);
        opacity: 0;
        cursor: pointer;
    }
    .content{
        width: 100%;
        margin-top: 57px;
        float: left;
        min-width: 1200px;
    }
    .box{
        margin: 0 auto;
        width: 1184px;
    }
    .col{
        float: left;
        width: 275px;
        margin-right: 28px;
    }
    img{
        width: 100%;
        height: auto;
    }
    .item{
        margin-bottom: 42px;
        width: 275px;
        position: relative;
    }
    .itemLast{
        margin-right: 0px!important;
    }
    .pageBox{
        width: 100%;
        margin-top: 42px;
        float: left;
        margin-bottom: 40px;
        padding-left: calc(30%);
    }
    .searchLodingBg{
        width: 100%;
        height: 163px;
        position: absolute;
        top: 10rem;
        text-align: center;
    }
    .searchLoding{
        width: 978px;
        height: 163px;
        line-height: 163px;
        margin: 0 auto;
        background: rgba(32,31,31,0.41);
        border: 1px solid #FFFFFF;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #fff;
    }
    .closeBtn{
        width: 18px !important;
        height: 18px;
        position: absolute;
        top: 23px;
        left: calc(50% + 444px);
    }
    .deleteArea{
        height: 62px;
        line-height: 62px;
        width: 100%;
        color: #fff;
        opacity: 0.65;
        text-align: center;
        background: #000000;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        position: absolute;
        bottom: 23px;
        transition: all 0.5s;
        cursor: pointer;
    }
    .searchArea{
        width: 980px;
        height: 100%;
        margin: 0 auto;
        display: flex;
    }
    .searchBg{
        width: 759px;
        height: 100%;
        background: #fff;
        display: flex;
        /*justify-content:center;!*x轴对齐方式*!*/
        align-items:center;     /*y轴对滴方式*/
    }
    .searchInput{
        width: 90%;
        height: 55px;
        border: none;
        outline:none;
        text-indent: 2em;
        font-size: 16px;
    }
    .searchBtn{
        width: 30px !important;
        height: 30px !important;
        cursor: pointer;
    }
    .bindBtn{
        right: 210px;
    }
    .imgName{
        width: 100%;
        overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;/*规定段落中的文本不进行换行 */
    }
    .flowerBth{
        right: 210px !important;
    }
</style>