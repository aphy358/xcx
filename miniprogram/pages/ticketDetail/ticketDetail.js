// miniprogram/pages/ticketDetail/ticketDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerSwiper: [
      {
        hotelId: '193847',
        img: 'http://image.jladmin.cn/real_1559184376702.png'
      },
    ],

    showNavBarTitle: false,

    showCanvasImg: false,

    shareImgPath: '',

    canvasUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onShareAppMessage: function (res) {
  },

  onPageScroll(e) {
    var scrollTop = 100 * global.deviceWidth / 375

    if (e.scrollTop >= scrollTop) {
      this.setData({
        showNavBarTitle: true
      })
    } else {
      this.setData({
        showNavBarTitle: false
      })
    }
  },


  showCanvasImg(){
    this.setData({
      showCanvasImg: true
    })
  },


  // 隐藏 canvas 图片
  hideCanvasImg(){
    this.setData({
      showCanvasImg: false
    })
  },


  // 进入到订单填写页
  gotoPlaceOrder(){
    wx.navigateTo({
      url: '/pages/placeOrder/placeOrder',
    })
  }

})