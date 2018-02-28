<template>
    <div class="personCenter">
        <div class="title">
            <h1>{{ msg }}</h1>
        </div>

        <el-row :gutter="10">
            <el-col :xs="5" :sm="5" :md="6" :lg="6" :xl="4">
                <div style="height:140px;border-radius:8px;background-color:#31b48c;color:white">
                    <el-row class="item1">
                        <el-col :span="10">
                            <div class="item1-left">个人课程统计</div>
                        </el-col>
                        <el-col :span="8" :offset="6">
                            <div class="item1-right"><span>实时</span></div>
                        </el-col>
                    </el-row>
                    <div class="num">
                            {{courseNum}}
                    </div>
                    <div class="normal">
                        {{courseNum}}
                    </div>
                    <div class="normal">
                        当前分类总记录数
                    </div>
                </div>
            </el-col>
         <el-col :xs="5" :sm="5" :md="6" :lg="6" :xl="4">
                <div style="height:140px;border-radius:8px;background-color:#38a1f2;color:white">
                    <el-row class="item1">
                        <el-col :span="10">
                            <div class="item1-left">个人附件统计</div>
                        </el-col>
                        <el-col :span="8" :offset="6">
                            <div class="item1-right"><span>实时</span></div>
                        </el-col>
                    </el-row>
                    <div class="num">
                            {{materialNum}}
                    </div>
                    <div class="normal">
                        {{materialNum}}
                    </div>
                    <div class="normal">
                        当前分类总记录数
                    </div>
                </div>
            </el-col><el-col :xs="5" :sm="5" :md="6" :lg="6" :xl="4">
                <div style="height:140px;border-radius:8px;background-color:#7438c7;color:white">
                    <el-row class="item1">
                        <el-col :span="10">
                            <div class="item1-left">评论统计</div>
                        </el-col>
                        <el-col :span="8" :offset="6">
                            <div class="item1-right"><span>实时</span></div>
                        </el-col>
                    </el-row>
                    <div class="num">
                            {{commentNum}}
                    </div>
                    <div class="normal">
                        {{commentNum}}
                    </div>
                    <div class="normal">
                        当前分类总记录数
                    </div>
                </div>
            </el-col><el-col :xs="5" :sm="5" :md="6" :lg="6" :xl="4">
                <div style="height:140px;border-radius:8px;background-color:#3b67a4;color:white">
                    <el-row class="item1">
                        <el-col :span="10">
                            <div class="item1-left">在线测试统计</div>
                        </el-col>
                        <el-col :span="8" :offset="6">
                            <div class="item1-right"><span>实时</span></div>
                        </el-col>
                    </el-row>
                    <div class="num">
                            {{onlineTestNum}}
                    </div>
                    <div class="normal">
                        {{onlineTestNum}}
                    </div>
                    <div class="normal">
                        当前分类总记录数
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "personCenter",
    data() {
        return {
            msg: "个人中心",
            courseNum:0,
            materialNum:0,
            commentNum:0,
            onlineTestNum:0
        };
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.title {
    margin: 10px 0;
}
.item1{
    width: 90%;
    margin:auto;
    padding-top: 10px;
    
    line-height: 30px;
    &-left{
        text-align: left;
    }
    &-right{
        text-align: right;
        span{
            background-color: rgba(255, 255, 255, 0.5);
            padding:2px 6px;
            border-radius: 5px;
        }
    }
}
.num{
    width: 90%;
    margin:auto;
    line-height: 50px;
    // font-weight: bold;
    font-size: 35px;
}
.normal{
    width: 90%;
    margin:auto;
    font-size: 15px;
}
</style>