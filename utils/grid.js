import Tile from './tile.js';

export default class{
  constructor(size, base) {
    this.base = base;
    this.size = size;
    this.container = this.init();
    this._index = 0;
    this.trash = [];
  }
  set index(value){
    this._index = value;
  }
  get index(){
    return this._index++;
  }
  init() {
    let container = new Array(this.size).fill(new Array(this.size).fill(null));
    container = container.map(row => row.map(e => null));
    return container;
  }

  genTile(){
    const x = parseInt(Math.random() * 40 / 10);
    const y = parseInt(Math.random() * 40 / 10);
    const key = Math.random()<0.7?this.base[0]:this.base[1];
    if (this.container[y][x] !== null) {
      return this.genTile();
    }
    const newer = new Tile({
      id: this.index,
      value: key,
      position: { x, y }
    });
    this.container[y][x] = newer;
  }
  getTile(position) {
    if (this.within(position)) {
      return this.container[position.y][position.x];
    } else {
      return false;
    }
  }

  insertTile(tile){
    this.container[tile.position.y][tile.position.x] = tile;
  }

  within(tile) {
    if (tile.x >= 0 && tile.x < this.size
      && tile.y >= 0 && tile.y < this.size) {
      return true;
    } else {
      return false;
    }
  }

  avaliable(tile) {
    if (this.within(tile) && this.container[tile.y][tile.x] === null) {
      return true;
    } else {
      return false;
    }
  }

  moveTo(tile, targetLocation) {
    this.container[targetLocation.y][targetLocation.x] = tile;
    this.container[tile.position.y][tile.position.x] = null;
    tile.position = targetLocation;
  }
  coverTo(tile, targetLocation) {
    
    // this.moveTo(tile, targetLocation);
    this.remove(tile);
  }

  remove(tile){
    this.container[tile.position.y][tile.position.x] = null;
    tile = null;
    
  }
  
}