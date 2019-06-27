Page({
  data: {
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
  globalData: ['navHeight'],
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
      reasonInfo: e.detail.value.replace(/^\s+|\s+$/g, '')
    })
  },
  inputName(e){
    this.setData({
      name: e.detail.value.replace(/^\s+|\s+$/g, '')
    })
  },
  inputTel(e){
    this.setData({
      tel: e.detail.value.replace(/^\s+|\s+$/g, '')
    })
  },
  call: function () {
    wx.showModal({
      title: '客服电话',
      content: '请拨打客服电话：0755-32981006',
      confirmText: '拨打电话',
      confirmColor: '#2577e3',
      success (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '0755-32981006'
          })
        }
      }
    })
  },
  submit: function () {
    if (!this.data.name){
      wx.showModal({
        content: '请输入联系人姓名',
        confirmColor: '#2577e3'
      })
    }else if (!this.data.tel){
      wx.showModal({
        content: '请输入联系人电话',
        confirmColor: '#2577e3'
      })
    }else if (this.data.name && !/^[\u4e00-\u9fa5]{1,30}$/.test(this.data.name)){
      wx.showModal({
        content: '联系人限制为30个以内的汉字',
        confirmColor: '#2577e3'
      })
    }else if (this.data.tel && !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.tel)){
      wx.showModal({
        content: '联系方式必须为11位的数字',
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