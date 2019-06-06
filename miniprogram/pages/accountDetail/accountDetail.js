Page({
  linkJl: function () {
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
  }
});