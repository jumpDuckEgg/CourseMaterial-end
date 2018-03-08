<template>
  <div class="upload">
    <el-row :class="{ material:true, materialShow : switchFlag}" justify type="flex">
      <el-col :span='2'>{{title}}：</el-col>
      <el-col>
        <el-upload :data="{
                'token':materialToken
              }" :action="materialUploadUrl" :on-preview="handleMaterialPreview" :on-remove="handleMaterialRemove" :before-remove="MaterialbeforeRemove" multiple :limit="limitFlieNumber" :on-success="handleMaterialSuccess" :file-list="materialfileList" :before-upload="beforeMaterialUpload" :on-exceed="handleMaterialExceed" :on-progress="handleProgress">
          <el-button size="small" type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传ppt文件，且不超过500kb</div> -->
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from "lodash";
import api from "../util/api.js";
export default {
    name: "upload",
    props: {
        title: {
            type: String,
            required: true
        },
        switchFlag: {
            type: Boolean,
            required: true
        },
        regx: {
            type: RegExp,
            required: true
        },
        regxType: {
            type: String,
            required: true
        },
        uploadFolder: {
            type: String,
            default: "material"
        },
        materialfileList: {
            type: Array,
            default: []
        },
        limitFlieNumber: {
            type: Number,
            default: 3
        },
        buttonFlag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            materialUploadUrl: "",
            materialToken: ""
        };
    },
    methods: {
        handleProgress() {
            console.log("我在上传了");

            this.$emit("update:buttonFlag", true);
        },
        // 课件资源
        handleMaterialSuccess(response, file, fileList) {
            this.$emit("update:materialfileList", fileList);
            this.$emit("update:buttonFlag", false);
        },
        handleMaterialRemove(file, fileList) {
            // console.log(file, fileList);
            this.$emit("update:materialfileList", fileList);
            this.$emit("update:buttonFlag", false);
        },
        handleMaterialPreview(file) {
            // console.log(file);
        },
        handleMaterialExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 ${this.limitFlieNumber} 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        MaterialbeforeRemove(file, fileList) {
            // return this.$confirm(`确定移除 ${file.name}？`);
            // 文件移除的时候触发的方法
        },
        beforeMaterialUpload(file) {
            // 当返回false就触发 :before-remove
            // ====  组件配置  ====
            const ispptType = this.regx.test(file.type);
            if (!ispptType) {
                // ====  组件配置  ====
                this.$message.error(`资源仅支持 ${this.regxType} 格式!`);
                return false;
            }

            // 获取文件后缀
            let suffix = _.last(_.split(file.name, "."));
            let params = {
                suffix: suffix,
                // ====  组件配置  ====
                type: this.uploadFolder
            };
            let that = this;
            return api.getUploadToken(params).then(res => {
                let result = res;
                // ====  组件配置  ====
                that.materialToken = result.data;
                that.materialUploadUrl = result.upload_url;
                return true;
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.upload {
    margin: 20px 0;
}
.material {
    display: none;
}
.materialShow {
    display: flex;
}
</style>