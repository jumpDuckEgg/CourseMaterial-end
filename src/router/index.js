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
const ModifyCourse = resolve => {
  require.ensure(['@/page/course/modifyCourse.vue'], () => {
    resolve(require('@/page/course/modifyCourse.vue'))
  })
}
const ExamineCourse = resolve => {
  require.ensure(['@/page/course/examineCourse.vue'], () => {
    resolve(require('@/page/course/examineCourse.vue'))
  })
}
const AddCourseMaterial = resolve => {
  require.ensure(['@/page/course/addCourseMaterial.vue'], () => {
    resolve(require('@/page/course/addCourseMaterial.vue'))
  })
}
const ModifyCourseMaterial = resolve => {
  require.ensure(['@/page/course/modifyCourseMaterial.vue'], () => {
    resolve(require('@/page/course/modifyCourseMaterial.vue'))
  })
}
const AddOnlineTest = resolve => {
  require.ensure(['@/page/course/addOnlineTest.vue'], () => {
    resolve(require('@/page/course/addOnlineTest.vue'))
  })
}

const ModifyOnlineTest = resolve => {
  require.ensure(['@/page/course/modifyOnlineTest.vue'], () => {
    resolve(require('@/page/course/modifyOnlineTest.vue'))
  })
}

const CommentManager = resolve => {
  require.ensure(['@/page/course/commentManager.vue'], () => {
    resolve(require('@/page/course/commentManager.vue'))
  })
}

const PersonCenter = resolve => {
  require.ensure(['@/page/user/personCenter.vue'], () => {
    resolve(require('@/page/user/personCenter.vue'))
  })
}

const PersonComment = resolve => {
  require.ensure(['@/page/course/personComment.vue'], () => {
    resolve(require('@/page/course/personComment.vue'))
  })
}

const ModifyUser = resolve=>{
  require.ensure(['@/page/user/modifyUser.vue'],()=>{
    resolve(require('@/page/user/modifyUser.vue'))
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
          path: '',
          name: 'personCenter',
          component: PersonCenter,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'user',
          name: 'userInformation',
          component: UserInformation,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'modifyUser',
          name: 'modifyUser',
          component: ModifyUser,
          meta: {
            requiresAuth: true
          },
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
              path: 'modifyCourse',
              name: 'modifyCourse',
              component: ModifyCourse,
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
            },
            {
              path: 'modifyCourseMaterial',
              name: 'modifyCourseMaterial',
              component: ModifyCourseMaterial,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'addOnlineTest',
              name: 'addOnlineTest',
              component: AddOnlineTest,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'modifyOnlineTest',
              name: 'modifyOnlineTest',
              component: ModifyOnlineTest,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'personComment',
              name: 'personComment',
              component: PersonComment,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'commentManager',
          name: 'commentManager',
          component: CommentManager,
          meta: {
            requiresAuth: true
          }
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
