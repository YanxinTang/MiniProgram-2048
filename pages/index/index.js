//index.js

//获取应用实例
const app = getApp();
const gameDataTableID = 51046;
let Table = new wx.BaaS.TableObject(gameDataTableID);
let record; // 游戏记录

Page({
  data: {
    auth: true,
    singleScore: 0,
    singleBest: 0
  },
  onLoad: function () {
    this.setData({
      auth: wx.getStorageSync('auth')
    });
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      // 以及认证的情况下直接获取记录
      this.getOrInsertRecord(app.globalData.userInfo);
    }
  },
  userInfoHandler(data){
    wx.BaaS.handleUserInfo(data).then(res => {
      this.setData({
        auth: true
      });
      wx.setStorage({
        key: "auth",
        data: true
      });
      this.getOrInsertRecord(res);
    }, res => {
      this.setData({
        authError: '授权失败，请重试-0-' 
      });
    })
  },
  getOrInsertRecord(userInfo){
    let query = new wx.BaaS.Query();
    query.compare('openid', '=', userInfo.openid);
    Table.setQuery(query).find().then(result => {
      // 查询完成
      if (result.data.meta.total_count) {
        // 查询到记录
        let recordInfo = result.data.objects[0];
        this.setData({
          singleScore: recordInfo.score,
          singleBest: recordInfo.best
        });
        return ;
      } else {
        // 查询到0条
        // 数据库中没有记录，插入一条
        let newRecord = Table.create();
        newRecord.set({
          openid: userInfo.openid
        })
        newRecord.save().then(res => {
          console.log('添加成功')
        });
        return this.getOrInsertRecord(userInfo)
      }

    }, err => {
      // 查询失败
    })
  }
})
