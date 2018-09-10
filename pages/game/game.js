import Game from '../../utils/game.js'
//index.js

//获取应用实例
const app = getApp();
const gameDataTableID = 51046;
let Table = new wx.BaaS.TableObject(gameDataTableID);
let record; // 游戏记录

let game;
let toucheStartX = 0, toucheStartY = 0,
  toucheEndX = 0, toucheEndY = 0;

Page({
  data: {
    grids: new Array(16),
    tiles: [],
    score: 0,
    best: 0,
    auth: true,
    notice: true,
    over: false,
    authError: ''
  },
  onLoad: function () {
    this.setData({
      auth: wx.getStorageSync('auth')
    });
    // 查看是否有数据保存
    if (app.globalData.userInfo) {
      // 以及认证的情况下直接获取记录
      this.getOrInsertRecord(app.globalData.userInfo);
    }
  },
  onReady() {

    this.start = (game) => {
      this.setData({
        tiles: game.tiles,
        score: game.score,
        best: game.best,
        over: game.over
      });
    }
  },
  touch(e) {
    switch (e.type) {
      case 'touchstart':
        toucheStartX = e.touches[0].clientX;
        toucheStartY = e.touches[0].clientY;
        break;
      case 'touchmove':
        break;
      case 'touchend':
        toucheEndX = e.changedTouches[0].clientX;
        toucheEndY = e.changedTouches[0].clientY;
        let dx = toucheEndX - toucheStartX,
          dy = toucheEndY - toucheStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
          game.control(dx > 0 ? 1 : 0);
        } else {
          game.control(dy > 0 ? 2 : 3);
        }
        this.updateView();
        this.updateData();
        break;
    }
  },
  userInfoHandler(data) {
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
  startNewGame() {
    game.startNewGame();
    this.setData({
      tiles: game.tiles,
      score: game.score,
      best: game.best,
      over: game.over
    });
    this.updateData();
  },
  updateView() {
    // 更新视图
    this.setData({
      tiles: game.tiles,
      score: game.score,
      best: game.best,
      over: game.over
    });
  },
  updateData() {
    // 更新数据
    record.set({
      tiles: game.serializeTiles(),
      score: game.score,
      best: game.best,
      over: game.over
    });
    record.update();
  },
  getOrInsertRecord(userInfo) {
    let query = new wx.BaaS.Query();
    query.compare('openid', '=', userInfo.openid);
    Table.setQuery(query).find().then(result => {
      // 查询完成
      if (result.data.meta.total_count) {
        // 查询到记录
        let recordInfo = result.data.objects[0];
        record = Table.getWithoutData(recordInfo.id);
        // 导入记录
        !game && (game = new Game({
          score: recordInfo.score,
          best: recordInfo.best,
          tiles: recordInfo.tiles,
          over: recordInfo.over
        }));
        this.start(game);
        return;
      } else {
        // 查询到0条
        // 数据库中没有记录，插入一条
        let newRecord = Table.create();
        newRecord.set({
          openid: userInfo.openid
        })
        newRecord.save().then(res => {
          console.log('添加成功')
          game = new Game();
        });
        return this.getOrInsertRecord(userInfo)
      }

    }, err => {
      // 查询失败
    })
  }
})
