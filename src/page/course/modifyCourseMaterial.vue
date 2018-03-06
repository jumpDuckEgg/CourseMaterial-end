<template>
    <div class="modifyCourseMaterial">
        <h1>{{ msg }}</h1>
        <div class="">

            <span>选择一个课程：</span>
            <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
                </el-option>
            </el-select>
        </div>
        <div class="dataTable">
            <h1 class="dataTable-title">课件资源</h1>
            <el-table :data="coursewaresData" border style="width: 60%">
                <el-table-column prop="courseware_id" label="课件ID" width="150"></el-table-column>
                <el-table-column prop="courseware_name" label="课件名称"></el-table-column>
                <el-table-column label="课件文件" width="150">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.row.courseware_url)" type="text">下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" :page-size="coursewaresDataSet.pageSize" @current-change="handleCurrentChange" :total="coursewaresDataSet.total" :current-page.sync='coursewaresDataSet.currentPage'>
                </el-pagination>
            </div>
        </div>
        <div class="dataTable">
            <h1 class="dataTable-title">实验资源</h1>
            <el-table :data="experimentsData" border style="width: 60%">
                <el-table-column prop="experiment_id" label="实验ID" width="150"></el-table-column>
                <el-table-column prop="experiment_name" label="实验名称"></el-table-column>
                <el-table-column label="课件文件" width="150">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.row.experiment_url)" type="text">下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" :page-size="experimentsDataSet.pageSize" @current-change="handleCurrentChange1" :total="experimentsDataSet.total" :current-page.sync='experimentsDataSet.currentPage'>
                </el-pagination>
            </div>
        </div>
        <div class="dataTable">
            <h1 class="dataTable-title">习题作业</h1>
            <el-table :data="homeworksData" border style="width: 60%">
                <el-table-column prop="homework_id" label="习题作业ID" width="150"></el-table-column>
                <el-table-column prop="homework_name" label="习题作业名称"></el-table-column>
                <el-table-column label="习题作业文件" width="150">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.row.homework_url)" type="text">下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" :page-size="homeworksDataSet.pageSize" @current-change="handleCurrentChange2" :total="homeworksDataSet.total" :current-page.sync='homeworksDataSet.currentPage'>
                </el-pagination>
            </div>
        </div>
        <div class="dataTable">
            <h1 class="dataTable-title">模拟试题</h1>
            <el-table :data="testsData" border style="width: 60%">
                <el-table-column prop="test_id" label="模拟试题ID" width="150"></el-table-column>
                <el-table-column prop="test_name" label="模拟试题名称"></el-table-column>
                <el-table-column label="模拟试题文件" width="150">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.row.test_url)" type="text">下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" :page-size="testsDataSet.pageSize" @current-change="handleCurrentChange3" :total="testsDataSet.total" :current-page.sync='testsDataSet.currentPage'>
                </el-pagination>
            </div>
        </div>
        <div class="dataTable">
            <h1 class="dataTable-title">视频资源</h1>
            <el-table :data="videosData" border style="width: 60%">
                <el-table-column prop="video_id" label="视频ID" width="150"></el-table-column>
                <el-table-column prop="video_name" label="视频名称"></el-table-column>
                <el-table-column label="视频文件" width="150">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.row.video_url)" type="text">下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center;margin:10px 0;">
                <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" :page-size="videosDataSet.pageSize" @current-change="handleCurrentChange4" :total="videosDataSet.total" :current-page.sync='videosDataSet.currentPage'>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../util/api.js";
