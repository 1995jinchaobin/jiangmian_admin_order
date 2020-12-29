<template>
    <!--删除确认框-->
    <div class="model">
        <div class="alert" id="alert">
            <div @click="cancel()"><span></span></div>
            <div>
                <img :src="code==0 ? succImg : errImg" alt=""><span>{{code==0 ? succMsg : errMsg}}</span>
            </div>
            <!--<div class="bottom" v-if="isSelect==0">-->
                <!--<div class="surePayBtn" @click="sure">是</div>-->
                <!--<div class="cancelBtn"  @click="cancel">否</div>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "SurePay",
        props:{
            //0:成功，1：警告
            code: {
                type: Number,
                required: true
            },
            succMsg: {
                type: String
            },
            errMsg: {
                type: String
            },
        },
        data(){
            return {
                succImg:require('../../../assets/image/user/dagou-2.png'),
                errImg:require('../../../assets/image/user/cuowu-2.png')
            }
        },
        methods: {
            sure(){
                this.$emit('sure')
            },
            cancel(){
                this.$emit('cancel')
            }
        }
    }
</script>

<style scoped>
    /*弹窗样式*/
    .model{
        position: fixed;
        z-index: 99999;
        top: 0;
        height: 100vh;
        width: 100%;
        left: 0;
        background: rgba(0,0,0,0.4);
        text-align: center;
    }
    .alert{
        width: 332px;
        background: #F6F6F6;
        position: relative;
        top: 239px;
        transition: all 0.5s;
        z-index: 999999;
        height: 132px;
        box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20);
        border-radius: 4px;
        margin: 0 auto;
    }
    .alert div:first-child span{
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('../../../assets/image/user/carClose.png') no-repeat center;
        background-size: 100%;
        margin-left: 334px;
        position: relative;
        top: 0px;
    }
    .alert div+div{
        margin: auto 0;
        font-size: 14px;
        align-items: center;
    }
    .alert div+div img{
        width: 22px;
        height: 22px;
        margin-top: 34px;
    }
    .alert:last-child span{
        position: relative;
        top: -5px;
        left: 6px;
    }
    .alert .bottom{
        width: 100%;
        height: 29px;
        display: flex;
        position: absolute;
        bottom: 0px;
    }
    .alert .surePayBtn,.alert .cancelBtn{
        width: 166px;
        height: 29px;
        line-height: 29px;
        text-align: center;
    }
    .alert .surePayBtn{
        background: #FFE135;
    }
    .alert .cancelBtn{
        border-top: 1px solid #979797;
        border-left: 1px solid #979797;
        height: 28px;
        line-height: 28px;
        text-align: center;
    }


</style>