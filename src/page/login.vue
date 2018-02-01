<template>
<el-card class="login">
    <div class="login__icon"><img src="../../static/egg.png" alt=""></div>
    <div class="login__title">网络应用技术资源库</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="70px" status-icon class="login__form">
        <el-form-item label="用户名" prop='username'>
             <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
             <el-input type="password" v-model="form.password" @keyup.enter.native="onSubmit('form')"></el-input>
        </el-form-item>
        <div class="login__button">
            <el-button type="primary" @click="onSubmit('form')" >登陆</el-button>
            <el-button @click="resetForm('form')">取消</el-button>
        </div>
    </el-form>
</el-card>
</template>

<script>
import api from "@/util/api.js";
export default {
  name: "login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit(formName) {
      // this.$router.push("/");
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            username: this.form.username,
            password: this.form.password
          };
          api.userLogin(data).then(data => {
            let result = data.data;
            if ( result.code == 2 || result.code == 3) {
              this.$notify({
                type: "error",
                message: result.message
              });
            } else {
              this.$notify({
                type: "success",
                message: result.message
              });
              let token = result.data.token;
              let username = result.data.username;
              this.$store.dispatch("UserLogin", token);
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
  height: 300px;

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
    width: 300px;
    margin: auto;
  }
  &__button {
    text-align: center;
  }
}
</style>