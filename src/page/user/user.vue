<template>
  <div class="userInformation">
    <h1>{{ msg }}</h1>

    <div class="box">
      <el-table border :data="userInfo" style="width: 100%">
        <el-table-column prop="user_id" label="用户ID" width="100">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="150">
        </el-table-column>
        <el-table-column label="用户类型" width="150">
          <template slot-scope="scope">
            {{getUserType(scope.row.userType)}}
          </template>
        </el-table-column>
        <el-table-column label="用户头像" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.userImage" alt="用户头像" style="width:40px;height:40px;">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row)">删除</el-button>
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
    },
    methods: {
        deleteUser(data) {
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let userData = {
                        user_id: data.user_id,
                        username: data.username
                    };
                    api.deleteUser(userData).then(res => {
                        if (res.code == 63) {
                            api.getAllUsers().then(users => {
                                let result = users.data;
                                if (result.code == 6) {
                                }
                                this.userInfo = result.data;
                                this.$message.success("删除用户成功");
                            });
                        }
                        if(res.code == 64){
                          this.$message.error(res.message);
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        getUserType(type) {
            switch (type) {
                case 0:
                    return "学生";
                    break;
                case 1:
                    return "教师";
                    break;
                case 3:
                    return "超级管理员";
                    break;
                default:
                    break;
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.box {
    margin: 10px 0;
}
</style>