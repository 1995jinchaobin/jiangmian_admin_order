<template>
  <div class="home">
    <el-row>
      <el-col :span="leftSpan">
        <div class="headLeft"><h1>后台管理</h1></div>
        <div class="leftNav">
          <el-menu
            :default-openeds="defaultOpenedsArray"
            :default-active="defaultActive"
            class="leftMenu"
            background-color="#001529"
            text-color="#fff"
            active-text-color="#fff"
            :unique-opened="true"
            :router="true"
          >
            <el-submenu
              v-for="(item, index) in menus"
              :index="index + ''"
              :key="item.name + item.key"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  @click="saveNavState(nav.url)"
                  v-for="(nav, navIndex) in item.subSysMenus"
                  :index="nav.url"
                  :key="nav.name + navIndex"
                  >{{ nav.name }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <!-- <div
              class="warnMessage"
              @click="toWarnMessage"
              :style="defaultActive === '/warnMessage' ? styleObject : ''"
            >
              <span>警告</span>
              <el-badge
                :value="warnMessageValue"
                :max="99"
                :hidden="warnMessageValue === 0 ? true : false"
              >
              </el-badge>
            </div> -->
          </el-menu>
        </div>
      </el-col>
      <el-col :span="rightSpan">
        <div class="rightHead">
          <img
            @click="leftShow()"
            class="headIcon"
            src="../../../assets/imgs/home/yincang.png"
          />
          <div class="userInfo">
            <el-link type="primary" @click="userpersonal()">
              <i class="el-icon-user-solid">欢迎你,{{ user.name }}</i>
            </el-link>
            <el-link type="info" @click="quit()">
              <i class="el-icon-s-unfold">注销</i>
            </el-link>
          </div>
        </div>
        <div class="rightContent">
          <router-view />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Cookie from '../../../utils/js/CookieUtil';
import { mapMutations, mapGetters } from "vuex";
export default {
  data () {
    return {
      getWarnMessageParams: {
        page: 1,
        rows: 1
      },
      timer: '',
      warnMessageValue: null,
      styleObject: {
        background: '#1890ff'
      },
      defaultOpenedsArray: [],
      defaultActive: '',
      actions: {
        getCurrentUser: "/system/user/getCurrentUser",
        loginOut: "/system/user/loginOut",
      },
      menus: [
        { name: '用户管理', key: '用户管理', subSysMenus: [{ name: '员工管理', url: '/userManage' }, { name: '客户管理', url: '/customerManage' }] },
        { name: '数据管理', key: '数据管理', subSysMenus: [{ name: '面料管理', url: '/fabricManage' }, { name: '机器管理', url: '/machineManage' }, { name: '配置方案管理', url: '/configuration' }, { name: "IP锁定", url: '/setIp' }] },
        { name: '订单管理', key: '订单管理', subSysMenus: [{ name: '订单管理', url: '/orderManage' }] },
        // {name:'仓储管理',key:'仓储管理',subSysMenus:[{name:'订单管理',url:'/home'}]}
        { name: '仓储管理', key: '仓储管理', subSysMenus: [{ name: '面料管理', url: '/storeManagement' }] }
        // {name:'警戒管理',key:'警戒管理',subSysMenus:[{name:'警戒管理',url:'/warnMessage'}]}
      ],
      isCollapse: false,
      leftSpan: 3,
      name: "",
      rightSpan: 21,
      roleList: []
    };
  },
  created () {
    // this.warnMessage()
    // this.timer = setInterval(() => {
    //   setTimeout(this.warnMessage, 0)
    // }, 30000)
    // this.defaultActive = window.sessionStorage.getItem('defaultActive')
    if (window.sessionStorage.getItem('defaultActive')) {
      this.defaultActive = window.sessionStorage.getItem('defaultActive')
    }
  },
  methods: {
    ...mapMutations(["saveLoginInfo"]),
    saveNavState (defaultActive) {
      window.sessionStorage.setItem('defaultActive', defaultActive)
      this.defaultActive = defaultActive
    },
    goToHome () {
      if (localStorage.getItem("userType") == 2) {
        this.$router.push("/home");
      }
    },
    userpersonal () {
      if (localStorage.getItem("userType") == 2) {
        this.$router.push("/userPersonal");
      }
    },
    //左侧导航的隐藏和显示
    leftShow () {
      if (!this.isCollapse) {
        this.leftSpan = 0;
        this.rightSpan = 24;
      } else {
        this.leftSpan = 3;
        this.rightSpan = 21;
      }
      this.isCollapse = !this.isCollapse;
    },
    quit () {
      this.$confirm("确认退出登录？")
        .then(_ => {
          let userInfo = {};
          this.saveLoginInfo(userInfo);
          Cookie.removeItem("token");
          localStorage.removeItem("userType");
          this.$router.push({
            path: '/'
          })
        })
        .catch(_ => { });
    },
    setPath () {
      if (localStorage.getItem("userType")) {
        if (localStorage.getItem("userType") == 3) {
          this.menus = [
            { name: '数据管理', key: '数据管理', subSysMenus: [{ name: '面料管理', url: '/fabricManage' }] },
            { name: '订单管理', key: '订单管理', subSysMenus: [{ name: '订单管理', url: '/orderManage' }] },
            { name: '仓储管理', key: '仓储管理', subSysMenus: [{ name: '仓库管理', url: '/storeManagement' }] }
          ]
        } else {
          this.menus = [
            { name: '用户管理', key: '用户管理', subSysMenus: [{ name: '员工管理', url: '/userManage' }, { name: '客户管理', url: '/customerManage' }] },
            {
              name: '数据管理', key: '数据管理', subSysMenus: [{ name: '面料管理', url: '/fabricManage' },
              // { name: '浆料管理', url: '/slurry' },//注释
              // { name: '瑕疵管理', url: '/flaw' }, 
              // { name: '机器管理', url: '/machineManage' }, 
              // { name: '配置方案管理', url: '/configuration' }, 
              { name: "IP锁定", url: '/setIp' },
              { name: '数据统计', url: "/statistics" },
                // { name: 'Websocket', url: "/Websocket" }
              ]
            },
            { name: '订单管理', key: '订单管理', subSysMenus: [{ name: '订单管理', url: '/orderManage' }] },
            { name: '仓储管理', key: '仓储管理', subSysMenus: [{ name: '仓库管理', url: '/storeManagement' }, { name: '操作记录', url: '/adminRecord' }] }
          ]
        }
      }
    },
    toWarnMessage () {
      this.$router.push('/warnMessage')
      this.defaultOpenedsArray = []
      window.sessionStorage.setItem('defaultActive', '/warnMessage')
    },
    // 定时请求
    warnMessage () {
      if (this.$route.path === '/') return
      this.$get('/inventory/alarm', {
        ...this.getWarnMessageParams
      }).then((data) => {
        // console.log(data.data.list)
        this.warnMessageValue = data.data.total
        // this.rukuList = data.data.list
        // this.warnMessageList = data.data.list
        // this.total = data.data.total
        // console.log(this.warnMessageValue)
      })
    }
  },
  mounted () {
    this.setPath();
  },
  updated () {
    // console.log(this.$route.path)
    const url = this.$route.path
    const urlS = window.sessionStorage.getItem('defaultActive')
    // console.log()
    if (url !== urlS) {
      window.sessionStorage.setItem('defaultActive', url)
    }
    this.defaultActive = window.sessionStorage.getItem('defaultActive')
  },
  computed: {
    ...mapGetters(["user"])
  }
};
</script>
<style>
.home {
  min-width: 1200px;
  height: 100vh !important;
}

.headLeft {
  height: 64px;
  line-height: 64px;
  background-color: #001529;
  text-align: center;
  color: #fff;
}

.leftNav {
  height: calc(100vh - 64px) !important;
}

.leftMenu {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 64px) !important;
}

.el-menu {
  border-right: solid 0px;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
}

.rightHead {
  height: 64px !important;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
}

.rightContent {
  overflow: auto;
  height: calc(100vh - 64px) !important;
}

.headIcon {
  cursor: pointer;
  height: 30px;
  width: 30px;
  padding-left: 24px;
  padding-top: 16px;
}

.logo {
  cursor: pointer;
  height: 46px;
  padding-top: 10px;
}

.userInfo {
  position: fixed;
  right: 32px;
  top: 20px;
}
.home .leftNav .warnMessage {
  color: #fff;
  /* background: #1890ff; */
  cursor: pointer;
  padding-left: 20px;
}
</style>
