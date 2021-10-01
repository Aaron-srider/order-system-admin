<template>
  <div class="login-container">
    <div id="weixin"></div>

    <span id="errMsg">{{errMsg}}</span>

    <!--<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"-->
    <!--label-position="left">-->

    <!--<div class="title-container">-->
    <!--<h3 class="title">Login Form</h3>-->
    <!--</div>-->

    <!--<el-form-item prop="username">-->
    <!--<span class="svg-container">-->
    <!--<svg-icon icon-class="user"/>-->
    <!--</span>-->
    <!--<el-input-->
    <!--ref="username"-->
    <!--v-model="loginForm.username"-->
    <!--placeholder="Username"-->
    <!--name="username"-->
    <!--type="text"-->
    <!--tabindex="1"-->
    <!--auto-complete="on"-->
    <!--/>-->
    <!--</el-form-item>-->

    <!--<el-form-item prop="password">-->
    <!--<span class="svg-container">-->
    <!--<svg-icon icon-class="password"/>-->
    <!--</span>-->
    <!--<el-input-->
    <!--:key="passwordType"-->
    <!--ref="password"-->
    <!--v-model="loginForm.password"-->
    <!--:type="passwordType"-->
    <!--placeholder="Password"-->
    <!--name="password"-->
    <!--tabindex="2"-->
    <!--auto-complete="on"-->
    <!--@keyup.enter.native="handleLogin"-->
    <!--/>-->
    <!--<span class="show-pwd" @click="showPwd">-->
    <!--<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>-->
    <!--</span>-->
    <!--</el-form-item>-->

    <!--<el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"-->
    <!--@click.native.prevent="handleLogin">Login-->
    <!--</el-button>-->

    <!--<div class="tips">-->
    <!--<span style="margin-right:20px;">username: admin</span>-->
    <!--<span> password: any</span>-->
    <!--</div>-->

    <!--</el-form>-->
  </div>
</template>
<script>
  import {validUsername} from '@/utils/validate'
  import RemoteScript from '@/components/Common/remote-script'
  import request from "@/utils/request";


  export default {
    name: 'Login',
    components: {
      RemoteScript
    },
    mounted() {

      // //权宜之计，便于手动获取code,方便调试接口
      // !function (a, b, c) {
      //   function d(a) {
      //     var c = "default";
      //     a.self_redirect === !0 ? c = "true" : a.self_redirect === !1 && (c = "false");
      //     var d = b.createElement("iframe"),
      //       e = "https://open.weixin.qq.com/connect/qrconnect?appid=" + a.appid + "&scope=" + a.scope + "&redirect_uri=" + a.redirect_uri + "&state=" + a.state + "&login_type=jssdk&self_redirect=" + c + '&styletype=' + (a.styletype || '') + '&sizetype=' + (a.sizetype || '') + '&bgcolor=' + (a.bgcolor || '') + '&rst=' + (a.rst || '');
      //     e += a.style ? "&style=" + a.style : "", e += a.href ? "&href=" + a.href : "", d.src = e, d.frameBorder = "0", d.allowTransparency = "true", d.scrolling = "no", d.width = "300px", d.height = "400px";
      //     var f = b.getElementById(a.id);
      //     f.innerHTML = "", f.appendChild(d)
      //   }
      //
      //   a.WxLogin = d
      // }(window, document);

      request({
        url: "/utils/wxLoginJsFile",
        params: {
          "url": "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
        }
      }).then((res) => {
        const wxJs = res.data
        eval(wxJs)
        var obj = new window.WxLogin({
          self_redirect: false,
          id: "weixin",
          appid: "wxb0632e9b62dba6a3",
          scope: "snsapi_login",
          redirect_uri: encodeURI("http://sp.bistucetc.com/login"),
        });

      }, (err) => {
        console.log(err)
      })
    },

    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {

        errMsg:undefined,
        loginForm: {
          username: 'admin',
          password: '111111'
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function (route1) {
          console.log(route1)
          // console.log(route2)
          console.log(route1.query)
          console.log(route1.query.redirect)
          this.redirect = route1.query && route1.query.redirect
          this.errMsg=route1.query.errMsg
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true

            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                console.log("login success")
                console.log(this.redirect)
                this.$router.push({path: this.redirect || '/'})
                console.log("route success")
                this.loading = false
              }).catch(() => {
              // this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
