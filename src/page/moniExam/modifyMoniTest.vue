<template>
  <div class="modifyMoniTest">
    <h1>{{ msg }}</h1>
    <div class="">
      <span>选择一个课程：</span>
      <el-select v-model="courseValue" placeholder="请选择">
        <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
        </el-option>
      </el-select>
      <div style="margin:10px 0;text-align:right">
        <el-input style="width:200px" placeholder="请输入试题名称" v-model="keyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="sreachMoniTest">搜索</el-button>
      </div>
      <div class="table_box">
        <div class="table_box-title">试题列表</div>
        <el-table border :data="currentMoniTest" style="width: 100%;">
          <el-table-column prop="moniTest_id" label="试题ID" width="90" sortable>
          </el-table-column>
          <el-table-column prop="moniTest_title" label="试题标题" width="180">
          </el-table-column>
          <el-table-column label="试题类型" width="110" prop="moniTest_type" :filters="[{ text: '单选', value: 'radio' }, { text: '多选', value: 'check' }, { text: '判断', value: 'judge' }]" :filter-method="filterMoniTestType">
            <template slot-scope="scope">
              <el-tag type="primary">{{moniTestType(scope.row.moniTest_type)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="courseid" label="课程ID" width="90">
          </el-table-column>
          <el-table-column prop="moniTest_level" label="试题难度" width="90" :filters="[{ text: '难度一', value: 'level1' }, { text: '难度二', value: 'level2' }, { text: '难度三', value: 'level3' }]" :filter-method="filterMoniTestLevel">
            <template slot-scope="scope">
              <el-tag type="primary">{{moniTestLevel(scope.row.moniTest_level)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" sortable width="110">
            <template slot-scope="scope">
              <el-tag type="success">{{scope.row.createdTime|formatDate}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="success" @click="watchMoniTest(scope.row)">查看</el-button>
              <el-button type="primary" @click="openModifyDialog(scope.row)">修改</el-button>
              <el-button type="danger" @click="removeMoniTest(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin:10px 0;">
          <el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" :current-page.sync='currentPage'>
          </el-pagination>
        </div>
      </div>
      <el-dialog title="查看试题" :visible.sync="watchMoniTestdialog" width="30%">
        <div>试题题目：{{watchData.moniTest_title}}</div>
        <div>试题类型：{{moniTestType(watchData.moniTest_type)}}</div>
        <div v-if="watchData.moniTest_optionsData&&watchData.moniTest_optionsData.length>0">
          <el-row type="flex" justify>
            <el-col :span="24/watchData.moniTest_optionsData.length" v-for="(selectItem,selectIndex) in watchData.moniTest_optionsData" :key="selectIndex">{{selectItem.id}}.{{selectItem.options}}</el-col>
          </el-row>
        </div>
        <div>难度：{{watchData.moniTest_level}}</div>
        <div>答案：{{watchData.moniTest_answer}}</div>
        <div>解析:{{watchData.moniTest_analysis}}</div>
        <div>分数:{{watchData.moniTest_score}}</div>
      </el-dialog>
      <el-dialog title="单选题修改" :visible.sync="radioMoniTestdialog" width="60%" :before-close="handleClose">
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
      </el-dialog>
      <el-dialog title="多选题修改" :visible.sync="checkMoniTestdialog" width="60%">
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
      </el-dialog>
      <el-dialog title="判断题修改" :visible.sync="judgeMoniTestdialog" width="60%">
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
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import api from "../../util/api.js";
export default {
    name: "modifyMoniTest",
    data() {
        return {
            msg: "试题修改",
            courseContent: [],
            courseValue: "",
            moniTests: [],
            watchData: {},
            modifyData: {},
            watchMoniTestdialog: false,
            radioMoniTestdialog: false,
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
                    {
                        required: true,
                        message: "请选择一个课程",
                        trigger: "blur"
                    }
                ],
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" }
                ],
                level: [
                    { required: true, message: "请选择难度", trigger: "blur" }
                ],
                answer: [
                    { required: true, message: "请选择答案", trigger: "blur" }
                ],
                score: [
                    { required: true, message: "请填写分数", trigger: "blur" }
                ],
                analysis: [
                    { required: true, message: "请填写解析", trigger: "blur" }
                ]
            },
            checkMoniTestdialog: false,
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
                    {
                        required: true,
                        message: "请选择一个课程",
                        trigger: "blur"
                    }
                ],
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" }
                ],
                level: [
                    { required: true, message: "请选择难度", trigger: "blur" }
                ],
                answer: [
                    { required: true, message: "请选择答案", trigger: "blur" }
                ],
                score: [
                    { required: true, message: "请填写分数", trigger: "blur" }
                ],
                analysis: [
                    { required: true, message: "请填写解析", trigger: "blur" }
                ]
            },
            judgeMoniTestdialog: false,
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
                    {
                        required: true,
                        message: "请选择一个课程",
                        trigger: "blur"
                    }
                ],
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" }
                ],
                level: [
                    { required: true, message: "请选择难度", trigger: "blur" }
                ],
                answer: [
                    { required: true, message: "请选择答案", trigger: "blur" }
                ],
                score: [
                    { required: true, message: "请填写分数", trigger: "blur" }
                ],
                analysis: [
                    { required: true, message: "请填写解析", trigger: "blur" }
                ]
            },
            pageSize: 10,
            total: 0,
            currentMoniTest: [],
            currentPage: 1,
            keyword: "",
            sreachmoniTests: []
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
                    this.moniTests = res.data;
                    this.total = this.moniTests.length;
                    let offset = 0;
                    this.currentMoniTest =
                        offset + this.pageSize >= this.moniTests.length
                            ? this.moniTests.slice(
                                  offset,
                                  this.moniTests.length
                              )
                            : this.moniTests.slice(
                                  offset,
                                  offset + this.pageSize
                              );
                    this.currentPage = 1;
                }
            });
        },
        "checkForm.checkAnswer": function(newValue, oldValue) {
            this.checkForm.answer = this.checkForm.checkAnswer.join(",");
        }
    },
    methods: {
        sreachMoniTest() {
            if (!this.courseValue) {
                this.$message.warning("请选择一个课程");
            }
            let key = this.keyword.trim();

            this.sreachmoniTests = _.filter(this.moniTests, function(o) {
                return _.includes(o.moniTest_title,key);
            });

            this.total = this.sreachmoniTests.length;
            let offset = 0;
            this.currentMoniTest =
                offset + this.pageSize >= this.sreachmoniTests.length
                    ? this.sreachmoniTests.slice(
                          offset,
                          this.sreachmoniTests.length
                      )
                    : this.sreachmoniTests.slice(
                          offset,
                          offset + this.pageSize
                      );
            this.currentPage = 1;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(this.moniTests.length);
            let offset = (val - 1) * this.pageSize;
            this.currentMoniTest =
                offset + this.pageSize >= this.moniTests.length
                    ? this.moniTests.slice(offset, this.moniTests.length)
                    : this.moniTests.slice(offset, offset + this.pageSize);
            if (this.keyword.trim()&& this.sreachmoniTests.length>0) {
                this.currentMoniTest =
                    offset + this.pageSize >= this.sreachmoniTests.length
                        ? this.sreachmoniTests.slice(
                              offset,
                              this.sreachmoniTests.length
                          )
                        : this.sreachmoniTests.slice(
                              offset,
                              offset + this.pageSize
                          );
            }
        },
        filterMoniTestType(value, row) {
            return row.moniTest_type === value;
        },
        filterMoniTestLevel(value, row) {
            return row.moniTest_level === value;
        },
        // 删除试题
        removeMoniTest(data) {
            let moniTestData = {
                moniTest_id: data.moniTest_id
            };
            this.$confirm("此操作将永久删除该试题, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    api.deleteMoniTest(moniTestData).then(res => {
                        if (res.code == 30) {
                            this.$message.success(res.message);
                            let data = {
                                courseid: this.courseValue
                            };
                            api.getAllMoniTestByOptions(data).then(res => {
                                if (res.code == 28) {
                                    this.moniTests = res.data;
                                    this.total = this.moniTests.length;
                                    let offset = 0;
                                    this.currentMoniTest =
                                        offset + this.pageSize >=
                                        this.moniTests.length
                                            ? this.moniTests.slice(
                                                  offset,
                                                  this.moniTests.length
                                              )
                                            : this.moniTests.slice(
                                                  offset,
                                                  offset + this.pageSize
                                              );
                                    this.currentPage = 1;
                                    this.keyword = "";
                                }
                            });
                        }
                    });
                })
                .catch(err => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        handleClose(done) {
            done();
        },
        moniTestLevel(type) {
            switch (type) {
                case "level1":
                    return "难度一";
                    break;
                case "level2":
                    return "难度二";
                    break;
                case "level3":
                    return "难度三";
                    break;
                default:
                    break;
            }
        },
        moniTestType(type) {
            switch (type) {
                case "check":
                    return "多选";
                    break;
                case "radio":
                    return "单选";
                    break;
                case "judge":
                    return "判断";
                    break;
                default:
                    break;
            }
        },
        watchMoniTest(data) {
            this.watchData = data;
            this.watchMoniTestdialog = true;
        },
        openModifyDialog(data) {
            this.modifyData = data;
            if (data.moniTest_type == "radio") {
                this.form.courseid = data.courseid;
                this.form.title = data.moniTest_title;
                this.form.answer = data.moniTest_answer;
                this.form.level = data.moniTest_level;
                this.form.score = data.moniTest_score;
                this.form.analysis = data.moniTest_analysis;
                this.form.optionsData = data.moniTest_optionsData;
                this.radioMoniTestdialog = true;
            }
            if (data.moniTest_type == "check") {
                this.checkForm.courseid = data.courseid;
                this.checkForm.title = data.moniTest_title;
                this.checkForm.answer = data.moniTest_answer;
                this.checkForm.level = data.moniTest_level;
                this.checkForm.score = data.moniTest_score;
                this.checkForm.analysis = data.moniTest_analysis;
                this.checkForm.optionsData = data.moniTest_optionsData;
                let checkAnswer = data.moniTest_answer.split(",");
                this.checkForm.checkAnswer = checkAnswer;
                this.checkMoniTestdialog = true;
            }
            if (data.moniTest_type == "judge") {
                this.judgeForm.courseid = data.courseid;
                this.judgeForm.title = data.moniTest_title;
                this.judgeForm.answer = data.moniTest_answer;
                this.judgeForm.level = data.moniTest_level;
                this.judgeForm.score = data.moniTest_score;
                this.judgeForm.analysis = data.moniTest_analysis;
                this.judgeMoniTestdialog = true;
            }
        },
        // 判断每个题目的分值不能小于零且不能大于一百
        scoreFun: function() {
            if (this.form.score < 0) {
                this.form.score = 10;
                this.$message.warning(
                    '选题"' + this.form.title + '"的分值不能小于零'
                );
            } else if (this.form.score > 100) {
                this.form.score = 10;
                this.$message.warning(
                    '选题"' + this.form.title + '"的分值不能大于一百'
                );
            }
        },
        scoreFuncheck: function() {
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
                        _.forOwn(data, (value, key) => {
                            if (value == this.modifyData[key]) {
                                if (key == "moniTest_optionsData") {
                                } else {
                                    _.unset(data, [key]);
                                }
                            }
                        });
                        let updateData = {
                            query: {
                                moniTest_id: this.modifyData.moniTest_id
                            },
                            options: data
                        };
                        api.modifyMoniTest(updateData).then(res => {
                            if (res.code == 29) {
                                this.$message.success("修改试题成功");
                                this.radioMoniTestdialog = false;
                                let data = {
                                    courseid: this.courseValue
                                };
                                api.getAllMoniTestByOptions(data).then(res => {
                                    if (res.code == 28) {
                                        this.moniTests = res.data;
                                        this.total = this.moniTests.length;
                                        let offset = 0;
                                        this.currentMoniTest =
                                            offset + this.pageSize >=
                                            this.moniTests.length
                                                ? this.moniTests.slice(
                                                      offset,
                                                      this.moniTests.length
                                                  )
                                                : this.moniTests.slice(
                                                      offset,
                                                      offset + this.pageSize
                                                  );
                                        this.currentPage = 1;
                                        this.keyword ="";
                                    }
                                });
                            }
                        });
                    }
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
                        _.forOwn(data, (value, key) => {
                            if (value == this.modifyData[key]) {
                                if (key == "moniTest_optionsData") {
                                } else {
                                    _.unset(data, [key]);
                                }
                            }
                        });
                        let updateData = {
                            query: {
                                moniTest_id: this.modifyData.moniTest_id
                            },
                            options: data
                        };
                        api.modifyMoniTest(updateData).then(res => {
                            if (res.code == 29) {
                                this.$message.success("修改试题成功");
                                this.checkMoniTestdialog = false;
                                let data = {
                                    courseid: this.courseValue
                                };
                                api.getAllMoniTestByOptions(data).then(res => {
                                    if (res.code == 28) {
                                        this.moniTests = res.data;
                                        this.total = this.moniTests.length;
                                        let offset = 0;
                                        this.currentMoniTest =
                                            offset + this.pageSize >=
                                            this.moniTests.length
                                                ? this.moniTests.slice(
                                                      offset,
                                                      this.moniTests.length
                                                  )
                                                : this.moniTests.slice(
                                                      offset,
                                                      offset + this.pageSize
                                                  );
                                        this.currentPage = 1;
                                        this.keyword ="";
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },
        // 提交判断
        submitJudge() {
            this.$refs.judgeForm.validate(valid => {
                if (valid) {
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
                    _.forOwn(data, (value, key) => {
                        if (value == this.modifyData[key]) {
                            _.unset(data, [key]);
                        }
                    });
                    let updateData = {
                        query: {
                            moniTest_id: this.modifyData.moniTest_id
                        },
                        options: data
                    };
                    api.modifyMoniTest(updateData).then(res => {
                        if (res.code == 29) {
                            this.$message.success("修改试题成功");
                            this.judgeMoniTestdialog = false;
                            let data = {
                                courseid: this.courseValue
                            };
                            api.getAllMoniTestByOptions(data).then(res => {
                                if (res.code == 28) {
                                    this.moniTests = res.data;
                                    this.total = this.moniTests.length;
                                    let offset = 0;
                                    this.currentMoniTest =
                                        offset + this.pageSize >=
                                        this.moniTests.length
                                            ? this.moniTests.slice(
                                                  offset,
                                                  this.moniTests.length
                                              )
                                            : this.moniTests.slice(
                                                  offset,
                                                  offset + this.pageSize
                                              );
                                    this.currentPage = 1;
                                    this.keyword="";
                                }
                            });
                        }
                    });
                }
            });
        },
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
        }
    },
    filters: {
        formatDate: function(value) {
            return moment(value).format("YYYY-MM-DD");
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.table_box {
    margin: 20px 0;
    &-title {
        margin: 10px 0;
        font-weight: bold;
    }
}
</style>