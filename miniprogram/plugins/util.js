
import store from './store/index.js'


/**
 * 获取指定的url参数值
 * @param {指定的url参数名} name
 */
export const queryString = function (name, targetStr) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r;
  if (!targetStr) {
    if(window.location.search){
      r = window.location.search.substr(1).match(reg);
    }else if(window.location.hash){
      if (window.location.hash.indexOf('?') !== -1){
        r = window.location.hash.split('?')[1].match(reg);
      }
    }
  } else {
    r = targetStr.match(reg);
  }
  return r != null ? unescape(r[2]) : null;
}

// 在给定的日期基础上加上若干天，并格式化成 '2017-10-01' 的字符串返回
export const addDays = function (d1, num, sep) {
  sep = sep || '-';
  num = num || 0;
  if (typeof d1 === 'string') d1 = new Date(d1.replace(/-/g, '/'));
  return new Date(+d1 + num * 24 * 60 * 60 * 1000).Format('yyyy' + sep + 'MM' + sep + 'dd');
}

// 对日期格式化1
export const formatDateOne = (dateStr) => {
  return dateStr.replace(/-/g, '/')
}

// 对日期格式化2
export const formatDateTwo = (dateStr) => {
  return dateStr.replace(/-/g, '/') + ' 00:00:00'
}

// 获取星级的字面表示
export const getStarText = (n) => {
  n.starText = 
    n.star <= 25 ? '经济型' : 
    n.star <= 35 ? '舒适型' : 
    n.star <= 45 ? '高档型' : '豪华型'
}


// 获取用户信息和账户信息
export const getUserAndAccount = (openid, token) => {
  openid = openid || global.openid
  token = token || global.token

  wx.request({
    url: global.url + '/user/userDetail',
    data: {
      token: token,
      openid: openid
    },
    success(res) {
      if (res.data.returnCode == -400001) {
        // 登录态丢失，重新登录
        wxLogin()
      } else if (res.data.returnCode == 1){
        // 自定义 request 函数
        setRequestFunc(openid, token)

        // global.userInfo 如果存在，说明是之前授权后返回的用户信息，包含头像、位置信息等
        if (!res.data.data.hcfUser.avatarUrl){
          if (global.userInfo){
            Object.assign(res.data.data.hcfUser, global.userInfo)
          }else{
            wx.getStorage({
              key: 'authorize',
              success(res) {
                wx.navigateTo({
                  url: '/pages/authorize/authorize'
                })
              },
              fail(res) {
              }
            })
          }
        }

        store.dispatch('userData', res.data.data)
      }
    },
    fail(res) {
    }
  })
}

function _getSuccessFunc(params, mustLogin){
  return function (res) {
    if (res.data.returnCode == -400001) {
      // 如果未登录，则登录
      mustLogin ? wxLogin() : ''
    } else if (res.data.returnCode == 1) {
      params.success(res)
    } else {
      wx.hideLoading()
      // 显示错误信息
      wx.showToast({
        title: res.data.returnMsg,
        icon: 'none',
        duration: 3000
      })
    }
  }
}

