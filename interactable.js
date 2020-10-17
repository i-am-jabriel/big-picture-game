var interactables = [];
class Interactable{
    constructor(){
        this.id = interactables.push(this) - 1;
        tree.insert(this.aabb = {id:this.id});
        this.bounce = null;
        this.speed = 0;
        this.rotation = 0;
        this.x = spawn.x;
        this.y = spawn.y;
    }
    onEnterFrame(dt){
        if(this.canMove){
            this.x += -Math.cos(this.rotation.degToRad()) * this.speed * dt;
            this.y += -Math.sin(this.rotation.degToRad()) * this.speed * dt;
            this.updateAABB();
        }
        if(camera.inView(this))this.render(dt);
        var l = tree.search(this.aabb);
        if(mc == this)console.log(l);
        if(l.length)this.handleCollisions(l);
    }
    handleCollisions(){
    }
    render(dt){
        if(this.bounce)this.bounce.count = ((this.bounce.count + (dt / (1000 * this.bounce.rate)))) % (Math.PI);
        context.drawImage(this.image, this.x, this.y, this.width, this.height * this.bounceHeight);
    }
    destroy(){
        this.onDestroy();
        interactables.splice(this.id,1);
        let i = interactables.length;
        while(i--)interactables[i].id = i;
    }
    static destroyAll(arr){
        let i = arr.length;
        while(i--)arr[i].onDestroy();
        interactables = interactables.filter(x=>arr.indexOf(x)==-1);
        i = interactables.length;
        while(i--)interactables[i].id = i;
    }
    onDestroy(){
        tree.remove(this);
    }
    /*get x(){return this._x;}
    set x(value){
        this._x = value;
        this.updateAABB();
    }
    get y(){return this._y;}
    set y(value){
        this._x = value;
        this.updateAABB();
    }*/
    get width(){
        return 40;
    }
    get height(){
        return 40;
    }
    get randomX(){
        return Math.random() * camera.width * .9 - camera.width * .45;
    }
    get randomY(){
        return Math.random() * camera.height * .9 - camera.height * .45;
    }
    get left(){
        return this.x;
    }
    get top(){
        return this.y;
    }
    get bottom(){
        return this.y + this.height;
    }
    get right(){
        return this.x + this.width;
    }
    get canMove(){
        return false;
    }
    get bounceHeight(){
        return this.bounce ? lerp(this.bounce.min,this.bounce.max,Math.sin(this.bounce.count)) : 1;
    }
    get minX(){return this.x;}
    get minY(){return this.y;}
    get maxX(){return this.right;}
    get maxY(){return this.bottom;}
    updateAABB(){
        Object.assign(this.aabb,{
            minX: this.x,
            minY: this.y,
            maxX: this.right,
            maxY: this.bottom,
        });
    }
}

const tree = new rbush(12);
console.log(tree.all());