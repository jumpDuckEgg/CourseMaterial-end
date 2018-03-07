<template>
    <div class="commentManager">
        <h1>{{ msg }}</h1>
        <div style="margin:10px 0;text-align:right">
            <el-input style="width:200px" placeholder="请输入评论人或者评论内容" v-model="keyword"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="sreachComment">搜索</el-button>
        </div>
        <div class="box">
            <el-table border :data="currentData" style="width: 100%">
                <el-table-column prop="comment_id" label="评价ID" sortable width="90">
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
                <el-table-column prop="comment_content" label="评价内容" width="180">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" :disabled="scope.row.isPublish" @click="commentPublish(scope.row)">显示</el-button>
                        <el-button size="mini" type="info" :disabled="!scope.row.isPublish" @click="commentPublish(scope.row)">隐藏</el-button>
                        <el-button size="mini" type="danger" @click="deleteComment(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :current-page.sync='currentPage'>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import api from "../../util/api.js";
export default {
  name: "commentManager",
  data() {
    return {
      msg: "评价管理",
      comments: [],
      total: 0,
      currentData: [],
      pageSize: 10,
      currentPage: 1,
      keyword: "",
      sreachComments: []
    };
  },
  created() {
    api.getAllComment().then(res => {
      if (res.code == 21) {
        this.comments = res.data;
        this.total = this.comments.length;
        let offset = 0;
        this.currentData =
          offset + this.pageSize >= this.comments.length
            ? this.comments.slice(offset, this.comments.length)
            : this.comments.slice(offset, offset + this.pageSize);
        this.currentPage = 1;
      }
    });
  },
  methods: {
    sreachComment() {
     
      let key = this.keyword.trim();
      this.sreachComments = _.filter(this.comments, function(o) {
        return (
          _.includes(o.comment_people, key) ||
          _.includes(o.comment_content, key)
        );
      });

      this.total = this.sreachComments.length;
      let offset = 0;
      this.currentData =
        offset + this.pageSize >= this.sreachComments.length
          ? this.sreachComments.slice(offset, this.sreachComments.length)
          : this.sreachComments.slice(offset, offset + this.pageSize);
      this.currentPage = 1;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      let offset = (val - 1) * this.pageSize;
      this.currentData =
        offset + this.pageSize >= this.comments.length
          ? this.comments.slice(offset, this.comments.length)
          : this.comments.slice(offset, offset + this.pageSize);
      if (this.keyword.trim()&&this.sreachComments.length>0) {
        this.currentData =
          offset + this.pageSize >= this.sreachComments.length
            ? this.sreachComments.slice(offset, this.sreachComments.length)
            : this.sreachComments.slice(offset, offset + this.pageSize);
      }
    },
    filterTag(value, row) {
      return row.comment_type === value;
    },
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
                  this.total = this.comments.length;
                  let offset = 0;
                  this.currentData =
                    offset + this.pageSize >= this.comments.length
                      ? this.comments.slice(offset, this.comments.length)
                      : this.comments.slice(offset, offset + this.pageSize);
                  this.currentPage = 1;
                  this.keyword = "";
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
              this.total = this.comments.length;
              let offset = 0;
              this.currentData =
                offset + this.pageSize >= this.comments.length
                  ? this.comments.slice(offset, this.comments.length)
                  : this.comments.slice(offset, offset + this.pageSize);
              this.currentPage = 1;
              this.keyword = "";
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