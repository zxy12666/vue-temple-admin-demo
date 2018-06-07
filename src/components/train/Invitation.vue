<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogFormVisible1=true">选择讲师</el-button>
    <el-dialog title="选择讲师" :visible.sync="dialogFormVisible1" center>
      <div style="height: 4rem;">
        <el-select v-model="pk_corp" filterable placeholder="请选择公司">
          <el-option
            v-for="item in this.corpList"
            :key="item.id"
            :label="item.orgName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="deptcode" filterable placeholder="请选择部门">
          <el-option
            v-for="item in this.deptcodeList"
            :key="item.pk_defdoc"
            :label="item.docname"
            :value="item.pk_defdoc">
          </el-option>
        </el-select>
      </div>
      <el-form ref="form" :rules="rules" :model="Invitation" label-width="120px">
        <div >
          <el-transfer
            filterable
            filter-placeholder="搜索讲师"
            :titles="['讲师列表', '已选讲师']"
            v-model="Invitation.lecturer"
            :data="data2">
          </el-transfer>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="dialogFormVisible1=false">取消</el-button>
      </div>
    </el-dialog>
    <p>已选择讲师：{{Invitation.lecturer}}</p>
  </div>
</template>

<script>
  import { editTrain, listTrain } from '@/api/train'
  import { getOrgList } from '@/api/common'
  import store from '@/store'
  export default {
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (0 in this.Invitation.lecturer) {
          callback(new Error('选择讲师'))
        }
        callback()
      }
      return {
        Invitation: {
          lecturer: [],
          judges: []
        },

        data2: this.generateData2(),
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        corpList: [],
        deptcodeList: [],
        pk_corp: '',
        deptcode: '',
        rules: {
          cadetHandbook: [
            { required: true, message: '请上传学员手册', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    props: ['id', 'type'],
    methods: {
      generateData2() {
        const data = []
        const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都']
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index
          })
        })
        return data
      },
      onSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            editTrain(Object.assign(this.Invitation.lecturer, { tid: this.id })).then(function(resp) {
              if (resp.data.success === true) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.getWorkInfo()
                this.Invitation = {
                  lecturer: [],
                  judges: []
                }
                this.dialogFormVisible1 = false
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
      getWorkInfo(id) {
        listTrain(Object.assign(this.search_data, { tid: id, type: this.type })).then(function(resp) {
          if (resp.data.success) {
            if (0 in resp.data.data.list) {
              this.Invitation.lecturer = resp.data.data.list[0]
            }
          } else {
            this.$message.error(resp.data.errorMsg)
          }
        }.bind(this))
      },
      getCorpList() {
        getOrgList().then(function(resp) {
          if (!resp.data.data) {
            this.$message({
              message: '公司信息获取异常',
              type: 'warning'
            })
          } else {
            this.corpList = resp.data.data
          }
        }.bind(this))
      }
    },
    created() {
      console.log(store.getters.org)
      this.pk_corp = store.getters.org
      if (this.id) {
        this.getCorpList()
      //        this.getWorkInfo(this.id)
      }
    }
  }
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>

