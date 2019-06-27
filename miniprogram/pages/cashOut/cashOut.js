import store from '../../plugins/store/index.js'

Page(store.createPage({
  data: {
    popupHidden: true,
    canCash: 0,
    name: '',
    phone: '',
    showNameIcon: false,
    showPhoneIcon: false,
    isNameCorrect: false,
    isPhoneCorrect: false
  },
  globalData: ['userData', 'navHeight'],
  
  cashOut(){
    if (this.data.userData.hcfUser.contactName && this.data.userData.hcfUser.mobilePhone){
      if (!this.data.popupHidden){
        if (this.data.isNameCorrect && this.data.isPhoneCorrect){
          this.askCashOut();
        }
      }else{
        this.askCashOut();
      }
    }else{
      this.setData({
        popupHidden: false
      })
    }
    
  },
  inputName(e){
    this.setData({
      name: e.detail.value,
      showNameIcon: true
    });
    if (/^[\u4e00-\u9fa5]{1,30}$/.test(e.detail.value)){
      this.setData({
        isNameCorrect: true
      })
    }else{
      this.setData({
        isNameCorrect: false
      })
    }
  },
  inputPhone(e){
    this.setData({
      phone: e.detail.value,
      showPhoneIcon: true
    });
    if (/^[1][3,4,5,7,8][0-9]{9}$/.test(e.detail.value)){
      this.setData({
        isPhoneCorrect: true
      })
    }else{
      this.setData({
        isPhoneCorrect: false
      })
    }
  },
  cancelWrite(){
    this.setData({
      popupHidden: true
    })
  },
  saveInfo(){
    if (this.data.isNameCorrect && this.data.isPhoneCorrect){
      this.setData({
        popupHidden: true
      });
      this.askCashOut();
    }else{
      this.setData({
        showNameIcon: true,
        showPhoneIcon: true,
      })
    }
  },
  askCashOut(){
    let _this = this;
    wx.showLoading({
      title: '提现中',
    });
    global.request({
      url: '/withdrawal/askWithdrawal',
      data: {
        amount: _this.data.userData.hcfAccount.moneyCanCash,
        contactName: _this.data.name,
        mobilePhone: _this.data.phone,
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        if (res.data.returnCode === 1){
          wx.showModal({
            content: '提现成功',
            confirmColor: '#2577e3',
            showCancel: false,
            success(res){
              wx.redirectTo({
                url: '/pages/accountDetail/accountDetail',
              })
            }
          });
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.userData){
      this.setData({
        canCash: this.data.userData.hcfAccount.moneyCanCash,
        name: this.data.userData.hcfUser.contactName,
        phone: this.data.userData.hcfUser.mobilePhone,
      })
    }
  },
  
  watch: {
    userData(newVal){
      if (newVal){
        this.setData({
          canCash: newVal.hcfAccount.moneyCanCash,
          name: newVal.hcfUser.contactName,
          phone: newVal.hcfUser.mobilePhone,
        })
      }
    }
  }
}));