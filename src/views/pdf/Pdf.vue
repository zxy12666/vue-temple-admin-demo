<template>
  <div>
    <button @click="openPdf">打开PDF</button>
    <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue" @uploadpic="uploadpic"></UE>
    <el-dialog
      title="帮助中心"
      :visible.sync="dialogVisible"

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
  import UE from '../../components/ue.vue'
  import { bus } from '@/store/bus'
  export default {
    components: {
      pdf,
      UE
    },
    data() {
      return {
        loadingTask: '',
        numPages: undefined,
        dialogVisible: false,
        loading: true,
        defaultMsg: '<span style="orphans: 2; widows: 2; font-size: 22px; font-family: KaiTi_GB2312; background-color: rgb(229, 51, 51);"><strong>夏钧11姗：成功的投资需具备哪些心态和掌握哪些重要止损位</strong></span>',
        config: {
          toolbars: [['FullScreen', 'Source', 'Undo', 'Redo', 'bold', 'test', 'camnpr', 'print']],
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
        ue1: 'ue1'
      }
    },
    methods: {
      openPdf() {
        this.dialogVisible = true
      },
      uploadpic() {
        console.log('uploadpic')
      }
    },
    mounted() {
      this.loadingTask.then(pdf => {
        this.numPages = pdf.numPages
      })
    },
    created() {
      this.loadingTask = pdf.createLoadingTask('http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
      bus.$on('uploadpic', () => {
        this.uploadpic()
      })
    }
  }

</script>
