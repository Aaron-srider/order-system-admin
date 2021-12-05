<template>
  <div class="login-container">
    <div class="login-qrcode">
      <div id="weixin"/>
    </div>

    <span id="errMsg">{{ errMsg }}</span>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'Login',

  data() {
    return {
      errMsg: undefined,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log('route', route)
        console.log(route.query.redirect)
        this.redirect = route.query && route.query.redirect
        this.errMsg = route.query.errMsg
        console.log('this.redirect')
        if (this.redirect) {
          console.log('this.redirect', this.redirect)
          this.$store.commit({
            type: 'settings/STORE_REDIRECT',
            redirect: this.redirect
          })
        }
      },
      immediate: true
    }
  },
  created() {
    request({
      url: '/utils/wxLoginJsFile',
      params: {
        'url': 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
      }
    }).then((res) => {
      const wxJs = res.data
      eval(wxJs)
      var obj = new window.WxLogin({
        self_redirect: false,
        id: 'weixin',
        appid: 'wxb0632e9b62dba6a3',
        scope: 'snsapi_login',
        redirect_uri: encodeURI('http://sp.bistucetc.com/login')
      })
    }, (err) => {
      console.log(err)
    })
  },
  methods: {}
}
</script>

<style scoped>
/deep/ #weixin iframe{
  width: 100%;
}

#weixin{
  position: relative;
  top:100px;
}
</style>

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
  height: 100%;
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




.login-qrcode {
background-color: #30B08F;
height: 100%;
}

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
