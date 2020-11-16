/**
 * 全页面的请求接口都统一放在API.js里
 * 一般的接口请求都需要SessionKey,所以这里会统一写好传给后端
 * 前端可以传其他需要的参数
 *  统一的接口域名请求在app.js data里,前端可以自己配置
 */
const app = getApp();
import regeneratorRuntime from 'plugs/regeneratorRuntime';
import promisify from 'plugs/promisify.js';
import icom from 'base/com.js';

class API {
    constructor(_this) {
        this.DOMAIN = _this.data.domain;
        this.wxResuest = promisify(wx.request)
        this.wxUploadFile = promisify(wx.uploadFile)
        this.apiurl = '/Api/Handler.ashx?method=';
    }
    /**
     * 初始化
     */
    async _send(method, data, type) {
        //data里面不带SessionKey才赋值
        if (!this.SessionKey && !data.hasOwnProperty('SessionKey')) data.SessionKey = getApp().data.SessionKey;
        console.log('APIname:'+method)
        let res = await this.wxResuest({
            url: this.DOMAIN + this.apiurl + method,
            data: data,
            method: type || 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
                // 'Authorization': 'Bearer ' + this.token
            },
            dataType: "json"
        });
        console.log(res.data)
        if (!res.data) {
            wx.showToast({ title: res.data.message, icon: "none" })
            return null;
        } else {
            return res.data;
        }
    }
    // 上传图片文件
    async _uploadFile(method, data) {
        let res = await this.wxUploadFile({
            url: this.DOMAIN + this.apiurl + method,
            filePath: data,
            name: 'file',
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
            }
        });
        if (res.statusCode != 200) {
            wx.showToast({ title: res.data.message, icon: "none" })
            return JSON.parse(res.data);
        } else {
            return JSON.parse(res.data);
        }
    }

    /**
     * 接口示意
     * @params Function success 回调函数 如果回调为null说明服务器报错了或者errcod非0
     * testApi 为接口的名称,两个保持一致即可
     */
    // 获取用户信息
    async GetUserInfo(data) {
        return this._send('GetUserInfo', data, 'GET');
    }

    // 获取用户手机号
    async GetUserPhone(data) {
        return this._send('GetUserPhone', data, 'POST');
    }
    // 菊花码参数获取 回跳地址
    async GetQRcodeScene(data) {
        return this._send('GetQRcodeScene', data, 'POST');
    }
  // 授权
  async AppletLogin(data) {
    return this._send('AppletLogin', data, 'POST');
  }

  async IsAuthorization(data) {
    return this._send('IsAuthorization', data, 'POST');
  }
  

  

}



module.exports = API;