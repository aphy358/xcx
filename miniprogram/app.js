//app.js
import './plugins/dateFormat.js'
import store from './plugins/store/index.js'
import { addDays } from './plugins/util.js'

App(store.createApp({
  onLaunch: function () {
    global.url = 'https://sz.jltour.com'
    global.deviceWidth = wx.getSystemInfoSync().windowWidth

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      checkin: addDays(new Date),
      checkout: addDays(new Date, 1),
    }

    wx.login({
      success(res){
        if (res.code) {
          //发起网络请求
          wx.request({
            url: global.url,
            data: {
              code: res.code
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
}))
