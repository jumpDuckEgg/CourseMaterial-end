<template>
    <div class="personCenter">
        <div class="title">
            <h1>{{ msg }}</h1>
        </div>

        <el-row :gutter="10" v-loading="loadingFlag">
            <el-col :xs="5" :sm="5" :md="6" :lg="6" :xl="4">
                <div style="height:140px;border-radius:8px;background-color:#31b48c;color:white">
                    <el-row class="item1">
                        <el-col :span="16">
                            <div class="item1-left">个人课程统计</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
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
                        <el-col :span="16">
                            <div class="item1-left">个人附件统计</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
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
            </el-col>
            <el-col :xs="5" :sm="5" :md="6" :lg="6" :xl="4">
                <div style="height:140px;border-radius:8px;background-color:#7438c7;color:white">
                    <el-row class="item1">
                        <el-col :span="16">
                            <div class="item1-left">评论统计</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
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
            </el-col>
            <el-col :xs="5" :sm="5" :md="6" :lg="6" :xl="4">
                <div style="height:140px;border-radius:8px;background-color:#3b67a4;color:white">
                    <el-row class="item1">
                        <el-col :span="16">
                            <div class="item1-left">在线测试统计</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
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
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>最新评论</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="tolink('/course/personComment')">更多</el-button>
                    </div>
                    <el-row v-for="(item,index) in newComment" :key="'comment'+index" class="commentItem">
                        <el-col :span="12" class="commentItem-left">{{item.comment_content}}</el-col>
                        <el-col :span="12" class="commentItem-right">
                            <span>{{item.createdTime|formatDate}}</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>最新收藏数</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="tolink('/course/modifyCourse')">更多</el-button>
                    </div>
                    <el-row v-for="(item,index) in newCourse" :key="'comment'+index" class="commentItem">
                        <el-col :span="12" class="commentItem-left">{{item.course_name}}</el-col>
                        <el-col :span="12" class="commentItem-right">
                            <span>{{item.collectNum}}</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import moment from "moment";
import api from "../../util/api.js";
export default {
    name: "personCenter",
    data() {
        return {
            msg: "个人中心",
            courseNum: 0,
            materialNum: 0,
            commentNum: 0,
            onlineTestNum: 0,
            loadingFlag: true,
            newComment: [],
            newCourse: []
        };
    },
    created() {
        let data = {
            username: this.$store.state.username
        };
        api.getUserCountNum(data).then(res => {
            if (res.code == 62) {
                this.courseNum = res.data.courseNum;
                this.materialNum = res.data.materialNum;
                this.commentNum = res.data.commentNum;
                this.onlineTestNum = res.data.onlineTestNum;
                this.loadingFlag = false;
            }
        });

        let commentData = {
            comment_people: this.$store.state.username,
            people_id: this.$store.state.user_id
        };

        api.getNewComment(commentData).then(res => {
            if (res.code == 21) {
                this.newComment = res.data;
            }
        });

        let courseData = {
            author: this.$store.state.username
        };

        api.getNewCourse(courseData).then(res => {
            if (res.code == 8) {
                this.newCourse = res.data;
            }
        });
    },
    filters: {
        formatDate: function(value) {
            return moment(value).format("YYYY-MM-DD");
        }
    },
    methods: {
        tolink(data) {
            this.$router.push(data);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.title {
    margin: 10px 0;
}
.item1 {
    width: 90%;
    margin: auto;
    padding-top: 10px;

    line-height: 30px;
    &-left {
        text-align: left;
    }
    &-right {
        text-align: right;
        span {
            background-color: rgba(255, 255, 255, 0.5);
            padding: 2px 6px;
            border-radius: 5px;
        }
    }
}
.num {
    width: 90%;
    margin: auto;
    line-height: 50px;
    // font-weight: bold;
    font-size: 35px;
}
.normal {
    width: 90%;
    margin: auto;
    font-size: 15px;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}

.box-card {
    width: 480px;
    margin: 20px 0;
}
.commentItem {
    margin-top: 12px;
    &-left {
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &-right {
        text-align: right;
        span {
            background-color: rgba(190, 187, 187, 0.5);
            padding: 2px 6px;
            border-radius: 5px;
        }
    }
}
</style>