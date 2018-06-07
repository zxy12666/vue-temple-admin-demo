import { mapActions } from 'vuex'
import { USER_SIGNIN } from '../../store/modules/user'
import { mapState } from 'vuex'
import store from '../../store'
// eslint-disable-next-line
import { login, loginByName } from '@/api/login'
export default {
  name: 'login',
  data() {
    return {
      divShow: true,
      winSize: {
        width: '',
        height: ''
      },

      formOffset: {
        position: 'absolute',
        left: '',
        top: ''
      },

      remumber: this.$store.state.user.remumber,

      register: false,

      login_actions: {
        disabled: false
      },

      data: {
        loginName: '',
        password: ''
      },

      rule_data: {
        loginName: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'))
            } else {
              callback()
            }
            // else {
            // 	if (/^[a-zA-Z0-9_-]{1,16}$/.test(value)) {
            // 		callback();
            // 	} else {
            // 		callback(new Error('用户名至少6位,由大小写字母和数字,-,_组成'));
            // 	}
            // }
          },
          trigger: 'blur'
        }],
        password: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else {
              callback()
            }
            // else {
            // 	if (!(/^[a-zA-Z0-9_-]{6,16}$/.test(value))) {
            // 		callback(new Error('密码至少6位,由大小写字母和数字,-,_组成'));
            // 	} else {
            // 		if (this.register === true) {
            // 			if (this.data.repassword !== '') {
            // 				this.$refs.data.validateField('repassword');
            // 			}
            // 		}
            // 		callback();
            // 	}
            //
            // }
          },
          trigger: 'blur'
        }],
        repassword: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.data.password) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        mark: false
      }
    }
  },
  methods: {
    ...mapActions([USER_SIGNIN]),
    setSize() {
      this.winSize.width = this.$lib_$(window).width() + 'px'
      this.winSize.height = this.$lib_$(window).height() + 'px'

      this.formOffset.left = (parseInt(this.winSize.width) / 2 - 175) + 'px'
      this.formOffset.top = (parseInt(this.winSize.height) / 2 - 178) + 'px'
    },

    onLogin(ref, type) {
      if (type && this.register === true) {
        this.$message.error('请输入确认密码')
        return
      }
      this.$refs[ref].validate((valid) => {
        if (valid) {
          this.login_actions.disabled = true
          this.$router.push({ path: '/project/index' })
          // 如果记住密码，提交的信息包括真实token，密码则是假的
          // 服务端登录验证优先级：用户名必须，其次先取token，不存在时再取密码
          // login(this[ref]).then(response => {
          //   if (response.data.success) {
          //     this.$message.success('验证成功，已登录。')
          //     this.USER_SIGNIN(response.data.data)
          //     this.$router.push({ path: '/project/index' })
          //   } else {
          //     this.$message.error(response.data.errorMsg)
          //     this.login_actions.disabled = false
          //   }
          // }).catch((res) => { console.log(res) })
        }
      })
    },

    onRegister(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          this.login_actions.disabled = true
          this.$$api_user_register({
            data: this[ref],
            fn: data => {
              this.login_actions.disabled = false
              this.$message.success('注册成功，请登录。')
              this.toggleStatus(false)
            },
            errFn: () => {
              this.login_actions.disabled = false
            },
            tokenFlag: true
          })
        }
      })
    },

    resetForm(ref) {
      this.$refs[ref].resetFields()
    },

    toggleStatus(type) {
      this.register = type
      if (this.register === true) {
        this.$set(this.data, 'repassword', '')
      } else {
        this.$delete(this.data, 'repassword')
      }
    }
  },
  created() {
    this.setSize()
    this.$lib_$(window).resize(() => {
      this.setSize()
    })
    if (window.location.href.match(/userno=.*?(?=(&|$))/g) != null && !store.state.user.userno) {
      this.divShow = false
      loginByName({
        loginName: window.location.href.match(/userno=.*?(?=(&|$))/g)[0].split('userno=')[1].split('#/')[0]
      }).then(function(resp) {
        if (resp.data.success === true) {
          this.$message.success('验证成功，已登录。')
          this.USER_SIGNIN(resp.data.data)
          this.$router.push({ path: '/project/index' })
        } else {
          this.$message.error(resp.data.errorMsg)
        }
      }.bind(this))
    }
    console.log(window.location.href)
  },

  mounted() {
    // this.toggleStatus(true);
    // console.log(this.remumber);

    // 如果上次登录选择的是记住密码并登录成功，则会保存状态，用户名以及token
    // if (this.remumber.remumber_flag === true) {
    // 	this.data.loginName = this.remumber.remumber_login_info.loginName;
    // 	this.data.password = this.remumber.remumber_login_info.token.substring(0, 16);
    // 	this.$set(this.data, 'token', this.remumber.remumber_login_info.token);
    // }
  },
  computed: {
    ...mapState({ user: state => state.user }),
    ...mapState({ control: state => state.control })

  }
}
