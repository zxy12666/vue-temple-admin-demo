<template>
  <div>
    <div class="basicinfo-list-form1">
      <el-table
        :data="pretrainData"
        border
        style="width: 100%;text-align: center;">
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="courseUrl"
          label="调研网址"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="courseCode"
          label="二维码"
          align="center"
        >
          <template slot-scope="scope">
            <img class="QRimg" :src="scope.row.courseCode" alt="">
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
      <el-form ref="form" :rules="rules" :model="pretrain" label-width="120px">
        <el-form-item prop="courseName" label="课程名称">
          <el-input v-model="pretrain.courseName"></el-input>
        </el-form-item>
        <el-form-item prop="courseUrl" label="课程网址">
          <el-input v-model="pretrain.courseUrl"></el-input>
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
  import { addPretrainCourse, delPretrainCourse, pretrainCourseList } from '@/api/train'
  export default {
    components: {

    },
    data() {
      return {
        dialogFormVisible: false,
        pretrainData: [],
        pretrain: {
          courseName: '',
          courseCode: '',
          courseUrl: ''
        },
        // 搜索表单信息
        search_data: {
          pageNum: 1,
          pageSize: 10,
          sortColumn: 'add_time',
          type: ''
        },
        rules: {
          courseName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
          courseUrl: [
            { required: true, message: '请输入课程网址', trigger: 'blur' }
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
            this.pretrain.courseCode = await createQR(this.pretrain.courseUrl).catch((err) => { this.$message.error(err) })
            addPretrainCourse(Object.assign(this.pretrain, { tid: this.id })).then(function(resp) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getList()
              this.pretrain = {
                courseName: '',
                courseCode: '',
                courseUrl: ''
              }
              this.dialogFormVisible = false
            }.bind(this)).catch((err) => { this.$message.error(err) })
          } else {
            return false
          }
        })
      },
      getList() {
        pretrainCourseList({
          tid: parseInt(this.id),
          pageNum: this.paginations.current_page,
          pageSize: this.paginations.pageSize,
          sortColumn: this.search_data.sortColumn,
          type: ''
        }).then(function(resp) {
          this.pretrainData = resp.data.data.list
          this.paginations.total = resp.data.data.total
        }.bind(this))
      },
      handleDelete(index, scope) {
        this.$confirm('您确定删除信息么?', '删除!', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delPretrainCourse({ id: scope.id }).then(function(resp) {
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
