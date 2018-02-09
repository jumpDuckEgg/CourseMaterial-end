<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    console.log("\n %c 翻滚吧鸭蛋！%c http://www.fangunbayadan.com/ \n\n", "color:white; background: #35495e; padding:5px 0;border-radius:2px", "color:white; background: #41b883; padding:5px 0;border-radius:2px")
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html,body,#app{
  width: 100%;
  height:100%;
  
}

</style>
