// miniprogram/pages/placeOrder/placeOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPriceDetail: false,
    animationData: {},
    num: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    })
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

  togglePriceDetail(){
    this.data.showPriceDetail
      ? this.hidePriceDetail()
      : this.showPriceDetail()
  },
  hidePriceDetail(){
    this.animation.bottom('-20rpx').step()
    this.setData({
      showPriceDetail: false,
      animationData: this.animation.export()
    })
  },
  showPriceDetail(){
    this.animation.bottom('110rpx').step()
    this.setData({
      showPriceDetail: true,
      animationData: this.animation.export()
    })
  },
  addNum(){
    var newNum = Math.min(8, ++this.data.num)

    this.setData({
      num: newNum
    })
  },
  reduceNum(){
    var newNum = Math.max(1, --this.data.num)

    this.setData({
      num: newNum
    })
  }

})