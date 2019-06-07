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
          this.animation.bottom('0').step()
          this.setData({
            animationData: this.animation.export()
          })
        }else{
          this.animation.bottom('-414rpx').step()
          this.setData({
            animationData: this.animation.export()
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {}
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
    hideSelector(){
      this.triggerEvent('hideSelector')
    },
    showSImg(){
      this.triggerEvent('showSImg')
    }
  }
})
