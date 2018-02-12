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
        <!-- 习题作业 -->
        <uploadComponent v-bind="homeworkData" :materialfileList.sync='homeworkData.materialfileList' ></uploadComponent>
        <!-- 模拟试题 -->
        <uploadComponent v-bind="testData" :materialfileList.sync='testData.materialfileList' ></uploadComponent>
        <div class="buttonGroup">
            <el-button type="primary" :loading="submintFlag" @click="submitFile">保存</el-button>
            <el-button :loading="submintFlag" >重置</el-button>
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
      submintFlag:false,
      materials: [
        "课件资源",
        "实验资源",
        // "在线测试",
        "视频资源",
        "习题作业",
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
      },
      // 习题作业
      homeworkData: {
        title: "习题作业",
        switchFlag: false,
        regx: /^(?:application\/msword|application\/pdf)$/i,
        regxType: "word 或 PDF",
        uploadFolder: "doc/homework",
        materialfileList: [],
        limitFlieNumber: 2
      },
      // 模拟试题
      testData: {
        title: "模拟试题",
        switchFlag: false,
        regx: /^(?:application\/msword|application\/pdf)$/i,
        regxType: "word 或 PDF",
        uploadFolder: "doc/test",
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
      if (_.indexOf(this.checkboxGroup, "习题作业") >= 0) {
        this.homeworkData.switchFlag = true;
      } else {
        this.homeworkData.switchFlag = false;
      }
      if (_.indexOf(this.checkboxGroup, "模拟试题") >= 0) {
        this.testData.switchFlag = true;
      } else {
        this.testData.switchFlag = false;
      }
    },
    submitFile() {  
      // 总资源
      let alldata = {};

      // 课件资源
      let coursewares = [];
      if (
        this.coursewareData.switchFlag &&
        this.coursewareData.materialfileList.length > 0
      ) {
        this.coursewareData.materialfileList.forEach((value, index) => {
          let data = {
            course_id: this.value,
            courseware_url: value.response.key,
            courseware_name: value.name
          };
          coursewares.push(data);
        });
        alldata['coursewares'] = coursewares;
      }
      // 实验资源
      let experiments = [];
      if (
        this.experimentData.switchFlag &&
        this.experimentData.materialfileList.length > 0
      ) {
        this.experimentData.materialfileList.forEach((value, index) => {
          let data = {
            course_id: this.value,
            experiment_url: value.response.key,
            experiment_name: value.name
          };
          experiments.push(data);
        });
        alldata['experiments'] = experiments;
      }
      // 视频资源
      let videos = [];
      if (
        this.videoData.switchFlag &&
        this.videoData.materialfileList.length > 0
      ) {
        this.videoData.materialfileList.forEach((value, index) => {
          let data = {
            course_id: this.value,
            video_url: value.response.key,
            video_name: value.name
          };
          videos.push(data);
        });
         alldata['videos'] = videos;
      }
      // 习题作业
      let homeworks = [];
      if (
        this.homeworkData.switchFlag &&
        this.homeworkData.materialfileList.length > 0
      ) { 
        this.homeworkData.materialfileList.forEach((value, index) => {
          let data = {
            course_id: this.value,
            homework_url: value.response.key,
            homework_name: value.name
          };
          homeworks.push(data);
        });
         alldata['homeworks'] = homeworks;
      }
      // 模拟试题
      let tests = [];
      if (
        this.testData.switchFlag &&
        this.testData.materialfileList.length > 0
      ) {
        this.testData.materialfileList.forEach((value, index) => {
          let data = {
            course_id: this.value,
            test_url: value.response.key,
            test_name: value.name
          };
          tests.push(data);
        });
         alldata['tests'] = tests;
      }
      if(Object.keys(alldata).length == 0){
        this.$message.warning("请选择一个文件才能上传");
        return false;
      }
      this.submintFlag = true;
      console.log(alldata)
      api.addResources(alldata).then(res=>{
        if(res.code == 12){
          this.$message.success("添加资源成功");
          this.submintFlag = false;
        }
        
      })
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