<template>
  <div class="deleteCourse" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <h1>{{ msg }}</h1>
    <div>
      <el-table :data="content" style="width:100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-steps :active="activeFlag(props.row.isPublish)" finish-status="success" :space="200">
              <el-step title="上传" description="上传资料成功"></el-step>
              <el-step title="审核中" description="等待管理员的审核"></el-step>

              <template v-if="props.row.isPublish=='fail'">
                <el-step title="审核失败" status='error' :description="props.row.examineMessage"></el-step>
              </template>
              <template v-else>
                <el-step title="审核成功" description="审核成功"></el-step>
              </template>
            </el-steps>
          </template>
        </el-table-column>
        <el-table-column prop="course_id" label="课程id" width="100"></el-table-column>
        <el-table-column prop="author" label="创建人" width="120"></el-table-column>
        <el-table-column prop="course_name" label="课程名称" width="150"></el-table-column>
        <el-table-column label="课程图片" width="130">
          <template slot-scope="scope">
            <img :src="scope.row.courseImage" alt="课程图片" style="width:40px;height:40px;">
          </template>
        </el-table-column>
        <el-table-column prop="collectNum" label="课程收藏数" width="100"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.isPublish=='examine'" @click="handleEdit(scope.$index, scope.row)">{{scope.row.isPublish=="fail"?'重新上传':'编辑'}}</el-button>
            <el-button size="mini" type="danger" :disabled="scope.row.isPublish=='examine'" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-dialog title="编辑课程" :visible.sync="dialogVisible" center :before-close="handleClose">
        <div>
          <el-form ref="form" :model="form" :rules="rules" label-width="100px" @submit.native.prevent>
            <el-form-item label="课程名称:" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="课程描述:" prop="description">
              <el-input type="textarea" :rows="4" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="头像上传:" required>
              <el-upload name='file' :action="imageUploadUrl" :data="{
                        token
                      }" :file-list="logofileList" ref="logoUpload" :limit='limitNum' :on-exceed='handleExceed' :before-upload="beforeImageUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-progress='handleProgress' :on-success="handleSuccess" :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="PicturedialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="星数:">
              <el-rate v-model="starNum" class="star-rate"></el-rate>
            </el-form-item>
            <el-form-item label="课程申报书:" required>
              <el-upload name='file' drag :data="{
                        'token':docToken
                      }" ref="docUpload" :file-list="docfileList" :action="docUploadUrl" :before-upload="beforeDocUpload" :limit="limitNum" :on-exceed='handleExceed' :on-success="handleDocSuccess" :on-progress="handleProgress" :on-remove="handleDocRemove">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
            <el-form-item>

            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitCourse" :disabled="disabledFlag" :loading="submintFlag">提交</el-button>
          <el-button :loading="submintFlag" :disabled="disabledFlag" @click="resetContent">重置</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import api from "../../util/api.js";
