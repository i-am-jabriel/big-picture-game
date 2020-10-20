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
        var readyToLevelUp = Math.max(...interactables.map(x=>x.size))>=10;
        if(readyToLevelUp && !this.levelingUp){
            this.levelingUp = true;
            setTimeout(()=>{
                var shrinkTime = 2000;
                applyOverTime(shrinkTime, (a,dt)=>{
                    var i=interactables.length;
                    var shrink = dt * 2 / shrinkTime;
                    var destroy = [];
                    while(i--){
                        if((interactables[i].size -= Math.max(shrink,interactables[i].size*.01)) < 0.1)destroy.push(interactables[i]);
                    }
                    if(destroy.length>0) Interactable.destroyAll(destroy);
                    this.scale += shrink;
                },x=>this.levelingUp=false);
            },500)
        }
    }
}