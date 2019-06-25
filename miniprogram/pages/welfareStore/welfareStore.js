
import { checkOuthorize, processProductInfo, runAfterCondition } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

Page(store.createPage({
  data: {
    productList: [],
    titleClass: '',
    showNavBarTitle: false,

    showShareSelector: false,

    pageNum: 1,
    pageTotal: 1000,
    loading: true,

    // 被点击的商品信息
    productInfo: null,


    shareTitle: '福利社',
    sharePath: 'pages/welfareStore/welfareStore',
    shareImageUrl: '',
  },

  globalData: ['userData', 'isLogin'],

  watch: {
    isLogin(newVal) {
    },
  },

  onReady: function () {
  },

  onLoad: function (options) {
    this.queryADList()
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onShareAppMessage: function (res) {
    if (this.data.shareTitle == '福利社') {
      return {
        title: this.data.shareTitle,
        path: this.data.sharePath,
      }
    } else {
      return {
        title: this.data.shareTitle,
        path: this.data.sharePath,
        imageUrl: this.data.shareImageUrl
      }
    }
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageNum > this.data.pageTotal) {
      // 什么都不干
    } else {
      this.queryADList()
    }
  },
  
  gotoTicketDetail(e) {
    wx.navigateTo({
      url: '/pages/ticketDetail/ticketDetail?goodsId=' + e.currentTarget.dataset.info.hcfGoodsInfo.goodsId,
    })
  },
  
  // 显示分享方式的选择底部弹窗
  showShare(e) {
    if (!runAfterCondition(this, 'showShare', 'userData', e)) return

    var info = e.currentTarget.dataset.info
    this.setData({
      productInfo: info,
      showShareSelector: true
    })

    this.data.shareTitle = info.hcfGoodsInfo.goodsName
    this.data.sharePath = 'pages/ticketDetail/ticketDetail?goodsId=' + info.hcfGoodsInfo.goodsId + '&commissionUserId=' + this.data.userData.hcfUser.userId
    this.data.shareImageUrl = info.hcfGoodsInfo.goodsPoster || info.hcfGoodsInfo.goodsImgArr[0]
  },
  // 隐藏分享方式的选择底部弹窗
  hideSelector() {
    this.setData({
      showShareSelector: false
    })

    this.data.shareTitle = '福利社'
    this.data.sharePath = 'pages/welfareStore/welfareStore'
  },

  // 查询商品列表
  queryADList(){
    if (this.data.pageNum > this.data.pageTotal) return

    var _this = this
    this.setData({
      loading: true
    })

    global.request2({
      url: '/ad/promotionList',
      data: {
        pageNum: _this.data.pageNum || 1,
        pageSize: 10
      },
      success(res) {
        _this.setData({
          loading: false
        })
        
        if (res.data.returnCode == 1) {
          for (var i = 0; i < res.data.dataList.length; i++) {
            processProductInfo(res.data.dataList[i], 22)
          }

          _this.setData({
            productList: _this.data.productList.concat(res.data.dataList),  // res.data.dataList
            pageNum: res.data.pageNum + 1,
            pageTotal: res.data.pageTotal
          })
        }
      }
    })
  },

}))