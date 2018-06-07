<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="培训班名称" prop="className">
        <el-input v-model="form.className" placeholder="请输入培训班名称"></el-input>
      </el-form-item>
      <el-form-item label="培训班时间" prop="startTime">
        <el-col :span="5">
          <el-date-picker type="date" placeholder="培训班开始时间" value-format="yyyy-MM-dd" v-model="form.startTime" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="5">
          <el-date-picker type="date" placeholder="培训班结束时间" value-format="yyyy-MM-dd" v-model="form.endTime" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="报名时间" prop="signStartTime">
        <el-col :span="5">
          <el-date-picker type="date" placeholder="培训班报名开始时间" value-format="yyyy-MM-dd" v-model="form.signStartTime" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="5">
          <el-date-picker type="date" placeholder="培训班报名结束时间" value-format="yyyy-MM-dd" v-model="form.signEndTime" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="培训地点" prop="address">
        <el-input placeholder="请输入培训地点" v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="带班老师" prop="classTeacher">
        <el-input placeholder="请输入带班老师" v-model="form.classTeacher"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input placeholder="请输入联系电话" v-model.number="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="包含事项">
        <el-checkbox-group v-model="form.events">
          <el-checkbox label="需求调研" name="type">需求调研</el-checkbox>
          <el-checkbox label="课程表(含评价)" name="type">课程表(含评价)</el-checkbox>
          <el-checkbox label="训前学习" name="type">训前学习</el-checkbox>
          <el-checkbox label="训前作业" name="type">训前作业</el-checkbox>
          <el-checkbox label="行动计划" name="type">行动计划</el-checkbox>
          <el-checkbox label="训后作业" name="type">训后作业</el-checkbox>
          <el-checkbox label="研讨" name="type">研讨</el-checkbox>
          <el-checkbox label="学员手册" name="type">学员手册</el-checkbox>
          <el-checkbox label="发送邀请" name="type">发送邀请</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="二维码图片"
                    onclick="document.querySelector('#thumb').click()" prop="code">
        <input v-show="false" type="file" @change="upLoadPic" id="thumb"/>
        <input class="el-input__inner" placeholder="点击上传二维码图片" @change="upLoadPic" readonly="readonly"/>
      </el-form-item>
      <el-form-item v-if="form.code!=''">
        <div>
          <img  class="auth-img" :src="form.code" alt="">
          <svg class="cart" aria-hidden="true" @click="form.code=''">
            <use xlink:href="#icon-jianshao"></use>
          </svg>
        </div>
      </el-form-item>
      <el-form-item label="报到须知"
                    onclick="document.querySelector('#files').click()" prop="reportNote">
        <input v-show="false" type="file" @change="upLoadFile" id="files"/>
        <input class="el-input__inner" placeholder="点击上传报到须知" @change="upLoadFile" readonly="readonly"/>
      </el-form-item>
      <el-form-item v-if="form.reportNote!=''">
        <a class="file" :href="form.reportNote">{{form.reportNoteName}}</a>
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
import { getTrain } from '@/api/train'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      console.log(value)
      if (this.form.startTime === '') {
        callback(new Error('请选择培训开始时间'))
      }
      if (this.form.endTime === '') {
        callback(new Error('请选择培训结束时间'))
      }
      if (new Date(this.form.startTime).getTime() > new Date(this.form.endTime).getTime()) {
        callback(new Error('培训开始时间不得大于培训结束时间'))
      }
      callback()
    }
    const validatePass1 = (rule, value, callback) => {
      if (this.form.signStartTime === '') {
        callback(new Error('请选择报名开始时间'))
      }
      if (this.form.signEndTime === '') {
        callback(new Error('请选择报名结束时间'))
      }
      if (new Date(this.form.signStartTime).getTime() > new Date(this.form.signEndTime).getTime()) {
        callback(new Error('报名开始时间不得大于报名结束时间'))
      }
      callback()
    }
    const validatePass2 = (rule, value, callback) => {
      if (this.form.reportNote === '') {
        callback(new Error('请上传报到须知'))
      }
      callback()
    }
    return {
      form: {
        className: '',
        startTime: '',
        endTime: '',
        signStartTime: '',
        signEndTime: '',
        address: '',
        classTeacher: '',
        events: [],
        tel: '',
        reportNoteName: '',
        reportNote: '',
        code: ''
      },
      fileTypeList: {
        img: ['bmp', 'jpg', 'png', 'tiff', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw'],
        file: ['pdf']
      },
      rules: {
        className: [
          { required: true, message: '请输入培训班名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择培训开始时间', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        signStartTime: [
          { required: true, message: '请选择报名开始时间', trigger: 'blur' },
          { validator: validatePass1, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入培训地点', trigger: 'blur' }
        ],
        classTeacher: [
          { required: true, message: '请输入培训讲师', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '联系电话不能为空' },
          { type: 'number', message: '联系电话必须为数字值' }
        ],
        reportNote: [
          { required: true, message: '请上传报到须知', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请上传微信群二维码', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['id'],
  methods: {
    onSubmit() {
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
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
    upLoadPic() {
      const file = event.target
      if (window.FileReader) {
        var fr = new FileReader()
      } else {
        this.$message({
          message: '对不起，您的浏览器过旧，请用升级您的浏览器',
          type: 'warning'
        })
      }
      const fileExt = file.value.substr(file.value.lastIndexOf('.') + 1).toLowerCase()
      if (this.fileTypeList.img.indexOf(fileExt) !== -1) {
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
            scaleSize: [{ width: 50, height: 50 }]
          }).then(function(resp) {
            if (resp.data.success) {
              this.form.code = resp.data.data.storePath
              console.log(resp.data.data.storePath)
            } else {
              this.$message.error(resp.data.errorMsg)
            }
          }.bind(this))
        }.bind(this)
        file.value = ''
      }
    },
    upLoadFile() {
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
              this.form.reportNote = url
              this.form.reportNoteName = fileName
            } else {
              this.$message.error(resp.data.errorMsg)
            }
          }.bind(this))
        }.bind(this)
        file.value = ''
      } else {
        this.$message.error('文档格式错误！请上传PDF格式文件。')
      }
    },
    delTrainNote() {
      this.form.reportNoteName = ''
      this.form.reportNote = ''
    },
    getBasicInfo(id) {
      getTrain({ id: id }).then(function(resp) {
        if (resp.data.success) {
          this.form = resp.data.data
          this.$emit('showTab', this.form.events)
        } else {
          this.$message.error(resp.data.errorMsg)
        }
      }.bind(this))
    }
  },
  created() {
    if (this.id) {
      this.getBasicInfo(this.id)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

