//index.js
const app = getApp()

Page({
  data: {
    bannerSwiper: [
      {
        hotelId: '193847',
        img: 'http://image.jladmin.cn/real_1559184376702.png'
      },
    ],

    tabItems: [
      {
        text: '全部',
        id: 0
      },
      {
        text: '限时抢购',
        id: 1
      },
      {
        text: '限时抢购',
        id: 2
      },
      {
        text: '限时抢购',
        id: 3
      },
    ],
    activeTab: 0,
    tabFixClass: '',

    adItems: [
      {
        img: 'http://image.jladmin.cn/real_1559188425194.png',
        name: '上海迪士尼2日1晚维也纳酒店免费接送迪士尼乐园含门票',
        price: 699,
        profit: 69,
        endDate: '2019-06-15',
      },
      {
        img: 'http://image.jladmin.cn/real_1559188425194.png',
        name: '上海迪士尼2日1晚维也纳酒店免费接送迪士尼乐园含门票',
        price: 699,
        profit: 69,
        endDate: '2019-06-15',
      },
      {
        img: 'http://image.jladmin.cn/real_1559188425194.png',
        name: '上海迪士尼2日1晚维也纳酒店免费接送迪士尼乐园含门票',
        price: 699,
        profit: 69,
        endDate: '2019-06-15',
      },
      {
        img: 'http://image.jladmin.cn/real_1559188425194.png',
        name: '上海迪士尼2日1晚维也纳酒店免费接送迪士尼乐园含门票',
        price: 699,
        profit: 69,
        endDate: '2019-06-15',
      },
      {
        img: 'http://image.jladmin.cn/real_1559188425194.png',
        name: '上海迪士尼2日1晚维也纳酒店免费接送迪士尼乐园含门票',
        price: 699,
        profit: 69,
        endDate: '2019-06-15',
      },
      {
        img: 'http://image.jladmin.cn/real_1559188425194.png',
        name: '上海迪士尼2日1晚维也纳酒店免费接送迪士尼乐园含门票',
        price: 699,
        profit: 69,
        endDate: '2019-06-15',
      },
      {
        img: 'http://image.jladmin.cn/real_1559188425194.png',
        name: '上海迪士尼2日1晚维也纳酒店免费接送迪士尼乐园含门票',
        price: 699,
        profit: 69,
        endDate: '2019-06-15',
      },
    ],

    showShareSelector: false,
  },

  onReady: function() {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
  },

  onLoad: function() {
  },

  onShow: function () {
  },

  onPageScroll(e) {
    var scrollTop = 211 * global.deviceWidth / 375

    if (e.scrollTop >= scrollTop) {
      this.setData({
        tabFixClass: ' fixed'
      })
    } else {
      this.setData({
        tabFixClass: ''
      })
    }
  },

  switchTab(e){
    let id = e.target.dataset.item.id
    if (id != this.data.activeTab){
      this.setData({
        activeTab: id
      })
    }
  },

  gotoTicketDetail(e){
    wx.navigateTo({
      url: '/pages/ticketDetail/ticketDetail',
    })
  },

  // 显示分享方式的选择底部弹窗
  showShare() {
    wx.hideTabBar()
    this.setData({
      showShareSelector: true
    })
  },
  // 隐藏分享方式的选择底部弹窗
  hideSelector() {
    this.setData({
      showShareSelector: false
    })

    setTimeout(function () {
      wx.showTabBar()
    }, 300)
  },

})
