
var Point = function (x, y) {
  return { x: x, y: y };
};


// miniprogram/pages/ticketDetail/ticketDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerSwiper: [
      {
        hotelId: '193847',
        img: 'http://image.jladmin.cn/real_1559184376702.png'
      },
    ],

    showNavBarTitle: false,

    shareImgPath: '',

    ratio: 1,

    canvasUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 绘制 canvas
    this.makeCanvas() 

    var _this = this
    wx.getSystemInfo({
      success: res => {
        _this.setData({
          ratio: res.pixelRatio
        })
      }
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
  onShareAppMessage: function (res) {
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

  // 将 canvas 保存为图片
  savePic() {
    var _this = this
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: function (res) {
        _this.setData({
          shareImgPath: res.tempFilePath
        })
        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempFilePath,
        //   success(res) {
        //     wx.showModal({
        //       content: '图片已保存到相册，赶紧晒一下吧~',
        //       showCancel: false,
        //       confirmText: '好的',
        //       confirmColor: '#333',
        //       success: function (res) {
        //         if (res.confirm) { }
        //       },
        //       fail: function (res) { }
        //     })
        //   },
        //   fail: function (res) {
        //     wx.showToast({
        //       title: '保存成功',
        //     })
        //   }
        // })
      }
    });
  },

  // 保存图片到系统相册（授权）
  saveImageToPhotos() {

    let self = this

    // 相册授权
    wx.getSetting({
      success(res) {
        // 进行授权检测，未授权则进行弹层授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              self.savePic()
            },
            // 拒绝授权时，则进入手机设置页面，可进行授权设置
            fail() {
              wx.openSetting({
                success: function (data) {
                  console.log("openSetting success");
                },
                fail: function (data) {
                  console.log("openSetting fail");
                }
              });
            }
          })
        } else {
          // 已授权则直接进行保存图片
          self.savePic()
        }
      },
      fail(res) {
        wx.showToast({
          title: '授权失败',
        })
      }
    })
  },


  // 绘制 canvas
  makeCanvas(){
    var _this = this

    wx.getImageInfo({
      // http://image.jladmin.cn
      src: 'https://qnb.oss-cn-shenzhen.aliyuncs.com/real_1559184376702.png',
      success: function (res) {
        var ctx = wx.createCanvasContext('share')
        ctx.setFillStyle("#373737");
        ctx.setTextAlign('center')
        ctx.font = 'normal bold 14px sans-serif'
        ctx.fillText("惠出发", 150, 25)
        ctx.drawImage(res.path, 20, 40, 260, 150)
        _this.drawRoundedRect({
          x: 20,
          y: 40,
          width: 260,
          height: 150
        }, 3, ctx)
        ctx.draw()

        // _this.saveImageToPhotos()
      }
    })
  },


  // 画圆角矩形
  drawRoundedRect(rect, r, ctx){
    var ptA = Point(rect.x + r, rect.y);
    var ptB = Point(rect.x + rect.width, rect.y);
    var ptC = Point(rect.x + rect.width, rect.y + rect.height);
    var ptD = Point(rect.x, rect.y + rect.height);
    var ptE = Point(rect.x, rect.y);

    ctx.beginPath();

    ctx.moveTo(ptA.x, ptA.y);
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

    ctx.stroke();
  }

})