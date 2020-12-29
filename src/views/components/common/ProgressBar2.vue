<template>
    <!--进度条-->
    <div class="model">
        <div class="progressBar">
            <div class="tips">{{content}} {{number}}%</div>
            <div class="barBg"></div>
            <div class="bar" :style="{width:codeNumber+'px'}"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProgressBar",
        props:{
            hasFinshed: Boolean,
            content: {
                type: String,
                required: true,
                default:'加载中'
            },
            fileSize:{
                type:Number,
                required: true,
                default:4
            }
        },
        data(){
            return{
                width:0,
                clock:null,
                codeNumber:0,
                number:0
            }
        },
        methods:{
            changeWidth(){
                let self = this;
                let speed = 480/3/this.fileSize
                self.clock = setInterval(function(){
                    if(this.hasFinshed == true){
                        clearInterval(self.clock);
                        self.number=100;
                        self.codeNumber=480;
                    }else if(self.codeNumber==480){
                        clearInterval(self.clock);
                    }else if(self.codeNumber+speed>=480 && !this.hasFinshed){
                        self.number=99;
                        self.codeNumber=479
                    }else{
                        self.codeNumber = self.codeNumber+speed;
                        self.number=parseInt(self.codeNumber*100/480)
                    }
                },50);
            }
        },
        mounted(){
            this.changeWidth();
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
    }
    .progressBar{
        width: 636px;
        height: 125px;
        background: #FFFFFF;
        border-radius: 10px;
        position: fixed;
        top: calc(50vh - 62px);
        left: calc(50vw - 318px);
        text-align: center;
    }
    .tips{
        font-family: SourceHanSansCN-Medium;
        font-size: 16px;
        color: #000000;
        margin: 39px auto 17px;
    }
    .barBg{
        width: 480px;
        height: 8px;
        margin-left: 78px;
        background: rgba(151,151,151,0.37);
        border-radius: 6px;
    }
    .bar{
        width: 10px;
        height: 8px;
        background: #FFE300;
        border-radius: 4px;
        margin-left: 78px;
        margin-top: -8px;
    }
</style>