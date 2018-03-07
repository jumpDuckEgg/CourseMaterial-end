<template>
    <div class="modifyUser">
        <h1>{{ msg }}</h1>
        <el-form ref="form" :model="form" style="margin:30px 0" label-width="100px" @submit.native.prevent>
            <el-form-item label="用户名:" prop="username">
                <el-input v-model="form.username" readonly></el-input>
            </el-form-item>
            <el-form-item label="创建时间:" prop="createdTime">
                <el-input v-model="form.createdTime" readonly s></el-input>
            </el-form-item>
            <el-form-item label="类型:" prop="userType">
                <el-input v-model="form.userType" readonly></el-input>
            </el-form-item>
            <el-form-item label="头像上传:" required>
                <el-upload name='file' :action="imageUploadUrl" :data="{
                        token
                      }" :file-list="logofileList" ref="logoUpload" :limit='limitNum' :on-exceed='handleExceed' :before-upload="beforeImageUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-progress='handleProgress' :on-success="handleSuccess" :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="PicturedialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitCourse" :disabled="disabledFlag" :loading="submintFlag">提交</el-button>
                <el-button :loading="submintFlag" :disabled="disabledFlag" @click="resetContent">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import _ from "lodash";
import api from "../../util/api.js";
export default {
  name: "modifyUser",
  data() {
    return {
      msg: "修改个人信息",
      uesrInfo: {},
      imageUploadUrl: "",
      token: "",
      logofileList: [],
      limitNum: 1,
      PicturedialogVisible: false,
      dialogImageUrl: "",
      form: {},
      imageUrl: "",
      disabledFlag: false,
      submintFlag: false
    };
  },
  created() {
    let data = {
      user_id: this.$store.state.user_id
    };
    api.getUserById(data).then(res => {
      if (res.code == 6) {
        this.uesrInfo = res.data;
        this.form.username = res.data.username;
        this.form.userType = res.data.userType;
        this.form.createdTime = res.data.createdTime;
        this.imageUrl = res.data.userImage;
        this.logofileList = [{ name: "课程图片", url: res.data.userImage }];
      }
    });
  },
  methods: {
    // 表单方法
    resetContent() {
      this.form.username = this.uesrInfo.username;
      this.form.userType = this.uesrInfo.userType;
      this.form.createdTime = this.uesrInfo.createdTime;
      this.$refs.logoUpload.clearFiles();
      this.imageUrl = this.uesrInfo.userImage;
      this.logofileList = [{ name: "课程图片", url: this.uesrInfo.userImage }];
    },
    submitCourse() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.imageUrl) {
            this.$message.warning("请选择头像");
            return false;
          }

          let data = {
            userImage: this.imageUrl
          };
          if (this.imageUrl == this.uesrInfo.userImage) {
            this.$message.warning("暂无修改信息");
            return false;
          }
          console.log(this.imageUrl);

          let params = {
            query: {
              user_id: this.$store.state.user_id
            },
            options: data
          };
          this.submintFlag = true;
          let modifyData = {
            query: {
              user_id: this.$store.state.user_id
            },
            update: {
              userImage: this.imageUrl
            }
          };
          api.modifyUser(modifyData).then(res => {
            if (res.code == 6) {
              this.$message.success(res.message);
              let data = {
                user_id: this.$store.state.user_id
              };
              api.getUserById(data).then(res => {
                if (res.code == 6) {
                  this.submintFlag = false;
                  this.uesrInfo = res.data;
                  this.imageUrl = res.data.userImage;
                  this.logofileList = [
                    {
                      name: "课程图片",
                      url: res.data.userImage
                    }
                  ];
                  let logoData = {
                    userImage: this.imageUrl
                  };
                  this.$store.dispatch("UserUpdateLogo", logoData);
                }
              });
            }
          });
        }
      });
    },
    handleExceed(files, fileList) {
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
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>

</style>