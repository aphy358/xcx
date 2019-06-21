// miniprogram/pages/myOrder/myOrder.js
import { runAfterCondition } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

Page(store.createPage({
  /**
   * 页面的初始数据
   */
  data: {
    tabActive: '',
    tabList: [
      {
        text: '全部订单',
        id: ''
      },
      {
        text: '待付款',
        id: 0
      },
      {
        text: '待使用',
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
    orderList: [],
    status: '',
    pageNum: 1,
    pageTotal: 1,
    loading: true,
  },
  
  globalData: ['isLogin', 'userData'],

  watch: {
    isLogin(newVal) {
      if (newVal) {
        this.getOrderList();
      }
    }
  },
  
  changeTab: function (e) {
    if (!runAfterCondition(this, 'changeTab', 'userData', e))  return
    
    let id = e.target.dataset.id;
    this.setData({
      tabActive: id,
      status: id,
      pageNum: 1,
      pageTotal: 1,
      orderList: []
    });
    this.getOrderList();
  },
  
  orderDetail(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  
  payNow(e) {
    wx.navigateTo({
      url: '../rePay/rePay?id=' + e.currentTarget.dataset.id,
    })
  },
  
  getOrderList() {
    let _this = this;
    wx.showLoading({
      title: '查询中',
    });
    this.setData({
      loading: true
    })
    global.request({
      url: '/order/orderList',
      data: {
        pageNum: _this.data.pageNum || 1,
        pageSize: 6,
        status: _this.data.status
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();

        _this.setData({
          loading: false
        })

        if (res.data.returnCode === 1) {
          let list = res.data.dataList || [];
          let resList = [];
          
          if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              resList[i] = {
                orderCode: item.hcfOrderInfo.orderCode,
                status: item.hcfOrderInfo.status,
                imgUrl: item.hcfGoodsInfo.goodsImg.split(',')[0],
                name: item.hcfGoodsInfo.goodsName,
                price: item.hcfOrderInfo.salePrice,
                amount: item.hcfOrderInfo.amount,
                beginDate: item.hcfOrderInfo.useBeginDate.split(' ')[0],
                endDate: item.hcfOrderInfo.useEndDate.split(' ')[0],
                totalPrice: item.hcfOrderInfo.salePriceAll,
                orderId: item.hcfOrderInfo.orderId
              };
              
              if ('0,1,4'.indexOf(item.hcfOrderInfo.status) !== -1){
                _this.setData({
                  beginDate: item.hcfOrderInfo.useBeginDate.split(' ')[0],
                  endDate: item.hcfOrderInfo.useEndDate.split(' ')[0]
                })
              }else{
                _this.setData({
                  beginDate: item.hcfOrderInfo.jlCheckInDate.split(' ')[0],
                  endDate: item.hcfOrderInfo.jlCheckOutDate.split(' ')[0]
                })
              }
            }
          }
          
          _this.setData({
            orderList: _this.data.orderList ? _this.data.orderList.concat(resList) : resList,
            pageTotal: res.data.pageTotal
          })
        }
      },
    })
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        tabActive: +options.id,
        status: +options.id
      })
    }
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
    this.setData({
      pageNum: 1,
      pageTotal: 1,
      orderList: []
    });
  
    if (this.data.isLogin){
      this.getOrderList();
    }
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
    let num = ++this.data.pageNum;
    if (num > this.data.pageTotal) {
      //没有更多了
    } else {
      this.setData({
        pageNum: num
      });
      
      this.getOrderList();
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}))