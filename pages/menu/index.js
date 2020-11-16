// pages/template/index.js

const app = getApp();
let ctx = wx.createCanvasContext('canvas');
let lineWidth = 1;
let that = null;
let strokeStyle = "rgba(255,255,255,1)"; //线的颜色


Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterList: [{
        id: 1,
        name: "原图",
        img: "/images/menu/filter/i1.png",
        filter_img: "/images/menu/filter/f1.png",
        active: false,
      },
      {
        id: 2,
        name: "自然",
        img: "/images/menu/filter/i2.png",
        filter_img: "/images/menu/filter/f2.png",
        active: false,
      },
      {
        id: 3,
        name: "复古",
        img: "/images/menu/filter/i3.png",
        filter_img: "/images/menu/filter/f3.png",
        active: false,
      },
      {
        id: 4,
        name: "美白",
        img: "/images/menu/filter/i4.png",
        filter_img: "/images/menu/filter/f4.png",
        active: false,
      },
      {
        id: 5,
        name: "HDR",
        img: "/images/menu/filter/i5.png",
        filter_img: "/images/menu/filter/f5.png",
        active: false,
      },
    ],

    threeMenus: [{
      id: 1,
      img: "/images/menu/c1.png",
      img_active: "/images/menu/c1.png",
      name: "撤销",
      active: false,
    }, {
      id: 2,
      img: "/images/menu/c2.png",
      img_active: "/images/menu/c2.png",
      name: "颜色",
      active: false,
    }, {
      id: 3,
      img: "/images/menu/c3.png",
      img_active: "/images/menu/c3.png",
      name: "大小",
      active: false,
    }],

    paintList: [{
        id: 1,
        color: "rgba(255,255,255,1)"
      },
      {
        id: 2,
        color: "rgba(220,220,220,1)"
      },
      {
        id: 3,
        color: "rgba(243,236,135,1)"
      },
      {
        id: 4,
        color: "rgba(246,222,109,1)"
      },
      {
        id: 5,
        color: "rgba(248,181,81,1)"
      },
      {
        id: 6,
        color: "rgba(244,164,44,1)"
      }, {
        id: 7,
        color: "rgba(204,225,152,1)"
      },
      {
        id: 8,
        color: "rgba(172,213,152,1)"
      },
      {
        id: 9,
        color: "rgba(132,204,201,1)"
      },
      {
        id: 10,
        color: "rgba(0,104,183,1)"
      },
      {
        id: 11,
        color: "rgba(0,71,157,1)"
      },
      {
        id: 12,
        color: "rgba(2,24,50,1)"
      }
    ],

    maskFlag: false, //提示显示
    filterImg: "/images/menu/filter/f1.png", //滤镜
    menusId: 2, //操作id

    three_menus_id: 2, //1  撤销  2  颜色 3 大小
    lineInfo: 10, //线的粗细
    canvasFlag: false, //画笔的canvas默认隐藏
    paintImg: "", //画笔画出来的图片
    paintImgFlag: false, //切换到文本  画笔的图片显示
    windowObj: {}, //屏幕信息
    cavansWidth: "", //
    cavansHeight: "", //


    cavansTextWidth: 750, //文字canvas的宽度
    cavansTextHeight: 1447, //文字canvas的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getFilter();
    that = this;

    this.get_window_scale();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    canvasSet();

    // this.drawCanvas();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 逻辑代码----start
  // 获取屏幕比例
  get_window_scale() {
    let res = wx.getSystemInfoSync();
    let {
      windowObj
    } = this.data;
    windowObj.scale = res.windowWidth / 750;
    console.log('windowObj.scale: ', windowObj.scale);
    this.setData({
      windowObj
    })

  },

  // 获取元素的宽高
  get_take_box_dom() {
    wx.createSelectorQuery().select('#canvas').boundingClientRect((rect) => {
      console.log('rect: ', rect);
      this.setData({
        cavansWidth: rect.width,
        cavansHeight: rect.height
      })
      console.log('cavansWidth: ', rect.width);
      console.log('cavansHeight: ', rect.height);

    }).exec()
  },
  // 图片滤镜（天天P图）
  getFilter() {
    app.MlkTools.mlk_getStorage("userInfo", (msg) => {
      console.log('msg: ', msg);
      var app_id = "wxc3880418474667f6";
      var time_stamp = msg.time_stamp;
      var nonce_str = "fa577ce340859f9fe";
      var sign = msg.detail.signature;
      var filter = 1;
      var image = "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1605253131&di=fe44cd47fd404311b7065d66b7558191&src=http://a0.att.hudong.com/30/29/01300000201438121627296084016.jpg";


      wx.request({
        url: 'https://api.ai.qq.com/fcgi-bin/ptu/ptu_imgfilter',
        method: "POST",
        data: {
          app_id,
          time_stamp,
          nonce_str,
          sign,
          filter,
          image
        },
        success: (res => {
          console.log('res: ', res);

        })
      })

    })
  },

  // 隐藏提示
  hideTip() {
    this.setData({
      maskFlag: false
    })
  },

  // 滤镜
  getFiltersBtn(e) {
    const {
      id
    } = e.currentTarget.dataset;
    let {
      filterList
    } = this.data;


    var filter_img = filterList.filter(item => {
      if (item.id === id) {
        return item.img;
      }
    })

    this.setData({
      filterImg: filter_img[0].filter_img
    })
  },

  // 四个操作
  menusBtn(e) {
    const {
      id
    } = e.currentTarget.dataset;

    this.setData({
      menusId: id,
      three_menus_id: 0,
      paintImgFlag: false,
      canvasFlag: false,
    })

    if (id == 2) {
      this.setData({
        three_menus_id: 2,
        canvasFlag: true
      })

      this.get_take_box_dom();
    } else if (id == 3) {
      this.setData({
        canvasFlag: false,
        paintImgFlag: true
      })
    }
  },


  // 获取面板颜色
  paint_btn(e) {
    const {
      color
    } = e.currentTarget.dataset;
    console.log('color: ', color);

    this.setData({
      three_menus_id: 3
    })
    ctx.strokeStyle = color;
    let {
      lineInfo
    } = this.data;
    ctx.lineWidth = lineInfo / 10

  },


  // 三个操作
  threeMenusBtn(e) {
    const {
      id
    } = e.currentTarget.dataset;

    this.setData({
      three_menus_id: id,
    })

  },

  sliderchange(e) {
    let {
      value
    } = e.detail;
    this.setData({
      lineInfo: value
    })

    ctx.lineWidth = value / 10
  },

  bindfocus(e) {
    const {
      height
    } = e.detail;
    console.log('height: ', height);
  },


  // 划文字
  drawCanvas() {
    var ctx = wx.createCanvasContext('canvas-demo');
    ctx.rotate(20 * Math.PI / 180)
    ctx.setFontSize(20)
    ctx.fillText('Hello', 120, 120)
    ctx.draw();
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1447,
      destWidth: 750,
      destHeight: 1447,
      fileType: 'jpg',
      canvasId: 'canvas-demo',
      success: (res) => {
        console.log('res: ', res);
        this.setData({
          result_text_img: res.tempFilePath
        })

        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempFilePath,
        // })
      }
    })

  },


  // 逻辑代码----end

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
    return app.setShareData();
  },

  canvasTouchstart,
  canvasTouchmove,
  canvasTouchend,
  canvasClear
});

