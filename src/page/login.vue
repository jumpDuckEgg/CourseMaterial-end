<template>
<el-card class="login">
    <div class="login__icon"><img src="../../static/egg.png" alt=""></div>
    <div class="login__title">网络应用技术资源库</div>
    <el-form ref="form" :model="form"  label-width="60px">
        <el-form-item label="用户名">
             <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
             <el-input v-model="form.password"></el-input>
        </el-form-item>
        <div class="login__button">
            <el-button type="primary" @click="onSubmit">登陆</el-button>
            <el-button>取消</el-button>
        </div>
    </el-form>
</el-card>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        name: "",
        password: ""
      }
    };
  },
  methods:{
      onSubmit(){
          this.$router.push('/')
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
    margin-bottom: 10px;
    font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  &__button{
      text-align: center;
  }
}
</style>