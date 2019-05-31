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
    let topHeight =  520 * this.data.bannerWidth / 375;
    let botHeight = ((this.data.bannerWidth + 30) * 1000)/750;
    console.log(topHeight);
    // console.log(botHeight);
    if (e.scrollTop >= topHeight){
      this.setData({
        titleClass: ' title-fixed'
      })
    }
    // else{
    //   this.setData({
    //     titleClass: ''
    //   })
    // }
    if (e.scrollTop <= botHeight){
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