<template>
  <div class="userInformation">
    <h1>{{ msg }}</h1>
    <div style="margin:10px 0;text-align:right">
      <el-input style="width:200px" placeholder="请输入用户名" v-model="keyword"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="sreachUser">搜索</el-button>
    </div>
    <div class="box">
      <el-table border :data="currentUserInfo" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div>用户状态：{{usedStatus(props.row.disUsed)}}</div>
            <div v-if="props.row.disUsed">封禁理由：{{props.row.disUsedMessage}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="user_id" sortable label="用户ID" width="90">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120">
        </el-table-column>
        <el-table-column label="用户类型" width="100" prop="userType" :filters="[{ text: '学生', value: 0 }, { text: '教师', value: 1 }, { text: '超级管理员', value: 3 }]" :filter-method="filterTag">
          <template slot-scope="scope">
            {{getUserType(scope.row.userType)}}
          </template>
        </el-table-column>
        <el-table-column label="用户头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.userImage" alt="用户头像" style="width:40px;height:40px;">
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" prop="disUsed" :filters="[{ text: '正常', value: false }, { text: '封禁中', value: true }]" :filter-method="filterDisUsed">
          <template slot-scope="scope">
            <el-tag :type="usedStatusType(scope.row.disUsed)">{{usedStatus(scope.row.disUsed)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="changePassword(scope.row)">修改密码</el-button>
            <el-button size="mini" type="primary" :disabled="scope.row.disUsed" @click="userOpen(scope.row,'dis')">封号</el-button>
            <el-button size="mini" type="success" :disabled="!scope.row.disUsed" @click="userOpen(scope.row,'open')">解除</el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin:10px 0;">
        <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :current-page.sync='currentPage'>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import api from "../../util/api.js";
export default {
    name: "userInformation",
    data() {
        return {
            msg: "用户信息详情",
            userInfo: [],
            total: 0,
            pageSize: 10,
            currentUserInfo: [],
            currentPage: 1,
            keyword: "",
            sreachUsers: []
        };
    },
    created() {
        api.getAllUsers().then(data => {
            let result = data.data;
            if (result.code == 6) {
            }
            this.userInfo = result.data;
            this.total = this.userInfo.length;
            let offset = 0 * this.pageSize;
            this.currentUserInfo =
                offset + this.pageSize >= this.userInfo.length
                    ? this.userInfo.slice(offset, this.userInfo.length)
                    : this.userInfo.slice(offset, offset + this.pageSize);
            this.currentPage = 1;
        });
    },
    methods: {
        sreachUser() {
            let key = this.keyword.trim();

            this.sreachUsers = _.filter(this.userInfo, function(o) {
                return _.includes(o.username, key);
            });

            this.total = this.sreachUsers.length;
            let offset = 0;
            this.currentUserInfo =
                offset + this.pageSize >= this.sreachUsers.length
                    ? this.sreachUsers.slice(offset, this.sreachUsers.length)
                    : this.sreachUsers.slice(offset, offset + this.pageSize);
            this.currentPage = 1;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let offset = (val - 1) * this.pageSize;
            this.currentUserInfo =
                offset + this.pageSize >= this.userInfo.length
                    ? this.userInfo.slice(offset, this.userInfo.length)
                    : this.userInfo.slice(offset, offset + this.pageSize);
            if (this.keyword.trim()) {
                this.currentUserInfo =
                    offset + this.pageSize >= this.sreachUsers.length
                        ? this.sreachUsers.slice(
                              offset,
                              this.sreachUsers.length
                          )
                        : this.sreachUsers.slice(
                              offset,
                              offset + this.pageSize
                          );
            }
        },
        changePassword(data) {
            this.$prompt("请输入新密码", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValidator: value => {
                    if (!value) {
                        return false;
                    }
                },
                inputErrorMessage: "不能为空"
            })
                .then(({ value }) => {
                    let updateData = {
                        user_id: data.user_id,

                        password: value
                    };
                    api.modifyUserPassword(updateData).then(res => {
                        if (res.code == 6) {
                            this.$message.success("修改密码成功");
                        }
                        if (res.code == 64) {
                            this.$message.warning(res.message);
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消修改"
                    });
                });
        },
        filterDisUsed(value, row) {
            return row.disUsed === value;
        },
        filterTag(value, row) {
            return row.userType === value;
        },
        usedStatusType(status) {
            switch (status) {
                case false:
                    return "success";
                    break;
                case true:
                    return "danger";
                    break;
                default:
                    break;
            }
        },
        usedStatus(status) {
            switch (status) {
                case false:
                    return "正常";
                    break;
                case true:
                    return "封禁中";
                    break;
                default:
                    break;
            }
        },
        userOpen(data, type) {
            if (type == "dis") {
                this.$prompt("请输入封禁理由", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputValidator: value => {
                        if (!value) {
                            return false;
                        }
                    },
                    inputErrorMessage: "不能为空"
                })
                    .then(({ value }) => {
                        let updateData = {
                            query: {
                                user_id: data.user_id
                            },
                            update: {
                                disUsed: !data.disUsed,
                                disUsedMessage: value
                            }
                        };
                        api.modifyUser(updateData).then(res => {
                            if (res.code == 6) {
                                this.$message.success(res.message);
                                api.getAllUsers().then(data => {
                                    let result = data.data;
                                    if (result.code == 6) {
                                        this.userInfo = result.data;
                                        this.total = this.userInfo.length;
                                        let offset = 0;
                                        this.currentUserInfo =
                                            offset + this.pageSize >=
                                            this.userInfo.length
                                                ? this.userInfo.slice(
                                                      offset,
                                                      this.userInfo.length
                                                  )
                                                : this.userInfo.slice(
                                                      offset,
                                                      offset + this.pageSize
                                                  );
                                        this.currentPage = 1;
                                        this.keyword = "";
                                    }
                                });
                            }
                            if (res.code == 64) {
                                this.$message.warning(res.message);
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "取消封禁"
                        });
                    });
            } else {
                let updateData = {
                    query: {
                        user_id: data.user_id
                    },
                    update: {
                        disUsed: !data.disUsed
                    }
                };
                api.modifyUser(updateData).then(res => {
                    if (res.code == 6) {
                        this.$message.success(res.message);
                        api.getAllUsers().then(data => {
                            let result = data.data;
                            if (result.code == 6) {
                                this.userInfo = result.data;
                                this.total = this.userInfo.length;
                                let offset = 0 * this.pageSize;
                                this.currentUserInfo =
                                    offset + this.pageSize >=
                                    this.userInfo.length
                                        ? this.userInfo.slice(
                                              offset,
                                              this.userInfo.length
                                          )
                                        : this.userInfo.slice(
                                              offset,
                                              offset + this.pageSize
                                          );
                                this.currentPage = 1;
                                this.keyword = "";
                            }
                        });
                    }
                });
            }
        },
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
                                this.total = this.userInfo.length;
                                let offset = 0 * this.pageSize;
                                this.currentUserInfo =
                                    offset + this.pageSize >=
                                    this.userInfo.length
                                        ? this.userInfo.slice(
                                              offset,
                                              this.userInfo.length
                                          )
                                        : this.userInfo.slice(
                                              offset,
                                              offset + this.pageSize
                                          );
                                this.currentPage = 1;
                                this.keyword = "";
                            });
                        }
                        if (res.code == 64) {
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