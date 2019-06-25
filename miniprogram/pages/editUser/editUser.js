import store from '../../plugins/store/index.js'

Page(store.createPage({
  data:{
    nameHidden: true,
    focus: false,
    nameHeight: '',
    telHeight: '',
    nameVal: '',
    phoneVal: '',
    telHidden: true,
    maskHidden: true,
    loadingHidden: true,
    name: '',
    phone: ''
  },
  
  globalData: ['userData', 'navHeight'],
  
  editUserName(){
    this.setData({
      nameHidden: false,
      maskHidden: false,
      focus: true
    })
  },
  nameFocus(e){
    if (e.detail.height) {
      this.setData({
        nameHeight: 'padding-bottom: ' + (e.detail.height) + 'px;'
      })
    }
  },
  inputName(e){
    this.setData({
      nameVal: e.detail.value
    });
  },
  saveName(){
    if (this.data.nameVal && /^[\u4e00-\u9fa5]{1,20}$/.test(this.data.nameVal.replace(/^\s+|\s+$/g, ''))){
      let _this = this;
      wx.showLoading({
        title: '保存中',
      });
      global.request({
        url: '/user/updateContactInfo',
        data: {
          contactName: _this.data.nameVal
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          if (res.data.returnCode === 1){
            _this.setData({
              nameHidden: true,
              maskHidden: true,
              focus: false,
              name: res.data.data.contactName
            })
          }else{
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '姓名必须为20个以内的汉字',
        icon: 'none'
      })
    }
  },
  editTel(){
    this.setData({
      telHidden: false,
      maskHidden: false,
      focus: true
    })
  },
  telFocus(e){
    if (e.detail.height) {
      this.setData({
        telHeight: 'padding-bottom: ' + (e.detail.height) + 'px;'
      })
    }
  },
  inputPhone(e){
    this.setData({
      phoneVal: e.detail.value
    });
  },
  savePhone(){
    if (this.data.phoneVal && /^[0-9]{11}$/.test(this.data.phoneVal.replace(/^\s+|\s+$/g, ''))){
      let _this = this;
      wx.showLoading({
        title: '保存中',
      });
      global.request({
        url: '/user/updateContactInfo',
        data: {
          mobilePhone: _this.data.phoneVal
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          if (res.data.returnCode === 1){
            _this.setData({
              telHidden: true,
              maskHidden: true,
              focus: false,
              phone: res.data.data.mobilePhone
            })
          }else{
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '手机号必须为11个数字',
        icon: 'none'
      })
    }
  },
  closeModal(){
    this.setData({
      nameHidden: true,
      telHidden: true,
      maskHidden: true,
      focus: false
    })
  },
  
  watch: {
    userData(newVal){
      if (newVal){
        this.setData({
          loadingHidden: false,
          name: newVal.hcfUser.contactName || '',
          phone: newVal.hcfUser.mobilePhone || ''
        })
      }
    }
  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (this.data.userData){
      this.setData({
        loadingHidden: false,
        name: this.data.userData.hcfUser.contactName || '',
        phone: this.data.userData.hcfUser.mobilePhone || ''
      })
    }
  },
}));