export default {
    name: "modifyCourse",
    data() {
        return {
            loading: true,
            msg: "修改课程",
            content: [],
            dialogVisible: false,
            form: {
                name: "",
                description: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入课程名称",
                        trigger: "blur"
                    }
                ],
                description: [
                    {
                        required: true,
                        message: "请输入一段描述",
                        trigger: "blur"
                    },
                    { max: 120, message: "不能超过120字", trigger: "change" }
                ]
            },
            courseContent: {},
            dialogImageUrl: "",
            PicturedialogVisible: false,
            imageUrl: "",
            imageUploadUrl: "",
            token: "",
            submintFlag: false,
            limitNum: 1,
            starNum: 0,
            docToken: "",
            docUrl: "",
            docUploadUrl: "",
            disabledFlag: false,
            logofileList: [],
            docfileList: []
        };
    },
    created() {
        let data = {
            params: {
                author: this.$store.state.username
            }
        };
        api
            .findAllCourseByAuthor(data)
            .then(res => {
                this.content = res.data;
            })
            .then(() => {
                this.loading = false;
            });
    },
    methods: {
        // 表单方法
        resetContent() {
            this.form.name = "";
            this.form.description = "";
            this.$refs.logoUpload.clearFiles();
            this.$refs.docUpload.clearFiles();
            this.imageUrl = "";
            this.docUrl = "";
            this.starNum = 0;
        },
        submitCourse() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (!this.imageUrl) {
                        this.$message.warning("请选择课程图片");
                        return false;
                    }
                    if (!this.docUrl) {
                        this.$message.warning("请选择课程申请书");
                        return false;
                    }
                    let data = {
                        course_name: this.form.name,
                        description: this.form.description,
                        courseImage: this.imageUrl,
                        course_declaration: this.docUrl,
                        star: this.starNum,
                        author: this.$store.state.username
                    };
                    _.forOwn(data, (value, key) => {
                        if (value == this.courseContent[key]) {
                            _.unset(data, [key]);
                        }
                    });

                    if (this.courseContent.isPublish == "fail") {
                        _.set(data, "isPublish", "examine");
                    }
                    console.log(data);
                    let params = {
                        query: {
                            course_id: this.courseContent.course_id
                        },
                        options: data
                    };
                    this.submintFlag = true;
                    api.updateCourse(params).then(res => {
                        this.submintFlag = false;
                        if (res.code == 11) {
                            this.form.name = "";
                            this.form.description = "";
                            this.$refs.logoUpload.clearFiles();
                            this.$refs.docUpload.clearFiles();
                            this.imageUrl = "";
                            this.docUrl = "";
                            this.starNum = 0;
                            api.findAllCourse().then(res => {
                                this.content = res.data;
                                this.dialogVisible = false;
                                this.$message.success(`${res.message}`);
                            });
                        } else {
                            this.$message.warning(`${res.message}`);
                        }
                    });
                }
            });
        },
        handleProgress() {
            console.log("我在上传了");
            this.disabledFlag = true;
        },
        handleSuccess(response, file, fileList) {
            this.imageUrl = response.key;
            this.disabledFlag = false;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.imageUrl = "";
            this.disabledFlag = false;
        },
        handleDocSuccess(response, file, fileList) {
            this.docUrl = response.key;
            this.disabledFlag = false;
        },
        handleDocRemove(file, fileList) {
            console.log(file, fileList);
            this.docUrl = "";
            this.disabledFlag = false;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件`);
        },
        checkOptions(file) {
            const isDocImage = /^(?:application\/msword|application\/pdf)$/i.test(
                file.type
            );
            if (!isDocImage) {
                this.$message.error(`申报书仅支持 word 或 PDF 格式!`);
                return false;
            }
            return true;
        },
        beforeDocUpload(file) {
            if (!this.checkOptions(file)) {
                return false;
            }
            // 获取文件后缀
            let suffix = _.last(_.split(file.name, "."));
            let params = {
                suffix: suffix,
                type: "doc/course"
            };
            let that = this;
            return api.getUploadToken(params).then(res => {
                let result = res;
                that.docToken = result.data;
                that.docUploadUrl = result.upload_url;
                return true;
            });
        },
        checkLegalOptions(file) {
            const isLegalImage = /^(?:image\/jpeg|image\/png|image\/jpg)$/i.test(
                file.type
            );
            const isLt2M = file.size / 1024 / 1024 < 1;

            if (!isLegalImage) {
                this.$message.error(`上传头像图片只能是 JPG 或 PNG 格式!`);
                return false;
            }
            if (!isLt2M) {
                this.$message.error(`上传头像图片大小不能超过 1MB!`);
                return false;
            }
            return true;
        },
        beforeImageUpload(file) {
            if (!this.checkLegalOptions(file)) {
                return false;
            }
            // 获取文件后缀
            let suffix = _.last(_.split(file.name, "."));
            let params = {
                suffix: suffix,
                type: "image/logo"
            };
            let that = this;
            return api.getUploadToken(params).then(res => {
                let result = res;
                that.token = result.data;
                that.imageUploadUrl = result.upload_url;
                return true;
            });
        },

        // 表单方法

        handleClose(done) {
            done();
        },
        activeFlag(status) {
            if (status == "examine") {
                return 1;
            } else {
                return 3;
            }
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.dialogVisible = true;
            this.courseContent = row;
            this.imageUrl = row.courseImage;
            this.docUrl = row.course_declaration;
            this.form.name = row.course_name;
            this.form.description = row.description;
            this.starNum = row.star;
            this.logofileList = [{ name: "课程图片", url: row.courseImage }];
            this.docfileList = [
                { name: "课程申请书", url: row.course_declaration }
            ];
        },
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let data = {
                        course_id: row.course_id
                    };
                    console.log(data);
                    api.deleteCourse(data).then(res => {
                        if (res.code == 9) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            api.findAllCourse().then(res => {
                                console.log(res.data);
                                this.content = res.data;
                            });
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
        download(url) {
            window.location.href = url;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
.star-rate {
    margin-top: 10px;
}
</style>