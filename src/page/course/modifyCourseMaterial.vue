<template>
  <div class="modifyCourseMaterial">
    <h1>{{ msg }}</h1>
    <div class="">

        <span>选择一个课程：</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in courseContent"
            :key="item.course_name"
            :label="item.course_name"
            :value="item.course_id">
          </el-option>
        </el-select>
    </div>
    <div class="dataTable">
        <h1 class="dataTable-title">课件资源</h1>
        <el-table :data="coursewares" border style="width: 60%">
            <el-table-column  prop="courseware_id"   label="课件ID"  width="150"></el-table-column>
            <el-table-column  prop="courseware_name"   label="课件名称"  ></el-table-column>
            <el-table-column     label="课件文件" width="150" >
                <template slot-scope="scope">
                    <el-button @click="download(scope.row.courseware_url)" type="text">下载</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button  type="danger" plain @click="removeResource(scope.row)" >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="dataTable">
        <h1 class="dataTable-title">实验资源</h1>
        <el-table :data="experiments" border style="width: 60%">
            <el-table-column  prop="experiment_id"   label="实验ID"  width="150"></el-table-column>
            <el-table-column  prop="experiment_name"   label="实验名称"  ></el-table-column>
            <el-table-column     label="课件文件"  width="150">
                <template slot-scope="scope">
                    <el-button @click="download(scope.row.experiment_url)" type="text">下载</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button  type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="dataTable">
        <h1 class="dataTable-title">习题作业</h1>
        <el-table :data="homeworks" border style="width: 60%">
            <el-table-column  prop="homework_id"   label="习题作业ID"  width="150"></el-table-column>
            <el-table-column  prop="homework_name"   label="习题作业名称"  ></el-table-column>
            <el-table-column     label="习题作业文件"  width="150">
                <template slot-scope="scope">
                    <el-button @click="download(scope.row.homework_url)" type="text">下载</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button  type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="dataTable">
        <h1 class="dataTable-title">模拟试题</h1>
        <el-table :data="tests" border style="width: 60%">
            <el-table-column  prop="test_id"   label="模拟试题ID"  width="150"></el-table-column>
            <el-table-column  prop="test_name"   label="模拟试题名称"  ></el-table-column>
            <el-table-column     label="模拟试题文件"  width="150">
                <template slot-scope="scope">
                    <el-button @click="download(scope.row.test_url)" type="text">下载</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button  type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="dataTable">
        <h1 class="dataTable-title">视频资源</h1>
        <el-table :data="videos" border style="width: 60%">
            <el-table-column  prop="video_id"   label="视频ID"  width="150"></el-table-column>
            <el-table-column  prop="video_name"   label="视频名称"  ></el-table-column>
            <el-table-column     label="视频文件"  width="150">
                <template slot-scope="scope">
                    <el-button @click="download(scope.row.video_url)" type="text">下载</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button  type="danger" plain @click="removeResource(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
      homeworks: []
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
          course_id: this.value
        }
      };
      api.findAllResources(data).then(res => {
        if (res.code == 13) {
          let result = res.data;
          if (result.coursewares) {
            this.coursewares = result.coursewares;
          }
          if (result.experiments) {
            this.experiments = result.experiments;
          }
          if (result.tests) {
            this.tests = result.tests;
          }
          if (result.videos) {
            this.videos = result.videos;
          }
          if (result.homeworks) {
            this.homeworks = result.homeworks;
          }
        }
      });
    }
  },
  methods: {
    download(url) {
      window.location.href = url;
    },
    removeResource(data) {
      console.log(data);
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
              }
              if (result.experiments) {
                this.experiments = result.experiments;
              }
              if (result.tests) {
                this.tests = result.tests;
              }
              if (result.videos) {
                this.videos = result.videos;
              }
              if (result.homeworks) {
                this.homeworks = result.homeworks;
              }
            }
          });
          this.$message.success('删除成功');
        }
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