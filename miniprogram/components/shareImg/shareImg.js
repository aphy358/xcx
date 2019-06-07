var Point = function (x, y) {
  return { x: x, y: y };
};

// components/shareImg/shareImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // true 表示显示 canvas，false 表示不显示
    showCanvasImg: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changePath) {
        if (newVal) {
          this.animation.top('50%').step()
          this.setData({
            animationData: this.animation.export()
          })
        } else {
          this.animation.top('-50%').step()
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
    shareImgPath: '',
    animationData: {}
  },

  lifetimes: {
    attached: function () {
      this.makeCanvas()
      this.animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      })
    },
    detached: function () {
    },
  },

  pageLifetimes: {
    show() {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 画圆角矩形
    drawRoundedRect(rect, r, ctx) {
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

      // ctx.stroke();
    },

    // 绘制 canvas
    makeCanvas() {
      var _this = this

      var path = '/assets/img/ttt.jpg'    // 测试用的图片
      var path2 = '/assets/img/qrcode.jpg'    // 测试用的图片
      var ctx = wx.createCanvasContext('share', this)

      // 画最上面的 '惠出发'
      ctx.setFillStyle("#373737");
      ctx.setTextAlign('center')
      ctx.font = 'normal bold 14px sans-serif'
      ctx.fillText("惠出发", 150, 25)
      ctx.save()

      // 画景点图片，或酒店图片
      _this.drawRoundedRect({
        x: 15,
        y: 40,
        width: 270,
        height: 150
      }, 4, ctx)
      ctx.clip()
      ctx.drawImage(path, 15, 40, 270, 150)
      ctx.restore()

      // 画景点名称，或酒店名称，如果太长，则分两行画
      var grd = ctx.createLinearGradient(15, 200, 45, 200)
      grd.addColorStop(0, '#FA5098')
      grd.addColorStop(1, '#683FB9')
      ctx.setFillStyle(grd)
      ctx.fillRect(15, 200, 30, 15)
      ctx.setFillStyle("white");
      ctx.setTextAlign('center')
      ctx.font = 'normal 10px sans-serif'
      ctx.fillText("热卖", 30, 211)

      var text = '上海迪斯尼2日1晚维也纳酒店免费接站接送迪斯尼乐园含门票上海迪斯尼2日1晚上海迪斯尼2日1晚'
      var text1 = ''
      var text2 = ''
      if (text.length > 18) {
        for (var i = 18; i < text.length; i++) {
          var metrics = ctx.measureText(text.substring(0, i))
          if (metrics.width >= 200) {
            i--
            break
          }
        }
        text1 = text.substring(0, i)
        text2 = text.substring(i)
        if (text2.length >= 15) {
          text2 = text2.substring(0, 15) + '...'
        }
      } else {
        text1 = text
      }

      ctx.setFillStyle("#373737");
      ctx.setTextAlign('left')
      ctx.font = 'normal bold 12px sans-serif'
      ctx.fillText(text1, 50, 212)
      if (text2 != '') {
        ctx.fillText(text2, 15, 232)
      }

      // 画价格
      var price = '919'
      ctx.setFillStyle("#FF5A3D");
      ctx.setTextAlign('right')
      ctx.font = 'normal bold 18px sans-serif'
      var metrics = ctx.measureText(price)
      ctx.fillText(price, 285, 234)

      // 画 '￥'
      ctx.setFillStyle("#FF5A3D");
      ctx.setTextAlign('right')
      ctx.font = 'normal bold 12px sans-serif'
      ctx.fillText('￥', 285 - metrics.width, 234)
      ctx.save()

      // 画头像和分享人信息
      ctx.arc(27, 258, 12, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(path, 15, 246, 24, 24)
      ctx.restore()

      ctx.setFillStyle("#717171");
      ctx.setTextAlign('left')
      ctx.font = 'normal 10px sans-serif'
      ctx.fillText("来自***的分享", 48, 263)

      // 画二维码
      ctx.drawImage(path2, 15, 285, 52, 52)

      ctx.setFillStyle("#373737")
      ctx.fillText("长按识别二维码，可购买商品", 75, 315)

      ctx.draw(true, setTimeout(function () {
        _this.canvasToTempFilePath()
      }, 1000))

      wx.getImageInfo({
        // http://image.jladmin.cn
        src: 'https://qnb.oss-cn-shenzhen.aliyuncs.com/real_1559184376702.png',
        success: function (res) {

          // _this.saveImageToPhotos()
        }
      })
    },

    // 保存图片到系统相册（授权）
    saveImageToPhotos() {
      let self = this

      wx.showModal({
        content: '是否保存图片？',
        success: function (res) {
          if (res.confirm) {
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
          }
        }
      })
    },


    // 将 canvas 保存为图片
    savePic() {
      if (this.data.shareImgPath) {
        wx.showLoading({
          title: '图片保存中...'
        })
        wx.saveImageToPhotosAlbum({
          filePath: this.data.shareImgPath,
          success(res) {
            wx.showModal({
              content: '图片已保存到相册，赶紧晒一下吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) { }
              },
              fail: function (res) { }
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      } else {
        var _this = this
        setTimeout(function () {
          _this.savePic()
        }, 100)
      }
    },

    // 将 canvas 转图片
    canvasToTempFilePath() {
      var _this = this
      wx.canvasToTempFilePath({
        canvasId: 'share',
        success: function (res) {
          _this.setData({
            shareImgPath: res.tempFilePath
          })
        },
        fail: function(res){
        }
      }, _this);
    },

    // 隐藏 canvas 图片
    hideCanvasImg(){
      this.triggerEvent('hideImage')
    }

  }
})
