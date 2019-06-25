
import { checkOuthorize, processProductInfo, runAfterCondition, processTimeLeft, throttle } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

//index.js
const app = getApp()

Page(store.createPage({
  data: {
    bannerSwiper: [],

    tabItems: [
      {
        categoryName: '全部',
        categoryId: -1,
        adItems: [],
        adItemsShow: [],
        pageNum: 1,
        pageTotal: 1000,
        adTotal: 0,
        pholderHeight1: 0,
        pholderHeight2: 0,
        firstShowIndex: 0,
      },
    ],

    curTab: {
      categoryName: '全部',
      categoryId: -1,
      adItems: [],
      adItemsShow: [],
      pageNum: 1,
      pageTotal: 1000,
      adTotal: 0,
      pholderHeight1: 0,
      pholderHeight2: 0,
      firstShowIndex: 0,
    },

    activeTab: -1,
    tabFixClass: '',

    showShareSelector: false,

    // 被点击的商品信息
    productInfo: null,
    
    loading: true,


    shareTitle: '惠出发',
    sharePath: 'pages/index/index',
    shareImageUrl: '',
  },

  globalData: ['userData', 'isLogin', 'navHeight'],

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
  },

  onShow: function () {
    // 检查是否已经授权过
    checkOuthorize()

    if (true){
      this.resetParams()

      var _this = this
      this.data.scrollTop = 0
      this.data.fixScrollTop = 210 * global.deviceWidth / 375
      this.data.pholderPerHeight = 289 * global.deviceWidth / 375
      this.data.marginTop = 10 * global.deviceWidth / 375

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

            for (let i = 0; i < res.data.dataList.length; i++) {
              const o = res.data.dataList[i]
              o.adItems = []
              o.adItemsShow = []
              o.pageNum = 1
              o.pageTotal = 1000
              o.adTotal = 0
              o.pholderHeight1 = 0
              o.pholderHeight2 = 0
              o.firstShowIndex = 0
            }

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
    }
  },

  resetParams(){
    this.data.bannerSwiper = []

    this.data.tabItems = [
      {
        categoryName: '全部',
        categoryId: -1,
        adItems: [],
        adItemsShow: [],
        pageNum: 1,
        pageTotal: 1000,
        adTotal: 0,
        pholderHeight1: 0,
        pholderHeight2: 0,
        firstShowIndex: 0,
      },
    ]

    this.data.curTab = {
      categoryName: '全部',
      categoryId: -1,
      adItems: [],
      adItemsShow: [],
      pageNum: 1,
      pageTotal: 1000,
      adTotal: 0,
      pholderHeight1: 0,
      pholderHeight2: 0,
      firstShowIndex: 0,
    }

    this.data.activeTab = -1
    this.data.tabFixClass = ''
    this.data.showShareSelector = false
    this.data.productInfo = null
    this.data.loading = true
  },

  onShareAppMessage: function () {
    if (this.data.shareTitle == '惠出发'){
      return {
        title: this.data.shareTitle,
        path: this.data.sharePath,
      }
    }else{
      return {
        title: this.data.shareTitle,
        path: this.data.sharePath,
        imageUrl: this.data.shareImageUrl
      }
    }
  },

  onPageScroll(e) {
    console.log('onPageScroll')
    if (e.scrollTop >= this.data.fixScrollTop) {
      this.setData({
        tabFixClass: ' fixed'
      })
    } else {
      this.setData({
        tabFixClass: ''
      })
    }

    // if(e.scrollTop > this.data.scrollTop){
    //   console.log('向下')
    // }else{
    //   console.log('向上')
    // }

    this.data.scrollTop = e.scrollTop

    // throttle(this.setScrollPholder, 100)()

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
    return

    let adItems = this.data.curTab.adItems
    let adItemsShow = this.data.curTab.adItemsShow

    for (let i = 0; i < adItems.length; i++) {
      processTimeLeft(adItems[i])
    }

    for (let i = 0; i < adItemsShow.length; i++) {
      processTimeLeft(adItemsShow[i])
    }

    this.setData({
      curTab: this.data.curTab,
    })
  },

  // 查询商品列表
  getProductList(reset){
    // var curTab = this.data.tabItems.filter(n => n.categoryId == this.data.activeTab)
    var curTab = this.data.curTab
    if (curTab.pageNum > curTab.pageTotal && !reset) return

    let _this = this
    this.setData({
      loading: true
    })

    var params = {
      pageNum: reset ? 1 : curTab.pageNum,
      pageSize: 500,
    }

    if (curTab.categoryId != -1) params.categoryId = curTab.categoryId

    global.request2({
      url: '/goods/goodsList',
      data: params,
      success(res) {
        _this.setData({
          loading: false
        })
        
        if (res.data.returnCode == 1) {
          for (var i = 0; i < res.data.dataList.length; i++) {
            processProductInfo(res.data.dataList[i])
          }

          var curTab = _this.data.tabItems.filter(n => n.categoryId == _this.data.curTab.categoryId)[0]
          curTab.adItems = curTab.adItems.concat(res.data.dataList)

          for (let i = 0; i < 10; i++) {
            curTab.adItems = curTab.adItems.concat(res.data.dataList)
            curTab.adItemsShow = curTab.adItemsShow.concat(res.data.dataList)
          }

          curTab.pageNum = curTab.pageNum + 1
          curTab.pageTotal = res.data.pageTotal
          curTab.adTotal = res.data.pageRecordCount

          _this.setData({
            tabItems: _this.data.tabItems,
            curTab: curTab,
          }, function(){
            const query = wx.createSelectorQuery()
            query.selectAll('.ad-item').boundingClientRect()
            query.exec(function (res) {
              res = res[0]
              var curTab = _this.data.tabItems.filter(n => n.categoryId == _this.data.curTab.categoryId)[0]
              for (var i = 0; i < res.length; i++) {
                curTab.adItems[curTab.firstShowIndex + i].domHeight = res[i].height
              }
              _this.data.curTab.firstShowIndex

              _this.setData({
                tabItems: _this.data.tabItems,
                curTab: curTab,
              })
            })
          })

          // _this.setScrollPholder()
        }
      }
    })
  },

  setScrollPholder(){
    var _this = this
    var curTab = _this.data.tabItems.filter(n => n.categoryId == _this.data.curTab.categoryId)[0]
    var scrollDiff = _this.data.scrollTop - _this.data.fixScrollTop
    var scrollCount = (scrollDiff / _this.data.pholderPerHeight) | 0
    var firstShowIndex = scrollCount - 4
    if (firstShowIndex < 0) firstShowIndex = 0

    if (firstShowIndex == curTab.firstShowIndex && firstShowIndex != 0)    return

    var adItemsShow = []
    for (let i = firstShowIndex, count = 0; i < curTab.adItems.length && count < 10; i++, count++) {
      adItemsShow.push(curTab.adItems[i])
    }

    curTab.firstShowIndex = firstShowIndex
    curTab.adItemsShow = adItemsShow
    curTab.pholderHeight1 = firstShowIndex * _this.data.pholderPerHeight

    var belowCount = curTab.adItems.length - firstShowIndex - 10
    if(belowCount < 0)  belowCount = 0
    // curTab.pholderHeight2 = belowCount * _this.data.pholderPerHeight

    _this.setData({
      tabItems: _this.data.tabItems,
      curTab: curTab,
    })
  },

  switchTab(e){
    var _this = this
    let categoryId = e.target.dataset.item.categoryId
    if (categoryId != this.data.curTab.categoryId){
      var curTab = this.data.tabItems.filter(n => n.categoryId == categoryId)[0]

      this.setData({
        curTab: curTab,
      })

      if (curTab.pageTotal >= curTab.pageNum && curTab.adItems.length < 1){
        this.getProductList()
      }

      // 切换 tab，如果当前 tab 下从未加载过，则加载 list...
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

    this.data.shareTitle = info.hcfGoodsInfo.goodsName
    this.data.sharePath = 'pages/ticketDetail/ticketDetail?goodsId=' + info.hcfGoodsInfo.goodsId + '&commissionUserId=' + this.data.userData.hcfUser.userId
    this.data.shareImageUrl = info.hcfGoodsInfo.goodsPoster || info.hcfGoodsInfo.goodsImgArr[0]
  },
  // 隐藏分享方式的选择底部弹窗
  hideSelector() {
    this.setData({
      showShareSelector: false
    })

    this.data.shareTitle = '惠出发'
    this.data.sharePath = 'pages/index/index'
  },

}))
