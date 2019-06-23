
import { checkOuthorize, processProductInfo, runAfterCondition, processTimeLeft } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

//index.js
const app = getApp()

Page(store.createPage({
  data: {
    bannerSwiper: [
    ],

    tabItems: [
      {
        categoryName: '全部',
        categoryId: -1
      },
    ],
    activeTab: -1,
    tabFixClass: '',

    // 所有的商品列表
    adItems: [],

    // 最终显示的商品列表
    adItemsShow: [],

    showShareSelector: false,

    // 被点击的商品信息
    productInfo: null,

    pageNum: 1,
    pageTotal: 1000,
    loading: true,
  },

  globalData: ['userData', 'isLogin'],

  watch: {
    isLogin(newVal){
    },
  },

  onReady: function() {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
  },

  onLoad: function() {
    var _this = this
    this.data.scrollTop = 0
   
    // 查 banner
    global.request2({
      url: '/ad/adList',
      success(res) {
        if (res.data.returnCode == 1) {
          _this.setData({
            bannerSwiper: res.data.dataList
          })
        }
      }
    })

    // 查商品类别
    global.request2({
      url: '/goods/categoryList',
      success(res) {
        if (res.data.returnCode == 1) {
          var tmpList = _this.data.tabItems
          tmpList = tmpList.concat(res.data.dataList)
          _this.setData({
            tabItems: tmpList
          })
        }
      }
    })

    // 查商品列表
    this.getProductList()

    setInterval(function () {
      // 定时器更新商品抢购倒计时
      _this._setInterval()
    }, 1000)
  },

  onShow: function () {
    // 检查是否已经授权过
    checkOuthorize()
  },

  onPageScroll(e) {
    var scrollTop = 210 * global.deviceWidth / 375

    if (e.scrollTop >= scrollTop) {
      this.setData({
        tabFixClass: ' fixed'
      })
    } else {
      this.setData({
        tabFixClass: ''
      })
    }

    if(e.scrollTop > this.data.scrollTop){
      console.log('向下')
    }else{
      console.log('向上')
    }
    this.data.scrollTop = e.scrollTop

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageNum > this.data.pageTotal){
      // 什么都不干
    }else{
      this.getProductList()
    }
  },

  // 定时器更新商品抢购倒计时
  _setInterval(){
    let adItems = this.data.adItems
    let adItemsShow = this.data.adItemsShow

    for (let i = 0; i < adItems.length; i++) {
      processTimeLeft(adItems[i])
    }

    for (let i = 0; i < adItemsShow.length; i++) {
      processTimeLeft(adItemsShow[i])
    }

    this.setData({
      adItems: adItems,
      adItemsShow: adItemsShow
    })
  },

  // 查询商品列表
  getProductList(reset){
    if (this.data.pageNum > this.data.pageTotal && !reset) return

    let _this = this
    this.setData({
      loading: true
    })

    if(reset){
      this.setData({
        pageNum: 1,
        pageTotal: 1000
      })
    }

    global.request2({
      url: '/goods/goodsList',
      data: {
        pageNum: reset ? 1 : _this.data.pageNum,
        pageSize: 500
      },
      success(res) {
        _this.setData({
          loading: false
        })
        
        if (res.data.returnCode == 1) {
          for (var i = 0; i < res.data.dataList.length; i++) {
            processProductInfo(res.data.dataList[i])
          }

          var adItems = reset ? res.data.dataList : _this.data.adItems.concat(res.data.dataList)
          var adItemsShow = _this.data.activeTab == -1 ? adItems : adItems.filter((n) => n.hcfGoodsInfo.categoryId == _this.data.activeTab)

          _this.setData({
            adItems: adItems,
            adItemsShow: adItemsShow,
            pageNum: res.data.pageNum + 1,
            pageTotal: res.data.pageTotal
          })

          if (adItemsShow.length < 2 && _this.data.pageNum <= _this.data.pageTotal) {
            setTimeout(function(){
              _this.getProductList()
            }, 100)
          }
        }
      }
    })
  },

  switchTab(e){
    var _this = this
    let categoryId = e.target.dataset.item.categoryId
    if (categoryId != this.data.activeTab){
      var tmpArr = categoryId == -1
        ? this.data.adItems
        : this.data.adItems.filter((n) => n.hcfGoodsInfo.categoryId == categoryId)

      this.setData({
        activeTab: categoryId,
        adItemsShow: tmpArr
      })

      if (tmpArr.length < 2 && this.data.pageNum <= this.data.pageTotal){
        this.getProductList()
      }
    }
  },

  gotoTicketDetail(e){
    // 将商品详情保存到 store，这样商品详情页就能更快的渲染出来
    if (e.currentTarget.dataset.info.hcfGoodsInfo){
      wx.navigateTo({
        url: '/pages/ticketDetail/ticketDetail?goodsId=' + e.currentTarget.dataset.info.hcfGoodsInfo.goodsId,
      })
    }else{
      wx.showToast({
        title: '该商品已下线',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 显示分享方式的选择底部弹窗
  showShare(e) {
    if (!runAfterCondition(this, 'showShare', 'userData', e))  return

    var info = e.currentTarget.dataset.info
    this.setData({
      productInfo: info,
      showShareSelector: true
    })
  },
  // 隐藏分享方式的选择底部弹窗
  hideSelector() {
    this.setData({
      showShareSelector: false
    })
  },

}))
