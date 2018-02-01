<template>
  <div class="userInformation">
    <h1>{{ msg }}</h1>
    <div>{{userInfo}}</div>
  </div>
</template>

<script>
import api from '../../util/api.js'
export default {
  name: 'userInformation',
  data () {
    return {
      msg: '我是用户信息详情',
      userInfo:''
    }
  },
  created(){
      api.getAllUsers().then((data)=>{
          let result=data.data;
          if(result.code==6){
              
          }
          this.userInfo=result;
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>

</style>