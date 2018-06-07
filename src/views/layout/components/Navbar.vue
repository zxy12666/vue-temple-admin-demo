<template>
  <el-menu class="head-nav" mode="horizontal">
      <el-row>
        <el-col :span="4" class='logo-container'>
          <img src="/static/img/logo.png" class='logo' alt="" @click="this.$i18n.locale = lang">
        </el-col>
        <el-col :span="16">
          <div style="line-height: 60px; text-align: left;margin-left: -20px;">管理系统</div>
        </el-col>
        <el-col :span="2">
            <div class="help-contain">
              <el-tooltip effect="dark" content="帮助中心" placement="bottom">
              <svg class="help" aria-hidden="true" @click="openPdf()">
                <use xlink:href="#icon-help"></use>
              </svg>
              </el-tooltip>
            </div>
        </el-col>
        <el-col :span="2" class='userinfo'>
          <el-menu class="navbar" mode="horizontal">
            <el-dropdown class="avatar-container" trigger="click">
              <div class="avatar-wrapper">
                {{$store.state.user.userName}}
              </div>
              <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <el-dropdown-item>
                  <span @click="logout" style="display:block;">退出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu>
        </el-col>
      </el-row>
      <Pdf ref="pdf" url='http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'></Pdf>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Pdf from '@/components/Pdf'
import { mapActions } from 'vuex'
import { USER_SIGNOUT } from '@/store/modules/user'
import { logout } from '@/api/login'

export default {
  data() {
    return {
      url: 'http://jhcp.com.cn:8090/JH_EL/course/201512/C-ZY-ZY067.pdf'
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    Pdf
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    ...mapActions([USER_SIGNOUT]),
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$confirm('你确定退出登录么?', '确认退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout().then(function(resp) {
          if (resp.data.success) {
            this.USER_SIGNOUT()
            this.$router.push('/login')
          } else {
            this.$message.error(resp.data.errorMsg)
          }
        }.bind(this))
      }).catch()
    },
    openPdf() {
      this.$refs.pdf.openPdf()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 60px;
  line-height:60px;
  border-radius: 0px !important;
  background: #324057;
  color: #FFF;
  border-bottom: 1px solid #1F2D3D;
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 60px;
    .avatar-wrapper {
      color: #FFF;
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

