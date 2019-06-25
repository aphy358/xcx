import { updateUserInfo } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

Page(store.createPage({

  /**
   * 页面的初始数据
   */
  data: {
    bottom: 58,
  },

  globalData: ['userData'],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bottom: global.menuRect.bottom
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  filterEmoji: function(emoji){
    var ranges = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    var emojireg = emoji;
    return emojireg.replace(ranges, '');
  },

  onGotUserInfo(e){
    if (e.detail.userInfo){
      wx.setStorage({
        key: "authorize",
        data: {}
      })

      // 处理用户信息的 nickname，以防带有表情而无法保存
      e.detail.userInfo.nickName = this.filterEmoji(e.detail.userInfo.nickName)

      global.userInfo = e.detail.userInfo
      if (this.data.userData) { // 此时将最新的 userInfo 合并到之前返回的 userData 里面
        Object.assign(this.data.userData.hcfUser, e.detail.userInfo)
      }
      store.dispatch('userData', this.data.userData)  // 保存到 store

      updateUserInfo(e.detail.userInfo)

      wx.navigateBack({
        delta: 1
      })
    }
  },

  // 跳转到首页
  gotoIndex(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
}))