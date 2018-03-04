<template>
    <el-card class="login">
        <div class="registerBtn">
            <el-button @click="tolink('/register')">注册</el-button>
        </div>
        <div class="login__icon"><img src="../../static/egg.png" alt=""></div>
        <div class="login__title">网络应用技术资源库</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="70px" status-icon class="login__form">
            <el-form-item label="用户名" prop='username'>
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop='password'>
                <el-input type="password" v-model="form.password" ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop='code'>
                <el-row>
                    <el-col :span="10"><el-input  v-model="code" @keyup.enter.native="onSubmit('form')" ></el-input></el-col>
                    <el-col :span="9"><img :src="imgDataURL" alt="" style="border:2px solid black"></el-col>
                    <el-col :span="5"><el-button type="primary"  icon="el-icon-refresh" @click="refreshCode"></el-button></el-col>
                </el-row>
                
               
                
            </el-form-item>
            <div class="login__button">
                <el-button type="primary" @click="onSubmit('form')">登陆</el-button>
                <el-button @click="resetForm('form')">取消</el-button>
            </div>
        </el-form>
    </el-card>
</template>

<script>
import verification from "verification-code";
import api from "@/util/api.js";
export default {
  name: "login",
  data() {
    return {
      code: "",
      vcode: "",
      imgDataURL: "",
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        
       
      }
    };
  },
  created() {
    let result = verification.create();
    this.vcode = result.code; // 随机生成的验证码
    this.imgDataURL = result.dataURL; // 验证码图片的 base64
  },
  methods: {
    refreshCode() {
      let result = verification.create();
      this.vcode = result.code; // 随机生成的验证码
      this.imgDataURL = result.dataURL; // 验证码图片的 base64
    },
    tolink(url) {
      this.$router.push(url);
    },
    onSubmit(formName) {
      // this.$router.push("/");
      this.$refs[formName].validate(valid => {
        if (valid) {
        if(!this.code.trim()){
            this.$message.warning('验证码不能为空');
            return false;
        }
          if (this.code != this.vcode) {
            this.$message.warning("验证码错误，请重新填写");
            let result = verification.create();
            this.vcode = result.code; // 随机生成的验证码
            this.imgDataURL = result.dataURL; // 验证码图片的 base64
            return false;
          }
          let data = {
            username: this.form.username,
            password: this.form.password
          };
          api.userLogin(data).then(data => {
            let result = data;
            if (result.code == 2 || result.code == 3) {
              this.$notify({
                type: "error",
                message: result.message
              });
            } else if (result.code == 65) {
              this.$notify({
                type: "error",
                message:
                  "该用户已被封禁，封禁理由：" +
                  result.data.disUsedMessage +
                  ",解封请联系管理员"
              });
            } else {
              this.$notify({
                type: "success",
                message: result.message
              });
              let data = result.data;
              this.$store.dispatch("UserLogin", data);
              let redirectUrl = decodeURIComponent(
                this.$route.query.redirect || "/"
              );
              //跳转到指定的路由
              this.$router.push({
                path: redirectUrl
              });
            }
          });
        } else {
          console.log("提交失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.login {
  position: absolute;
  width: 400px;
  height: 380px;

  box-sizing: border-box;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &__icon {
    text-align: center;
  }
  &__title {
    text-align: center;
    margin-bottom: 20px;
    font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  &__form {
    width: 350px;
    margin: auto;
  }
  &__button {
    text-align: center;
  }
}
.registerBtn {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>