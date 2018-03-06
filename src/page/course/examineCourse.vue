<template>
    <div class="examineCourse" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <h1>{{ msg }}</h1>
        <div>
            <el-table :data="content" style="width:100%;margin:10px 0;" border>
                <el-table-column prop="course_id" label="课程id" width="120" sortable></el-table-column>
                <el-table-column prop="course_name" label="课程名称" width="150"></el-table-column>
                <el-table-column label="课程图片" width="150">
                    <template slot-scope="scope">
                        <img :src="scope.row.courseImage" alt="课程图片" style="width:40px;height:40px;">
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="作者名称" width="150"></el-table-column>
                <el-table-column label="状态" width="180">
                    <template slot-scope="scope">
                        <el-tag :type="publishStatusType(scope.row.isPublish)">{{publishStatus(scope.row.isPublish)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="查看">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleLook(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="审核" width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.isPublish=='examine'?false:true">通过</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" :disabled="scope.row.isPublish=='examine'?false:true">不通过</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :current-page.sync='currentPage'>
                </el-pagination>
            </div>
            <el-dialog title="课程详情" :visible.sync="dialogVisible" center :before-close="handleClose">
                <div class="courseContent">
                    <div class="courseContent_item">课程id：{{courseContent.course_id}}</div>
                    <div class="courseContent_item">课程教师：{{courseContent.author}}</div>
                    <div class="courseContent_item">课程名称：{{courseContent.course_name}}</div>
                    <div class="courseContent_item">课程图片：<img :src="courseContent.courseImage" alt="课程图片" style="width:80px;height:80px;"></div>
                    <div class="courseContent_item">课程描述：{{courseContent.description}}</div>
                    <div class="courseContent_item">课程申请书：
                        <el-button type="text" @click="download(courseContent.course_declaration)">下载</el-button>
                    </div>
                    <div></div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import api from "../../util/api.js";
export default {
  name: "examineCourse",
  data() {
    return {
      msg: "审批课程",
      content: [],
      dialogVisible: false,
      courseContent: {},
      loading: true,
      total: 0,
      currentData: [],
      pageSize: 10,
      currentPage: 1
    };
  },
  computed: {},
  created() {
    api
      .findAllCourse()
      .then(res => {
        this.content = res.data;
        this.total = this.content.length;
        let offset = 0;
        this.currentData =
          offset + this.pageSize >= this.content.length
            ? this.content.slice(offset, this.content.length)
            : this.content.slice(offset, offset + this.pageSize);
        this.currentPage = 1;
      })
      .then(() => {
        this.loading = false;
      });
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      let offset = (val - 1) * this.pageSize;
      this.currentData =
        offset + this.pageSize >= this.content.length
          ? this.content.slice(offset, this.content.length)
          : this.content.slice(offset, offset + this.pageSize);
    },
    publishStatusType: status => {
      switch (status) {
        case "examine":
          return "";
        case "pass":
          return "success";
        case "fail":
          return "danger";
      }
    },
    publishStatus: status => {
      switch (status) {
        case "examine":
          return "等待审核通过";
        case "pass":
          return "审核通过";
        case "fail":
          return "审核失败";
      }
    },
    handleClose(done) {
      done();
    },
    handleLook(index, row) {
      this.dialogVisible = true;
      this.courseContent = row;
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$prompt("请输入整改理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          if (!value) {
            return false;
          }
        },
        inputErrorMessage: "不能为空"
      })
        .then(({ value }) => {
          let data = {
            query: {
              course_id: row.course_id
            },
            options: {
              isPublish: "fail",
              examineMessage: value
            }
          };
          api
            .isPublishCourse(data)
            .then(res => {
              if (res.code == 10) {
                this.$message({
                  type: "success",
                  message: res.message
                });
                return Promise.resolve();
              }
            })
            .then(() => {
              this.loading = true;
              return api.findAllCourse();
            })
            .then(res => {
              this.content = res.data;
              let offset = 0;
              this.currentData =
                offset + this.pageSize >= this.content.length
                  ? this.content.slice(offset, this.content.length)
                  : this.content.slice(offset, offset + this.pageSize);
              this.currentPage = 1;
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消整改"
          });
        });
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.$confirm("此操作将审核通过该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            query: {
              course_id: row.course_id
            },
            options: {
              isPublish: "pass"
            }
          };
          api
            .isPublishCourse(data)
            .then(res => {
              if (res.code == 10) {
                this.$message({
                  type: "success",
                  message: res.message
                });
                return Promise.resolve();
              }
            })
            .then(() => {
              this.loading = true;
              return api.findAllCourse();
            })
            .then(res => {
              this.content = res.data;
              let offset = 0;
              this.currentData =
                offset + this.pageSize >= this.content.length
                  ? this.content.slice(offset, this.content.length)
                  : this.content.slice(offset, offset + this.pageSize);
              this.currentPage = 1;
              this.loading = false;
            });
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "info",
            message: "取消审核"
          });
        });
    },
    download(url) {
      window.location.href = url;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.courseContent {
  &_item {
    margin: 30px 0;
    border: 1px solid #99a9bf;
    padding: 20px;
  }
}
</style>