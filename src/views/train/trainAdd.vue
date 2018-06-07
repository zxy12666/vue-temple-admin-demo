<template>
  <div class="app-container">
    <div class="form-title">新建培训班</div>
    <basic-info @submit="submit"></basic-info>
  </div>
</template>

<script>
  import { BasicInfo } from '@/components/train'
  import { addTrain } from '@/api/train'
  export default {
    components: {
      BasicInfo
    },
    methods: {
      submit(form) {
        console.log(form)
        addTrain(form).then(function(resp) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({
            name: 'trainEdit',
            params: {
              id: resp.data.data.id
            }
          })
        }.bind(this)).catch((err) => { this.$message.error(err) })
      }
    }
  }
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

