//app.js
import './plugins/dateFormat.js'
import store from './plugins/store/index.js'
import { addDays } from './plugins/util.js'


App(store.createApp({
  onLaunch: function () {
    var appId = wx.getAccountInfoSync().miniProgram.appId

    global.url = appId == 'wx6ac08ec94a8fb611'
      ? 'https://test.huichufa.jlqnb.com'
      : 'https://huichufa.jlqnb.com'

    global.deviceWidth = wx.getSystemInfoSync().windowWidth

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.login({
      success(res){
        if (res.code) {
          //发起网络请求
          wx.request({
            url: global.url + '/login/autoLoginWx',
            data: {
              code: res.code
            },
            success(res) {
              console.log(res.data)
            },
            fail(res) {
              console.log('failed')
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    checkin: addDays(new Date),
    checkout: addDays(new Date, 1),
  }

}))
