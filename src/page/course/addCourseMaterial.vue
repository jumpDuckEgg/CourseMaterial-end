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
            :value="item.course_id">
          </el-option>
        </el-select>
      </div>
      <!-- <template v-if="value"> -->
        <template v-if="true">
         <div class="courseMaterial__item">
            <span>选择添加的资源类型：</span>
            <el-checkbox-group v-model="checkboxGroup" style="margin:10px 0;"  >
                <el-checkbox-button v-for="material in materials" :label="material" :key="material" @change="changeGroup" >{{material}}</el-checkbox-button>
            </el-checkbox-group>
         </div>
        <!-- 课件资源 -->
        <uploadComponent v-bind="coursewareData" :materialfileList.sync='coursewareData.materialfileList' ></uploadComponent>
        <!-- 实验资源 -->
        <!-- <uploadComponent :title="experimentData.title" :switchFlag="experimentData.switchFlag" :regx='experimentData.regx' :regxType='experimentData.regxType' :uploadFolder='experimentData.uploadFolder'></uploadComponent> -->
        <uploadComponent v-bind="experimentData" :materialfileList.sync='experimentData.materialfileList' ></uploadComponent>
        <!-- 视频资源 -->
        <uploadComponent v-bind="videoData" :materialfileList.sync='videoData.materialfileList' ></uploadComponent>
        <div class="buttonGroup">
            <el-button type="primary" @click="submitFile">保存</el-button>
            <el-button>重置</el-button>
        </div>
         
      </template> 
     
    </div>
  </div>
</template>

<script>
import uploadComponent from "@/components/upload.vue";
import _ from "lodash";
import api from "../../util/api.js";
export default {
  name: "addCourseMaterial",
  components: {
    uploadComponent
  },
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
      coursewareData: {
        title: "课件资源",
        switchFlag: false,
        regx: /^(?:application\/vnd.openxmlformats-officedocument.presentationml.presentation|application\/vnd.ms-powerpoint)$/i,
        regxType: "PPT",
        uploadFolder: "ppt/courseware",
        materialfileList: [],
        limitFlieNumber: 2
      },
      // 实验资源
      experimentData: {
        title: "实验资源",
        switchFlag: false,
        regx: /^(?:application\/msword|application\/pdf)$/i,
        regxType: "word 或 PDF",
        uploadFolder: "doc/experiment",
        materialfileList: [],
        limitFlieNumber: 2
      },
      // 视频资源
      videoData: {
        title: "视频资源",
        switchFlag: false,
        regx: /^(?:video\/mp4)$/i,
        regxType: "MP4",
        uploadFolder: "mp4/video",
        materialfileList: [],
        limitFlieNumber: 2
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
      console.log(this.courseContent);
    });
  },
  methods: {
    changeGroup() {
      if (_.indexOf(this.checkboxGroup, "课件资源") >= 0) {
        this.coursewareData.switchFlag = true;
      } else {
        this.coursewareData.switchFlag = false;
      }
      if (_.indexOf(this.checkboxGroup, "实验资源") >= 0) {
        this.experimentData.switchFlag = true;
      } else {
        this.experimentData.switchFlag = false;
      }
      if (_.indexOf(this.checkboxGroup, "视频资源") >= 0) {
        this.videoData.switchFlag = true;
      } else {
        this.videoData.switchFlag = false;
      }
    },
    submitFile() {
      if (
        this.coursewareData.switchFlag &&
        this.coursewareData.materialfileList.length > 0
      ) {
        this.$message.success("提交成功");
        let coursewares = [];
        this.coursewareData.materialfileList.forEach((value, index) => {
          let data = {
            course_id: this.value,
            courseawre_url: value.response.key,
            courseware_name: value.name
          };
          coursewares.push(data);
        });
        console.log(coursewares);
        api.addCourseware(coursewares).then(res => {
          console.log(res)
        });
      }
    }
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
.buttonGroup {
  // text-align: center;
  // margin-top:100px;
  position: absolute;
  bottom: 100px;
  left: 50%;
}
</style>