<template>
  <div class="userInformation">
    <h1>{{ msg }}</h1>

    <div class="box">
      <el-table border
      :data="userInfo"
      style="width: 100%">
      <el-table-column
        prop="user_id"
        label="用户ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column label="用户类型" width="150">
          <template slot-scope="scope">
              {{scope.row.userType}}
          </template>
        </el-table-column>
      <el-table-column label="用户头像" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.userImage" alt="用户头像" style="width:40px;height:40px;">
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button size="mini"  >更改类型</el-button>
            <el-button size="mini" type="danger" >删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import api from "../../util/api.js";
export default {
  name: "userInformation",
  data() {
    return {
      msg: "用户信息详情",
      userInfo: []
    };
  },
  created() {
    api.getAllUsers().then(data => {
      let result = data.data;
      if (result.code == 6) {
      }
      this.userInfo = result.data;
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.box{
  margin: 10px 0;
}
</style>