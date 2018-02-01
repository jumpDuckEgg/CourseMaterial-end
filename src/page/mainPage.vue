<template>
  <div class="mainPage">
      <el-container>
        <el-header class="header">
          <el-row   type="flex" justify="space-between">
            <el-col  :span="9">
              <el-row type="flex">
                <el-col class="header__icon" :span="3"><img src="../../static/egg.png" alt=""></el-col>
                <el-col class="header__title" :span="9">网络应用技术资源库后台</el-col>
                
              </el-row> 
            </el-col>
            
            <el-col :span="4" class="header__user">
              <img src="../../static/mylogo.jpg" alt="头像" class="header__user-icon">
              <el-button size="mini"  type="primary" icon='el-icon-menu' plain class="header__user-btn" @click="logout">注销</el-button>
            </el-col>  
          </el-row>
        </el-header>
        <el-container>
          <el-aside width="210px">
                <el-menu
                  default-active="2"
                  >
                  <el-submenu index="1">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span>导航一</span>
                    </template>
                    <el-menu-item-group>
                      <template slot="title">分组一</template>
                      <el-menu-item index="1-1">选项1</el-menu-item>
                      <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                      <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                      <template slot="title">选项4</template>
                      <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu>
                  </el-submenu>
                  <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                  </el-menu-item>
                  <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航三</span>
                  </el-menu-item>
                </el-menu>
          </el-aside>
          <el-main>Main</el-main>
        </el-container>
      </el-container>
  </div>
</template>

<script>
export default {
  name: "mainPage",
  data() {
    return {};
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