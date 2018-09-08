export default class{

  constructor(init){
    this.id = init.id;
    this.value = init.value;
    this.position = init.position;
    this.merge = init.merge || false;
    this.newer = init.newer || true;
  }

  clean(){
    this.merge = false;
    this.newer = false;
  }
}