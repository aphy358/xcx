import { checkOuthorize, processProductInfo, processImgUrl, wxPay, payFunc } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

Page(store.createPage({
  /**
   * 页面的初始数据
   */
  data: {
    showPriceDetail: false,
    animationData: {},

    // 预定数量
    num: 1,

    // 用户名
    userName: '',

    // 手机号
    mobile: '',

    // 用户备注
    customRemark: '',

    orderId: null,

    // 是否显示支付失败后的选择弹框
    showPayCancelSelector: false,
    // 正式支付前的数据（timeStamp、nonceStr、package、paySign）
    dataBeforePay: null,

    commissionUserId: ''
  },

  globalData: ['isLogin', 'curProductInfo', 'userData', 'usePerson', 'navHeight'],

  watch: {
    isLogin(newVal) {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    this.setData({
      userName: this.data.usePerson.usePerson || '',
      mobile: this.data.usePerson.tel || '',
      commissionUserId: options.commissionUserId || ''
    })

    this.data.commissionUserId = options.commissionUserId
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
    // 隐藏转发按钮
    wx.hideShareMenu()

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
  },

  inputUserName(e){
    this.setData({
      userName: e.detail.value
    })
  },

  inputMobile(e){
    this.setData({
      mobile: e.detail.value
    })
  },

  inputRemark(e){
    this.setData({
      customRemark: e.detail.value
    })
  },

  // 下单
  placeOrder(){
    var userName = this.data.userName.replace(/^\s+|\s+$/g, '')
    var mobile = this.data.mobile.replace(/^\s+|\s+$/g, '')
    var customRemark = this.data.customRemark.replace(/^\s+|\s+$/g, '')

    if (!userName){
      return wx.showToast({
        title: '姓名必填',
        icon: 'none',
        duration: 2000
      })
    }

    if (userName.length > 30){
      return wx.showToast({
        title: '姓名不能超过30个字符',
        icon: 'none',
        duration: 2000
      })
    }

    if (!mobile){
      return wx.showToast({
        title: '手机号必填',
        icon: 'none',
        duration: 2000
      })
    }

    if (!new RegExp(/^[1][3,4,5,7,8][0-9]{9}$/).test(mobile)) {
      return wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    }

    if (customRemark.length > 200) {
      return wx.showToast({
        title: '备注不能超过200个字符',
        icon: 'none',
        duration: 2000
      })
    }

    wx.showLoading({
      title: '提交订单...',
    });
    var _this = this
    var params = {
      goodsStockId: this.data.curProductInfo.hcfGoodsStock.stockId,
      goodsId: this.data.curProductInfo.hcfGoodsInfo.goodsId,
      amount: this.data.num,
      salePriceAll: this.data.curProductInfo.goodsPrice * this.data.num,
      usePerson: this.data.userName,
      tel: this.data.mobile,
      customRemark: this.data.customRemark,
    }

    if (this.data.commissionUserId && this.data.commissionUserId != 'undefined'){
      params.commissionUserId = this.data.commissionUserId
    }

    global.request({
      url: '/order/saveOrder',
      method: "POST",
      data: params,
      success(res){
        if (res.data.returnCode == 1){
          if (res.data.data.msg == "创建订单成功"){
            var data = res.data.data.hcfOrderInfos[0]
            var orderId = data.orderId
            var total_fee = data.amount * data.salePrice * 100
            _this.setData({
              orderId: orderId
            })
            wxPay(_this, orderId, total_fee)
            _this.setUsePerson(params.usePerson, params.tel)
          }
        }else{
          wx.hideLoading()
          wx.showModal({
            content: res.data.returnMsg,
            showCancel: false,
          })
        }
      }
    })
  },

  // 将使用人信息设置到 storage 里面
  setUsePerson(usePerson, tel){
    wx.setStorage({
      key: "usePerson",
      data: { usePerson, tel }
    })
  },

  // 隐藏支付失败后的选择弹框
  hidePayCancelSelector() {
    this.setData({
      showPayCancelSelector: false
    })
  },
  // 跳转到订单详情
  showOrderDetail() {
    this.hidePayCancelSelector()
    wx.redirectTo({
      url: '/pages/orderDetail/orderDetail?id=' + this.data.orderId,
    })
  },
  // 继续支付
  rePay() {
    this.hidePayCancelSelector()
    payFunc(this, this.data.dataBeforePay)
  }

}))