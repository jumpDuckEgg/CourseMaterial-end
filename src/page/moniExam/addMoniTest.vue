<template>
  <div class="addMoniTest">
    <h1>{{ msg }}</h1>
    <div class="box">
      <el-tabs type="border-card">
        <!-- 单选 -->
        <el-tab-pane label="单选">
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="选择一个课程：" prop="courseid">
              <el-select v-model="form.courseid" placeholder="请选择">
                <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择难度：" prop="level">
              <el-select v-model="form.level" placeholder="请选择">
                <el-option label="难度一" value="level1">
                </el-option>
                <el-option label="难度二" value="level2">
                </el-option>
                <el-option label="难度三" value="level3">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题：" prop="title">
              <el-input placeholder="未填写" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="正确答案：" prop="answer">
              <el-input placeholder="请在以下选项中，勾选出正确答案" disabled v-model="form.answer"></el-input>
            </el-form-item>
            <el-form-item label="分值：" prop="score">
              <el-input v-model="form.score" @keyup.native='scoreFun()' type="number" min="1" max="100" placeholder="未填写"></el-input>
            </el-form-item>
            <el-form-item label="选项：">
              <div class="box__item-select-element" v-for="(selectItem,selectIndex) in form.optionsData" :key="selectIndex">
                <el-radio v-model="form.answer" :label="selectItem.id">{{selectItem.id}}</el-radio>
                <el-input v-model="selectItem.options" placeholder="未填写" style="width:300px;margin-left:10px;"></el-input>
                <div class="box__item-select-element_left">
                  <el-button type="text" @click='addNewOptionsFun(selectIndex)' v-if="selectIndex==form.optionsData.length-1">添加选项</el-button>
                  <el-button type="text" v-if="selectIndex==form.optionsData.length-1&&selectIndex>0" @click='deleteOptionsFun(selectIndex)'>删除选项</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="解析：" prop="analysis">
              <el-input v-model="form.analysis" :rows="4" type="textarea" placeholder="未填写"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center">
              <el-button @click="submitRadio">提交</el-button>
              <el-button @click="resetForm('radio')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 多选 -->
        <el-tab-pane label="多选">
          <el-form ref="checkForm" :model="checkForm" :rules="checkRules" label-width="150px">
            <el-form-item label="选择一个课程：" prop="courseid">
              <el-select v-model="checkForm.courseid" placeholder="请选择">
                <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择难度：" prop="level">
              <el-select v-model="checkForm.level" placeholder="请选择">
                <el-option label="难度一" value="level1">
                </el-option>
                <el-option label="难度二" value="level2">
                </el-option>
                <el-option label="难度三" value="level3">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题：" prop="title">
              <el-input placeholder="未填写" v-model="checkForm.title"></el-input>
            </el-form-item>
            <el-form-item label="正确答案：" prop="answer">
              <el-input placeholder="请在以下选项中，勾选出正确答案" disabled v-model="checkForm.answer"></el-input>
            </el-form-item>
            <el-form-item label="分值：" prop="score">
              <el-input v-model="checkForm.score" @keyup.native='scoreFuncheck()' type="number" min="1" max="100" placeholder="未填写"></el-input>
            </el-form-item>
            <el-form-item label="选项：">
              <el-checkbox-group v-model="checkForm.checkAnswer">
                <div class="box__item-select-element" v-for="(selectItem,selectIndex) in checkForm.optionsData" :key="selectIndex">
                  <el-checkbox :label="selectItem.id"></el-checkbox>
                  <el-input v-model="selectItem.options" placeholder="未填写" style="width:300px;margin-left:10px;"></el-input>
                  <div class="box__item-select-element_left">
                    <el-button type="text" @click='addNewOptionsFunCheck(selectIndex)' v-if="selectIndex==checkForm.optionsData.length-1">添加选项</el-button>
                    <el-button type="text" v-if="selectIndex==checkForm.optionsData.length-1&&selectIndex>0" @click='deleteOptionsFunCheck(selectIndex)'>删除选项</el-button>
                  </div>
                </div>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="解析：" prop="analysis">
              <el-input v-model="checkForm.analysis" :rows="4" type="textarea" placeholder="未填写"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center">
              <el-button @click="submitCheck">提交</el-button>
              <el-button @click="resetForm('check')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="判断题">
          <el-form ref="judgeForm" :model="judgeForm" :rules="judgeRules" label-width="150px">
            <el-form-item label="选择一个课程：" prop="courseid">
              <el-select v-model="judgeForm.courseid" placeholder="请选择">
                <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择难度：" prop="level">
              <el-select v-model="judgeForm.level" placeholder="请选择">
                <el-option label="难度一" value="level1">
                </el-option>
                <el-option label="难度二" value="level2">
                </el-option>
                <el-option label="难度三" value="level3">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题：" prop="title">
              <el-input placeholder="未填写" v-model="judgeForm.title"></el-input>
            </el-form-item>
            <el-form-item label="答案" prop='answer'>
              <el-radio v-model="judgeForm.answer" label="true">正确</el-radio>
              <el-radio v-model="judgeForm.answer" label="false">错误</el-radio>
            </el-form-item>
            <el-form-item label="分值：" prop="score">
              <el-input v-model="judgeForm.score" @keyup.native='scoreFunjudge()' type="number" min="1" max="100" placeholder="未填写"></el-input>
            </el-form-item>
            <el-form-item label="解析：" prop="analysis">
              <el-input v-model="judgeForm.analysis" :rows="4" type="textarea" placeholder="未填写"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center">
              <el-button @click="submitJudge">提交</el-button>
              <el-button @click="resetForm('judge')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import api from "../../util/api.js";
