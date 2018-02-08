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
const CourseIndex = resolve => {
  require.ensure(['@/page/course/course.vue'], () => {
    resolve(require('@/page/course/course.vue'))
  })
}
const CreateCourse = resolve => {
  require.ensure(['@/page/course/createCourse.vue'], () => {
    resolve(require('@/page/course/createCourse.vue'))
  })
}
const DeleteCourse = resolve => {
  require.ensure(['@/page/course/deleteCourse.vue'], () => {
    resolve(require('@/page/course/deleteCourse.vue'))
  })
}
const ExamineCourse = resolve => {
  require.ensure(['@/page/course/examineCourse.vue'],()=>{
    resolve(require('@/page/course/examineCourse.vue'))
  })
}
const AddCourseMaterial = resolve =>{
  require.ensure(['@/page/course/addCourseMaterial.vue'],()=>{
    resolve(require('@/page/course/addCourseMaterial.vue'))
  })
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: MainPage,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'user',
          name: 'userInformation',
          component: UserInformation,
        },
        {
          path: 'course',
          component: CourseIndex,
          
          children: [
            {
              path: 'createcourse',
              name: 'createCourse',
              component: CreateCourse,
              meta: {
                requiresAuth: true
              },
            },
            {
              path: 'deletecourse',
              name: 'deleteCourse',
              component: DeleteCourse,
              meta: {
                requiresAuth: true
              },
            },
            {
              path: 'examinecourse',
              name: 'examineCourse',
              component: ExamineCourse,
              meta: {
                requiresAuth: true
              },
            },
            {
              path: 'addCourseMaterial',
              name: 'addCourseMaterial',
              component: AddCourseMaterial,
              meta: {
                requiresAuth: true
              },
            }
          ]
        }

      ]
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/register',
      name: 'register',
      component: Register
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
