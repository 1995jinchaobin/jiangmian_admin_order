<template>
    <div class="login">
        <div class="loginBg">
        </div>
        <!--登录部分-->
        <div class="loginBox">
            <!--logo-->
            <!-- <img class="logo" src="../../../assets/image/searchPicturePC/logop.png"/> -->
            <div class="title">以图识图</div>
            <!--账号输入-->
            <div class="accountArea">
                <img src="../../../assets/image/searchPicturePC/accountImg.png"/>
                <input v-model="userName" placeholder="账号"/>
            </div>
            <!--密码输入-->
            <div class="passwordArea">
                <img src="../../../assets/image/searchPicturePC/passwordImg.png"/>
                <input v-model="password" placeholder="密码" type="password"/>
            </div>
            <!-- <div class="tipArea">
            <el-checkbox v-model="rember" class="loginAuto">自动登录</el-checkbox>
            <label class="forgetPassword">忘记密码</label>
            </div> -->
            <!--登录按钮-->
            <div class="loginBtn" @click="login">登&nbsp;&nbsp;录</div>
        </div>
        <Loading v-if="showLoading"></Loading>
        <InfoBox  v-if="showInfo==1 || showInfo==0" :code="showInfo" :errMsg="errMsg" :succMsg="succMsg"></InfoBox>
    </div>
</template>

<script>
    import Loading from '../Loading';
    import InfoBox from '../common/InfoBox';
    import messageUtil from '../../../utils/js/MessageUtil'
    import {mapMutations} from 'vuex'
    import Cookie from '../../../utils/js/CookieUtil'
    export default {
        name: "KnowledgePcLogin",
        data(){
            return{
                userName:'',
                password:'',
                //是否记住密码
                rember:false,
                showLoading:false,
                showInfo:-1,
                errMsg:'',
                succMsg:''
            }
        },
        components:{
            Loading,
            InfoBox
        },
        methods:{
            ...mapMutations([
                'saveLoginInfo'
            ]),
            //登录
            login(event){
                // 阻止页面刷新
                event.preventDefault();
                let self = this;
                //验证
                if(!self.userName){
                    self.$message.error('请输入账号')
                    return;
                }
                if(!self.password){
                    self.$message.error('请输入密码')
                    return;
                }else{
                    this.$post('/user/token',{
                        account: this.userName,
                        password: this.password
                    }).then((data)=>{
                        let userInfo={
                        userId:data.data.id,
                        name:data.data.name,
                        account:data.data.account,
                        roleBtns:''
                        }
                        self.saveLoginInfo(userInfo);
                        Cookie.setItem("token",data.data.token);
                        Cookie.setItem('userInfo',userInfo);
                        Cookie.setItem("userType",0);
                        messageUtil.message.success('登录成功，跳转中')
                        self.$router.push({path: '/Knowledge'})
                    })
                }
            }
        }
    }
</script>

<style>
    .login{
        width: 100vw;
        height: 100vh;
        background-color: #f0f3f7;
        text-align: center;
        background-image: url("../../../assets/image/searchPicturePC/loginBg.png");
    }
    .loginBg{
        width: 100%;
        height: 100%;
        opacity: 0.79;
        background: #000000;
        position: absolute;
    }
    .login .loginBox{
        width: 368px;
        margin: 0 auto;
        position: relative;
        top: calc(50vh - 170px);
        text-align: center;
    }
    .login .logo{
        width: 120px;
        height: auto;
        margin-bottom: 9px;
    }
    .login .title{
        font-family: PingFangSC-Medium;
        font-size: 40px;
        color: #FFFFFF;
        letter-spacing: 0;
    }
    .login .accountArea,.login .passwordArea{
        height: 40px;
        line-height: 40px;
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        margin-top: 40px;
        text-align: left;
    }
    .login .accountArea img,.login .passwordArea img{
        width: 10.4px;
        margin-left: 14.8px;
    }
    .login .accountArea input,.login .passwordArea input{
        width: 320px;
        text-indent: 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(0,0,0,0.25);
    }
    .login .passwordArea{
        margin-top: 24px;
    }
    .login .tipArea{
        margin-top: 27px;
        text-align: left;
    }
    .login .tipArea .forgetPassword{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #1890FF;
        position: relative;
        left: 192px;
        cursor: pointer;
    }
    .el-checkbox{
        font-weight: normal !important;
        font-family: PingFangSC-Regular !important;
        font-size: 14px !important;
        color: rgba(0,0,0,0.65) !important;
    }
    .login .loginBtn{
        background: #1890FF;
        border-radius: 4px;
        margin-top: 24px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        color: #fff;
    }
    .login .copyright{
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(0,0,0,0.45);
        position: fixed;
        bottom: 27px;
        width: 230px;
        left:calc(50% - 110px);
    }
    input{
        outline:none;
        border: none;
        background:none;
    }

</style>
