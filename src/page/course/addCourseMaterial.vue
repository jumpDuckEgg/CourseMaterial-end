<template>
  <div class="addCourseMaterial">
    <h1>{{ msg }}</h1>
    <div class="courseMaterial">
      <!-- <div>{{courseContent}}</div> -->
      <div class="courseMaterial__item">
        <span>选择一个课程：</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in courseContent"
            :key="item.course_name"
            :label="item.course_name"
            :value="item.course_name">
          </el-option>
        </el-select>
      </div>
      <div class="courseMaterial__item">
        <span>选择添加的资源类型：</span>
         <el-checkbox-group v-model="checkboxGroup" style="margin:10px 0;"  >
            <el-checkbox-button v-for="material in materials" :label="material" :key="material" @change="changeGroup" >{{material}}</el-checkbox-button>
         </el-checkbox-group>
      </div>
      <!-- 课件资源 -->
      <el-row :class="{ courseware:true, coursewareShow : coursewareFlag}"  justify type="flex">
        <el-col :span='2' >课件资源：</el-col>
        <el-col>
          <el-upload
              :data="{
                'token':coursewareToken
              }"
            :action="coursewareUploadUrl"
            :on-preview="handleCoursewarePreview"
            :on-remove="handleCoursewareRemove"
            :before-remove="CoursewarebeforeRemove"
            multiple
            :limit="3"
            :on-success="handleCoursewareSuccess"
            :file-list="CoursewarefileList"
            :before-upload="beforeCoursewareUpload"
            :on-exceed="handleCoursewareExceed"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传ppt文件，且不超过500kb</div> -->
          </el-upload>
        </el-col>
      </el-row>
      <!-- 实验资源 -->

    </div>
  </div>
</template>

<script>
import _ from "lodash";
import api from "../../util/api.js";
export default {
  name: "addCourseMaterial",
  data() {
    return {
      msg: "添加课程资料",
      courseContent: [],
      value: "",
      materials: [
        "课件资源",
        "实验资源",
        "在线测试",
        "视频资源",
        "习题和作业",
        "模拟试题"
      ],
      checkboxGroup: [],
      // 课程资源
      coursewareUploadUrl: "",
      coursewareToken: "",
      CoursewarefileList: [],
      coursewareFlag: false
      // 课程资源
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
  methods: {
    changeGroup() {
      if (_.indexOf(this.checkboxGroup, "课件资源") >= 0) {
        this.coursewareFlag = true;
      } else {
        this.coursewareFlag = false;
      }
    },
    // 课件资源
    handleCoursewareSuccess(response, file, fileList) {
      console.log(file, fileList.length);
    },
    handleCoursewareRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handleCoursewarePreview(file) {
      console.log(file);
    },
    handleCoursewareExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    CoursewarebeforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
      // 文件移除的时候触发的方法
    },
    beforeCoursewareUpload(file) {
      // 当返回false就触发 :before-remove
      // ====  组件配置  ====
      const ispptType = /^(?:application\/vnd.openxmlformats-officedocument.presentationml.presentation|application\/vnd.ms-powerpoint)$/i.test(
        file.type
      );
      if (!ispptType) {
        // ====  组件配置  ====
        this.$message.error(`课件仅支持 PPT 格式!`);
        return false;
      }

      // 获取文件后缀
      let suffix = _.last(_.split(file.name, "."));
      let params = {
        suffix: suffix,
        // ====  组件配置  ====
        type: "ppt/course"
      };
      let that = this;
      return api.getUploadToken(params).then(res => {
        let result = res;
        // ====  组件配置  ====
        that.coursewareToken = result.data;
        that.coursewareUploadUrl = result.upload_url;
        return true;
      });
    }
    // 课程资源
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.courseMaterial {
  width: 100%;
  margin: 10px auto;
  &__item {
    margin: 20px 0;
  }
}
.courseware {
  display: none;
}
.coursewareShow {
  display: flex;
}
</style>