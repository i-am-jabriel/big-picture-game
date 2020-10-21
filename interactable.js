var interactables = [];
var pps = 32;
class Interactable{
    constructor(){
        this.id = interactables.push(this) - 1;
        this.bounce = null;
        this.speed = 0;
        this.rotation = 0;
        this.x = spawn.x;
        this.y = spawn.y;
        this.size = 1;
    }
    onEnterFrame(dt){
        if(this.canMove){
            this.x += -Math.cos(this.rotation.degToRad()) * this.speed * dt;
            this.y += -Math.sin(this.rotation.degToRad()) * this.speed * dt;
        }
        if(camera.inView(this))this.render(dt);
        var l = tree.search(this).filter(x=>this.canTarget(x));
        if(l.length)this.handleCollisions(l);
    }
    insertIntoTree(){
        tree.insert(this);
    }
    static bulkInsertIntoTree(arr){
        tree.load(arr);
    }
    handleCollisions(){
    }
    render(dt){
        if(this.bounce)this.bounce.count = ((this.bounce.count + (dt / (1000 * this.bounce.rate)))) % (Math.PI);
        context.drawImage(this.image, this.x - this.width * .5 + camera.x, this.y - this.height *.5 + camera.y, this.width, this.height * this.bounceHeight);
    }
    onClick(){console.log(this)}
    destroy(){
        this.onDestroy();
        interactables.splice(interactables.indexOf(this),1);
    }
    static destroyAll(arr){
        let i = arr.length;
        while(i--)arr[i].onDestroy();
        interactables = interactables.filter(x=>arr.indexOf(x)==-1);
    }
    onDestroy(){
        this.id = null;
        tree.remove(this);
    }
    canTarget(x){
        return this != x;
    }
    distance(obj){
        return Math.sqrt(Math.pow(this.x-obj.x,2)+Math.pow(this.y-obj.y,2));
    }
    rotationTowards(obj){
        return Math.atan2(this.y-obj.y,this.x-obj.x).radToDeg();
    }
    static clear(){
        tree.clear();
        let i = interactables.length;
        while(i--)interactables[i].onDestroy();
        interactables = [];
    }
    get width(){
        return pps * this.size;
    }
    get height(){
        return pps * this.size;
    }
    get randomX(){
        return Math.random() * camera.width * .9 - camera.width * .45;
    }
    get randomY(){
        return Math.random() * camera.height * .9 - camera.height * .45;
    }
    get randomX_(){
        return Random.range(0,camera.width*1.5)*(prob(50)?-1:1)+mc.x;
    }
    get randomY_(){
        return Random.range(0,camera.height*1.5)*(prob(50)?-1:1)+mc.y;
    }
    get left(){
        return this.x - this.width * .5;
    }
    get top(){
        return this.y - this.height * .5;
    }
    get bottom(){
        return this.y + this.height * .5;
    }
    get right(){
        return this.x + this.width * .5;
    }
    get canMove(){
        return false;
    }
    get bounceHeight(){
        return this.bounce ? lerp(this.bounce.range.min,this.bounce.range.max,Math.sin(this.bounce.count)) : 1;
    }
    get mc(){return this === mc;}
    get minX(){return this.left;}
    get minY(){return this.top;}
    get maxX(){return this.right;}
    get maxY(){return this.bottom;}
}

const tree = new rbush(35);