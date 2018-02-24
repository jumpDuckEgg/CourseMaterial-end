<template>
  <div class="addOnlineTest">
    <h1>{{ msg }}</h1>
    <div class="courseMaterial">
      <div class="courseMaterial__item">
        <span>选择一个课程：</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in courseContent" :key="item.course_name" :label="item.course_name" :value="item.course_id">
          </el-option>
        </el-select>
      </div>
      <div class="courseMaterial__item" v-if="value">
        <div class="courseMaterial__item-title">测试名称：
          <el-input class="courseMaterial__item-input" v-model="title"></el-input>
        </div>
        <div>
          <el-button @click="addNewSubjectFun()">添加选择题</el-button>
        </div>
        <el-card class="box" v-for="(item,index) in question" :key="index">
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
    </div>
  </div>
</template>

<script>
import api from "../../util/api.js";
export default {
    name: "addOlineTest",
    data() {
        return {
            msg: "添加在线测试",
            courseContent: [],
            value: "",
            title: "",
            question: [
                {
                    id: 1,
                    title: "",
                    answer: "",
                    score: 10,
                    optionsData: [
                        {
                            id: "A",
                            options: ""
                        }
                    ]
                }
            ]
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
    methods: {
        // 删除选题
        deleteSubjectFun: function(index) {
            this.question.splice(index, 1);
        },
        // 新增选题
        addNewSubjectFun: function() {
            let subjectDataMes = {};
            subjectDataMes.id = this.question.length + 1;
            subjectDataMes.title = "";
            subjectDataMes.answer = "";
            subjectDataMes.score = 10;
            subjectDataMes.optionsData = [
                {
                    id: "A",
                    options: ""
                }
            ];
            this.question.push(subjectDataMes);
        },
        // 新增选项
        addNewOptionsFun: function(subjectIndex, opdtIndex) {
            var optionsDataMes = {};
            optionsDataMes.id = String.fromCharCode(64 + (opdtIndex + 2)); //将id从数字转换成大写字母.
            optionsDataMes.options = "";
            var subjectDataMes = this.question[subjectIndex].optionsData;
            subjectDataMes.push(optionsDataMes);
        },
        // 删除选项
        deleteOptionsFun: function(subjectIndex, opdtIndex) {
            var subjectDataMes = this.question[subjectIndex].optionsData;
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
        submitOnlineTest() {
            if (!this.title) {
                this.$message.error("测试名称不能为空");
                return false;
            }
            let data = {
                title: this.title,
                course_id: this.value,
                question: this.question
            };
            api.addOnlineTest(data).then(res => {
                if (res.code == 15) {
                    this.$message.success(res.message);
                    this.title = "";
                    this.question = [
                        {
                            id: 1,
                            title: "",
                            answer: "",
                            score: 10,
                            optionsData: [
                                {
                                    id: "A",
                                    options: ""
                                }
                            ]
                        }
                    ];
                }
            });
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