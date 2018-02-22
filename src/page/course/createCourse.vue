<template>
  <div class="createCourse">
    <h1>{{ msg }}</h1>
    <br>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" @submit.native.prevent>
        <el-form-item label="课程名称:" prop="name">
            <el-input v-model="form.name" ></el-input>
        </el-form-item>
        <el-form-item label="课程描述:" prop="description">
            <el-input type="textarea"  :rows="4" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="课程图片上传:" required> 
            <el-upload
              name='file' 
              :action="imageUploadUrl" 
              :data="{
                token
              }"
              ref="logoUpload"
              :limit='limitNum'
              :on-exceed='handleExceed'
              :before-upload="beforeImageUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-progress='handleProgress'
              :on-success="handleSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>  
        </el-form-item>
        <el-form-item label="星数:">
           <el-rate v-model="starNum" class="star-rate"></el-rate>
        </el-form-item>
        <el-form-item label="课程申报书:" required>
          <el-upload
            name='file'
            drag
             :data="{
                'token':docToken
              }"
            ref="docUpload"
            :action="docUploadUrl"
             :before-upload="beforeDocUpload"
             :limit="limitNum"
             :on-exceed='handleExceed'
              :on-success="handleDocSuccess"
              :on-progress="handleProgress"
              :on-remove="handleDocRemove">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitCourse" :disabled="disabledFlag" :loading="submintFlag">提交</el-button>
          <el-button :loading="submintFlag" :disabled="disabledFlag"  @click="resetContent">重置</el-button>
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
      rules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入一段描述", trigger: "blur" },
          { max: 120, message: "不能超过120字", trigger: "change" }
        ]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      imageUrl: "",
      imageUploadUrl: "",
      token: "",
      submintFlag: false,
      limitNum: 1,
      starNum: 0,
      docToken: "",
      docUrl: "",
      docUploadUrl: "",
      disabledFlag: false
    };
  },
  methods: {
    resetContent() {
      this.$refs.form.resetFields();
      this.$refs.logoUpload.clearFiles();
      this.$refs.docUpload.clearFiles();
      this.imageUrl = "";
      this.docUrl = "";
      this.starNum = 0;
    },
    submitCourse() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.imageUrl) {
            this.$message.warning("请选择课程图片");
            return false;
          }
          if (!this.docUrl) {
            this.$message.warning("请选择课程申请书");
            return false;
          }
          let data = {
            name: this.form.name,
            description: this.form.description,
            imageUrl: this.imageUrl,
            docUrl: this.docUrl,
            starNum: this.starNum,
            author: this.$store.state.username
          };
          this.submintFlag = true;
          api.createCourse(data).then(res => {
            
            this.submintFlag = false;
            if (res.code == 7) {
              this.$refs.form.resetFields();
              this.$refs.logoUpload.clearFiles();
              this.$refs.docUpload.clearFiles();
              this.imageUrl = "";
              this.docUrl = "";
              this.starNum = 0;
              this.$message.success(`${res.message}`);
            } else {
              this.$message.warning(`${res.message}`);
            }
          });
          
        }
      });
    },
    handleProgress() {
      console.log("我在上传了");
      this.disabledFlag = true;
    },
    handleSuccess(response, file, fileList) {
      this.imageUrl = response.key;
      this.disabledFlag = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.imageUrl = "";
      this.disabledFlag = false;
    },
    handleDocSuccess(response, file, fileList) {
      this.docUrl = response.key;
      this.disabledFlag = false;
    },
    handleDocRemove(file, fileList) {
      console.log(file, fileList);
      this.docUrl = "";
      this.disabledFlag = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    checkOptions(file) {
      console.log(file.type);
      const isDocImage = /^(?:application\/msword|application\/pdf|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/i.test(
        file.type
      );
      if (!isDocImage) {
        this.$message.error(`申报书仅支持 word 或 PDF 格式!`);
        return false;
      }
      return true;
    },
    beforeDocUpload(file) {
      if (!this.checkOptions(file)) {
        return false;
      }
      // 获取文件后缀
      let suffix = _.last(_.split(file.name, "."));
      let params = {
        suffix: suffix,
        type: "doc/course"
      };
      let that = this;
      return api.getUploadToken(params).then(res => {
        let result = res;
        that.docToken = result.data;
        that.docUploadUrl = result.upload_url;
        return true;
      });
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
        suffix: suffix,
        type: "image/logo"
      };
      let that = this;
      return api.getUploadToken(params).then(res => {
        let result = res;
        that.token = result.data;
        that.imageUploadUrl = result.upload_url;
        return true;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.createCourse {
  width: 80%;
  margin: auto;
}
.star-rate {
  margin-top: 10px;
}
</style>