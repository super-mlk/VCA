const app = getApp();
const {
    API,
    beats,
    icom,
    mta,
    regeneratorRuntime,
    promisify
} = app;
//-------------------------------------------------------初始化-------------------------------------------------------
Page({
    data: {

    }, //页面的初始数据
    onLoad(option) {

    },
    onReady: function () {}, //监听页面初次渲染完成
    onShow: function () {

    }, //监听页面显示

    // 代码逻辑----start
    bindgetuserinfo(e){
        console.log('授权信息: ', e);
        const {iv,encryptedData,userInfo} = e.detail;
        console.log('userInfo: ', userInfo);

        app.MlkTools.mlk_setStorage("userInfo",e)

    },
    // 代码逻辑----end


    onHide: function () {}, //监听页面隐藏
    onUnload: function () {}, //监听页面卸载
    onPullDownRefresh: function () {}, //页面相关事件处理函数--监听用户下拉动作
    onReachBottom: function () {}, //页面上拉触底事件的处理函数
    onShareAppMessage: function () { //用户点击右上角分享
        return app.setShareData();
    },

}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------