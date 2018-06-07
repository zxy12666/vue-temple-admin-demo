<template>
  <div>
    <el-dialog
      title="帮助中心"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :fullscreen="true"
      width="70%"
    >
      <div v-show="loading" v-loading="true"></div>
      <pdf
        v-for="i in numPages"
        :key="i"
        :src="loadingTask"
        :page="i"
        style="display: inline-block; width: 100%"
        @loaded="loading=false"
      ></pdf>
    </el-dialog>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
  export default {
    components: {
      pdf
    },
    data() {
      return {
        loadingTask: '',
        numPages: undefined,
        dialogVisible: false,
        loading: true
      }
    },
    props: ['url'],
    methods: {
      openPdf() {
        this.dialogVisible = true
      }
    },
    mounted() {
      this.loadingTask.then(pdf => {
        this.numPages = pdf.numPages
      })
    },
    created() {
      console.log(this.url)
      this.loadingTask = pdf.createLoadingTask(this.url)
    }
  }

</script>
