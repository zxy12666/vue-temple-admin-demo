<template>
  <div>
    <el-tabs v-model="activeName2" :lazy="true" type="border-card" @tab-click="handleClick" >
      <el-tab-pane label="基本信息" name="first">
        <transition name="fade" mode="out-in">
          <basic-info :id="id" class="trans" v-if="activeName2=='first'" @showTab="showTab" @submit="submit"></basic-info>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('需求调研')" label="需求调研" name="second">
        <transition name="fade" mode="out-in">
          <survey :id="id" class="trans" v-if="activeName2=='second'"></survey>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('课程表(含评价)')" label="课程表(含评价)" name="third">
        <transition name="fade" mode="out-in">
          <Timetable :id="id" class="trans" v-if="activeName2=='third'"></Timetable>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('训前学习')" label="训前学习" name="fourth">
        <transition name="fade" mode="out-in">
          <Pretrain :id="id" class="trans" v-if="activeName2=='fourth'"></Pretrain>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('训前作业')" :lazy="true" label="训前作业" name="fifth">
        <transition name="fade" mode="out-in">
          <Workupload :id="id" class="trans" type="Q" v-if="activeName2=='fifth'"></Workupload>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('研讨')" :lazy="true" label="研讨" name="sixth">
        <transition name="fade" mode="out-in">
          <Discuss class="trans" v-if="activeName2=='sixth'" :id="id"></Discuss>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('行动计划')" label="行动计划" name="eighth">
        <transition name="fade" mode="out-in">
          <Workupload :id="id" class="trans" type="X" v-if="activeName2=='eighth'"></Workupload>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('训后作业')" :lazy="true" label="训后作业" name="ninth">
        <transition name="fade" mode="out-in">
          <Workupload :id="id" class="trans" type="H" v-if="activeName2=='ninth'"></Workupload>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('学员手册')" label="学员手册" name="tenth">
        <transition name="fade" mode="out-in">
          <Report :id="id" class="trans" v-if="activeName2=='tenth'"></Report>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="tabControl('发送邀请')" label="发送邀请" name="twentyh">
        <transition name="fade" mode="out-in">
          <Invitation :id="id" class="trans" v-if="activeName2=='twentyh'"></Invitation>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { BasicInfo, Survey, Timetable, Pretrain, Workupload, Discuss, Report, Invitation } from '@/components/train'
  import { editTrain } from '@/api/train'

  export default {
    components: {
      BasicInfo,
      Survey,
      Timetable,
      Pretrain,
      Workupload,
      Discuss,
      Report,
      Invitation
    },
    data() {
      return {
        activeName2: 'first',
        id: '',
        showTabs: ['需求调研', '课程表', '训前学习', '训前作业', '行动计划', '训后作业', '研讨', '学员手册', '发送邀请']
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      submit(form) {
        editTrain(form).then(function(resp) {
          if (resp.data.success) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            this.$message.error(resp.data.errorMsg)
          }
        }.bind(this))
      },
      showTab(tabArr) {
        console.log(tabArr)
        this.showTabs = tabArr
      },
      tabControl(v) {
        return this.showTabs.includes(v)
      }
    },
    created() {
      if (this.$route.params.id) {
        this.id = this.$route.params.id
      }
    }
  }

</script>
<style type="text/css">
  .trans{
    overflow: hidden;
    animation: slide 1s ease-out forwards;
  }
  @keyframes slide {
    0%{
      max-height:0px;
    }
    100% {
      max-height:800px;
    }
  }
</style>
