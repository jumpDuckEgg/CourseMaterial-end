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
    <div style="margin:30px 0;">
      <el-transfer v-model="transferData" :props="{
      key: 'moniTest_id',
      label: 'moniTest_title' 
    }" :data="moniTests" :button-texts="['撤销', '添加']" :titles="['试题库','添加试题']" filterable>
        <div slot="left-footer"></div>

        <div slot="right-footer" style="margin:5px;">
          <el-button size="small" @click="reviewMoniExam">预览</el-button>
          <el-button size="small">生成试卷</el-button>
        </div>
      </el-transfer>
    </div>
    <div>
      {{transferData}}
    </div>
    <el-dialog title="试卷预览" :visible.sync="dialogVisible" width="60%">
      {{moniExamData}}
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
                    this.radioMoniTest = _.filter(res.data, function(o) {
                        return o.moniTest_type == "radio";
                    });
                    this.checkMoniTest = _.filter(res.data, function(o) {
                        return o.moniTest_type == "check";
                    });
                    this.judgeMoniTest = _.filter(res.data, function(o) {
                        return o.moniTest_type == "judge";
                    });
                    this.moniTests = _.concat(
                        this.radioMoniTest,
                        this.checkMoniTest,
                        this.judgeMoniTest
                    );
                }
            });
        }
    },
    methods: {
        reviewMoniExam() {
            this.dialogVisible = true;
            let data = [];
            this.transferData.map(value => {
                let temp = _.filter(this.moniTests, function(o) {
                    return o.moniTest_id == value;
                });
                data.push(temp[0])
            });
            this.moniExamData =data;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>

</style>