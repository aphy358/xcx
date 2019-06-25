//app.js
import './plugins/dateFormat.js'
import store from './plugins/store/index.js'
import { addDays, wxLogin, getUserAndAccount, setRequestFunc2, compareVersion } from './plugins/util.js'


App(store.createApp({
  onLaunch: function () {
    wx.showShareMenu({
      withShareTicket: true
    })

    try {
      var appId = wx.getAccountInfoSync().miniProgram.appId
  
      global.url = appId == 'wx6ac08ec94a8fb611'
        ? 'https://test-huichufa.jlqnb.com'
        : 'https://huichufa.jlqnb.com'
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级到最新微信版本。'
      })
      global.url = 'https://huichufa.jlqnb.com'
    }

    // 获取设备宽度
    var sysInfo = wx.getSystemInfoSync()
    global.deviceWidth = sysInfo.windowWidth
    var statusBarHeight = sysInfo.statusBarHeight

    global.menuRect = wx.getMenuButtonBoundingClientRect()

    // 自定义 request 函数
    setRequestFunc2()

    // if (!wx.cloud) {
    //   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    // } else {
    //   wx.cloud.init({
    //     traceUser: true,
    //   })
    // }
  },
  onShow(options) {
    var _this = this

    // 先尝试着从 storage 里取 openid，如果有，则说明以前登录过
    wx.getStorage({
      key: 'openid',
      success(res) {
        // 尝试着获取用户信息，试一试现在是否还处于登录态，如丢失登录态，则登录
        getUserAndAccount(res.data.openid, res.data.token)
      },
      fail: function (res) {
        // 如果以前从未登录,则登录
        wxLogin()
      }
    })

    wx.getStorage({
      key: 'usePerson',
      success(res) {
        _this.globalData.usePerson = res.data
      }
    })
  },
  globalData: {
    checkin: addDays(new Date),
    checkout: addDays(new Date, 1),

    // 用户信息
    userData: null,

    // 当前是否处于登录态
    isLogin: false,

    // 当前商品详情页要显示的商品信息
    curProductInfo: null,

    usePerson: {}
  }

}))
