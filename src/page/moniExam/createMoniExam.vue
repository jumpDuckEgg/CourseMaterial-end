<template>
    <div class="createMoniExam">
        <h1>{{ msg }}</h1>
        <div>
            <span>选择一个课程：</span>
            <el-select v-model="courseValue" placeholder="请选择">
                <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
                </el-option>
            </el-select>
        </div>
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
        <el-dialog title="试卷预览" :visible.sync="dialogVisible" width="60%">
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
    </div>
</template>

<script>
import _ from "lodash";
import api from "../../util/api.js";
export default {
  name: "createMoniExam",
  data() {
    return {
      title: "",
      msg: "试卷创建",
      courseValue: "",
      courseContent: [],
      moniTests: [],
      radioMoniTest: [],
      checkMoniTest: [],
      judgeMoniTest: [],
      transferData: [],
      dialogVisible: false,
      moniExamData: []
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
        courseid: newValue
      };
      api.getAllMoniTestByOptions(data).then(res => {
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
    createdExam() {
      if (!this.courseValue) {
        this.$message.warning("请选择一个课程");
        return false;
      }
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
            title: this.title,
            content: this.moniExamData,
            course_id: this.courseValue
          };
          api.addMoniExam(createdData).then(res => {
            if (res.code == 31) {
              this.$message.success(res.message);
              this.transferData = [];
              this.title = "";
              this.moniExamData = [];
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
    reviewMoniExam() {
      this.dialogVisible = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
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