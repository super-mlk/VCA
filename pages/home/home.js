const app = getApp();
const { API, beats, icom,  mta, regeneratorRuntime, promisify } = app;
//-------------------------------------------------------初始化-------------------------------------------------------
let $query;


Page({
    data: {
        bgmPlay: false
    }, //页面的初始数据
    async onLoad(option) {
        $query = option;
        console.log('getQueryString', option);
        await app.initApp();
       

    },
    onReady: function() {}, //监听页面初次渲染完成
    onShow: function() {
        // if (app.bgm){
        //     app.bgm.reShow();
        // }//edn if
    }, //监听页面显示
    onHide: function() {}, //监听页面隐藏
    onUnload: function() {}, //监听页面卸载
    onPullDownRefresh: function() {}, //页面相关事件处理函数--监听用户下拉动作
    onReachBottom: function() {}, //页面上拉触底事件的处理函数
    onShareAppMessage: function() { //用户点击右上角分享
        return app.setShareData();
    },
    bgmClick: function() { //背景音乐按钮点击事件
        app.bgm.click();
    },
   
}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------