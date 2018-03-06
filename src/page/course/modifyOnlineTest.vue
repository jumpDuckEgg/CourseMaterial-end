<template>
    <div class="modifyOnlineTest">
        <h1>{{ msg }}</h1>
        <div class="courseMaterial">
            <div class="courseMaterial__item">
                <span>选择一个课程：</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
                    </el-option>
                </el-select>
            </div>
            <div class="courseMaterial__item">
                <el-table :data="tableData" border style="width: 90%">
                    <el-table-column prop="onlineTest_id" label="测试ID" width="100">
                    </el-table-column>
                    <el-table-column prop="onlineTest_title" label="测试名称" width="180">
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template slot-scope="scope">
                            <el-tag :type="publishStatusType(scope.row.onlineTest_publish)">{{publishStatus(scope.row.onlineTest_publish)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="详情" width="100">
                        <template slot-scope="scope">
                            <el-button type="success" @click="checkChoice(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button plain @click="modifyChoice(scope.row)">修改</el-button>
                            <el-button type="danger" plain @click="removeChoice(scope.row)">删除</el-button>
                            <el-button type="primary" :disabled="scope.row.onlineTest_publish" plain @click="isPublish(scope.row.onlineTest_id,scope.row.onlineTest_publish)">上线</el-button>
                            <el-button type="info" :disabled="!scope.row.onlineTest_publish" plain @click="isPublish(scope.row.onlineTest_id,scope.row.onlineTest_publish)">下线</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align:center;margin:10px 0;">
                    <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :current-page.sync='currentPage'>
                    </el-pagination>
                </div>
                <el-dialog title="内容详情" :visible.sync="dialogChoiceVisible">
                    <div class="choiceQuestion" v-for="(item,index) in choices" :key="index" style="border:1px solid #eee;margin-bottom:10px;padding:20px;">
                        <el-row type="flex" justify style="margin-bottom:20px;">
                            <el-col :span="20">{{index+1}}.{{item.title}}</el-col>
                            <el-col :span="4" style="text-align:right;">({{item.score}}分)</el-col>
                        </el-row>
                        <el-row type="flex" justify>
                            <el-col :span="24/item.optionsData.length" v-for="(selectItem,selectIndex) in item.optionsData" :key="selectIndex">{{selectItem.id}}.{{selectItem.options}}</el-col>
                        </el-row>
                    </div>
                </el-dialog>
                <el-dialog title="选择题" :visible.sync="modifyChoiceVisible" :before-close='resetChoice'>
                    <div class="courseMaterial__item">
                        <div class="courseMaterial__item-title">测试名称：
                            <el-input class="courseMaterial__item-input" v-model="choicesData.onlineTest_title"></el-input>
                        </div>
                        <div>
                            <el-button @click="addNewSubjectFun()">添加选择题</el-button>
                        </div>
                        <el-card class="box" v-for="(item,index) in choicesData.onlineTest_content" :key="index">
                            <el-form ref="form" label-width="100px">
                                <el-form-item label="选题：">
                                    <el-button type="text" @click="deleteSubjectFun(index)">删除选题</el-button>
                                </el-form-item>
                                <el-form-item label="标题：" prop="name">
                                    <el-input placeholder="未填写" v-model="item.title"></el-input>
                                </el-form-item>
                                <el-form-item label="正确答案：">
                                    <el-input placeholder="未填写" disabled v-model="item.answer"></el-input>
                                    请在以下选项中，勾选出正确答案
                                </el-form-item>
                                <el-form-item label="分值：">
                                    <el-input v-model="item.score" @keyup.native='scoreFun(index)' type="number" min="1" max="100" placeholder="未填写"></el-input>
                                </el-form-item>
                                <el-form-item label="选项：">
                                    <div class="box__item-select-element" v-for="(selectItem,selectIndex) in item.optionsData" :key="selectIndex">
                                        <el-radio v-model="item.answer" :label="selectItem.id">{{selectItem.id}}</el-radio>
                                        <el-input v-model="selectItem.options" placeholder="未填写" style="width:300px;margin-left:10px;"></el-input>
                                        <div class="box__item-select-element_left">
                                            <el-button type="text" @click='addNewOptionsFun(index,selectIndex)' v-if="selectIndex==item.optionsData.length-1">添加选项</el-button>
                                            <el-button type="text" v-if="selectIndex==item.optionsData.length-1&&selectIndex>0" @click='deleteOptionsFun(index,selectIndex)'>删除选项</el-button>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item>

                                </el-form-item>
                            </el-form>
                        </el-card>
                        <div class="submitBtn">
                            <el-button type="primary" @click="submitOnlineTest">提交</el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../util/api.js";
export default {
  name: "modifyOnlineTest",
  data() {
    return {
      msg: "修改在线测试",
      courseContent: [],
      value: "",
      tableData: [],
      dialogChoiceVisible: false,
      modifyChoiceVisible: false,
      choices: [],
      choicesData: {},
      total: 0,
      currentData: [],
      pageSize: 10,
      currentPage: 1
    };
  },
  created() {
    let data = {
      params: {
        author: this.$store.state.username,
        isPublish: "pass"
      },
      options: ["course_name", "course_id"]
    };
    api.findAllCourseByAuthor(data).then(res => {
      this.courseContent = res.data;
    });
  },
  watch: {
    value: function(newValue, oldValue) {
      let data = {
        query: {
          course_id: newValue
        }
      };
      api.findOnlineTest(data).then(res => {
        if (res.code == 16) {
          this.tableData = res.data;
          this.total = this.tableData.length;
          let offset = 0;
          this.currentData =
            offset + this.pageSize >= this.tableData.length
              ? this.tableData.slice(offset, this.tableData.length)
              : this.tableData.slice(offset, offset + this.pageSize);
          this.currentPage = 1;
        }
      });
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      let offset = (val - 1) * this.pageSize;
      this.currentData =
        offset + this.pageSize >= this.tableData.length
          ? this.tableData.slice(offset, this.tableData.length)
          : this.tableData.slice(offset, offset + this.pageSize);
    },
    //   删除在线测试
    removeChoice(choiceData) {
      this.$confirm("确认删除该测试, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            onlineTest_id: choiceData.onlineTest_id,
            course_id: this.value
          };

          api
            .removeOnlineTest(data)
            .then(res => {
              if (res.code == 18) {
                let data = {
                  query: {
                    course_id: this.value
                  }
                };
                this.$message.success(res.message);
                return api.findOnlineTest(data);
              }
            })
            .then(res => {
              if (res.code == 16) {
                this.tableData = res.data;
                this.total = this.tableData.length;
                let offset = 0;
                this.currentData =
                  offset + this.pageSize >= this.tableData.length
                    ? this.tableData.slice(offset, this.tableData.length)
                    : this.tableData.slice(offset, offset + this.pageSize);
                this.currentPage = 1;
              }
            });
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },
    //   重置修改
    resetChoice() {
      let data = {
        query: {
          course_id: this.value
        }
      };
      api.findOnlineTest(data).then(res => {
        if (res.code == 16) {
          this.tableData = res.data;
        }
      });
      this.modifyChoiceVisible = false;
    },
    //   提交修改
    submitOnlineTest() {
      let data = {
        query: {
          onlineTest_id: this.choicesData.onlineTest_id
        },
        options: {
          onlineTest_title: this.choicesData.onlineTest_title,
          onlineTest_content: this.choicesData.onlineTest_content
        }
      };
      api
        .publishOnlineTest(data)
        .then(res => {
          if (res.code == 17) {
            let data = {
              query: {
                course_id: this.value
              }
            };
            this.$message.success(res.message);
            return api.findOnlineTest(data);
          }
        })
        .then(res => {
          if (res.code == 16) {
            this.modifyChoiceVisible = false;
            this.tableData = res.data;
            this.total = this.tableData.length;
            let offset = 0;
            this.currentData =
              offset + this.pageSize >= this.tableData.length
                ? this.tableData.slice(offset, this.tableData.length)
                : this.tableData.slice(offset, offset + this.pageSize);
            this.currentPage = 1;
          }
        });
    },
    // 删除选题
    deleteSubjectFun: function(index) {
      this.choicesData.onlineTest_content.splice(index, 1);
    },
    // 新增选题
    addNewSubjectFun: function() {
      let subjectDataMes = {};
      subjectDataMes.id = this.choicesData.onlineTest_content.length + 1;
      subjectDataMes.title = "";
      subjectDataMes.answer = "";
      subjectDataMes.score = 10;
      subjectDataMes.optionsData = [
        {
          id: "A",
          options: ""
        }
      ];
      this.choicesData.onlineTest_content.push(subjectDataMes);
    },
    // 新增选项
    addNewOptionsFun: function(subjectIndex, opdtIndex) {
      var optionsDataMes = {};
      optionsDataMes.id = String.fromCharCode(64 + (opdtIndex + 2)); //将id从数字转换成大写字母.
      optionsDataMes.options = "";
      var subjectDataMes = this.choicesData.onlineTest_content[subjectIndex]
        .optionsData;
      subjectDataMes.push(optionsDataMes);
    },
    // 删除选项
    deleteOptionsFun: function(subjectIndex, opdtIndex) {
      var subjectDataMes = this.choicesData.onlineTest_content[subjectIndex]
        .optionsData;
      subjectDataMes.splice(opdtIndex, 1);
    },
    // 判断每个题目的分值不能小于零且不能大于一百
    scoreFun: function(index) {
      if (this.question[index].score < 0) {
        this.question[index].score = 10;
        this.$message.warning(
          '选题"' + this.question[index].title + '"的分值不能小于零'
        );
      } else if (this.question[index].score > 100) {
        this.question[index].score = 10;
        this.$message.warning(
          '选题"' + this.question[index].title + '"的分值不能大于一百'
        );
      }
    },
    //   修改在线测试
    modifyChoice(choicesData) {
      this.modifyChoiceVisible = true;
      this.choicesData = choicesData;
    },
    //   上下线在线测试
    isPublish(onlineTest_id, onlineTest_publish) {
      let data = {
        query: {
          onlineTest_id: onlineTest_id
        },
        options: {
          onlineTest_publish: !onlineTest_publish
        }
      };
      api
        .publishOnlineTest(data)
        .then(res => {
          if (res.code == 17) {
            let data = {
              query: {
                course_id: this.value
              }
            };
            this.$message.success(res.message);
            return api.findOnlineTest(data);
          }
        })
        .then(res => {
          if (res.code == 16) {
            this.tableData = res.data;
            this.total = this.tableData.length;
            let offset = 0;
            this.currentData =
              offset + this.pageSize >= this.tableData.length
                ? this.tableData.slice(offset, this.tableData.length)
                : this.tableData.slice(offset, offset + this.pageSize);
            this.currentPage = 1;
          }
        });
    },
    //   查看测试题目
    checkChoice(data) {
      this.dialogChoiceVisible = true;
      this.choices = data.onlineTest_content;
    },

    publishStatusType: status => {
      switch (status) {
        case false:
          return "danger";
        case true:
          return "success";
      }
    },
    publishStatus: status => {
      switch (status) {
        case false:
          return "未发布";
        case true:
          return "发布中";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.courseMaterial {
  width: 100%;
  margin: 10px auto;
  &__item {
    margin: 20px 0;
    &-title {
      line-height: 40px;
      text-align: left;
      margin: 10px 0;
    }
    &-input {
      width: 300px;
    }
  }
}
.box {
  margin: 10px 0;

  &__item {
    margin-bottom: 10px;
    &-title {
      line-height: 40px;
      text-align: left;
    }
    &-content {
      line-height: 40px;
      text-align: left;
      padding-left: 10px;
    }
    &-select {
      &-title {
        margin-bottom: 10px;
      }
      &-element {
        margin-bottom: 10px;
        &_left {
          margin-left: 50px;
        }
      }
    }
  }
}
.submitBtn {
  text-align: center;
  margin-top: 20px;
}
</style>