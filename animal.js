var camera;
Number.prototype.degToRad = function() {
    return this * (Math.PI / 180);
  };
  
Number.prototype.radToDeg =  function() {
    return this / (Math.PI / 180);
  };
var pps =  40; //pixelpersize
var minDistance = 15;
var maxSpeed = 0.1;
var animals = [];
class Animal{
    constructor(){
        if(!camera)camera = new Camera();
        if(!mc)mc=this;
        this.init(...arguments);
        this.id = animals.push(this) - 1;
    }
    init(index = null, hue = null,brightness = null, grayscale = null){
        this.index = index || Math.floor(Math.random() * (sprites.length));
        this.hue = hue || Math.round(Math.random()*360);
        this.brightness = brightness || Math.round(Math.random()*100)/100;
        this.grayscale = grayscale || Math.round(Math.random()*100)/100;
        this.size = .5 + Math.round(Math.random()*10)/20;
        this.rotation = Math.round(Math.random()*360);
        this.speed = 0.01;
        this.x = 0;
        this.y = 0;
        this.colliders = [];
        this.x = spawn.x + camera.x;
        this.y = spawn.y + camera.y;
        this.createImage();
        this.bounce = {
            rate: 1.7,
            count:0,
            min:.85,
            max:1.15
        }
        if(mc === this){
            this.size = 1;
            this.speed = 0.1;
            this.rotation = 0;
        }
        else{
            this.x += Animal.randomX;
            this.y += Animal.randomY;
        }
    }
    onEnterFrame(dt){
        if(mc ===  this){
            if(mouse.distance(this)>=minDistance){
                this.speed = maxSpeed;
                var targetRot = Math.atan2(this.y - mouse.y, this.x - mouse.x).radToDeg();
                this.rotation = lerpAngle(this.rotation,targetRot,0.2);            
            }else this.speed = 0;
        }
        this.x += -Math.cos(this.rotation.degToRad()) * this.speed * dt;
        this.y += -Math.sin(this.rotation.degToRad()) * this.speed * dt;
        if(camera.inView(this))this.render(dt);
        else if(mc != this){
            this.rotation += Math.random() * 10;
            var targetRot = Math.atan2(this.y-spawn.y + camera.y, this.x-spawn.x + camera.x).radToDeg();
            this.rotation = lerpAngle(this.rotation,targetRot,0.8);   
        }
        for(var i=this.id+1;i<animals.length;i++){
            this.checkCollision(animals[i]);
        }
        while(this.colliders.length){
            this.colliders.pop().destroy();
        }
    }
    render(dt){
        // context.filter = this.getFilter();
        //context.save();
        //context.translate(camera.width*.5,camera.height*.5);
        //context.rotate(this.rotation.degToRad());
        //context.fillStyle = hslToHex(this.hue,this.grayscale,this.brightness);
        this.bounce.count = ((this.bounce.count + (dt / (1000 * this.bounce.rate)))) % (Math.PI);
        context.drawImage(this.image,this.x,this.y,this.size*pps,this.size*pps*lerp(this.bounce.min,this.bounce.max,Math.sin(this.bounce.count)));
        //context.restore();
    }
    checkCollision(shape){
        if(shape==this)return false;
        var a,b,c,d;
        if(
            (a = (this.x > shape.right)) || 
            (b = (this.right < shape.x)) || 
            (c = (this. y > shape.bottom)) || 
            (d = (this.bottom < shape.y) )){
                //console.log(a,b,c,d);
                return false;
        }
        var eater = this.size > shape.size ? this : shape;
        var eaten  = this.size > shape.size ? shape : this;
        if(eaten==mc)return false;
        eater.colliders.push(eaten);
        eater.size += Math.random() *.5 +.5;
        return true;
    }
    createImage(){
        //this.image = new document.createElement();
        this.image = sprites[this.index];
        // this.image.ctx.fillStyle = hslToHex(this.hue,this.grayscale,this.brightness);
        //  
        // this.image.ctx.fillRect(0,0,image.width,image.height);
        // this.image.ctx.globalCompositeOperation = "source-over";
    }
    getFilter(){
        return `brightness(${this.brightness}) sepia(1) saturate(10000%) hue-rotate(${this.hue}deg) grayscale(${this.grayscale})`;
    }
    getTransform(){
        return `rotate(${this.rotation}deg)`;
    }
    setPos(x,y){this.x=x;this.y=y;}
    destroy(){
        animals.splice(this.id,1);
        let i = animals.length;
        while(i--)animals[i].id = i;
    }
    static spawnAnimals(I=40){
        for(var i=0;i<I;i++)new Animal();
    }
    static get randomX(){
        return Math.random() * camera.width * .9 - camera.width * .45;
    }
    static get randomY(){
        return Math.random() * camera.height * .9 - camera.height * .45;
    }
    get left(){
        return this.x;
    }
    get top(){
        return this.y;
    }
    get bottom(){
        return this.y+this.size*pps;
    }
    get right(){
        return this.x+this.size*pps;
    }
}