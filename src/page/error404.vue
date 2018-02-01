<template>
  <div class="error404">
      <div class="error404__content">
          <div class="error404__content-img">
          </div>
          <div class="error404__content-message">
             咦~页面不见了~
          </div>
          <div class="error404__content-messageV2">
            请核对您输入的页面地址是否正确哦~
          </div>
          <el-button type="primary">
              返回首页
          </el-button>
      </div>
  </div>
</template>

<script>
export default {
  name: "404",
  data() {
    return {
      msg: "404"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.error404 {
    text-align: center;
  &__content {
    width: 600px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    &-img {
      width: 350px;
      height: 300px;
      background-image: url("../../static/404.jpg");
      background-repeat: no-repeat;
      background-size: cover;
      margin: auto;
    }
    &-message {
        margin: 10px auto;
     
      font-size: 2.5rem;
    }
    &-messageV2 {
        margin: 10px auto;
      
      font-size: 1.3rem;
    }

  }
}
</style>