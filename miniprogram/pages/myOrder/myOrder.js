// miniprogram/pages/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 0,
    tabList: [
      {
        text: '全部订单',
        id: 0
      },
      {
        text: '待付款',
        id: 1
      },
      {
        text: '已确认',
        id: 2
      },
      {
        text: '已完成',
        id: 3
      },
      {
        text: '已取消',
        id: 4
      }
    ],
    orderList: [
      {
        orderCode: '1908121995',
        status: '待支付',
        imgUrl: 'http://image.jladmin.cn/real_1529379798959.jpg',
        name: '上海迪士尼2日1晚维也纳酒店免费接站接送迪士尼乐园含门票',
        price: '699.00',
        beginDate: '2019-05-28',
        endDate: '2019-05-29',
        totalPrice: '699.0'
      },
      {
        orderCode: '1908121995',
        status: '待支付',
        imgUrl: 'http://image.jladmin.cn/real_1529379798959.jpg',
        name: '上海迪士尼2日1晚维也纳酒店免费接站接送迪士尼乐园含门票',
        price: '699.00',
        beginDate: '2019-05-28',
        endDate: '2019-05-29',
        totalPrice: '699.0'
      },
      {
        orderCode: '1908121995',
        status: '待支付',
        imgUrl: 'http://image.jladmin.cn/real_1529379798959.jpg',
        name: '上海迪士尼2日1晚维也纳酒店免费接站接送迪士尼乐园含门票',
        price: '699.00',
        beginDate: '2019-05-28',
        endDate: '2019-05-29',
        totalPrice: '699.0'
      },
      {
        orderCode: '1908121995',
        status: '待支付',
        imgUrl: 'http://image.jladmin.cn/real_1529379798959.jpg',
        name: '上海迪士尼2日1晚维也纳酒店免费接站接送迪士尼乐园含门票',
        price: '699.00',
        beginDate: '2019-05-28',
        endDate: '2019-05-29',
        totalPrice: '699.0'
      }
    ]
  },
  changeTab: function (e) {
    let id = e.target.dataset.id;
    this.setData({
      tabActive: id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})