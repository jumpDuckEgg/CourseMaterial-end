<template>
  <div class="modifyMoniExam">
    <h1>{{ msg }}</h1>
    <div>
      <span>选择一个课程：</span>
      <el-select v-model="courseValue" placeholder="请选择">
        <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
        </el-option>
      </el-select>
    </div>
    <div class="tableBox">
      <el-table :data="moniExams" border style="width: 100%">
        <el-table-column prop="moniExam_id" label="试卷ID" width="100" sortable>
        </el-table-column>
        <el-table-column prop="moniExam_title" label="试卷名称" width="130">
        </el-table-column>
        <el-table-column prop="course_id" label="关联课程ID" width="100">
        </el-table-column>
        <el-table-column label="试卷状态" width="110" prop="moniExam_isPublish" :filters="[{ text: '发布中', value: true }, { text: '下架中', value: false }]" :filter-method="filterMoniExamStatus">
          <template slot-scope="scope">
            <el-tag type="primary">{{moniExamStatus(scope.row.moniExam_isPublish)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="watchMoniExam(scope.row)" type="primary">查看</el-button>
            <el-button @click="modifyMoniExam(scope.row)">修改</el-button>
            <el-button @click="moniExamPublish(scope.row,'yes')" type="success" :disabled="scope.row.moniExam_isPublish">发布</el-button>
            <el-button @click="moniExamPublish(scope.row,'no')" type="info" :disabled="!scope.row.moniExam_isPublish">下线</el-button>
            <el-button type="danger" @click="deleteMoniExam(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="试卷预览" :visible.sync="watchDialogVisible" width="60%">
      <template v-if="radioMoniTest.length>0">
        <div>选择题：</div>
        <div v-for="(item,index) in radioMoniTest" :key="'radio'+index" class="radioBox">
          <div class="radioBox-title">{{index+1}}.{{item.moniTest_title}}
            <span> ({{item.moniTest_score}}分)</span>
          </div>
          <el-row>
            <el-row type="flex" justify>
              <el-col :span="24/item.moniTest_optionsData.length" v-for="(selectItem,selectIndex) in item.moniTest_optionsData" :key="selectIndex">{{selectItem.id}}.{{selectItem.options}}</el-col>
            </el-row>
          </el-row>
          <div>答案：{{item.moniTest_answer}}</div>
          <div>解析：{{item.moniTest_analysis}}</div>
        </div>
      </template>
      <template v-if="checkMoniTest.length>0">
        <div>多选题：</div>
        <div v-for="(item,index) in checkMoniTest" :key="'check'+index" class="radioBox">
          <div class="radioBox-title">{{index+1}}.{{item.moniTest_title}}
            <span> ({{item.moniTest_score}}分)</span>
          </div>
          <el-row>
            <el-row type="flex" justify>
              <el-col :span="24/item.moniTest_optionsData.length" v-for="(selectItem,selectIndex) in item.moniTest_optionsData" :key="selectIndex">{{selectItem.id}}.{{selectItem.options}}</el-col>
            </el-row>
          </el-row>
          <div>答案：{{item.moniTest_answer}}</div>
          <div>解析：{{item.moniTest_analysis}}</div>
        </div>
      </template>
      <template v-if="judgeMoniTest.length>0">
        <div class="radioBox-title">判断题：</div>
        <div v-for="(item,index) in judgeMoniTest" :key="'judge'+index" class="radioBox">
          <div>{{index+1}}.{{item.moniTest_title}}
            <span> ({{item.moniTest_score}}分)</span>
          </div>
          <div>答案：{{item.moniTest_answer}}</div>
          <div>解析：{{item.moniTest_analysis}}</div>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="试卷修改" :visible.sync="modifyDialogVisible" width="60%">
      <div class="exam-title">
        添加试卷标题：
        <el-input placeholder="添加试卷标题" v-model="title" style="width:250px;"></el-input>
      </div>
      <div style="margin:30px 0;">
        <el-transfer v-model="transferData" :props="{
      key: 'moniTest_id',
      label: 'moniTest_title' 
    }" :data="moniTests" :button-texts="['撤销', '添加']" :titles="['试题库','添加试题']" filterable @change="changeTransfer">
          <div slot="left-footer"></div>

          <div slot="right-footer" style="margin:5px;">
            <el-button size="small" @click="reviewMoniExam">预览</el-button>
            <el-button size="small" @click="createdExam">生成试卷</el-button>
          </div>
        </el-transfer>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import _ from "lodash";
import api from "../../util/api.js";
export default {
    name: "modifyMoniExam",
    data() {
        return {
            msg: "试卷修改",
            courseValue: "",
            courseContent: [],
            moniExams: [],
            watchDialogVisible: false,
            modifyDialogVisible: false,
            radioMoniTest: [],
            checkMoniTest: [],
            judgeMoniTest: [],
            moniTests: [],
            title: "",
            transferData: [],
            moniExam_id: 0,
            tempData: {}
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
        courseValue: function(newValue, oldValue) {
            let data = {
                query: {
                    course_id: newValue
                }
            };
            api.getAllMoniExamByOptions(data).then(res => {
                if (res.code == 32) {
                    this.moniExams = res.data;
                }
            });
            let data2 = {
                courseid: newValue
            };
            api.getAllMoniTestByOptions(data2).then(res => {
                if (res.code == 28) {
                    let radioMoniTest = _.filter(res.data, function(o) {
                        return o.moniTest_type == "radio";
                    });
                    let checkMoniTest = _.filter(res.data, function(o) {
                        return o.moniTest_type == "check";
                    });
                    let judgeMoniTest = _.filter(res.data, function(o) {
                        return o.moniTest_type == "judge";
                    });
                    this.moniTests = _.concat(
                        radioMoniTest,
                        checkMoniTest,
                        judgeMoniTest
                    );
                }
            });
        }
    },
    methods: {
        deleteMoniExam(data) {
            this.$confirm("此操作将下架该试卷, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let removeData = {
                        moniExam_id: data.moniExam_id,
                        course_id: data.course_id
                    };
                    api.deleteMoniExam(removeData).then(res => {
                        if (res.code == 34) {
                            this.$message.success(res.message);
                            let data = {
                                query: {
                                    course_id: this.courseValue
                                }
                            };
                            api.getAllMoniExamByOptions(data).then(res => {
                                if (res.code == 32) {
                                    this.moniExams = res.data;
                                }
                            });
                        }
                    });
                })
                .catch(err => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        moniExamPublish(data, type) {
            if (type == "yes") {
                let updateData = {
                    query: {
                        moniExam_id: data.moniExam_id
                    },
                    options: {
                        moniExam_isPublish: !data.moniExam_isPublish
                    }
                };
                api.modifyMoniExamByOptions(updateData).then(res => {
                    if (res.code == 33) {
                        this.$message.success(res.message);
                        let data = {
                            query: {
                                course_id: this.courseValue
                            }
                        };
                        api.getAllMoniExamByOptions(data).then(res => {
                            if (res.code == 32) {
                                this.moniExams = res.data;
                            }
                        });
                    }
                });
            }
            if (type == "no") {
                this.$confirm("此操作将下架该试卷, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let updateData = {
                            query: {
                                moniExam_id: data.moniExam_id
                            },
                            options: {
                                moniExam_isPublish: !data.moniExam_isPublish
                            }
                        };
                        api.modifyMoniExamByOptions(updateData).then(res => {
                            if (res.code == 33) {
                                this.$message.success(res.message);
                                let data = {
                                    query: {
                                        course_id: this.courseValue
                                    }
                                };
                                api.getAllMoniExamByOptions(data).then(res => {
                                    if (res.code == 32) {
                                        this.moniExams = res.data;
                                    }
                                });
                            }
                        });
                    })
                    .catch(err => {
                        this.$message({
                            type: "info",
                            message: "已取消操作"
                        });
                    });
            }
        },
        createdExam() {
            if (!this.title.trim()) {
                this.$message.warning("标题不能为空");
                return false;
            }
            if (this.transferData.length == 0) {
                this.$message.warning("试题不能为空");
                return false;
            }
            this.$confirm("此操作将生成试卷, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let createdData = {
                        moniExam_title: this.title,
                        moniExam_content: this.moniExamData,
                        moniTests: this.transferData
                    };
                    let updateData = {
                        query: {
                            moniExam_id: this.moniExam_id
                        },
                        options: createdData
                    };
                    api.modifyMoniExamByOptions(updateData).then(res => {
                        if (res.code == 33) {
                            this.$message.success(res.message);
                            let data = {
                                query: {
                                    course_id: this.courseValue
                                }
                            };
                            api.getAllMoniExamByOptions(data).then(res => {
                                if (res.code == 32) {
                                    this.moniExams = res.data;
                                }
                            });

                            this.modifyDialogVisible = false;
                        }
                    });
                })
                .catch(err => {
                    this.$message({
                        type: "info",
                        message: "已取消生成"
                    });
                });
        },
        changeTransfer() {
            let data = [];
            this.transferData.map(value => {
                let temp = _.filter(this.moniTests, function(o) {
                    return o.moniTest_id == value;
                });
                data.push(temp[0]);
            });
            this.radioMoniTest = _.filter(data, function(o) {
                return o.moniTest_type == "radio";
            });
            this.checkMoniTest = _.filter(data, function(o) {
                return o.moniTest_type == "check";
            });
            this.judgeMoniTest = _.filter(data, function(o) {
                return o.moniTest_type == "judge";
            });
            this.moniExamData = _.concat(
                this.radioMoniTest,
                this.checkMoniTest,
                this.judgeMoniTest
            );
        },
        modifyMoniExam(data) {
            this.tempData = data;
            this.title = data.moniExam_title;
            this.moniExam_id = data.moniExam_id;
            this.transferData = data.moniTests;
            this.modifyDialogVisible = true;
        },
        watchMoniExam(data) {
            this.radioMoniTest = _.filter(data.moniExam_content, function(o) {
                return o.moniTest_type == "radio";
            });
            this.checkMoniTest = _.filter(data.moniExam_content, function(o) {
                return o.moniTest_type == "check";
            });
            this.judgeMoniTest = _.filter(data.moniExam_content, function(o) {
                return o.moniTest_type == "judge";
            });
            this.watchDialogVisible = true;
        },
        reviewMoniExam() {
            this.watchDialogVisible = true;
        },
        moniExamStatus(status) {
            switch (status) {
                case true:
                    return "发布中";
                    break;
                case false:
                    return "下架中";
                    break;
                default:
                    break;
            }
        },
        filterMoniExamStatus(value, row) {
            return row.moniExam_isPublish === value;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.tableBox {
    margin: 20px 0;
}
.radioBox {
    margin: 10px 0;
    border: 1px solid black;
    padding: 10px;
    &-title {
        margin-bottom: 10px;
    }
}
.exam-title {
    margin: 10px 0;
}
</style>