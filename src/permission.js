import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress Configuration

//全局路由白名单
const whiteList = ['/login', '/404']

//全局路由守卫，不拦截/login
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  //设置跳转页面的标题
  document.title = getPageTitle(to.meta.title)

  //判断用户是否登录
  const hasToken = getToken()


  //如果已经登录，守卫放行
  if (hasToken) {
    next()
    NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      //如果没有登录，守卫拦截重定向到登录页面
      let redirect = `/login?redirect=${to.path}`
      next(redirect)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
