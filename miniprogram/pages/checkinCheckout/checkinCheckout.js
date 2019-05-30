// miniprogram/pages/checkinCheckout.js
import { getOneMonthData, getMonthsData } from './getMonthsData.js'
import { formatDateTwo, addDays } from '../../plugins/util.js'
import store from '../../plugins/store/index.js'

Page(store.createPage({

  /**
   * 页面的初始数据
   */
  data: {
    showMonths: [],
    monthData: null,
    // 用自定义变量保存当前系统中的年月日
    tY: null,
    tM: null,
  },

  // 依赖的全局状态属性 这些状态会被绑定到data上
  globalData: ['checkin', 'checkout'],

  watch: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
    this.processData(this.data.monthData)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  onPageScroll: function(){
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
    var tmpArr = this.data.showMonths
    if(tmpArr.length < 7){
      tmpArr.push(getOneMonthData(this.tY, this.tM++))

      if (this.tM > 11) {
        this.tY
        this.tM = 0
      }

      this.data.monthData = tmpArr
      this.processData(this.data.monthData)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 初始化
  init(){
    if(this.tY == null){
      var Today = new Date();
      this.tY = Today.getFullYear();
      this.tM = Today.getMonth();
    }

    let resultArr = []

    for (let i = 0; i < 2; i++) {
      resultArr.push(getOneMonthData(this.tY, this.tM++))

      if (this.tM > 11) {
        this.tY
        this.tM = 0
      }
    }
    
    this.data.monthData = resultArr
  },


  // 点击某一天
  clickOneDay(event) {
    let day = event.currentTarget.dataset.day
    let m = event.currentTarget.dataset.m
    
    if (this.ifDisable(day)) return false;

    let dayStr = addDays(m.year + '/' + m.month + '/' + day.day)

    if (this.data.checkout) {
      // 当入离日期都有的时候，则将当前被点击的日期设置为入住日期，同时清空离店日期
      this.setData({
        checkin: dayStr,
        checkout: '',
      })
    } else {
      // 当目前只有入住日期的时候，如果被点击的日期比入住日期小，则将被点击日期设置为入住日期；
      // 如果被点击日期大于入住日期，则将被点击日期设置为离店日期，然后跳转到上一个页面；
      let checkin = +new Date(formatDateTwo(this.data.checkin))
      let dayClicked = +new Date(formatDateTwo(dayStr))

      if (dayClicked <= checkin) {
        this.setData({
          checkin: dayStr,
        })
      } else {
        // this.data.checkout = dayStr
        this.setData({
          checkout: dayStr,
        })

        // 将入离日期设置到 store
        store.dispatch('checkin', this.data.checkin);
        store.dispatch('checkout', this.data.checkout);
      }
    }

    this.processData(this.data.monthData)
  },


  // 检查这一天是否不可点，有两三种情况不可点：1、日期小于今天（境外是小于明天） 2、当离店日期还没选的时，比入住日期大15天以上的日期  3、日期比今天大180天以上
  ifDisable(day) {
    let dayStr = day.dayStr
    let minDate =
      this.getCityType == 3
        ? addDays(new Date, 1)
        : addDays(new Date)

    if (dayStr) {
      let d1 = +new Date(formatDateTwo(dayStr))
      let d2 = +new Date(formatDateTwo(minDate))

      if (d1 < d2 || d1 - d2 > 180 * 24 * 60 * 60 * 1000) return true

      if (!this.data.checkout) {
        let d3 = +new Date(formatDateTwo(this.data.checkin || ''))
        if (d1 - d3 > 15 * 24 * 60 * 60 * 1000) {
          return true
        }

        return false
      }

      return false
    }

    return true
  },


  // 检查 dayStr，如果其日期值等于 getCheckin 则返回1，如等于 getCheckout 则返回2，否则返回0
  checkDayStr(day) {
    let dayStr = day.dayStr

    if (dayStr) {
      let d1 = +new Date(formatDateTwo(dayStr))
      let d2 = +new Date(formatDateTwo(this.data.checkin || ''))
      let d3 = +new Date(formatDateTwo(this.data.checkout || ''))

      if (d1 == d2) return 1
      if (d1 == d3) return 2
      if (day.today) return 3
      return 0
    }

    return 0;
  },

  // 处理数据，使之适应模板
  processData(data){
    for (let i = 0; i < data.length; i++) {
      const month = data[i]
      
      for (let j = 0; j < month.weeks.length; j++) {
        const week = month.weeks[j]

        for (let k = 0; k < week.length; k++) {
          const day = week[k]
          let dayClass = []
          let dayTextClass = []
          let dayCheckinClass = []

          day.checkDayStr = this.checkDayStr(day)

          if(this.ifDisable(day))         dayClass.push('disable')
          if(day.festText)                dayClass.push('festival')
          if(day.checkDayStr)             dayClass.push('text-white')
          if(k % 7 == 0 || k % 7 == 6)    dayClass.push('weekend')

          if(day.festText || day.today)   dayTextClass.push('small-text')
          if(day.checkDayStr)             dayTextClass.push('circle')

          if(day.checkDayStr)             dayCheckinClass.push('bg-circle')
          if(day.checkDayStr == 1)        dayCheckinClass.push('checkin')
          if(day.checkDayStr == 2)        dayCheckinClass.push('checkout')
          if(day.today)                   dayCheckinClass.push('today')

          day.dayClass                  = dayClass.join(' ')
          day.dayTextClass              = dayTextClass.join(' ')
          day.dayCheckinClass           = dayCheckinClass.join(' ')
        }
      }
    }

    this.setData({
      showMonths: this.data.monthData,
    })
  }
}))