// miniprogram/pages/checkinCheckout.js
import { getMonthsData } from './getMonthsData.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMonths: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let monthData = getMonthsData()

    this.processData(monthData)

    this.setData({
      showMonths: monthData
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  // 点击某一天
  clickOneDay: function(disable, m, _day) {
    if (disable) return false;

    let dayStr = addDays(m.year + '/' + m.month + '/' + _day.day)

    if (this.checkout) {
      // 当入离日期都有的时候，则将当前被点击的日期设置为入住日期，同时清空离店日期
      this.checkin = dayStr
      this.checkout = ''
    } else {
      // 当目前只有入住日期的时候，如果被点击的日期比入住日期小，则将被点击日期设置为入住日期；
      // 如果被点击日期大于入住日期，则将被点击日期设置为离店日期，然后跳转到上一个页面；
      let checkin = +new Date(formatDateTwo(this.checkin))
      let dayClicked = +new Date(formatDateTwo(dayStr))

      if (dayClicked <= checkin) {
        this.checkin = dayStr
      } else {
        this.checkout = dayStr

        // 将入离日期设置到 store
        this.$store.commit(`setCommonState`, { k: 'checkin', v: this.checkin })
        this.$store.commit(`setCommonState`, { k: 'checkout', v: this.checkout })

        // 延迟返回上一个页面
        let _this = this
        setTimeout(function () {
          window.historyObj.arr.pop()
          _this.$router.go(-1)
        }, 200)
      }
    }
  },


  // 检查这一天是否不可点，有两三种情况不可点：1、日期小于今天（境外是小于明天） 2、当离店日期还没选的时，比入住日期大15天以上的日期  3、日期比今天大180天以上
  ifDisable: function(day) {
    let dayStr = day.dayStr
    let minDate =
      this.getCityType == 3
        ? addDays(new Date, 1)
        : addDays(new Date)

    if (dayStr) {
      let d1 = +new Date(formatDateTwo(dayStr))
      let d2 = +new Date(formatDateTwo(minDate))

      if (d1 < d2 || d1 - d2 > 180 * 24 * 60 * 60 * 1000) return true

      if (!this.checkout) {
        let d3 = +new Date(formatDateTwo(this.checkin))
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
  checkDayStr: function(day) {
    let dayStr = day.dayStr

    if (dayStr) {
      let d1 = +new Date(formatDateTwo(dayStr))
      let d2 = +new Date(formatDateTwo(this.checkin || ''))
      let d3 = +new Date(formatDateTwo(this.checkout || ''))

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
  }
})