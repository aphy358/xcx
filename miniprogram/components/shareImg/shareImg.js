import store from '../../plugins/store/index.js'

var Point = function (x, y) {
  return { x: x, y: y };
};

Component(store.createComponent({
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
          var goodsId = this.data.productInfo.hcfGoodsInfo.goodsId
          if (this.data.goodsId != goodsId){
            // 当点击了生成海报按钮时，则开始制作 canvas（先下载所有图片）
            this.downLoadImgs()
          }else{
            this.setData({
              imgReady: true,
              shareImgPath: this.data.lastShareImg
            })
          }

          this.animation.top('50%').step()
          this.setData({
            animationData: this.animation.export(),
            goodsId: goodsId
          })
        } else {
          this.animation.top('-60%').step()
          this.setData({
            animationData: this.animation.export()
          })
        }
      }
    },
    // 商品信息
    productInfo: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changePath) {
        if (newVal && newVal.hcfGoodsInfo) {
          this.setData({
            heightOfImg1: newVal.hcfGoodsInfo.goodsPoster ? 120 : 0
          })
        }
      }
    },
  },

  globalData: ['userData'],

  /**
   * 组件的初始数据
   */
  data: {
    shareImgPath: '',
    imgReady: false,
    animationData: {},

    // 商品临时图片
    img1: '',
    // 头像临时图片
    img2: '',
    // 小程序码临时图片
    img3: '',

    // 保存上一次的商品 id
    goodsId: null,

    // 上一次的海报图片
    lastShareImg: '',

    // 生成海报中，商品图片高度的增量，如果商品没有海报图片，该增量为 0，有海报图片则为 120
    heightOfImg1: 120

  },

  watch: {
    img1: function (newVal, oldVal) {
      this.makeCanvas()
    },
    img2: function (newVal, oldVal) {
      this.makeCanvas()
    },
    img3: function (newVal, oldVal) {
      if (newVal) {
        this.makeCanvas()
      }
    }
  },

  lifetimes: {
    attached: function () {
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

    // 下载所有制作 canvas 需要的图片
    downLoadImgs(){
      wx.showLoading({
        title: '生成海报...',
      })
      var _this = this

      // 下载商品临时图片
      wx.downloadFile({
        url: _this.data.productInfo.hcfGoodsInfo.goodsPoster || _this.data.productInfo.hcfGoodsInfo.goodsImgArr[0],
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            _this.setData({
              img1: res.tempFilePath
            })
          }else{
          }
        }
      })

      // 下载小程序码临时图片
      global.request({
        url: '/qrcode/getWxAcodeUnlimit',
        data: {
          page: 'pages/ticketDetail/ticketDetail',
          width: 52,
          scene: 'goodsId=' + this.data.productInfo.hcfGoodsInfo.goodsId + '&commissionUserId=' + this.data.userData.hcfUser.userId
        },
        success(res) {
          if (res.data.returnCode == 1) {
            if (res.data.data) {
              res.data.data = res.data.data.replace(/^https:\/\/oss-cn-shenzhen.aliyuncs.com/g, 'https://qnb.oss-cn-shenzhen.aliyuncs.com')
              wx.downloadFile({
                url: res.data.data,
                success(res) {
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                    _this.setData({
                      img3: res.tempFilePath
                    })
                  }
                }
              })
            }
          }
        }
      })

      // 下载头像临时图片
      if (store.app.globalData.userData.hcfUser.avatarUrl){
        wx.downloadFile({
          url: store.app.globalData.userData.hcfUser.avatarUrl,
          success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              _this.setData({
                img2: res.tempFilePath
              })
            }
          }
        })
      }else{
        _this.setData({
          img2: '/assets/img/headshot.jpg'
        })
      }
    },

    // 绘制 canvas
    makeCanvas() {
      var _this = this

      setTimeout(function(){
        // 必须三张临时图片都备好之后才绘制 canvas
        if (!(_this.data.img1 && _this.data.img2 && _this.data.img3))  return

        var ctx = wx.createCanvasContext('share', _this)
        var hDiff = _this.data.heightOfImg1

        ctx.save()
        _this.drawRoundedRect({
          x: 0,
          y: 0,
          width: 300,
          height: 360 + hDiff
        }, 4, ctx)
        ctx.setFillStyle('#fff')
        ctx.fill()

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
          height: 150 + hDiff
        }, 4, ctx)
        ctx.clip()
        ctx.drawImage(_this.data.img1, 15, 40, 270, 150 + hDiff)
        ctx.restore()

        // 画或商品名称，如果太长，则分两行画
        var grd = ctx.createLinearGradient(15, 200 + hDiff, 45, 200 + hDiff)
        grd.addColorStop(0, '#FA5098')
        grd.addColorStop(1, '#683FB9')
        ctx.setFillStyle(grd)
        ctx.fillRect(15, 200 + hDiff, 30, 15)
        ctx.setFillStyle("white");
        ctx.setTextAlign('center')
        ctx.font = 'normal 10px sans-serif'
        ctx.fillText("热卖", 30, 211 + hDiff)

        var text = _this.data.productInfo.hcfGoodsInfo.goodsName
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
        ctx.fillText(text1, 50, 212 + hDiff)
        if (text2 != '') {
          ctx.fillText(text2, 15, 232 + hDiff)
        }

        // 画价格
        var price = (_this.data.productInfo.goodsPrice || _this.data.productInfo.hcfGoodsStock.goodsPrice) + ''
        ctx.setFillStyle("#FF5A3D");
        ctx.setTextAlign('right')
        ctx.font = 'normal bold 18px sans-serif'
        var metrics = ctx.measureText(price)
        ctx.fillText(price, 285, 234 + hDiff)

        // 画 '￥'
        ctx.setFillStyle("#FF5A3D");
        ctx.setTextAlign('right')
        ctx.font = 'normal bold 12px sans-serif'
        ctx.fillText('￥', 285 - metrics.width, 234 + hDiff)
        ctx.save()

        // 画头像和分享人信息
        ctx.arc(27, 258 + hDiff, 12, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(_this.data.img2, 15, 246 + hDiff, 24, 24)
        ctx.restore()

        ctx.setFillStyle("#717171");
        ctx.setTextAlign('left')
        ctx.font = 'normal 10px sans-serif'
        ctx.fillText("来自 " + store.app.globalData.userData.hcfUser.nickName + " 的分享", 48, 263 + hDiff)

        // 画小程序码
        ctx.drawImage(_this.data.img3, 15, 285 + hDiff, 52, 52)

        ctx.setFillStyle("#373737")
        ctx.fillText("长按识别二维码，可购买商品", 75, 315 + hDiff)

        ctx.draw(true, setTimeout(function () {
          _this.canvasToTempFilePath()
        }, 100))
      }, 100)

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
            shareImgPath: res.tempFilePath,
            lastShareImg: res.tempFilePath,
            imgReady: true
          })
          wx.hideLoading()
        },
        fail: function(res){
        }
      }, _this);
    },

    // 隐藏 canvas 图片
    hideCanvasImg(){
      this.resetCanvas()
      this.triggerEvent('hideImage')
      wx.hideLoading()
    },

    // 重置 Canvas
    resetCanvas(){
      var _this = this
      setTimeout(function () {
        var ctx = wx.createCanvasContext('share', _this)
        var hDiff = _this.data.heightOfImg1
        ctx.save()
        _this.drawRoundedRect({
          x: 0,
          y: 0,
          width: 300,
          height: 360 + hDiff
        }, 4, ctx)
        ctx.setFillStyle('#fff')
        ctx.fill()
        ctx.draw()

        _this.setData({
          imgReady: false,
          img1: '',
          img2: '',
          img3: '',
          shareImgPath: '/assets/img/loading.gif',
        })
      }, 300)
    }

  }
}))
