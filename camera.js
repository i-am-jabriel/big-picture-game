var spawn={
    get x(){return this._x + camera.x;},
    get y(){return this._y + camera.y;}
};

class Camera{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.levelingUp = false;
        this.scale = 1;
        this.onResize();
        /*window.addEventListener('resize',x=>this.onResize());*/
    }
    inView(obj, margin = 20){
        if(
            obj.x >= this.x - margin &&
            obj.x <= this.x + this.width + margin &&
            obj.y >= this.y - margin &&
            obj.y <= this.y + this.height + margin
        ) {
           return true;
        }
    
        return false;
    }
    onResize(){
        let c=document.querySelector('canvas');
        c.width = this.width = document.body.clientWidth;
        c.height = this.height = window.outerHeight;
        spawn._x=this.width*.48;
        spawn._y=this.height*.48;
    }
    tryToLevelUp(){
        if(mc.size > 6 && !this.levelingUp){
            this.levelingUp = true;
            setTimeout(()=>{

                console.log('level up');
                var shrinkTime = 2000;
                applyOverTime(shrinkTime, (a,dt)=>{
                    var i=animals.length;
                    var shrink = dt*5/shrinkTime;
                    var destroy = [];
                    while(i--){
                        if((animals[i].size -= shrink) < 0.1)destroy.push(animals[i]);
                    }
                    if(destroy.length>0) Animal.destroyAll(destroy);
                    console.log('shrinking by',shrink,mc.size);
                    this.scale += shrink;
                },x=>this.levelingUp=false);
            },500)
        }
    }
}