import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/page/login'
import mainPage from '@/page/mainPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: mainPage
    },{
      path:'/login',
      name:'login',
      component:login
    }
  ]
})
