Page({
  data: {
    reason: '行程改变',
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
    linkName: '',
    linkTel: ''
  },
  changeReason: function (e) {
    let obj = this.data.reasonArray.filter((item)=> {
      return item.value === +e.detail.value;
    });
    this.setData({
      reason: obj[0].text
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
    }else if (!this.data.linkName){
      wx.showModal({
        content: '请输入联系人姓名',
        confirmColor: '#2577e3'
      })
    }else if (!this.data.linkTel){
      wx.showModal({
        content: '请输入联系人电话',
        confirmColor: '#2577e3'
      })
    }
  },
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  }
});