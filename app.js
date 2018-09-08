//app.js

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
    wx.getUserInfo,
    wx.requestPayment)

    wx.BaaS.init('a3e3d96112694558311b')

    // 获取用户信息
    wx.BaaS.login(false).then(userinfo => {
      // 登录成功
      this.globalData.userInfo = userinfo;
      try {
        wx.setStorageSync('auth', true);
      } catch (e) {
        console.log(e);
      }
    }, res => {
      // 登录失败
      try {
        wx.setStorageSync('auth', false)
      } catch (e) {
        console.log(e);
      }
    });
  },
  globalData: {
    userInfo: null
  },
})