// 自定义 request 函数
export const setRequestFunc = (openid, token) => {
  global.openid = openid
  global.token = token

  global.request = (params) => {
    params.data = params.data || {}
    Object.assign(params.data, {
      openid, token
    })

    return wx.request({
      url: global.url + params.url, //  + '?openid=' + openid + '&token=' + token
      data: params.data,  //  ? qs(params.data) : null
      method: params.method || 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: _getSuccessFunc(params, true),
      fail: params.fail || function (res) { // 如果用户传递了 fail 的函数定义，则使用用户定义的函数，如果没有则给出默认的 fail 处理方式
        wx.hideLoading()
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  store.dispatch('isLogin', true)
  global.isLoging = false

  // 设置定时器，每分钟刷新一下登录态，这样登录态又延长为一个小时了
  // setInterval(function(){
  //   global.request({
  //     url: '/login/extendLogin',
  //     success(res){}
  //   })
  // }, 1000 * 60)
}

// 自定义 request 函数2
export const setRequestFunc2 = () => {
  global.request2 = (params) => {
    params.data = params.data || {}
    return wx.request({
      url: global.url + params.url,
      data: params.data,
      method: params.method || 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: _getSuccessFunc(params),
      fail: params.fail || function (res) { // 如果用户传递了 fail 的函数定义，则使用用户定义的函数，如果没有则给出默认的 fail 处理方式
        wx.hideLoading()
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
}

// 微信登录
export const wxLogin = () => {
  if (global.isLoging)  return
  global.isLoging = true

  wx.login({
    success(res) {
      if (res.code) {
        //发起网络请求
        wx.request({
          url: global.url + '/login/autoLoginWx',
          data: {
            code: res.code
          },
          success(res) {
            if (res.data.returnCode == 1){
              wx.hideLoading()

              var openid = res.data.data.openid
              var token = res.data.data.token

              // 自定义 request 函数
              setRequestFunc(openid, token)

              wx.setStorage({
                key: "openid",
                data: { openid, token }
              })

              // 如果之前没有查 userData，则查询一下
              if (!store.app.globalData.userData){
                getUserAndAccount(openid, token)
              }
            }
          },
          fail(res) {
            wx.hideLoading()
            wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '登录失败' + res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }
  })
}


export const updateUserInfo = (userInfo, openid, token) => {
  var params = {
    nickName: userInfo.nickName,
    avatarUrl: userInfo.avatarUrl,
    gender: userInfo.gender,
    country: userInfo.country,
    province: userInfo.province,
    city: userInfo.city,
    token: token || global.token,
    openid: openid || global.openid
  }

  wx.request({
    url: global.url + '/login/updateUserInfo',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs(params),
    success(res) {
    },
    fail(res) {
    }
  })
}


export const qs = (json) => {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

// 检查是否已经授权过
export const checkOuthorize = () => {
  wx.getStorage({
    key: 'authorize',
    success(res) {
    },
    fail(res) {
      wx.navigateTo({
        url: '/pages/authorize/authorize'
      })
    }
  })
}

// 处理商品详情，使之适应模板，nameLen 表示商品名称最多显示多少字
export const processProductInfo = (info, nameLen) => {
  nameLen = nameLen || 36

  if (info.hcfActivityInfo){
    info.hcfActivityInfo.bookingDes = info.hcfActivityInfo.bookingDes.split(/[\n|\r]/).filter(n => n)
    info.hcfActivityInfo.bookingNotice = info.hcfActivityInfo.bookingNotice.split(/[\n|\r]/).filter(n => n)
    info.hcfActivityInfo.costIncludes = info.hcfActivityInfo.costIncludes.split(/[\n|\r]/).filter(n => n)
    info.hcfActivityInfo.regressionRule = info.hcfActivityInfo.regressionRule.split(/[\n|\r]/).filter(n => n)
    processTimeLeft(info)
  }

  if (info.hcfGoodsInfo){
    info.hcfGoodsInfo.goodsPoster = processImgUrl(info.hcfGoodsInfo.goodsPoster || '')
    info.hcfGoodsInfo.goodsDetail = info.hcfGoodsInfo.goodsDetail.split(/[\n|\r]/).filter(n => n)
    info.hcfGoodsInfo.goodsImgArr = processImgUrl(info.hcfGoodsInfo.goodsImg || '').split(/[,|，]/).filter(n => n)
    info.hcfGoodsInfo.highlight = info.hcfGoodsInfo.highlight.split(/[\n|\r|#]/).filter(n => n)
    info.hcfGoodsInfo.goodsDetailImgArr = processImgUrl(info.hcfGoodsInfo.goodsDetailImg || '').split(/[,|，]/).filter(n => n)

    info.hcfGoodsInfo.goodsNameShow = info.hcfGoodsInfo.goodsName.length > nameLen
      ? info.hcfGoodsInfo.goodsName.substr(0, nameLen) + '...'
      : info.hcfGoodsInfo.goodsName

    // 针对订单填写页的商品名长度进行属性设置
    info.hcfGoodsInfo.goodsNameShow2 = info.hcfGoodsInfo.goodsName.length > 28
      ? info.hcfGoodsInfo.goodsName.substr(0, 28) + '...'
      : info.hcfGoodsInfo.goodsName
  }

  if (info.hcfGoodsStock){
    info.activityBeginDate = info.hcfGoodsStock.activityBeginDate.substr(0, 10)
    info.activityEndDate = info.hcfGoodsStock.activityEndDate.substr(0, 10)
    info.beginDate = info.hcfGoodsStock.beginDate.substr(0, 10)
    info.endDate = info.hcfGoodsStock.endDate.substr(0, 10)
  }

  if (info.hcfActivityInfo && info.hcfActivityInfo.activityBeginDate) info.activityBeginDate = info.hcfActivityInfo.activityBeginDate.substr(0, 10)
  if (info.hcfActivityInfo && info.hcfActivityInfo.activityEndDate) info.activityEndDate = info.hcfActivityInfo.activityEndDate.substr(0, 10)
}

// 处理倒计时
export const processTimeLeft = (info) => {
  var gap = new Date(formatDateOne(info.hcfActivityInfo.activityEndDate)) - new Date()
  if(gap >= 7 * 24 * 60 * 60 * 1000){
    info.hcfActivityInfo.timeLeftText = '抢购截止时间：' + info.hcfActivityInfo.activityEndDate.substr(0, 10)
  }else{
    var day = (gap / (1000 * 60 * 60 * 24)) | 0
    gap = gap % (1000 * 60 * 60 * 24)

    var hour = (gap / (1000 * 60 * 60)) | 0
    gap = gap % (1000 * 60 * 60)

    var min = (gap / (1000 * 60)) | 0
    gap = gap % (1000 * 60)

    var sec = (gap / 1000) | 0    // 秒

    info.hcfActivityInfo.timeLeftText = day == 0
      ? '抢购时间剩余：' + hour + '小时' + min + '分钟' + sec + '秒'
      : '抢购时间剩余：' + day + '天' + hour + '小时' + min + '分钟'
  }
}

export const processImgUrl = (url) => {
  return url.replace(/http:\/\/image.jladmin.cn/g, 'https://qnb.oss-cn-shenzhen.aliyuncs.com')
}


// 微信支付
export const wxPay = (_this, orderId, total_fee) => {
  wx.showLoading({
    title: '正在支付...',
  });

  global.request({
    url: '/wxAppPay/wxAppPayStart.do',
    data: {
      orderId: orderId,
      total_fee: total_fee,
    },
    method: "POST",
    success(res) {
      if (res.data.success == false) {
        wx.hideLoading()
        wx.showModal({
          content: res.data.errinfo,
          showCancel: false,
        })
      } else {
        payFunc(_this, res)
      }
    },
    fail(res) {
      wx.showToast({
        title: res.errMsg,
        icon: 'none',
        duration: 2000
      })
    },
    complete(res) {
      wx.hideLoading()
    }
  })
}


export const payFunc = (_this, res) => {
  wx.hideLoading()
  _this.setData({
    dataBeforePay: res
  })

  var data = res.data.data
  var type = store.app.globalData.userData.hcfUser.type

  wx.requestPayment({
    timeStamp: data.timeStamp,
    nonceStr: data.nonceStr,
    package: data.packageStr,
    signType: 'MD5',
    paySign: data.paySign,
    success(res) {
      wx.redirectTo({
        url: '/pages/orderDetail/orderDetail?id=' + _this.data.orderId + '&showPacket=1&type=' + type,
      })
    },
    fail(res) {
      // 弹出选择框，同时提供两个选项：1、查看订单 2、继续支付
      _this.setData({
        showPayCancelSelector: true
      })
    },
  })
}


// 在满足特定条件下才执行函数，比如这里的第三个参数，意思是只有当 _this[daa] 不为空的时候，才执行函数
export function runAfterCondition(_this, func, daa) {
  var args = Array.from(arguments).slice(3)

  if (!_this.data[daa]) {
    wx.showLoading({
      title: '请稍等...',
    })
    var timeout = setTimeout(function () {
      _this[func](...args)
    }, 100)

    return false
  }

  wx.hideLoading()
  return true
}



export function throttle(func, wait) {
  wait = wait || 300

  return function () {
    var context = this;
    var args = arguments;

    if (!func.tId) {
      func.tId = setTimeout(() => {
        func.tId = null;
        func.apply(context, args)
      }, wait);
    }
  }
}


export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}