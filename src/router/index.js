import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'
Vue.use(Router);


//懒加载
const Login = resolve => {
  require.ensure(['@/page/login.vue'], () => {
    resolve(require('@/page/login.vue'));
  })
}
const MainPage = resolve => {
  require.ensure(['@/page/mainPage.vue'], () => {
    resolve(require('@/page/mainPage.vue'));
  })
}
const Register = resolve => {
  require.ensure(['@/page/register.vue'], () => {
    resolve(require('@/page/register.vue'))
  })
}
const Error404 = resolve => {
  require.ensure(['@/page/error404.vue'], () => {
    resolve(require('@/page/error404.vue'))
  })
}
const UserInformation = resolve => {
  require.ensure(['@/page/user/user.vue'], () => {
    resolve(require('@/page/user/user.vue'))
  })
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: MainPage,
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/register',
      name: 'register',
      component: Register
    }, {
      path: '/user',
      name: 'userInformation',
      component: UserInformation,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      name: 'error',
      component: Error404
    }

  ]
});

//注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  //获取store里面的token
  let token = store.state.token;
  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }// 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      })
    }
  } else {
    next();//没有需要token的就继续下去
  }

})


export default router;
