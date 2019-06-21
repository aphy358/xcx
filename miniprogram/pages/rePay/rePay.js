import { wxPay, payFunc, processProductInfo } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

Page(store.createPage({
  data: {
    orderId: '3',
    hour: '00',
    minutes: '00',
    seconds: '00',
    beginDate: '0000-00-00',
    endDate: '0000-00-00',
    totalFee: 0,

    // 是否显示支付失败后的选择弹框
    showPayCancelSelector: false,
    // 正式支付前的数据（timeStamp、nonceStr、package、paySign）
    dataBeforePay: null
  },
  globalData: ['isLogin'],
  
  getOrderDetail(id){
    let _this = this;
    wx.showLoading({
      title: '查询中',
    });
    global.request({
      url: '/order/orderDetail',
      data: {
        orderId: id || _this.data.orderId
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        let obj = res.data;
        if (obj.returnCode === 1){
          if (obj.data.hcfOrderInfo.status === 0){
            _this.initGapTime(obj.data.hcfOrderFinance.receiptTimeLimit);
          }
          _this.setData({
            orderInfo: obj.data.hcfOrderInfo,
            financeInfo: obj.data.hcfOrderFinance,
            activityInfo: obj.data.hcfActivityInfo,
            goodsInfo: obj.data.hcfGoodsInfo,
            beginDate: obj.data.hcfGoodsStock.beginDate.split(' ')[0],
            endDate: obj.data.hcfGoodsStock.endDate.split(' ')[0],
            totalFee: obj.data.hcfOrderInfo.salePrice * obj.data.hcfOrderInfo.amount,
          })
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
  payNow(){
    if (this.data.minutes <= 0 && this.data.seconds <= 0){
      wx.showToast({
        title: '已超过支付有效时间',
        icon: 'none',
        duration: 3000
      })
    }else{
      let orderId = this.data.orderId
      let total_fee = this.data.totalFee * 100
      wxPay(this, orderId, total_fee)
    }
    
  },
  readDetail(){
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + this.data.orderId,
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
    if (this.data.isLogin){
      this.getOrderDetail(options.id)
    }
  },
  
  watch: {
    isLogin(newVal){
      if (newVal){
        this.getOrderDetail()
      }
    }
  },

  // 隐藏支付失败后的选择弹框
  hidePayCancelSelector(){
    this.setData({
      showPayCancelSelector: false
    })
  },
  // 跳转到订单详情
  showOrderDetail(){
    this.hidePayCancelSelector()
    wx.redirectTo({
      url: '/pages/orderDetail/orderDetail?id=' + this.data.orderId,
    })
  },
  // 继续支付
  rePay(){
    this.hidePayCancelSelector()
    payFunc(this, this.data.dataBeforePay)
  },

  // 重新下单
  reBook(){
    wx.redirectTo({
      url: '/pages/ticketDetail/ticketDetail?goodsId=' + this.data.goodsInfo.goodsId,
    })
  }
  
}));