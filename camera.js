var spawn={
    get x(){return this._x + camera.x;},
    get y(){return this._y + camera.y;},
    _x:0,
    _y:0
};

var cameraPadding = 0.98;
class Camera{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.levelingUp = false;
        this.scale = 1;
        this.onResize();
        window.addEventListener('resize',x=>this.onResize());
    }
    onEnterFrame(){
        this.tryToLevelUp();
        camera.x = -lerp(camera.x, mc.x - camera.width * .5, cameraPadding);
        camera.y = -lerp(camera.y, mc.y - camera.height * .5, cameraPadding);
    }
    inView(obj, margin = -40){
        if(
            obj.x >= -this.x - margin &&
            obj.x <= -this.x + this.width + margin &&
            obj.y >= -this.y - margin &&
            obj.y <= -this.y + this.height + margin
        ) {
           return true;
        }
    
        return false;
    }
    onResize(){
        let c=document.querySelector('canvas');
        c.width = this.width = document.body.clientWidth;
        c.height = this.height = window.outerHeight;
        spawn._x=this.width*.5;
        spawn._y=this.height*.5;
    }
    tryToLevelUp(){
        var readyToLevelUp = Math.max(...interactables.map(x=>x.constructor.name=='Animal'?x.size:0))>=14;
        if(readyToLevelUp && !this.levelingUp){
            var i=interactables.length;
            while(i--)new Particle('spark',interactables[i]);
            this.levelingUp = true;
            browserElements['canvas'].className='level-up';
            setTimeout(()=>browserElements['canvas'].className='',1000);
            setTimeout(()=>{
                var shrinkTime = 2000;
                this.levelingUp = applyOverTime(shrinkTime, (a,dt)=>{
                    var i=interactables.length;
                    var shrink = dt * 2.2 / shrinkTime;
                    var destroy = [];
                    while(i--){
                        if((interactables[i].size -= Math.max(shrink,interactables[i].size*.012)) < 0.1)destroy.push(interactables[i]);
                    }
                    if(destroy.length>0) Interactable.destroyAll(destroy);
                    this.scale += shrink * 4;
                },x=>this.levelingUp=null);
            },500)
        }
    }
}