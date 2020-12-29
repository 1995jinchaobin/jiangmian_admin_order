<template>
    <div class="usertab">
        <div @click="back" class="backBox">
            <img src="../../assets/image/shopping/backicon.png" alt="">
            <span>返回</span>
        </div>
        <!-- 个人中心下的选项卡 -->
        <ul class="listBox">
            <li :style="{color: arr[index].color}" v-for="(item,index) in arr" :key="index" @click="select(index)">{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'Usertab',
    props: {
        arr: Array
    },
    data(){
        return {
            
        }
    },
    methods: {
        back(){
            this.$router.push({
                path: '/User'
            });
        },
        select(index){
            for(var i=0;i<this.arr.length;i++){
                this.arr[i].color = '#8d8d8d';
            }
            this.arr[index].color = "#333";
            this.$emit('setUserIndex',index);
        }
    },
    mounted(){
        
    }
}
</script>
<style scoped>
    .usertab{
        position: relative;
        margin: 0 14.375rem;
    }
    .backBox{
        position: absolute;
        top: .5rem;
        left: 0;
        color: #585858;
        font-size: 1rem;
        display: flex;
        align-items: center;
        cursor: default;
    }
    .backBox img{
        display: block;
        margin-right: .5rem;
        width: .5625rem;
    }
    .listBox{
        display: flex;
        justify-content: center;
        background: #eee;
        margin-top: 1.25rem;
    }
    .listBox li{
        position: relative;
        padding: 0 3.25rem;
        font-size: 1.875rem;
        font-weight: normal;
        cursor: default;
    }
    .listBox li:after{
        content: '';
        position: absolute;
        width: 1px;
        height: 1.5rem;
        background: #8d8d8d;
        right: 0;
        top: calc(50% - .75rem);
    }
    .listBox li:last-child:after{
        display: none;
    }
</style>