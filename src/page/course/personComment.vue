<template>
    <div class="personComment">
        <h1>{{ msg }}</h1>

        <div class="box">
            <el-table border :data="comments" style="width: 100%">
                <el-table-column prop="comment_id" label="评价ID" width="100">
                </el-table-column>
                <el-table-column prop="comment_people" label="评价人" width="130">
                </el-table-column>
                <el-table-column label="评价人头像" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.people_image" alt="用户头像" style="width:40px;height:40px;">
                    </template>
                </el-table-column>
                <el-table-column label="评价类型" width="100">
                    <template slot-scope="scope">
                        <el-tag>{{commentType(scope.row.comment_type)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type_id" label="评价类型ID" width="130">
                </el-table-column>
                <el-table-column label="评价时间" width="180">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.createdTime|formatDate}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="comment_content" label="评价内容" width="180">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" :disabled="scope.row.isPublish" @click="commentPublish(scope.row)">上架</el-button>
                        <el-button size="mini" type="info" :disabled="!scope.row.isPublish" @click="commentPublish(scope.row)">下架</el-button>
                        <el-button size="mini" type="danger" @click="deleteComment(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import api from "../../util/api.js";
export default {
    name: "personComment",
    data() {
        return {
            msg: "个人评价11111",
            comments: []
        };
    },
    created() {
        api.getAllComment().then(res => {
            if (res.code == 21) {
                this.comments = res.data;
            }
        });
    },
    methods: {
        deleteComment(data) {
            this.$confirm("确认删除该评价, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let updateData = {
                        user_id: this.$store.state.user_id,
                        comment_id: data.comment_id
                    };
                    api.deleteComment(updateData).then(res => {
                        if (res.code == 23) {
                            this.$message.success(res.message);
                            api.getAllComment().then(res => {
                                if (res.code == 21) {
                                    this.comments = res.data;
                                }
                            });
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.$message({
                        type: "info",
                        message: "取消删除"
                    });
                });
        },
        commentType(type) {
            switch (type) {
                case "course":
                    return "课程";
                    break;
                case "videos":
                    return "视频";
                    break;
                case "test":
                    return "模拟试题";
                    break;
                case "homework":
                    return "习题作业";
                    break;
                default:
                    break;
            }
        },
       
    },
    filters: {
        formatDate: function(value) {
            return moment(value).format("MMMM Do YYYY");
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.box {
    margin: 10px 0;
}
</style><template>
    <div class="commentManager">
        <h1>{{ msg }}</h1>

        <div class="box">
            <el-table border :data="comments" style="width: 100%">
                <el-table-column prop="comment_id" label="评价ID" width="100">
                </el-table-column>
                <el-table-column prop="comment_people" label="评价人" width="130">
                </el-table-column>
                <el-table-column label="评价人头像" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.people_image" alt="用户头像" style="width:40px;height:40px;">
                    </template>
                </el-table-column>
                <el-table-column label="评价类型" width="100">
                    <template slot-scope="scope">
                        <el-tag>{{commentType(scope.row.comment_type)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type_id" label="评价类型ID" width="130">
                </el-table-column>
                <el-table-column label="评价时间" width="180">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.createdTime|formatDate}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="comment_content" label="评价内容" >
                </el-table-column>
               
            </el-table>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import api from "../../util/api.js";
export default {
    name: "personComment",
    data() {
        return {
            msg: "评价管理",
            comments: []
        };
    },
    created() {
        let data = {
            comment_people: this.$store.state.username,
            people_id: Number(this.$store.state.user_id)
        }
        api.getAllCommentById(data).then(res => {
            if (res.code == 21) {
                this.comments = res.data;
            }
        });
    },
    methods: {

        commentType(type) {
            switch (type) {
                case "course":
                    return "课程";
                    break;
                case "videos":
                    return "视频";
                    break;
                case "test":
                    return "模拟试题";
                    break;
                case "homework":
                    return "习题作业";
                    break;
                default:
                    break;
            }
        },
        commentPublish(data) {
            let updateData = {
                comment_id: data.comment_id,
                isPublish: !data.isPublish
            };
            api.modifyCommentPublish(updateData).then(res => {
                if (res.code == 22) {
                    this.$message.success(res.message);
                    api.getAllComment().then(res => {
                        if (res.code == 21) {
                            this.comments = res.data;
                        }
                    });
                }
            });
        }
    },
    filters: {
        formatDate: function(value) {
            return moment(value).format("MMMM Do YYYY");
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.box {
    margin: 10px 0;
}
</style>