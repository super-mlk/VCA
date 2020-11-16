// pages/template/index.js

const app = getApp();

let VC = require("../../common/js/canvas/VCanvas.js");
let stage;


let timeInfo = null; //定时器状态
let timeNum = 10; //定时器时间


let temp = [{
    id: 1,
    img: "/images/camera/i1.png",
    img_active: "/images/camera/i1_active.png",
    video: "/images/camera/i1_video_active.png",
    active: false,
    video_active: false
  },
  {
    id: 2,
    img: "/images/camera/i2.png",
    img_active: "/images/camera/i2_active.png",
    video: "/images/camera/i2_video_active.png",
    active: false,
    video_active: false
  },
  {
    id: 3,
    img: "/images/camera/i3.png",
    img_active: "/images/camera/i3_active.png",
    video: "/images/camera/i3_video_active.png",
    active: false,
    video_active: false
  }
]; //初始化相框

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dev_position: "back", //默认后置摄像头
    photo_frame_img: "/images/camera/bg2.png", //相框
    photo_frame_list: [],
    imageSrc: "", //拍摄的图片

    resultImg: "/images/camera/test.jpg", //合成的图片
    cavansWidth: 750,
    cavansHeight: 1190,
    currentId: 0, //当前相框选中的值

    cameraFlag: true, // 默认拍照显示
    maskFlag: false, //提示拍照
    menu_flag: false, //底部操作栏,

    windowObj: {}, //屏幕信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext();

    // this.drawCard();
    // this.draw();

    this.setData({
      photo_frame_list: temp
    }, () => {
      let {
        photo_frame_list
      } = this.data;
      photo_frame_list[1].active = true;
      this.setData({
        photo_frame_list
      })
    })


    this.get_window_scale();
    this.get_take_box_dom();
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
    wx.createSelectorQuery().select('.take_box').boundingClientRect((rect) => {
      console.log('rect: ', rect);
      this.setData({
        cavansWidth: rect.width,
        cavansHeight: rect.height
      })
      console.log('cavansWidth: ', rect.width);
      console.log('cavansHeight: ', rect.height);

    }).exec()
  },

  // 切换相机
  change_ccd() {
    let {
      dev_position
    } = this.data;
    if (dev_position == "back") {
      dev_position = "front";
    } else {
      dev_position = "back";
    }

    this.setData({
      dev_position
    })
  },
  // 切换相框
  change_photo_frame(e) {
    const {
      id
    } = e.currentTarget.dataset;

    let {
      photo_frame_list,
      photo_frame_img
    } = this.data;

    // 解决切换相框就拍照的问题
    // 如果当前相框状态就是选中的话 那么就可以拍照
    photo_frame_list.map(item => {
      if (item.id == id) {
        if (item.active) {
          this.handleClick();
        }
      }
    })


    /**
     * 将数组中某个对象放置再中间
     * 
     */

    photo_frame_list = [];
    // 假设我点了1
    if (id == 1) {
      photo_frame_list[0] = temp[2];
      photo_frame_list[1] = temp[0];
      photo_frame_list[2] = temp[1];
    } else if (id == 2) {
      photo_frame_list[0] = temp[0];
      photo_frame_list[1] = temp[1];
      photo_frame_list[2] = temp[2];
    } else if (id == 3) {
      photo_frame_list[0] = temp[1];
      photo_frame_list[1] = temp[2];
      photo_frame_list[2] = temp[0];
    }

    photo_frame_list.map(item => {
      item.active = false;
      if (item.id == id) {
        item.active = true;
      }
    })
    switch (id) {
      case 1:
        photo_frame_img = "/images/camera/bg1.png"
        break;
      case 2:
        photo_frame_img = "/images/camera/bg2.png"
        break;
      case 3:
        photo_frame_img = "/images/camera/bg3.png"
        break;
    }

    this.setData({
      photo_frame_list,
      photo_frame_img
    })

  },

  /**
   * 点击按钮 - 拍照
   */
  handleClick: function (e) {
    console.log("endTime - startTime = " + (this.endTime - this.startTime));
    if (this.endTime - this.startTime < 350) {
      console.log("点击");
      //调用拍照方法
      this.takePhoto();
    }
  },

  //touch start 手指触摸开始
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
    console.log(" startTime = " + e.timeStamp);
    console.log(" 手指触摸开始 ", e);
    console.log(" this ", this);
  },

  //touch end 手指触摸结束
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    console.log(" endTime = " + e.timeStamp);
    console.log(" 手指触摸结束 ", e);
    //判断是点击还是长按 点击不做任何事件，长按 触发结束录像
    if (this.endTime - this.startTime > 350) {
      //长按操作 调用结束录像方法
      this.stopShootVideo();
    }
  },
  /**
   *拍照的方法 
   */
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          imageSrc: res.tempImagePath,
        }, () => {
          this.drawCard();
          this.draw();
        })

        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempImagePath,
        // })



      },
      fail() {
        //拍照失败
        console.log("拍照失败");
      }
    })
  },

  /**
   * 开始录像的方法
   */
  startShootVideo() {
    console.log("========= 调用开始录像 ===========")
    this.ctx.startRecord({
      success: (res) => {
        // wx.showLoading({
        //   title: '正在录像',
        // })

        // 将底部的按钮变成红色的录制视频状态
        const {
          photo_frame_list
        } = this.data;

        photo_frame_list.map(item => {
          if (item.id == this.data.currentId) {
            item.img_active = item.video;
          }
        })

        this.setData({
          photo_frame_list
        })


        timeInfo = setInterval(() => {
          if (timeNum <= 0) {
            timeNum = 0;
            this.stopShootVideo();
          } else {
            wx.showLoading({
              title: '正在录像 ' + timeNum + "s",
            })
          }
          timeNum--;
        }, 1000)

      },
      fail() {
        console.log("========= 调用开始录像失败 ===========")
      }
    })
  },

  /**
   * 结束录像
   */
  stopShootVideo() {
    console.log("========= 调用结束录像 ===========")
    this.ctx.stopRecord({
      success: (res) => {
        // 将相框变回来
        const {
          photo_frame_list
        } = this.data;
        photo_frame_list.map(item => {
          if (item.id == 1) {
            item.img_active = "/images/camera/i1_active.png";
          } else if (item.id == 2) {
            item.img_active = "/images/camera/i2_active.png";
          } else if (item.id == 3) {
            item.img_active = "/images/camera/i3_active.png";
          }
        })


        wx.hideLoading();
        wx.showToast({
          title: '录制完成',
        })
        timeNum = 10;
        clearInterval(timeInfo);
        this.setData({
          videoSrc: res.tempVideoPath,
          photo_frame_list
        })

        // wx.saveVideoToPhotosAlbum({
        //   filePath: res.tempVideoPath,
        // })

      },
      fail() {
        wx.hideLoading();
        console.log("========= 调用结束录像失败 ===========")

        timeNum = 10;
        clearInterval(timeInfo);

      }
    })
  },

  /**
   * 长按按钮 - 录像
   */
  handleLongPress: function (e) {
    console.log("endTime - startTime = " + (this.endTime - this.startTime));
    console.log("长按");
    const {
      id
    } = e.currentTarget.dataset;
    this.setData({
      currentId: id
    })



    // 长按方法触发，调用开始录像方法
    this.startShootVideo();
  },

  // 上传视频和图片
  upload_img_video() {
    wx.showActionSheet({
      itemList: ['上传图片', '上传视频'],
      success(res) {
        console.log(res.tapIndex)

        if (res.tapIndex == 0) {
          // 图片
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              console.log('tempFilePaths: ', tempFilePaths);
            }
          })
        } else {
          // 视频
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },


  // 合成图片
  drawCard: function () {
    //创建舞台
    //拿到canvas的对象 必须指定宽度和高度
    //onDraw表示绘制结束 必须在onDraw里面去执行wx.canvasToTempFilePath获取canvas的图片数据

    const {
      cavansWidth,
      cavansHeight
    } = this.data;
    console.log('cavansWidth: ', cavansWidth);
    console.log('cavansHeight: ', cavansHeight);


    stage = new VC.Stage(wx.createCanvasContext('canvas-demo'), cavansWidth, cavansHeight, {
      onDraw: () => {
        this.createImg();
      }
    });
  },

  createImg: function () {
    let w = this.data.cavansWidth;
    let h = this.data.cavansHeight;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: w,
      height: h,
      destWidth: w,
      destHeight: h,
      fileType: 'jpg',
      canvasId: 'canvas-demo',
      quality: 1,
      success: (res) => {
        console.log('res: ', res);
        this.setData({
          resultImg: res.tempFilePath,
          cameraFlag: false
        });

        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempFilePath,
        // })

        wx.hideLoading();
      }
    })
  },

  draw() {
    // 拍照图
    const {
      imageSrc
    } = this.data;

    // 相框
    const {
      photo_frame_img
    } = this.data;

    // 获取比例
    let {
      windowObj
    } = this.data;

    // 获取canvas 宽高
    const {
      cavansWidth,
      cavansHeight
    } = this.data;


    let drawList = [{
        type: 'image',
        path: imageSrc,
        width: 750 * windowObj.scale,
        height: cavansHeight,
        x: 0,
        y: 0,
        fillType: null,
        stroke: 0,
        name: "拍照图/底图"
      },
      {
        type: 'image',
        path: '/images/index/logo.png',
        width: 750 * windowObj.scale,
        height: 98 * windowObj.scale,
        x: 0,
        y: 76 * windowObj.scale,
        fillType: null,
        stroke: 0,
        name: "logo"
      },
      {
        type: 'image',
        path: photo_frame_img,
        width: 750 * windowObj.scale,
        height: cavansHeight,
        x: 0,
        y: 0,
        fillType: null,
        stroke: 0,
        name: "相框"
      }
    ];
    stage.removeAll()
    stage.addChildByList(drawList);


    wx.showLoading({
      title: '生产中',
      mask: true
    });

  },


  // 提示
  tipBtn() {
    this.setData({
      maskFlag: false
    })
  },

  // 重新拍摄
  reset_take() {
    this.setData({
      cameraFlag: true
    })
  },

  // 拍完照片下一步
  next_menu() {
    const {
      resultImg
    } = this.data;
    wx.navigateTo({
      url: '/pages/menu/index?resultImg=' + resultImg,
    })
  },

  // 逻辑代码----end


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    console.log("timeNum:::", timeNum)

    if (timeNum != 10) {
      this.stopShootVideo();
    }
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
  }
})