function canvasSet() {
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.strokeStyle = strokeStyle;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = lineWidth;
  ctx.draw();
} //edn func

function canvasClear(e) {
  ctx.draw();
  // canvasSet();
} //edn event

function canvasTouchstart(e) {
  let touch = e.changedTouches[0];
  let x = touch.x;
  let y = touch.y;
  ctx.beginPath();

  ctx.arc(x, y, lineWidth * 0.5, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.draw(true);
  ctx.beginPath();
  ctx.moveTo(x, y);
} //edn event

function canvasTouchmove(e) {
  // console.log(e);
  let touch = e.touches[0];
  let x = touch.x;
  let y = touch.y;
  ctx.lineTo(x, y);
  ctx.stroke();
  // ctx.beginPath();
  // ctx.arc(x, y, lineWidth * 0.5, 0, 2 * Math.PI);
  // ctx.closePath();
  // ctx.fill();
  ctx.draw(true);
  ctx.moveTo(x, y);
} //edn event

function canvasTouchend(e) {
  ctx.closePath();

  let {
    windowObj,
    cavansWidth,
    canvasHeight
  } = that.data;

  wx.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: 750 * windowObj.scale,
    height: canvasHeight * windowObj.scale,
    destWidth: 750 * windowObj.scale,
    destHeight: canvasHeight * windowObj.scale,
    canvasId: 'canvas',
    fileType: 'png',
    success(res) {
      console.log(res.tempFilePath)
      // setTimeout(()=>{
      //   wx.saveImageToPhotosAlbum({
      //     filePath: res.tempFilePath,
      //   })
      // },1000)

      that.setData({
        paintImg: res.tempFilePath
      }, () => {
        // wx.saveImageToPhotosAlbum({
        //   filePath: that.data.paintImg,
        // })
      })
    },
    fail(err) {
      console.log(err, "画失败了")
    }
  }, that)

} //edn event