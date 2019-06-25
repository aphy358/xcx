import store from '../../plugins/store/index.js'
import { processProductInfo } from '../../plugins/util.js'

Page(store.createPage({
  data: {
    showPacket: false,
    orderInfo: {},
    financeInfo: {},
    beginDate: '',
    endDate: '',
    hour: '00',
    minutes: '00',
    seconds: '00',
    showShareSelector: false,
    orderId: '',

    // 商品信息
    productInfo: null,
    loadingHidden: true,
    oncePay: false,
    payHasClosed: false
  },
  
  globalData: ['userData', 'navHeight'],

  watch: {
    userData(newVal) {
      if (newVal) {
        this.getOrderDetail()
        this.setData({
          loadingHidden: false
        });
      }
    }
  },
  
  cancelOrder: function () {
    let _this = this;
    wx.showModal({
      content: '确定申请取消订单',
      confirmColor: '#2577e3',
      success (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/cancelOrder/cancelOrder?id=' + _this.data.orderId + '&price=' + _this.data.orderInfo.salePriceAll + '&name=' + _this.data.orderInfo.usePerson + '&tel=' + _this.data.orderInfo.tel,
          })
        }
      }
    })
  },
  closePacket: function () {
    this.setData({
      showPacket: false,
      payHasClosed: true,
      oncePay: false
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
  rePay(){
    wx.navigateTo({
      url: '/pages/rePay/rePay?id=' + this.data.orderId,
    })
  },
  share(){
    this.setData({
      showShareSelector: true
    })
  },
  getOrderDetail(id){
    let _this = this;
    wx.showLoading({
      title: '查询中',
    });
    global.request({
      url: '/order/orderDetail',
      data: {
        orderId: _this.data.orderId
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        let obj = res.data;
        if (obj.returnCode === 1){
          if (obj.data.hcfOrderInfo.status === 0){
            _this.initGapTime(obj.data.hcfOrderFinance.receiptTimeLimit);
          }

          processProductInfo(obj.data)

          _this.setData({
            orderInfo: obj.data.hcfOrderInfo,
            financeInfo: obj.data.hcfOrderFinance,
            productInfo: obj.data,
            canCancel: new Date() < new Date(obj.data.hcfGoodsStock.beginDate.replace(/-/g, '/')),
            showPacket: _this.data.oncePay && obj.data.hcfGoodsStock.isDistribution === 0,
          })
          
          if ('0,1,4'.indexOf(obj.data.hcfOrderInfo.status) !== -1){
            _this.setData({
              beginDate: obj.data.hcfOrderInfo.useBeginDate.split(' ')[0],
              endDate: obj.data.hcfOrderInfo.useEndDate.split(' ')[0]
            })
          }else{
            _this.setData({
              beginDate: obj.data.hcfOrderInfo.jlCheckInDate.split(' ')[0],
              endDate: obj.data.hcfOrderInfo.jlCheckOutDate.split(' ')[0]
            })
          }
        }
      }
    })
  },
  initGapTime(deadlineVal){
    let _this = this;
    let now = new Date();
    let deadline = new Date(deadlineVal.replace(/-/g, '/'));
    let gap = deadline - now;
    if (gap <= 0){
      this.setData({
        hour: '00',
        minutes: '00',
        seconds: '00',
      })
    }else{
      let hour = Math.floor(gap / 1000 / 60 / 60);
      let minutes = Math.floor(gap / 1000 / 60) % 60;
      let seconds = Math.floor(gap / 1000) % 60;
      this.setData({
        hour: hour >= 10 ? hour : '0' + hour,
        minutes: minutes >= 10 ? minutes : '0' + minutes,
        seconds: seconds >= 10 ? seconds : '0' + seconds,
      });
      setTimeout(function () {
        _this.initGapTime(deadlineVal);
      },1000)
    }
  },
  hideSelector(){
    this.setData({
      showShareSelector: false
    })
  },
  readOrder(){
    this.setData({
      showPacket: false
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        orderId: +options.id
      });
    }
    if (options && options.showPacket && !this.data.payHasClosed){
      this.setData({
        oncePay: true
      });
    }
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 检查是否已经授权过
    if (this.data.userData){
      this.setData({
        loadingHidden: false
      });
      this.getOrderDetail(this.data.orderId)
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.productInfo.hcfGoodsInfo.goodsName,
      path: 'pages/ticketDetail/ticketDetail?goodsId=' + this.data.productInfo.hcfGoodsInfo.goodsId + '&commissionUserId=' + this.data.userData.hcfUser.userId,
      imageUrl: this.data.productInfo.hcfGoodsInfo.goodsPoster || this.data.productInfo.hcfGoodsInfo.goodsImgArr[0]
    }
  },

  gotoTicketDetail() {
    wx.navigateTo({
      url: '/pages/ticketDetail/ticketDetail?goodsId=' + this.data.productInfo.hcfGoodsInfo.goodsId,
    })
  },
}));