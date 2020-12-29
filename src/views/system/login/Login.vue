<template>
  <div class="login">
    <!--登录部分-->
    <div class="loginBox">
      <!--logo-->
      <img class="logo" src="../../../assets/imgs/common/logo.png" />
      <!--账号输入-->
      <div class="accountArea">
        <img src="../../../assets/imgs/login/accountImg.png" />
        <input v-model="userName" placeholder="账号" />
      </div>
      <!--密码输入-->
      <div class="passwordArea">
        <img src="../../../assets/imgs/login/passwordImg.png" />
        <input v-model="password" placeholder="密码" type="password" />
      </div>
      <!--登录按钮-->
      <div class="loginBtn" @click="login">登&nbsp;&nbsp;录</div>
    </div>
    <!--版权申明-->
    <!-- <div class="copyright">copyright © 2019 浙江华燕数码印花&nbsp;&nbsp;<span @click="toLink()">浙ICP备16033954</span></div> -->
  </div>
</template>

<script>
import messageUtil from '../../../utils/js/MessageUtil'
import { mapMutations } from 'vuex'
import Cookie from '../../../utils/js/CookieUtil'
export default {
  name: "Login",
  data () {
    return {
      userName: '',
      password: '',
      //是否记住密码
      rember: false
    }
  },
  methods: {
    ...mapMutations([
      'saveLoginInfo'
    ]),
    //登录
    login () {
      //验证
      if (!this.userName) {
        this.$message.error('请输入账号')
        return;
      }
      if (!this.password) {
        this.$message.error('请输入密码')
        return;
      }
      // this.$router.push({path: '/home'})
      let _this = this;
      this.$post('/user/token', {
        account: this.userName,
        password: this.password
      }).then((data) => {
        let userInfo = {
          userId: data.data.id,
          name: data.data.name,
          account: data.data.account,
          roleBtns: '',
          userType: 1
        }
        if (data.data.role == 2 || data.data.role == 3) {
          _this.saveLoginInfo(userInfo);
          Cookie.setItem("token", data.data.token);
          Cookie.setItem('userInfo', userInfo);
          Cookie.setItem("userType", 1);
          localStorage.setItem("userType", data.data.role)
          messageUtil.message.success('登录成功，跳转中')
          const gaoliang = window.sessionStorage.getItem('defaultActive')
          if (gaoliang) {
            _this.$router.push({ path: gaoliang })
          } else {
            _this.$router.push({ path: '/orderManage' })
            window.sessionStorage.setItem("defaultActive", '/orderManage')
          }
        } else {
          this.$message.error('您没有权限，请联系厂长')
        }
      })
    },
    // toLink(){
    //   window.open('http://www.beian.miit.gov.cn');
    // }
  }
}
</script>

<style>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #f0f3f7;
  text-align: center;
}
.login .loginBox {
  width: 368px;
  margin: 0 auto;
  position: relative;
  top: calc(50vh - 250px);
  text-align: center;
}
.login .logo {
  width: 200px;
  height: auto;
  margin-bottom: 9px;
}
.login .title {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}
.login .accountArea,
.login .passwordArea {
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-top: 59px;
  text-align: left;
}
.login .accountArea img,
.login .passwordArea img {
  width: 10.4px;
  margin-left: 14.8px;
}
.login .accountArea input,
.login .passwordArea input {
  width: 320px;
  text-indent: 10px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.25);
}
.login .passwordArea {
  margin-top: 24px;
}
.login .tipArea {
  margin-top: 27px;
  text-align: left;
}
.login .tipArea .forgetPassword {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #1890ff;
  position: relative;
  left: 192px;
  cursor: pointer;
}
.el-checkbox {
  font-weight: normal !important;
  font-family: PingFangSC-Regular !important;
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.65) !important;
}
.login .loginBtn {
  background: #1890ff;
  border-radius: 4px;
  margin-top: 24px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  color: #fff;
}
.login .copyright {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  position: fixed;
  bottom: 27px;
  width: 360px;
  left: calc(50% - 180px);
}
.copyright span {
  cursor: pointer;
}
</style>
