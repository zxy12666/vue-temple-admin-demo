<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="work" label-width="120px">
      <el-form-item label="作业要求" prop="jobRequirements">
        <el-input type="textarea" v-model="work.jobRequirements" placeholder="请输入作业要求"></el-input>
      </el-form-item>
      <el-form-item label="提交时间" prop="startTime">
        <el-col :span="5">
          <el-date-picker type="date" placeholder="请选择开始时间" value-format="yyyy-MM-dd" v-model="work.startTime" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="5">
          <el-date-picker type="date" placeholder="请选择结束时间" value-format="yyyy-MM-dd" v-model="work.endTime" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="作业模板" :class="'workupload'+this.type"
                     prop="jobTemplate">
        <input class="el-input__inner" placeholder="点击上传作业模板" @change="upLoadFile1" readonly="readonly"/>
      </el-form-item>
      <input v-show="false" type="file" @change="upLoadFile1" :id="'files'+this.type" />
      <el-form-item v-if="work.jobTemplate!=''">
        <a class="file" :href="work.jobTemplate">{{work.jobName}}</a>
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
  import { addTask, taskList } from '@/api/train'
  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        console.log(value)
        if (this.work.startTime === '') {
          callback(new Error('请选择作业提交开始时间'))
        }
        if (this.work.endTime === '') {
          callback(new Error('请选择作业提交结束时间'))
        }
        if (new Date(this.work.startTime).getTime() > new Date(this.work.endTime).getTime()) {
          callback(new Error('开始时间不得大于结束时间'))
        }
        callback()
      }
      const validatePass2 = (rule, value, callback) => {
        if (this.work.jobTemplate === '') {
          callback(new Error('请上传作业模板'))
        }
        callback()
      }
      return {
        work: {
          jobRequirements: '',
          startTime: '',
          endTime: '',
          jobTemplate: '',
          jobName: ''
        },
        fileTypeList: {
          file: ['rar', 'zip']
        },
        rules: {
          jobRequirements: [
            { required: true, message: '请输入作业要求', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择作业提交开始时间', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          jobTemplate: [
            { required: true, message: '请上传作业模板', trigger: 'blur' },
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
        console.log(this.work)
        this.$refs.form.validate((valid) => {
          if (valid) {
            addTask(Object.assign(this.work, { tid: this.id, status: this.type })).then(function(resp) {
              if (resp.data.success === true) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.getWorkInfo()
                this.work = {
                  jobRequirements: '',
                  startTime: '',
                  endTime: '',
                  jobTemplate: '',
                  job_name: ''
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
                this.work.jobTemplate = url
                this.work.jobName = fileName
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
        this.work.jobName = ''
        this.work.jobTemplate = ''
      },
      getWorkInfo(id) {
        taskList(Object.assign(this.search_data, { tid: id, type: this.type })).then(function(resp) {
          if (resp.data.success) {
            if (0 in resp.data.data.list) {
              this.work = resp.data.data.list[0]
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
    },
    mounted() {
      const that = this
      this.$lib_$('.workupload' + this.type).on('click', function() {
        that.$lib_$('#files' + that.type).click()
      })
    }
  }
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>

