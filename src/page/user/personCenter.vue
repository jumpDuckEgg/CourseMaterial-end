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
                            <div class="item1-left">{{dataSet.oneText}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="num">
                        {{dataSet.oneNum}}
                    </div>
                    <div class="normal">
                        {{dataSet.oneNum}}
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
                            <div class="item1-left">{{dataSet.twoText}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="num">
                        {{dataSet.twoNum}}
                    </div>
                    <div class="normal">
                        {{dataSet.twoNum}}
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
                            <div class="item1-left">{{dataSet.threeText}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="num">
                        {{dataSet.threeNum}}
                    </div>
                    <div class="normal">
                        {{dataSet.threeNum}}
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
                            <div class="item1-left">{{dataSet.fourText}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item1-right">
                                <span>实时</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="num">
                        {{dataSet.fourNum}}
                    </div>
                    <div class="normal">
                        {{dataSet.fourNum}}
                    </div>
                    <div class="normal">
                        当前分类总记录数
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12" v-if='this.$store.state.user_type==3'>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>最新评论</span>
                      
                        <el-button style="float: right; padding: 3px 0" type="text" @click="tolink('/commentManager')" >更多</el-button>
                    </div>
                    <div class="no-content" v-if="newComment.length==0">
                        暂无信息
                    </div>
                    <el-row v-for="(item,index) in newComment" :key="'comment'+index" class="commentItem">
                        <el-col :span="12" class="commentItem-left">{{item.comment_content}}</el-col>
                        <el-col :span="12" class="commentItem-right">
                            <el-tag type="success">{{item.createdTime|formatDate}}</el-tag>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="12" v-if="this.$store.state.user_type==1">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>最新收藏数</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="tolink('/course/modifyCourse')">更多</el-button>
                    </div>
                    <div class="no-content" v-if="newCourse.length==0">
                        暂无信息
                    </div>
                    <el-row v-for="(item,index) in newCourse" :key="'comment'+index" class="commentItem">
                        <el-col :span="12" class="commentItem-left">{{item.course_name}}</el-col>
                        <el-col :span="12" class="commentItem-right">
                            <el-tag type="danger">{{item.collectNum}}</el-tag>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="12" v-if="this.$store.state.user_type==3">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>最新待审核课程</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="tolink('/course/examineCourse')">更多</el-button>
                    </div>
                    <div class="no-content" v-if="coursePublish.length==0">
                        暂无信息
                    </div>
                    <el-row v-for="(item,index) in coursePublish" :key="'comment'+index" class="commentItem">
                        <el-col :span="12" class="commentItem-left">{{item.course_name}}</el-col>
                        <el-col :span="12" class="commentItem-right">
                            <el-tag type="danger">{{item.createdTime|formatDate}}</el-tag>
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
            newCourse: [],
            dataSet: {
                oneText: "",
                oneNum: 0,
                twoText: "",
                twoNum: 0,
                threeText: "",
                threeNum: 0,
                fourText: "",
                fourNum: 0
            },
            coursePublish:[]
        };
    },
    created() {
        if (this.$store.state.user_type == 1) {
            let data = {
                username: this.$store.state.username
            };
            api.getUserCountNum(data).then(res => {
                if (res.code == 62) {
                    this.dataSet.oneText = "个人课程统计";
                    this.dataSet.twoText = "个人附件统计";
                    this.dataSet.threeText = "评论统计";
                    this.dataSet.fourText = "在线测试统计";
                    this.dataSet.oneNum = res.data.courseNum;
                    this.dataSet.twoNum = res.data.materialNum;
                    this.dataSet.threeNum = res.data.commentNum;
                    this.dataSet.fourNum = res.data.onlineTestNum;
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
        }
        if (this.$store.state.user_type == 3) {
            api.getUserNumData().then(res => {
                if (res.code == 62) {
                    this.dataSet.oneText = "教师用户统计";
                    this.dataSet.twoText = "学生用户统计";
                    this.dataSet.threeText = "待审核课程统计";
                    this.dataSet.fourText = "评价个数统计";
                    this.dataSet.oneNum = res.data.teacherCount;
                    this.dataSet.twoNum = res.data.studentCount;
                    this.dataSet.threeNum = res.data.courseNum;
                    this.dataSet.fourNum = res.data.courseCommentNum;
                    this.loadingFlag = false;
                }
            });
            api.getNewCommentByAdmin().then(res => {
                if (res.code == 21) {
                    this.newComment = res.data;
                }
            });
            api.getCourseByAdmin().then(res=>{
                if(res.code == 8){
                    this.coursePublish = res.data;
                }
            })
        }
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
    }
}
.no-content {
    text-align: center;
    margin: 10px 0;
}
</style>