export default {
  name: "addMoniTest",
  data() {
    return {
      courseContent: [],
      msg: "试题创建",
      // 单选表单
      form: {
        courseid: "",
        title: "",
        answer: "",
        level: "",
        score: 10,
        analysis: "",
        optionsData: [
          {
            id: "A",
            options: ""
          }
        ]
      },
      // 单选验证格式
      rules: {
        courseid: [
          { required: true, message: "请选择一个课程", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        level: [{ required: true, message: "请选择难度", trigger: "blur" }],
        answer: [{ required: true, message: "请选择答案", trigger: "blur" }],
        score: [{ required: true, message: "请填写分数", trigger: "blur" }],
        analysis: [{ required: true, message: "请填写解析", trigger: "blur" }]
      },
      // 多选表单
      checkForm: {
        courseid: "",
        title: "",
        level: "",
        answer: "",
        checkAnswer: [],
        score: 10,
        analysis: "",
        optionsData: [
          {
            id: "A",
            options: ""
          }
        ]
      },
      // 多选表单验证
      checkRules: {
        courseid: [
          { required: true, message: "请选择一个课程", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        level: [{ required: true, message: "请选择难度", trigger: "blur" }],
        answer: [{ required: true, message: "请选择答案", trigger: "blur" }],
        score: [{ required: true, message: "请填写分数", trigger: "blur" }],
        analysis: [{ required: true, message: "请填写解析", trigger: "blur" }]
      },
      // 判断表单
      judgeForm: {
        courseid: "",
        title: "",
        level: "",
        answer: "",
        score: 10,
        analysis: ""
      },
      // 判断表单验证
      judgeRules: {
        courseid: [
          { required: true, message: "请选择一个课程", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        level: [{ required: true, message: "请选择难度", trigger: "blur" }],
        answer: [{ required: true, message: "请选择答案", trigger: "blur" }],
        score: [{ required: true, message: "请填写分数", trigger: "blur" }],
        analysis: [{ required: true, message: "请填写解析", trigger: "blur" }]
      }
    };
  },
  watch: {
    "checkForm.checkAnswer": function(newValue, oldValue) {
      this.checkForm.answer = this.checkForm.checkAnswer.join(",");
    }
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
  methods: {
    resetForm(type) {
      if (type == "radio") {
        this.form.courseid = "";
        this.form.title = "";
        this.form.answer = "";
        this.form.level = "";
        this.form.score = 10;
        this.form.analysis = "";
        this.form.optionsData = [
          {
            id: "A",
            options: ""
          }
        ];
      }
      if (type == "check") {
        this.checkForm.courseid = "";
        this.checkForm.title = "";
        this.checkForm.answer = "";
        this.checkForm.level = "";
        this.checkForm.score = 10;
        this.checkForm.checkAnswer = [];
        this.checkForm.analysis = "";
        this.checkForm.optionsData = [
          {
            id: "A",
            options: ""
          }
        ];
      }
      if (type == "judge") {
        this.judgeForm.courseid = "";
        this.judgeForm.title = "";
        this.judgeForm.answer = "";
        this.judgeForm.level = "";
        this.judgeForm.score = 10;
        this.judgeForm.analysis = "";
      }
    },
    // 提交判断
    submitJudge() {
      this.$refs.judgeForm.validate(valid => {
        if (valid) {
          console.log(this.judgeForm);
          let data = {
            courseid: this.judgeForm.courseid,
            moniTest_title: this.judgeForm.title,
            moniTest_answer: this.judgeForm.answer,
            moniTest_level: this.judgeForm.level,
            moniTest_score: this.judgeForm.score,
            moniTest_analysis: this.judgeForm.analysis,
            moniTest_optionsData: [],
            moniTest_type: "judge"
          };
          api.addMoniTest(data).then(res => {
            if (res.code == 27) {
              this.$message.success("创建试题成功");
              this.resetForm('judge');
            }
          });
        }
      });
    },
    // 提交多选
    submitCheck() {
      let answerFlag = true;
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          this.checkForm.optionsData.map(value => {
            if (!value.options.trim()) {
              this.$message.warning("选项答案不能为空");
              answerFlag = false;
            }
          });
          if (answerFlag) {
            console.log(this.checkForm);
            let data = {
              courseid: this.checkForm.courseid,
              moniTest_title: this.checkForm.title,
              moniTest_answer: this.checkForm.answer,
              moniTest_level: this.checkForm.level,
              moniTest_score: this.checkForm.score,
              moniTest_analysis: this.checkForm.analysis,
              moniTest_optionsData: this.checkForm.optionsData,
              moniTest_type: "check"
            };
            api.addMoniTest(data).then(res => {
              if (res.code == 27) {
                this.$message.success("创建试题成功");
                this.resetForm('check');
              }
            });
          }
        }
      });
    },
    // 提交单选form
    submitRadio() {
      let answerFlag = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.optionsData.map(value => {
            if (!value.options.trim()) {
              this.$message.warning("选项答案不能为空");
              answerFlag = false;
            }
          });
          if (answerFlag) {
            let data = {
              courseid: this.form.courseid,
              moniTest_title: this.form.title,
              moniTest_answer: this.form.answer,
              moniTest_level: this.form.level,
              moniTest_score: this.form.score,
              moniTest_analysis: this.form.analysis,
              moniTest_optionsData: this.form.optionsData,
              moniTest_type: "radio"
            };
            api.addMoniTest(data).then(res => {
              if (res.code == 27) {
                this.$message.success("创建试题成功");
                this.resetForm('radio');
              }
            });
          }
        }
      });
    },
    // 判断每个题目的分值不能小于零且不能大于一百
    scoreFun: function() {
      if (this.form.score < 0) {
        this.form.score = 10;
        this.$message.warning('选题"' + this.form.title + '"的分值不能小于零');
      } else if (this.form.score > 100) {
        this.form.score = 10;
        this.$message.warning(
          '选题"' + this.form.title + '"的分值不能大于一百'
        );
      }
    },
    scoreFuncheck: function() {
      console.log(this.checkForm.score);
      if (this.checkForm.score < 0) {
        this.checkForm.score = 10;
        this.$message.warning(
          '选题"' + this.checkForm.title + '"的分值不能小于零'
        );
      } else if (this.checkForm.score > 100) {
        this.checkForm.score = 10;
        this.$message.warning(
          '选题"' + this.checkForm.title + '"的分值不能大于一百'
        );
      }
    },
    scoreFunjudge: function() {
      if (this.judgeForm.score < 0) {
        this.judgeForm.score = 10;
        this.$message.warning(
          '选题"' + this.judgeForm.title + '"的分值不能小于零'
        );
      } else if (this.judgeForm.score > 100) {
        this.judgeForm.score = 10;
        this.$message.warning(
          '选题"' + this.judgeForm.title + '"的分值不能大于一百'
        );
      }
    },

    // 单选新增选项
    addNewOptionsFun: function(opdtIndex) {
      var optionsDataMes = {};
      optionsDataMes.id = String.fromCharCode(64 + (opdtIndex + 2)); //将id从数字转换成大写字母.
      optionsDataMes.options = "";
      this.form.optionsData.push(optionsDataMes);
    },
    // 单选删除选项
    deleteOptionsFun: function(opdtIndex) {
      this.form.optionsData.splice(opdtIndex, 1);
    },
    // 多选新增选项
    addNewOptionsFunCheck: function(opdtIndex) {
      var optionsDataMes = {};
      optionsDataMes.id = String.fromCharCode(64 + (opdtIndex + 2)); //将id从数字转换成大写字母.
      optionsDataMes.options = "";
      this.checkForm.optionsData.push(optionsDataMes);
    },
    // 多选删除选项
    deleteOptionsFunCheck: function(opdtIndex) {
      this.checkForm.optionsData.splice(opdtIndex, 1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
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
</style>