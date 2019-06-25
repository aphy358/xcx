Page({
  data: {
    bottom: 58,
    reason: '行程改变',
    reasonType: 0,
    reasonArray: [
      {
        value: 0,
        text: '行程改变'
      },
      {
        value: 1,
        text: '无法满足需求'
      },
      {
        value: 2,
        text: '其他途径预定'
      },
      {
        value: 3,
        text: '酒店价格太贵'
      },
      {
        value: 4,
        text: '其他'
      }
    ],
    reasonInfo: '',
    orderId: '',
    name: '',
    tel: '',
    price: ''
  },
  changeReason: function (e) {
    let obj = this.data.reasonArray.filter((item)=> {
      return item.value === +e.detail.value;
    });
    this.setData({
      reason: obj[0].text,
      reasonType: obj[0].value
    })
  },
  inputReason(e){
    this.setData({
      reasonInfo: e.detail.value
    })
  },
  inputName(e){
    this.setData({
      name: e.detail.value
    })
  },
  inputTel(e){
    this.setData({
      tel: e.detail.value
    })
  },
  call: function () {
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
  submit: function () {
    if (!this.data.reasonInfo){
      wx.showModal({
        content: '请输入取消说明',
        confirmColor: '#2577e3'
      })
    }else if (!this.data.name){
      wx.showModal({
        content: '请输入联系人姓名',
        confirmColor: '#2577e3'
      })
    }else if (!this.data.tel){
      wx.showModal({
        content: '请输入联系人电话',
        confirmColor: '#2577e3'
      })
    }else{
      let _this = this;
      wx.showLoading({
        title: '取消中',
      });
      global.request({
        url: '/order/cancleOrder2',
        data: {
          orderId: _this.data.orderId,
          cancelType: _this.data.reasonType,
          usePerson: _this.data.name,
          tel: _this.data.tel,
          cancelReason: _this.data.reasonInfo,
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          let obj = res.data;
          console.log(obj);
          if (obj.returnCode === 1){
            wx.showModal({
              content: '订单取消成功',
              showCancel: false,
              success (res) {
                wx.redirectTo({
                  url: '/pages/orderDetail/orderDetail?id=' + _this.data.orderId,
                })
              }
            })
          }else{
            wx.showModal({
              content: obj.returnMsg,
              showCancel: false
            })
          }
        }
      })
    }
  },
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bottom: global.menuRect.bottom
    })
    if (options){
      this.setData({
        orderId: +options.id,
        name: options.name,
        tel: options.tel,
        price: options.price
      });
    }
  },
});