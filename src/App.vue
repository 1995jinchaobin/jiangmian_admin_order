<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
  // data () {
  //   return {
  //     timer:''
  //   }
  // },
  // methods: {
  //   warnMessage(){
  //   //   window.setInterval(() => {
  //   //   setTimeout(console.log(1), 0)
  //   // }, 30000)
  //   console.log(12)
  //   }
  // },
  // created(){
  //   this.warnMessage()
    // this.timer = setInterval(this.warnMessage,10000)
  // }
}
</script>

<style>
  @import "./assets/styles/common.css";
</style>
