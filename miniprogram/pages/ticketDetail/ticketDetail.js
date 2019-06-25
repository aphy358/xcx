
import store from '../../plugins/store/index.js'
import { checkOuthorize, processProductInfo, runAfterCondition, queryString } from '../../plugins/util.js'

Page(store.createPage({
  data: {
    showNavBarTitle: false,

    showShareSelector: false,

    commissionUserId: '',
  },

  globalData: ['userData', 'isLogin', 'curProductInfo'],

  watch: {
    isLogin(newVal) {
    }
  },

  onLoad: function (options) {
    if (options.scene){
      var scene = decodeURIComponent(options.scene)
      var goodsId = queryString('goodsId', scene)
      var commissionUserId = queryString('commissionUserId', scene)

      this.queryProductInfo(goodsId)
      this.data.commissionUserId = commissionUserId
      this.setData({
        commissionUserId: commissionUserId || ''
      })
    }else{
      this.queryProductInfo(options.goodsId)
      this.data.commissionUserId = options.commissionUserId
      this.setData({
        commissionUserId: options.commissionUserId || ''
      })
    }
  },

  onReady: function () {

  },

  onShow: function () {
    
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function (res) {
    return {
      title: this.data.curProductInfo.hcfGoodsInfo.goodsName,
      path: 'pages/ticketDetail/ticketDetail?goodsId=' + this.data.curProductInfo.hcfGoodsInfo.goodsId + '&commissionUserId=' + this.data.userData.hcfUser.userId,
      imageUrl: this.data.curProductInfo.hcfGoodsInfo.goodsPoster || this.data.curProductInfo.hcfGoodsInfo.goodsImgArr[0]
    }
  },

  onPageScroll(e) {
    var scrollTop = 100 * global.deviceWidth / 375

    if (e.scrollTop >= scrollTop) {
      this.setData({
        showNavBarTitle: true
      })
    } else {
      this.setData({
        showNavBarTitle: false
      })
    }
  },

  // 查询商品详情
  queryProductInfo(goodsId){
    global.request2({
      url: '/goods/goodsDetail',
      data: {
        goodsId: goodsId
      },
      success(res){
        if (res.data.returnCode == 1){
          processProductInfo(res.data.data)
          store.dispatch('curProductInfo', res.data.data)
        }
      }
    })
  },

  // 显示分享方式的选择底部弹窗
  showShare() {
    if (!runAfterCondition(this, 'showShare', 'userData')) return
    
    this.setData({
      showShareSelector: true
    })
  },
  // 隐藏分享方式的选择底部弹窗
  hideSelector() {
    this.setData({
      showShareSelector: false
    })
  },

  // 进入到订单填写页
  gotoPlaceOrder(){
    var hcfGoodsStock = this.data.curProductInfo.hcfGoodsStock
    if (hcfGoodsStock.stock <= hcfGoodsStock.sellStock){
      return wx.showToast({
        title: '库存不够',
        icon: 'none',
        duration: 2000
      })
    }
    wx.navigateTo({
      url: '/pages/placeOrder/placeOrder?commissionUserId=' + this.data.commissionUserId,
    })
  }

}))