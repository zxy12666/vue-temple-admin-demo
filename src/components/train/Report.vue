<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="report" label-width="120px">
      <el-form-item label="作业模板" id="reportNote"
                    onclick="document.querySelector('#filesReport').click()" prop="cadetHandbook">
        <input class="el-input__inner" placeholder="点击上传作业模板" @change="upLoadFile1" readonly="readonly"/>
        <input v-show="false" type="file" @change="upLoadFile1" id="filesReport" />
      </el-form-item>
      <el-form-item v-if="report.cadetHandbook!=''">
        <a class="file" :href="report.cadetHandbook">{{report.cadetHandbookName}}</a>
        <svg class="cart" aria-hidden="true" @click="delTrainNote">
          <use xlink:href="#icon-jianshao"></use>
        </svg>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { upload } from '@/api/upload'
  import { editTrain, listTrain } from '@/api/train'
  export default {
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (this.report.cadetHandbookName === '') {
          callback(new Error('请上传学员手册'))
        }
        callback()
      }
      return {
        report: {
          cadetHandbookName: '',
          cadetHandbook: ''
        },
        fileTypeList: {
          file: ['rar', 'zip']
        },
        rules: {
          cadetHandbook: [
            { required: true, message: '请上传学员手册', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        search_data: {
          pageNum: 1,
          pageSize: 10,
          sortColumn: 'add_time',
          type: ''
        }
      }
    },
    props: ['id', 'type'],
    methods: {
      onSubmit() {
        console.log(this.report)
        this.$refs.form.validate((valid) => {
          if (valid) {
            editTrain(Object.assign(this.report, { tid: this.id })).then(function(resp) {
              if (resp.data.success === true) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.getWorkInfo()
                this.report = {
                  cadetHandbookName: '',
                  cadetHandbook: ''
                }
                this.dialogFormVisible = false
              } else {
                this.$message({
                  message: resp.data.errorMsg,
                  type: 'warning'
                })
              }
            }.bind(this)).catch((err) => { this.$message.error(err) })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      upLoadFile1() {
        console.log(111)
        var file = event.target
        if (window.FileReader) {
          var fr = new FileReader()
        } else {
          this.$message({
            message: '对不起，您的浏览器过旧，请用升级您的浏览器',
            type: 'warning'
          })
        }
        const fileExt = file.value.substr(file.value.lastIndexOf('.') + 1).toLowerCase()
        if (this.fileTypeList.file.indexOf(fileExt) !== -1) {
          const fileName = file.value.substr(file.value.lastIndexOf('\\') + 1).toLowerCase()
          fr.readAsDataURL(file.files[0])
          fr.onloadend = function(e) {
            let fileUrl = e.target.result
            fileUrl = fileUrl.substr(fileUrl.indexOf(',') + 1)
            upload({
              fileContent: fileUrl,
              suffix: fileExt,
              fileName: fileName,
              scaleFlag: true,
              scaleSize: [{ width: 260, height: 260 }]
            }).then(function(resp) {
              if (resp.data.success) {
                const url = resp.data.data.storePath
                this.report.cadetHandbook = url
                this.report.cadetHandbookName = fileName
              } else {
                this.$message.error(resp.data.errorMsg)
              }
            }.bind(this))
          }.bind(this)
          file.value = ''
        } else {
          this.$message.error('文档格式错误！请上传压缩格式文件。')
        }
      },
      delTrainNote() {
        this.report.cadetHandbook = ''
        this.report.cadetHandbookName = ''
      },
      getWorkInfo(id) {
        listTrain(Object.assign(this.search_data, { tid: id, type: this.type })).then(function(resp) {
          if (resp.data.success) {
            if (0 in resp.data.data.list) {
              this.report = resp.data.data.list[0]
            }
          } else {
            this.$message.error(resp.data.errorMsg)
          }
        }.bind(this))
      }
    },
    created() {
      if (this.id) {
        this.getWorkInfo(this.id)
      }
    }
  }
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>

