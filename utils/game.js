import Grid from './grid.js'
import Tile from './tile.js'

export default class{
  constructor(){
    this.base = [2, 4];
    this.size = 4;
    this.grid = new Grid(this.size, this.base);
    // this.events();
  }

  start(){
    this.grid.genTile();
    
  }

  events(){

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
    console.log(direction);
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
          tile.merge = false;
          tile.newer = false;

          let trans = this.getNextPosition(tile.position, vector);
          let target = this.grid.getTile(trans.next);

          if (target && !target.merge && tile.value === target.value) {
            let merged = new Tile(this.grid.index, tile.value * 2, trans.next);
            merged.merge = true;
            this.grid.insertTile(merged);
            this.grid.remove(tile);
            // this.grid.remove(target);
            // this.grid.coverTo(tile, target.position);
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
    } else {
      console.log('failed')
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
  tiles(){
    
    let result = [];
    for (let row of this.grid.container){
      for(let item of row){
        if (item !== null) {
          result.push(item);
        }
      }
    }
    result = [...result, ...this.grid.trash];
    console.log(result, this.grid.trash);
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
}