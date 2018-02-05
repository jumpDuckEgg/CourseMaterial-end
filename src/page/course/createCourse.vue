<template>
  <div class="createCourse">
    <h1>{{ msg }}</h1>
    <br>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="课程名称:">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课程名称:">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "createCourse",
  data() {
    return {
      msg: "创建课程",
      form: {
          name:''
      }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.createCourse{
    width: 80%;
    margin: auto;
}
</style>