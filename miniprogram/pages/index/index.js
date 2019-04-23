//index.js
const app = getApp()

Page({
  data: {
    bannerSwiper: [
      { // <!--济州神话世界度假酒店--蓝鼎 193847   -->
        hotelId: '193847',
        img: 'http://image.jladmin.cn/real_1537842489044.jpg'
      },
      { // <!--迪士尼好莱坞酒店20190108 44153   -->
        hotelId: '44153',
        img: 'http://image.jladmin.cn/real_1546935858144.jpg'
      },
      { // <!--澳门金沙度假区-威尼斯人 -->
        hotelId: '37976',
        img: 'http://image.jladmin.cn/real_1539248861577.jpg'
      },
      { // <!--澳门喜来登酒店 -->
        hotelId: '38900',
        img: 'http://image.jladmin.cn/real_1539248810488.jpg'
      },
    ]
  },

  onReady: function() {
  },

  onLoad: function() {
  },

  openMap(){
    wx.openLocation({
      latitude: 23.099994,
      longitude: 113.324520,
      scale: 14,
      name: '腾讯微信总部'
    })
  }
  
})
