Page({
  data: {
    showPacket: true
  },
  cancelOrder: function () {
    wx.showModal({
      content: '确定申请取消订单',
      confirmColor: '#2577e3',
      success (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/cancelOrder/cancelOrder',
          })
        }
      }
    })
  },
  closePacket: function () {
    this.setData({
      showPacket: false
    })
  }
});