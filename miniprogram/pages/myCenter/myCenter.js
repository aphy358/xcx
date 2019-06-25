
import { checkOuthorize, getUserAndAccount } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

// miniprogram/pages/myCenter/myCenter.js
Page(store.createPage({

  /**
   * 页面的初始数据
   */
  data: {
    isVip: 0,
    loadingHidden: true
  },

  globalData: ['userData', 'navHeight'],

  watch: {
    userData(newVal){
      if (newVal){
        this.setData({
          isVip: newVal.hcfUser.type,
          loadingHidden: false
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  
  toOrderList(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../myOrder/myOrder?id=' + id,
    })
  },
  editUser(){
    wx.navigateTo({
      url: '../editUser/editUser',
    })
  },
  cashOut(){
    wx.navigateTo({
      url: '../cashOut/cashOut',
    })
  },
  budgetDetail(){
    wx.navigateTo({
      url: '../accountDetail/accountDetail',
    })
  },
  call(){
    wx.showModal({
      title: '客服电话',
      content: '请拨打客服电话：0755-33397777',
      confirmText: '拨打电话',
      confirmColor: '#2577e3',
      success (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '0755-33397777'
          })
        }
      }
    })
  },
  moneyNumTips(){
    wx.showModal({
      title: '待入账金额',
      content: '在订单入住/确定后可解冻提现，约 3个工作日到账',
      confirmColor: '#2577e3',
      showCancel: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 检查是否已经授权过
    checkOuthorize()
    getUserAndAccount();
    if (this.data.userData) {
      this.setData({
        isVip: this.data.userData.hcfUser.type,
        loadingHidden: false
      })
    }
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

  }
}))