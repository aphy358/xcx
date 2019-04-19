//app.js
import './plugins/dateFormat.js'
import store from './plugins/store/index.js'
import { addDays } from './plugins/util.js'

App(store.createApp({
  onLaunch: function () {
    
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
  }
}))
