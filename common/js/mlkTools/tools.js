class Tools {
  // 存入缓存
  mlk_setStorage(key, value) {
    wx.setStorage({
      key: key,
      data: value
    })
  }

  // 取
  mlk_getStorage(key, fn) {
    wx.getStorage({
      key: key,
      success(res) {
        fn(res.data);
      }
    })
  }


}

module.exports = Tools