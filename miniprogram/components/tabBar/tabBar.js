// components/tabBar/tabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: String,
      value: 1
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList: [
      {
        tabIndex: 1,
        tabIcon: "icon-home-page",
        tabText: "首页",
        isActive: true
      },
      {
        tabIndex: 2,
        tabIcon: "icon-lipin",
        tabText: "福利社",
        isActive: false
      },
      {
        tabIndex: 3,
        tabIcon: "icon-my-center",
        tabText: "我的",
        isActive: false
      },
    ]
  },

  lifetimes: {
    attached: function () {
      var tmpList = this.data.tabList
      for (var i = 0; i < tmpList.length; i++){
        tmpList[i].isActive = tmpList[i].tabIndex == this.data.index
      }

      this.setData({
        tabList: tmpList
      })
    },
    detached: function () {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
