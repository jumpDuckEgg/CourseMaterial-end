<template>
  <div class="modifyMoniTest">
    <h1>{{ msg }}</h1>
    <div class="">

      <span>选择一个课程：</span>
      <el-select v-model="courseValue" placeholder="请选择">
        <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import api from "../../util/api.js";
export default {
  name: "modifyMoniTest",
  data() {
    return {
      msg: "试题修改",
      courseContent: [],
      courseValue: ""
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
  watch:{
    courseValue:function(newValue,oldValue){
      
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>

</style>