import Grid from './grid.js'
import Tile from './tile.js'

export default class{
  constructor(oldRecode){
    this.base = [1, 2];
    this.size = 4;
    this.grid = new Grid(this.size, this.base);

    // this.events();
    this.start(oldRecode);
  }

  start(oldRecode){
    if (oldRecode){
      // 存在旧的数据
      this.score = oldRecode.score;
      this.best = oldRecode.best;
      this.won = false;
      this.over = oldRecode.over;
      let tile;
      try{
        for (let tileJson of oldRecode.tiles) {
          tile = new Tile(JSON.parse(tileJson));
          this.grid.insertTile(tile);
        }
        this.grid.index = tile.id + 1;
        this.tiles = this.getTiles();
      }catch(e){

      }
    }else{
      this.score = 0;
      this.best = 0;
      this.won = false;
      this.over = false;
      this.tiles = [];
      this.addStartTiles();
      this.tiles = this.getTiles();
    }
  }
  startNewGame(){
    this.score = 0;
    this.won = false;
    this.over = false;
    this.grid = new Grid(this.size, this.base);
    this.grid.index = 0;
    this.addStartTiles();
    this.tiles = this.getTiles();
  }
  addStartTiles(){
    for(let i = 0; i < 2; i++){
      this.grid.genTile()
    }
  }
  
  buildTraversals(vector) {
    const traversals = { x: [], y: [] };
    for (let i = 0; i < this.size; i++) {
      traversals.x.push(i);
      traversals.y.push(i);
    }
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    return traversals;
  }

  control(direction) {
    this.grid.trash = [];
    const vector = this.getVector(direction);
    const traversals = this.buildTraversals(vector);
    let canGenTile = false;
    let x = 0, y = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        [x, y] = [traversals.x[i], traversals.y[j]];
        let tile = this.grid.container[y][x];
        if (tile) {
          tile.clean()

          let trans = this.getNextPosition(tile.position, vector);
          let target = this.grid.getTile(trans.next);

          if (target && !target.merge && tile.value === target.value) {
            let merged = new Tile({
              id: this.grid.index,
              value: tile.value * 2,
              position: trans.next
            });
            merged.merge = true;
            this.grid.insertTile(merged);

            this.score += merged.value;
            this.score>this.best && (this.best = this.score);

            this.grid.remove(tile);
            tile.position = target.position;
            this.grid.trash.push(tile, target);
            canGenTile = true;
          } else {
            if (tile.position !== trans.previous) {
              this.grid.moveTo(tile, trans.previous);
              canGenTile = true;
            }
          }
        }
      }
    }
    if (canGenTile) {
      this.grid.genTile();
      this.tiles = this.getTiles();
    }
    if(!this.hasFree() && !this.canMerge()){
      this.over = true;
    }
  }

  getNextPosition(position, vector) {
    do {
      var previous = position;
      position = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.within(position) && this.grid.avaliable(position));
    return { previous, next: position };
  }

  getVector(direction) {

    const vectors = new Map([
      [0, { x: -1, y: 0 }],
      [1, { x: 1, y: 0 }],
      [2, { x: 0, y: 1 }],
      [3, { x: 0, y: -1 }]
    ]);

    return vectors.get(direction);
  }
  getAvaliableTiles(){
    let result = [];
    for (let row of this.grid.container) {
      for (let item of row) {
        if (item !== null) {
          result.push(item);
        }
      }
    }
    return result;
  }
  getTiles(){
    let result;
    result = [...this.getAvaliableTiles(), ...this.grid.trash];
    result.sort(function(a, b){
      if(a.id<b.id){
        return -1;
      }else if(a.id === b.id){
        return 0;
      }else{
        return 1;
      }
    });

    return result;
  }
  serializeTiles(){
    let serialize  = [];
    for(let tile of this.tiles){
      serialize.push(JSON.stringify(tile));
    }
    return serialize;
  }

  hasFree(){
    return this.getAvaliableTiles().length !== this.size * this.size;
  }

  canMerge(){
    let canMerge = false;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let tile = this.grid.container[i][j];
        if(tile){
          for(let k = 0; k < 4; k++){
            let vector = this.getVector(k);
            let nextTile = this.grid.getTile({
              x: tile.position.x + vector.x,
              y: tile.position.y + vector.y
            });

            if(nextTile && tile.value === nextTile.value){
              canMerge = true;
            }
          }
        }
      }
    }
    return canMerge;
  }
}