export default {
  name: "modifyCourseMaterial",
  data() {
    return {
      msg: "修改课程资料",
      courseContent: [],
      value: "",
      coursewares: [],
      experiments: [],
      tests: [],
      videos: [],
      homeworks: [],
      coursewaresData: [],
      coursewaresDataSet: {
        pageSize: 5,
        total: 0,
        currentPage: 1
      },
      experimentsData: [],
      experimentsDataSet: {
        pageSize: 5,
        total: 0,
        currentPage: 1
      },
      testsData: [],
      testsDataSet: {
        pageSize: 5,
        total: 0,
        currentPage: 1
      },
      videosData: [],
      videosDataSet: {
        pageSize: 5,
        total: 0,
        currentPage: 1
      },
      homeworksData: [],
      homeworksDataSet: {
        pageSize: 5,
        total: 0,
        currentPage: 1
      }
    };
  },
  created() {
    let data = {
      params: {
        author: this.$store.state.username,
        isPublish: "pass"
      },
      options: ["course_name", "course_id"]
    };
    api.findAllCourseByAuthor(data).then(res => {
      this.courseContent = res.data;
    });
  },
  watch: {
    value: function(newValue, oldValue) {
      let data = {
        query: {
          course_id: newValue
        }
      };
      api.findAllResources(data).then(res => {
        if (res.code == 13) {
          let result = res.data;
          if (result.coursewares) {
            this.coursewares = result.coursewares;
            this.coursewaresDataSet.total = this.coursewares.length;
            let offset = 0;
            this.coursewaresData =
              offset + this.coursewaresDataSet.pageSize >=
              this.coursewares.length
                ? this.coursewares.slice(offset, this.coursewares.length)
                : this.coursewares.slice(
                    offset,
                    offset + this.coursewaresDataSet.pageSize
                  );
            this.coursewaresDataSet.currentPage = 1;
          } else {
            this.coursewares = [];
          }
          if (result.experiments) {
            this.experiments = result.experiments;
            this.experimentsDataSet.total = this.experiments.length;
            let offset = 0;
            this.experimentsData =
              offset + this.experimentsDataSet.pageSize >=
              this.experiments.length
                ? this.experiments.slice(offset, this.experiments.length)
                : this.experiments.slice(
                    offset,
                    offset + this.experimentsDataSet.pageSize
                  );
            this.experimentsDataSet.currentPage = 1;
          } else {
            this.experiments = [];
          }
          if (result.tests) {
            this.tests = result.tests;
            this.testsDataSet.total = this.tests.length;
            let offset = 0;
            this.testsData =
              offset + this.testsDataSet.pageSize >= this.tests.length
                ? this.tests.slice(offset, this.tests.length)
                : this.tests.slice(offset, offset + this.testsDataSet.pageSize);
            this.testsDataSet.currentPage = 1;
          } else {
            this.tests = [];
          }
          if (result.videos) {
            this.videos = result.videos;
            this.videosDataSet.total = this.videos.length;
            let offset = 0;
            this.videosData =
              offset + this.videosDataSet.pageSize >= this.videos.length
                ? this.videos.slice(offset, this.videos.length)
                : this.videos.slice(
                    offset,
                    offset + this.videosDataSet.pageSize
                  );
            this.videosDataSet.currentPage = 1;
          } else {
            this.videos = [];
          }
          if (result.homeworks) {
            this.homeworks = result.homeworks;
            this.homeworksDataSet.total = this.homeworks.length;
            let offset = 0;
            this.homeworksData =
              offset + this.homeworksDataSet.pageSize >= this.homeworks.length
                ? this.homeworks.slice(offset, this.homeworks.length)
                : this.homeworks.slice(
                    offset,
                    offset + this.homeworksDataSet.pageSize
                  );
            this.homeworksDataSet.currentPage = 1;
          } else {
            this.homeworks = [];
          }
        }
      });
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      let offset = (val - 1) * this.coursewaresDataSet.pageSize;
      this.coursewaresData =
        offset + this.pageSize >= this.coursewares.length
          ? this.coursewares.slice(offset, this.coursewares.length)
          : this.coursewares.slice(
              offset,
              offset + this.coursewaresDataSet.pageSize
            );
    },
    handleCurrentChange1(val) {
      let offset = (val - 1) * this.experimentsDataSet.pageSize;
      this.experimentsData =
        offset + this.pageSize >= this.experiments.length
          ? this.experiments.slice(offset, this.experiments.length)
          : this.experiments.slice(
              offset,
              offset + this.experimentsDataSet.pageSize
            );
    },
    handleCurrentChange2(val) {
      let offset = (val - 1) * this.homeworksDataSet.pageSize;
      this.homeworksData =
        offset + this.pageSize >= this.homeworks.length
          ? this.homeworks.slice(offset, this.homeworks.length)
          : this.homeworks.slice(
              offset,
              offset + this.homeworksDataSet.pageSize
            );
    },
    handleCurrentChange3(val) {
      let offset = (val - 1) * this.testsDataSet.pageSize;
      this.testsData =
        offset + this.testsDataSet.pageSize >= this.tests.length
          ? this.tests.slice(offset, this.tests.length)
          : this.tests.slice(offset, offset + this.testsDataSet.pageSize);
    },
    handleCurrentChange4(val) {
      let offset = (val - 1) * this.videosDataSet.pageSize;
      this.videosData =
        offset + this.videosDataSet.pageSize >= this.videos.length
          ? this.videos.slice(offset, this.videos.length)
          : this.videos.slice(offset, offset + this.videosDataSet.pageSize);
    },
    download(url) {
      window.location.href = url;
    },
    removeResource(data) {
      this.$confirm("此操作将删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.removeOneResource(data).then(res => {
            if (res.code == 14) {
              let data = {
                query: {
                  course_id: this.value
                }
              };
              api.findAllResources(data).then(res => {
                if (res.code == 13) {
                  let result = res.data;
                  if (result.coursewares) {
                    this.coursewares = result.coursewares;
                    this.coursewaresDataSet.total = this.coursewares.length;
                    let offset = 0;
                    this.coursewaresData =
                      offset + this.coursewaresDataSet.pageSize >=
                      this.coursewares.length
                        ? this.coursewares.slice(
                            offset,
                            this.coursewares.length
                          )
                        : this.coursewares.slice(
                            offset,
                            offset + this.coursewaresDataSet.pageSize
                          );
                    this.coursewaresDataSet.currentPage = 1;
                  }
                  if (result.experiments) {
                    this.experiments = result.experiments;
                    this.experimentsDataSet.total = this.experiments.length;
                    let offset = 0;
                    this.experimentsData =
                      offset + this.experimentsDataSet.pageSize >=
                      this.experiments.length
                        ? this.experiments.slice(
                            offset,
                            this.experiments.length
                          )
                        : this.experiments.slice(
                            offset,
                            offset + this.experimentsDataSet.pageSize
                          );
                    this.experimentsDataSet.currentPage = 1;
                  }
                  if (result.tests) {
                    this.tests = result.tests;
                    this.testsDataSet.total = this.tests.length;
                    let offset = 0;
                    this.testsData =
                      offset + this.testsDataSet.pageSize >= this.tests.length
                        ? this.tests.slice(offset, this.tests.length)
                        : this.tests.slice(
                            offset,
                            offset + this.testsDataSet.pageSize
                          );
                    this.testsDataSet.currentPage = 1;
                  }
                  if (result.videos) {
                    this.videos = result.videos;
                    this.videosDataSet.total = this.videos.length;
                    let offset = 0;
                    this.videosData =
                      offset + this.videosDataSet.pageSize >= this.videos.length
                        ? this.videos.slice(offset, this.videos.length)
                        : this.videos.slice(
                            offset,
                            offset + this.videosDataSet.pageSize
                          );
                    this.videosDataSet.currentPage = 1;
                  }
                  if (result.homeworks) {
                    this.homeworks = result.homeworks;
                    this.homeworksDataSet.total = this.homeworks.length;
                    let offset = 0;
                    this.homeworksData =
                      offset + this.homeworksDataSet.pageSize >=
                      this.homeworks.length
                        ? this.homeworks.slice(offset, this.homeworks.length)
                        : this.homeworks.slice(
                            offset,
                            offset + this.homeworksDataSet.pageSize
                          );
                    this.homeworksDataSet.currentPage = 1;
                  }
                  this.$message.success(res.message);
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.dataTable {
  margin: 10px;
  &-title {
    margin: 10px 0;
  }
}
</style>