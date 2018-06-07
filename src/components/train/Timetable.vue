<template>
  <div>
    <div class="basicinfo-list-form1">
      <el-table
        :data="tableData"
        border
        style="width: 100%;text-align: center;">
        <el-table-column
          prop="startTime"
          label="授课时间起"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="授课时间止"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="teacheringAddress"
          label="授课地点"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="courseTheme"
          label="课程主题"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="content"
          label="主要内容"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="teacheringForm"
          label="授课形式"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="toBear"
          label="担当"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="participants"
          label="参与对象"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="evaluateCode"
          label="评价二维码"
          align="center"
        >
          <template slot-scope="scope">
            <img class="QRimg" :src="scope.row.evaluateCode" alt="">
          </template>
        </el-table-column>
        <el-table-column label="操作" style="width:50px;" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class='btm-action'>
        <el-pagination
          v-if='paginations.total>0'
          class='pagination'
          :page-sizes="paginations.page_sizes"
          :page-size="paginations.pageSize"
          :layout="paginations.layout"
          :total="paginations.total"
          :current-page='paginations.pageNum'
          @current-change='onChangeCurrentPage'
          @size-change='onChangePageSize'>
        </el-pagination>
      </el-col>
    </div>
    <el-col :span="24" class='add-contact1' >
      <div @click="openDialog()">
        <svg class="basicinfo-icon"  aria-hidden="true">
          <use xlink:href="#icon-xinzeng"></use>
        </svg>
        新增课程
      </div>
    </el-col>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :center="true" width="40%" top="8vh">
      <div slot="title" style="border-bottom: 1px solid #ddd;padding: 15px 0px;">
        <span style="font-size: 20px">新增课程</span>
      </div>
      <el-form ref="form" :rules="rules" :model="table" label-width="120px">
        <el-form-item prop="courseTheme" label="课程主题">
          <el-input v-model="table.courseTheme"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="主要内容">
          <el-input v-model="table.content"></el-input>
        </el-form-item>
        <el-form-item  label="授课形式">
          <el-radio v-model="table.teacheringForm" label="面授">面授</el-radio>
          <el-radio v-model="table.teacheringForm" label="视频教学">视频教学</el-radio>
        </el-form-item>
        <el-form-item prop="toBear" label="担当">
          <el-input v-model="table.toBear"></el-input>
        </el-form-item>
        <el-form-item prop="participants" label="参与对象">
          <el-input v-model="table.participants"></el-input>
        </el-form-item>
        <el-form-item label="授课时间" prop="startTime">
          <el-col :span="10">
            <el-date-picker type="date" placeholder="授课开始时间" value-format="yyyy-MM-dd" v-model="table.startTime" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="12">
            <el-date-picker type="date" placeholder="授课结束时间" value-format="yyyy-MM-dd" v-model="table.endTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item prop="teacheringAddress" label="授课地点">
          <el-input v-model="table.teacheringAddress"></el-input>
        </el-form-item>
        <el-form-item prop="evaluateUrl" label="评价网址">
          <el-input v-model="table.evaluateUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import { createQR } from '@/utils'
  import { trainCourseList, delTrainCourse, addTrainCourse } from '@/api/train'
  export default {
    components: {

    },
    data() {
      const validatePass = (rule, value, callback) => {
        console.log(value)
        if (this.table.startTime === '') {
          callback(new Error('请选择授课开始时间'))
        }
        if (this.table.endTime === '') {
          callback(new Error('请选择授课结束时间'))
        }
        if (new Date(this.table.startTime).getTime() > new Date(this.table.endTime).getTime()) {
          callback(new Error('授课开始时间不得大于授课结束时间'))
        }
        callback()
      }
      return {
        dialogFormVisible: false,
        tableData: [],
        table: {
          courseTheme: '',
          content: '',
          teacheringForm: '面授',
          startTime: '',
          endTime: '',
          evaluateUrl: '',
          evaluateCode: '',
          teacheringAddress: '',
          toBear: '',
          participants: ''
        },
        // 搜索表单信息
        search_data: {
          pageNum: 1,
          pageSize: 10,
          sortColumn: 'add_time',
          type: ''
        },
        rules: {
          courseTheme: [
            { required: true, message: '请输入课程主题', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入主要内容', trigger: 'blur' }
          ],
          toBear: [
            { required: true, message: '请输入担当', trigger: 'blur' }
          ],
          participants: [
            { required: true, message: '请输入参与对象', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择授课开始时间', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          evaluateUrl: [
            { required: true, message: '请输入评价网址', trigger: 'blur' }
          ],
          teacheringAddress: [
            { required: true, message: '请输入授课地点', trigger: 'blur' }
          ]
        },
        paginations: {
          current_page: 1,
          total: 0,
          pageSize: 5,
          page_sizes: [5, 10, 20],
          layout: 'total, sizes, prev, pager, next, jumper'
        }
      }
    },
    props: ['id'],
    methods: {
      openDialog() {
        this.dialogFormVisible = true
      },
      onSubmit() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            this.table.evaluateCode = await createQR(this.table.evaluateUrl).catch((err) => { this.$message.error(err) })
            addTrainCourse(Object.assign(this.table, { tid: this.id })).then(function(resp) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getList()
              this.table = {
                courseTheme: '',
                content: '',
                teacheringForm: '面授',
                startTime: '',
                endTime: '',
                evaluateUrl: '',
                evaluateCode: '',
                teacheringAddress: '',
                toBear: '',
                participants: ''
              }
              this.dialogFormVisible = false
            }.bind(this)).catch((err) => { this.$message.error(err) })
          } else {
            return false
          }
        })
      },
      getList() {
        trainCourseList({
          tid: parseInt(this.id),
          pageNum: this.paginations.current_page,
          pageSize: this.paginations.pageSize,
          sortColumn: this.search_data.sortColumn,
          type: ''
        }).then(function(resp) {
          this.tableData = resp.data.data.list
          this.paginations.total = resp.data.data.total
        }.bind(this))
      },
      handleDelete(index, scope) {
        this.$confirm('您确定删除信息么?', '删除!', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTrainCourse({ id: scope.id }).then(function(resp) {
            if (resp.data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$message.error(resp.data.errorMsg)
            }
          }.bind(this))
        }).catch(_ => {
        })
      },
      /**
       * 改变当前页事件
       * @param  {number} pageNum 当前页码
       */
      onChangeCurrentPage(pageNum) {
        this.paginations.current_page = pageNum
        this.$nextTick(function() {
          this.getList()
        })
      },

      /**
       * 改变每页显示数量事件
       * @param  {number} size 当前每页显示数量
       */
      onChangePageSize(pageSize) {
        this.paginations.pageSize = pageSize
        this.$nextTick(function() {
          this.getList()
        })
      }
    },
    created() {
      if (this.id) {
        this.getList()
      }
    }
  }

</script>
