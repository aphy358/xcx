// components/shareSelector/shareSelector.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // true 弹出层，false 表示不显示
    showSelector: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changePath) {
        if (newVal){
          this.ashowSelector()
        }else{
          this.ahideSelector()
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    showShareImg: false
  },

  observers: {
  },

  lifetimes: {
    attached: function () {
    },
    detached: function () {
    },
  },

  pageLifetimes: {
    show() {
      this.animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ashowSelector(){
      this.animation.bottom('0').step()
      this.setData({
        animationData: this.animation.export()
      })
    },

    ahideSelector(){
      this.animation.bottom('-414rpx').step()
      this.setData({
        animationData: this.animation.export()
      })
    },

    hideSelector(){
      this.triggerEvent('hideSelector')
    },
    
    // 显示生成的海报
    showSImg() {
      this.setData({
        showShareImg: true,
      })
      this.ahideSelector()
      wx.hideTabBar()
    },
    // 隐藏海报
    hideImage() {
      this.setData({
        showShareImg: false
      })
      this.hideSelector()
      setTimeout(function(){
        wx.showTabBar()
      }, 200)
    },
  }
})
