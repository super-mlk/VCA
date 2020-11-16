const app = getApp();
const { API, beats, icom,  mta, regeneratorRuntime, promisify } = app;
//-------------------------------------------------------初始化-------------------------------------------------------
let $query, toNext;

Page({
    data: {
        appData: app.data,
        bgmPlay: false
    }, //页面的初始数据
    async onLoad(option) {
        icom.OS();
        $query = option;
        console.log('getQueryString', option);
        await app.initApp();

        
        /**
         * redirectUrl,如果从开屏页跳到其他页面需要参数时,调用icom.combineUrl()方法
         * 传入要跳转的页面和后面所带的参数
         * 如{id:55,ss:555}
         */
        let url = icom.combineUrl('/pages/home/home', Object.assign({ ss: 11 }, option));
        if (url) {
            this.setData({ redirectUrl: url })
        }
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
    gotoNextPage() {
        // 参数中有url则跳转对应的页面
        const redirectUrl = this.data.redirectUrl || '/pages/home/home'
        wx.redirectTo({ url: decodeURIComponent(redirectUrl) })
    },
    bgmClick: function() { //背景音乐按钮点击事件
        app.bgm.click();
    },
    next(){
        toNext = '/pages/home/home';
        this.selectComponent("#auth").isAuth();
    },
    // 取消授权
    onAuthCancle(e){
        console.log(e.detail)
        wx.navigateTo({url:toNext})
    },
    // 拿到授权
    onAuthSure(e){
        console.log(e.detail)
        wx.navigateTo({url:toNext})
    },
}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------