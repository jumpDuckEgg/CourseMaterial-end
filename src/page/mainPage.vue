<template>
  <div class="mainPage">
    <el-container>
      <el-header class="header">
        <el-row type="flex" justify="space-between">
          <el-col :span="9">
            <el-row type="flex">
              <el-col class="header__icon" :span="3"><img src="../../static/egg.png" alt=""></el-col>
              <el-col class="header__title" :span="10">网络应用技术资源库后台</el-col>

            </el-row>
          </el-col>

          <el-col :span="4" class="header__user">
            <img :src="this.$store.state.userImage" alt="头像" class="header__user-icon">
            <el-button size="mini" type="primary" icon='el-icon-menu' plain class="header__user-btn" @click="logout">注销</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="210px">
          <el-menu default-active="5">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>课程</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1" @click="tolink('/course/createCourse')">添加课程</el-menu-item>
                <el-menu-item index="1-2" @click="tolink('/course/modifyCourse')">修改课程</el-menu-item>
                <el-menu-item index="1-3" @click="tolink('/course/examineCourse')">审核课程</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-4" @click="tolink('/course/addCourseMaterial')">添加课程资料</el-menu-item>
                <el-menu-item index="1-5" @click="tolink('/course/modifyCourseMaterial')">修改课程资料</el-menu-item>
              </el-menu-item-group>
              <!-- <el-submenu index="1-8">
                <template slot="title">选项4</template>
                <el-menu-item index="1-8-1">选项1</el-menu-item>
              </el-submenu> -->
            </el-submenu>
            <el-menu-item index="2" @click="tolink('/commentManager')">
              <i class="el-icon-menu"></i>
              <span slot="title">评价管理</span>
            </el-menu-item>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="3-1" @click="tolink('/user')">用户信息</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>在线测试</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="4-1" @click="tolink('/course/addOnlineTest')">添加在线测试</el-menu-item>
                <el-menu-item index="4-2" @click="tolink('/course/modifyOnlineTest')">修改在线测试</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="5" @click="tolink('/')">
              <i class="el-icon-tickets"></i>
              <span slot="title">个人中心</span>
            </el-menu-item>
            <el-menu-item index="6" @click="tolink('/course/personComment')">
              <i class="el-icon-menu"></i>
              <span slot="title">个人评论</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
    name: "mainPage",
    data() {
        return {

        };
    },
    methods: {
        logout() {
            //清除token
            this.$store.dispatch("UserLogout");
            if (!this.$store.state.token) {
                this.$router.push("/login");
                this.$message({
                    type: "success",
                    message: "登出成功"
                });
            } else {
                this.$message({
                    type: "info",
                    message: "登出失败"
                });
            }
        },
        tolink(data) {
            this.$router.push(data);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.mainPage,
.el-container {
    width: 100%;
    height: 100%;
    min-width: 1200px;
}
.el-header {
    border-bottom: solid 1px #e6e6e6;
}
.el-aside {
    border-right: solid 1px #e6e6e6;
    box-sizing: border-box;
}
ul {
    border-right: 0;
}
.header {
    &__icon {
        position: relative;
        top: 4px;
    }
    &__title {
        line-height: 60px;
    }

    &__user {
        text-align: right;
        &-icon {
            height: 46px;
            width: 46px;
            border-radius: 50%;
            border: solid 2px #e6e6e6;
            box-sizing: border-box;
            margin: 0 10px;
            position: relative;
            top: 7px;
        }
        &-btn {
            position: relative;
            top: -10px;
        }
    }
}
</style>