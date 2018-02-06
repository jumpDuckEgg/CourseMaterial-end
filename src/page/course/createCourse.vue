<template>
  <div class="createCourse">
    <h1>{{ msg }}</h1>
    <br>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="课程名称:">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课程描述:">
            <el-input type="textarea" :rows="4" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="头像上传:"> 
            <el-upload
              name='file' 
              :action="imageUrl" 
              :data="{
                token
              }"
              :limit='limitNum'
              :on-exceed='handleExceed'
              :before-upload="beforeImageUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-progress='handleProgress'
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>  
        </el-form-item>
        <el-form-item label="星数:">
           <el-rate v-model="starNum"></el-rate>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import _ from "lodash";
import api from "../../util/api.js";
export default {
  name: "createCourse",
  data() {
    return {
      msg: "创建课程",
      form: {
        name: "",
        description: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      imageUrl: "",
      token: "",
      limitNum:1,
      starNum:0
    };
  },
  methods: {
    handleProgress(){
      console.log("我在上传了")
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList){
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    checkLegalOptions(file) {
      const isLegalImage = /^(?:image\/jpeg|image\/png|image\/jpg)$/i.test(
        file.type
      );
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isLegalImage) {
        this.$message.error(`上传头像图片只能是 JPG 或 PNG 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 1MB!`);
        return false;
      }
      return true;
    },
    beforeImageUpload(file) {
      if (!this.checkLegalOptions(file)) {
        return false;
      }
      // 获取文件后缀
      let suffix = _.last(_.split(file.name, "."));
      let params = {
        suffix: suffix
      };
      let that = this;
      return api.getUploadToken(params).then(res => {
        let result = res.data;
        that.token = result.data;
        that.imageUrl = result.upload_url;
        return true;
      });
      
    },

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.createCourse {
  width: 80%;
  margin: auto;
}
</style>