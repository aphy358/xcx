// components/navBar/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // true 表示显示 title，false 表示不显示 title
    showNavBarTitle: {
      type: Boolean,
      value: true
    },

    // true 表示有后退按钮，false 表示没有后退按钮
    hasGoBack: {
      type: Boolean,
      value: true
    },

    // true 表示有回到首页按钮，false 表示没有回到首页按钮
    hasGoHome: {
      type: Boolean,
      value: true
    },

    // 字体颜色
    color: {
      type: String,
      value: 'black'
    },

    // 背景颜色
    background: {
      type: String,
      value: 'white'
    },

    // 胶囊背景是否透明
    opercity: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    top: 26,
    height: 32,
    width: 87,
    bottom: 58
  },

  lifetimes: {
    attached: function () {
      this.setData({
        top: global.menuRect.top,
        height: global.menuRect.height,
        width: global.menuRect.width,
        bottom: global.menuRect.bottom,
      })

      console.log(global.menuRect)
    },
    detached: function () {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBackPage(){
      var pages = getCurrentPages()
      if (pages.length > 1){
        wx.navigateBack({
          delta: 1,
        })
      }else{
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    },

    goHome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})
