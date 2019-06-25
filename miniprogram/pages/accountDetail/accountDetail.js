import store from '../../plugins/store/index.js'
import { runAfterCondition } from '../../plugins/util.js'

Page(store.createPage({
  data: {
    bottom: 58,
    tabActive: 0,
    tabList: [
      {
        text: '佣金明细',
        id: 0
      },
      {
        text: '提现明细',
        id: 1
      }
    ],
    pageNum: 1,
    pageTotal: 1,
    commissionHidden: false,
    cashHidden: true,
    commissionList: [],
    cashList: []
  },
  
  globalData: ['isLogin', 'userData'],
  
  changeTab: function (e) {
    if (!runAfterCondition(this, 'changeTab', 'isLogin', e))  return
    
    let id = e.currentTarget.dataset.id;
    this.setData({
      tabActive: id,
      pageNum: 1,
      pageTotal: 1
    });
    if (id === 0){
      this.getCommissionList();
      this.setData({
        commissionHidden: false,
        cashHidden: true,
        commissionList: []
      })
    }else{
      this.getCashList();
      this.setData({
        commissionHidden: true,
        cashHidden: false,
        cashList: []
      })
    }
  },
  getCommissionList(){
    let _this = this;
    wx.showLoading({
      title: '查询中',
    });
    global.request({
      url: '/commission/commissionList',
      data: {
        pageNum: _this.data.pageNum,
        pageSize: 10
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        let obj = res.data;
        if (obj.returnCode === 1){
          _this.setData({
            commissionHidden: false,
            commissionList: obj.dataList ? _this.data.commissionList.concat(obj.dataList) : obj.dataList,
            pageTotal: obj.pageTotal
          })
        }
      }
    })
  },
  getCashList(){
    let _this = this;
    wx.showLoading({
      title: '查询中',
    });
    global.request({
      url: '/withdrawal/withdrawalList',
      data: {
        pageNum: _this.data.pageNum,
        pageSize: 10
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        let obj = res.data;
        if (obj.returnCode === 1){
          _this.setData({
            cashHidden: false,
            cashList: obj.dataList ? _this.data.cashList.concat(obj.dataList) : obj.dataList,
            pageTotal: obj.pageTotal
          })
        }
      }
    })
  },
  linkJl: function () {
    wx.showModal({
      title: '客服电话',
      content: '请拨打客服电话：0755-33397777',
      confirmText: '拨打电话',
      confirmColor: '#2577e3',
      success (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '0755-33397777'
          })
        }
      }
    })
  },
  
  watch: {
    isLogin(newVal){
      if (newVal){
        if (this.data.tabActive === 0){
          this.getCommissionList();
        }else{
          this.getCashList();
        }
      }
    }
  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      bottom: global.menuRect.bottom
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      pageNum: 1,
      pageTotal: 1,
      commissionList: [],
      cashList: []
    });
    if (this.data.isLogin){
      if (this.data.tabActive === 0){
        this.getCommissionList();
      }else{
        this.getCashList();
      }
    }
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let num = this.data.pageNum;
    num = ++num;
    if (num > this.data.pageTotal) {
      //没有更多了
    } else {
      this.setData({
        pageNum: num
      });
      
      this.getCommissionList();
    }
  },
}));