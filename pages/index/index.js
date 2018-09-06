import Game from '../../utils/game.js'
//index.js
//获取应用实例
const app = getApp()
let game = new Game();
let toucheStartX = 0, toucheStartY = 0,
  toucheEndX = 0, toucheEndY = 0;
Page({
  data: {
    grids: new Array(16),
    tiles: []
  },
  onLoad: function () {
    
  },
  onReady(){
    
    game.start();
    this.setData({
      tiles: game.tiles()
    });
  },
  touch(e){

    
    switch(e.type){
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
        this.setData({
          tiles: game.tiles()
        });
        break;
    }    
  }
})
