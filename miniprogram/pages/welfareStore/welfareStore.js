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
    bannerWidth: 375
  },
  
  onPageScroll(e){
    let imgH =  480 * this.data.bannerWidth / 375;
    if (e.scrollTop >= imgH){
      this.setData({
        titleClass: ' title-fixed'
      })
    }else{
      this.setData({
        titleClass: ''
      })
    }
  },
  onReady: function () {
    let width = wx.getSystemInfoSync().windowWidth;
    this.setData({
      bannerWidth: width
    })
  },
});