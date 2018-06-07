import { mapState } from 'vuex'
import { USER_SIGNIN } from '../../store/modules/user'
import { mapActions } from 'vuex'
import { listTrain, delTrain } from '@/api/train'
import { parseTime } from '@/utils'
export default {
  name: 'order-infoList',
  data() {
    return {
      article_list: [],
      corList: [],
      corListN: [],
      userCorList: [],
      currentRow: '',
      transData: '',
      transTableVisible: false,
      statusList: [{
        value: 'start_time',
        label: '开始时间'
      }, {
        value: 'sign_start_time',
        label: '报名时间'
      }],
      batch_id: '', // 批量删除时这是多个用逗号隔开的id字符串
      batch_flag: true, // 符合批量删除为true,否则为false
      // 搜索表单信息
      search_data: {
        key: '',
        pageNum: 1,
        pageSize: 10,
        sortColumn: 'start_time',
        type: ''
      },
      tags: [],
      // 需要给分页组件传的信息
      paginations: {
        current_page: 1,
        total: 0,
        pageSize: 10,
        page_sizes: [20, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      fields: {
        number: {
          info: {
            prop: 'id',
            label: '序号',
            sortable: false
          },

          style: {
            width: '180',
            align: 'center'
          }
        },
        className: {
          info: {
            prop: 'className',
            label: '培训班名称',
            sortable: false
          },

          style: {
            width: '260',
            align: 'center'
          }
        },
        startTime: {
          info: {
            prop: 'startTime',
            label: '培训开始时间',
            sortable: false
          },
          style: {
            width: '260',
            align: 'center'
          }
        },
        endTime: {
          info: {
            prop: 'endTime',
            label: '培训结束时间',
            sortable: false
          },
          style: {
            width: '260',
            align: 'center'
          }
        },
        address: {
          info: {
            prop: 'address',
            label: '培训地点',
            sortable: false
          },
          style: {
            width: '180',
            align: 'center'
          }
        },
        classTeacher: {
          info: {
            prop: 'classTeacher',
            label: '带班老师',
            sortable: false
          },
          style: {
            width: '180',
            align: 'center'
          }
        },
        tel: {
          info: {
            prop: 'tel',
            label: '联系方式',
            sortable: false
          },

          style: {
            width: '260',
            align: 'center'
          }
        }
      },
      dialog: {
        detailData: '',
        visible: false,
        status: ''
      },
      centerDialogVisible: false,
      transfer: {
        patentId: '',
        sourceOrg: '',
        sourceOrgName: '',
        targetOrg: '',
        targetOrgName: ''
      },
      filename: '表格1',
      autoWidth: true,
      downloadLoading: false
    }
  },
  methods: {
    ...mapActions([USER_SIGNIN]),
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['专利号', '专利名称', '专利类型']
        const filterVal = ['id', 'name', 'typeName']
        const list = this.article_list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    detectZoom() {
      let ratio = 0
      const screen = window.screen
      const ua = navigator.userAgent.toLowerCase()

      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio
      } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI
        }
      } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth
      }

      if (ratio) {
        ratio = Math.round(ratio * 100)
      }

      return ratio
    },
    isScale() {
      const rate = window.outerWidth / window.innerWidth
      if ((rate * 10 - 10) > 1) {
        // 如何让页面的缩放比例自动为100,'transform':'scale(1,1)'没有用，又无法自动条用键盘事件，目前只能提示让用户如果想使用100%的比例手动去触发按ctrl+0
        this.$notify({
          title: '提示',
          message: '当前页面不是100%显示，请点击设置浏览器缩放，以防页面显示错乱！',
          duration: 0,
          position: 'bottom-right',
          type: 'warning'
        })
      }
    },
    closeDialog() {
      this.dialog.visible = false
    },
    closeDialog1() {
      this.transTableVisible = false
    },
    /**
         * 格式化状态
         */

    formatterStatus(item) {
      return this.format_status_list[item.status]
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'trainEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDelete(index, row) {
      // if (this.$store.state.user.roleId !== 1) {
      //   this.$message({
      //     message: '没有删除权限',
      //     type: 'warning'
      //   })
      //   return false
      // }
      this.$confirm('您确定删除信息么?', '删除!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row.id)
        delTrain({
          id: row.id
        }).then(function(resp) {
          if (resp.data.success === true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else if (resp.data.success === false) {
            this.$message({
              message: '删除失败',
              type: 'warning'
            })
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
    },
    tagHandleClose(tag) {
      console.info(tag)
      this.tags.splice(this.tags.indexOf(tag), 1)
      if (tag.type === 'key') {
        this.search_data.key = ''
      } else if (tag.type === 'status') {
        this.search_data.status = ''
      }
      this.getList()
    },
    getList() {
      listTrain({
        pageNum: this.paginations.current_page,
        pageSize: this.paginations.pageSize,
        sortColumn: this.search_data.sortColumn,
        type: '',
        key: this.search_data.key
      }).then(function(resp) {
        this.article_list = resp.data.data.list
        this.paginations.total = resp.data.data.total
      }.bind(this))
    },
    indexMethod(index) {
      return index + (this.paginations.current_page - 1) * this.paginations.pageSize + 1
    }
  },
  created() {
    this.getList()
    history.pushState({}, '', window.location.href = window.location.href.replace(window.location.search, ''))
  },
  computed: {
    ...mapState({ user: state => state.user }),
    ...mapState({ control: state => state.control })
  },
  mounted() {
    this.isScale()
  },
  '$route'(to, from) {

  },
  watch: {
    // 通过这种语法来watch就行，文档里有。。。看需求，还可以直接watch data，使用deep:true来深度观察
    'search_data': {
      handler: function(val, oldVal) {
        this.getList()
      },
      // 深度观察
      deep: true
    }
  },
  components: {
  }
}
