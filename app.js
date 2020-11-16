import icom from 'common/js/base/com.js';
import API from 'common/js/API.js';
import regeneratorRuntime from '/common/js/plugs/regeneratorRuntime';
import promisify from '/common/js/plugs/promisify.js';
import Init from '/common/js/base/init.js';

import tools from "/common/js/mlkTools/tools";

let first;
let Scene = "defualt"; //来源
let SceneValue = ""; //场景值

App({
    onLaunch: function (options) {
        console.log('onLaunch', options);
        this.launchoptions = options;
        this.API = new API(this); // new 一下API.js, 这样每个页面都可以拿到

        this.MlkTools = new tools();

        this.icom = icom;
        this.regeneratorRuntime = regeneratorRuntime;
        this.promisify = promisify;
        // this.bgm = bgm;

        first = true


        Scene = options.query.scene ? options.query.scene : "defualt";
        SceneValue = options.scene ? options.scene : "defualt";
        this.beats = new Init({
            API: this.API
        }); //new 一下init.js,这样每个页面都可以拿到
        console.log("Scene:" + Scene);
        console.log("SceneValue:" + SceneValue);


        this.updateManager();

        this.getWindowInfo();

        //播放背景音乐
        // this.bgm = require('common/js/base/bgm.js');
        // this.bgm.on({ src: 'http://t.sky.be-xx.com/wxapp/wxapp_frame/sound/bgm.mp3'});
    },

    updateManager() {
        const updateManager = wx.getUpdateManager();
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },

    async initApp() {
        if (this.data.SessionKey == '' || first) {
            first = false;
            await this.AppletLogin();
        }

        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        // page.footclick = this.footclick;
        page.setData({
            appData: this.data
        })


    },
    // code换openid
    async AppletLogin() {
        const login = promisify(wx.login);
        let {
            code
        } = await login();
        let res = await this.API.AppletLogin({
            code: code,
            source: Scene,
            wxsource: SceneValue
        })
        if (res.errcode == 0) {
            this.data.SessionKey = res.result.SessionKey;
        }
        let res2 = await this.API.IsAuthorization({})
        // 如果只需要其中一个授权，另外一个这里赋值=1即可
        // this.data.Flag_Info=res2.result.Flag_Info    //1是 0否
        // this.data.Flag_Phone=res2.result.Flag_Phone     //1是 0否
    },

    // 获取屏幕信息
    getWindowInfo() {
        let res = wx.getSystemInfoSync();
        console.log('系统信息: ', res);
        this.systemInfo = res;
    },

    /**
     * 全局参数
     * */
    data: {
        domain: "https://wxapplet.beats-digital.com", //测试
        systemInfo: {}, //系统信息
    },
    //初始化 end
    setShareData: function (options) {
        let defaults = {
            title: this.shareData.title,
            path: this.shareData.path,
            imageUrl: this.shareData.imageUrl,
        };
        let opts = {};
        Object.assign(opts, defaults, options);
        opts.path = icom.combineUrl(opts.path, {
            scene: Scene
        });
        console.log(opts);
        return {
            title: opts.title,
            path: opts.path,
            imageUrl: opts.imageUrl
        };
    },


    bgmClick: function () { //背景音乐按钮点击事件
        bgm.click();
    },
    onShow: function () {
        // if (this.bgm.stopByAppHide && this.bgm.playing){
        //     this.bgm.stopByAppHide = false;
        //     this.bgm.play();
        // }//edn if
    },
    shareData: {
        title: '小程序模板',
        path: '/pages/index/index',
        imageUrl: '/images/share.jpg'
    },

    onHide: function () {
        // this.bgm.stopByAppHide=true;
    },
})