<template>
  <div>
    <div class="basicinfo-list-form1">
      <el-table
        :data="surveyData"
        border
        style="width: 100%;text-align: center;">
        <el-table-column
          prop="researchtheme"
          label="调研主题"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="researchurl"
          label="调研网址"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="researchcode"
          label="二维码"
          align="center"
        >
          <template slot-scope="scope">
            <img class="QRimg" :src="scope.row.researchcode" alt="">
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
        新增需求调研
      </div>
    </el-col>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :center="true" width="40%" top="8vh">
      <div slot="title" style="border-bottom: 1px solid #ddd;padding: 15px 0px;">
        <span style="font-size: 20px">新增需求调研</span>
      </div>
      <el-form ref="form" :rules="rules" :model="survey" label-width="120px">
        <el-form-item prop="researchtheme" label="调研主题">
          <el-input v-model="survey.researchtheme"></el-input>
        </el-form-item>
        <el-form-item prop="researchurl" label="调研网址">
          <el-input v-model="survey.researchurl"></el-input>
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
  import { surveyAdd, surveyList, surveyDelete } from '@/api/train'
  export default {
    components: {

    },
    data() {
      return {
        dialogFormVisible: false,
        surveyData: [],
        survey: {
          researchtheme: '',
          researchcode: '',
          researchurl: ''
        },
        // 搜索表单信息
        search_data: {
          pageNum: 1,
          pageSize: 10,
          sortColumn: 'add_time',
          type: ''
        },
        rules: {
          researchtheme: [
            { required: true, message: '请输入调研主题', trigger: 'blur' }
          ],
          researchurl: [
            { required: true, message: '请输入调研网址', trigger: 'blur' }
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
            this.survey.researchcode = await createQR(this.survey.researchurl).catch((err) => { this.$message.error(err) })
            surveyAdd(Object.assign(this.survey, { tid: this.id })).then(function(resp) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getList()
              this.survey = {
                researchtheme: '',
                researchcode: '',
                researchurl: ''
              }
              this.dialogFormVisible = false
            }.bind(this)).catch((err) => { this.$message.error(err) })
          } else {
            return false
          }
        })
      },
      getList() {
        surveyList({
          tid: parseInt(this.id),
          pageNum: this.paginations.current_page,
          pageSize: this.paginations.pageSize,
          sortColumn: this.search_data.sortColumn,
          type: ''
        }).then(function(resp) {
          this.surveyData = resp.data.data.list
          this.paginations.total = resp.data.data.total
        }.bind(this))
      },
      handleDelete(index, scope) {
        this.$confirm('您确定删除信息么?', '删除!', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          surveyDelete({ id: scope.id }).then(function(resp) {
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
