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
    showNavBarTitle: false
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
});