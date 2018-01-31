<template>
<el-card class="register">
    <div class="register__icon"><img src="../../static/egg.png" alt=""></div>
    <div class="register__title">网络应用技术资源库后台</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="70px" status-icon class="register__form">
        <el-form-item label="用户名" prop='username'>
             <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
             <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop='checkpassword'>
             <el-input type="password" v-model="form.checkpassword"></el-input>
        </el-form-item>
        <div class="register__button">
            <el-button type="primary" @click="onSubmit('form')">注册</el-button>
            <el-button @click="resetForm('form')">取消</el-button>
        </div>
    </el-form>
</el-card>
</template>

<script>
import api from '../util/api.js'
export default {
  name: "register",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        password: "",
        checkpassword: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 12, message: "长度在6到12个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在6到12个字符", trigger: "blur" }
        ],
        checkpassword: [{ validator: validatePass, trigger: "blur" }]
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
    
          api.userRegister(data).then(data => {
            let result = data.data;
            if (result.code == 5) {
              this.$notify({
                type: "error",
                message: result.message
              });
            }else{
                this.$notify({
                    type:'success',
                    message:result.message
                })
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
.register {
  position: absolute;
  width: 400px;
  height: 400px;

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