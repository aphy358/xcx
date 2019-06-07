Page({
  data: {
    productList: [
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      },
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      },
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      },
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      },
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      },
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      },
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      },
      {
        imgUrl: '/assets/img/welfareStore/welfare-hotel.jpg',
        hotelName: '上海迪士尼2日1晚维也纳酒店免费',
        price: 699,
        profit: 36
      }
    ],
    titleClass: '',
    showNavBarTitle: false,

    showShareSelector: false,
  },
  
  onPageScroll(e){
    // let topHeight = 416 * global.deviceWidth / 375;
    // if (e.scrollTop >= topHeight){
    //   this.setData({
    //     titleClass: ' title-fixed'
    //   })
    // }else{
    //   this.setData({
    //     titleClass: ''
    //   })
    // }

    let topHeight2 = 300 * global.deviceWidth / 375;
    if (e.scrollTop >= topHeight2) {
      this.setData({
        showNavBarTitle: true
      })
    } else {
      this.setData({
        showNavBarTitle: false
      })
    }
    
  },
  onReady: function () {
  },


  gotoTicketDetail(e) {
    wx.navigateTo({
      url: '/pages/ticketDetail/ticketDetail',
    })
  },
  
  // 显示分享方式的选择底部弹窗
  showShare() {
    this.setData({
      showShareSelector: true
    })
  },
  // 隐藏分享方式的选择底部弹窗
  hideSelector() {
    this.setData({
      showShareSelector: false
    })
  },

});