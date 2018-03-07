<template>
    <div class="commentManager">
        <h1>{{ msg }}</h1>
        <div style="margin:10px 0;text-align:right">
            <el-input style="width:200px" placeholder="请输入评论人" v-model="keyword"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="sreachComment">搜索</el-button>
        </div>
        <div class="box">
            <el-table border :data="currentComments" style="width: 100%">

                <el-table-column prop="comment_id" label="评价ID" sortable width="100">
                </el-table-column>
                <el-table-column prop="comment_people" label="评价人" width="100">
                </el-table-column>
                <el-table-column label="评价人头像" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.people_image" alt="用户头像" style="width:40px;height:40px;">
                    </template>
                </el-table-column>
                <el-table-column label="评价类型" width="100" prop="comment_type" :filters="[{ text: '课程', value: 'course' }, { text: '视频', value: 'videos' }, { text: '模拟试题', value: 'test' }, { text: '习题作业', value: 'homework' }, { text: '实验资源', value: 'experiment' }]" :filter-method="filterTag">
                    <template slot-scope="scope">
                        <el-tag>{{commentType(scope.row.comment_type)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type_id" label="评价类型ID" width="100">
                </el-table-column>
                <el-table-column label="评价时间" width="180">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.createdTime|formatDate}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="comment_content" label="评价内容">
                </el-table-column>

            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :current-page='1'>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import moment from "moment";
import api from "../../util/api.js";
export default {
    name: "personComment",
    data() {
        return {
            msg: "评价管理",
            comments: [],
            total: 0,
            currentComments: [],
            pageSize: 10,
            keyword: "",
            sreachComments: []
        };
    },
    created() {
        let data = {
            comment_people: this.$store.state.username,
            people_id: Number(this.$store.state.user_id)
        };
        api.getAllCommentById(data).then(res => {
            if (res.code == 21) {
                this.comments = res.data;
                this.total = this.comments.length;
                let offset = 0;
                this.currentComments =
                    offset + this.pageSize >= this.comments.length
                        ? this.comments.slice(offset, this.comments.length)
                        : this.comments.slice(offset, offset + this.pageSize);
            }
        });
    },
    methods: {
        sreachComment() {
            let rule = new RegExp(this.keyword.trim());

            this.sreachComments = _.filter(this.comments, function(o) {
                return rule.test(o.comment_people);
            });

            this.total = this.sreachComments.length;
            let offset = 0;
            this.currentComments =
                offset + this.pageSize >= this.sreachComments.length
                    ? this.sreachComments.slice(
                          offset,
                          this.sreachComments.length
                      )
                    : this.sreachComments.slice(offset, offset + this.pageSize);
            this.currentPage = 1;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let offset = (val - 1) * this.pageSize;
            this.currentComments =
                offset + this.pageSize >= this.comments.length
                    ? this.comments.slice(offset, this.comments.length)
                    : this.comments.slice(offset, offset + this.pageSize);
            if (this.keyword.trim()) {
                this.currentComments =
                    offset + this.pageSize >= this.sreachComments.length
                        ? this.sreachComments.slice(
                              offset,
                              this.sreachComments.length
                          )
                        : this.sreachComments.slice(
                              offset,
                              offset + this.pageSize
                          );
            }
        },
        filterTag(value, row) {
            return row.comment_type === value;
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
                case "experiment":
                    return "实验资源";
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
            return moment(value).format("YYYY-MM-DD");
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