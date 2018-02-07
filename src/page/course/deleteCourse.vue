<template>
  <div class="deleteCourse">
    <h1>{{ msg }}</h1>
    <div>
      <el-table :data="content" style="width:100%">
        <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="课程描述:">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="课程申请书：">
                <a :href="props.row.course_declaration">下载</a>
                <!-- <el-button type="text" @click="download(props.row.course_declaration)">下载</el-button> -->
            </el-form-item>
          </el-form>
          </template>
      </el-table-column>
        <el-table-column prop="course_id" label="课程id"></el-table-column>
        <el-table-column prop="author" label="创建人"></el-table-column>
        <el-table-column prop="course_name" label="课程名称"></el-table-column>
        <el-table-column label="课程图片">
          <template slot-scope="scope">
            <img :src="scope.row.courseImage" alt="课程图片" style="width:40px;height:40px;">
          </template>
        </el-table-column>
       <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "../../util/api.js";
export default {
  name: "deleteCourse",
  data() {
    return {
      msg: "删除课程",
      content: []
    };
  },
  created() {
    api.findAllCourse().then(res => {
      console.log(res.data);
      this.content = res.data;
    });
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    download(url){
      
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.demo-table-expand{
  font-size: 0;
}
.demo-table-expand label{
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item{
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>