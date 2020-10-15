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
class Shape{
    constructor(){
        if(!camera)camera = new Camera();
        if(!mc)mc=this;
        this.init(...arguments);
        Shape.shapes.push(this);
    }
    init(index = null, hue = null,brightness = null, grayscale = null){
        this.index = index || Math.floor(Math.random() * (spriteSize));
        this.hue = hue || Math.round(Math.random()*360);
        this.brightness = brightness || Math.round(Math.random()*100)/100;
        this.grayscale = grayscale || Math.round(Math.random()*100)/100;
        this.size = .5 + Math.round(Math.random()*10)/10;
        this.rotation = Math.round(Math.random()*360);
        this.speed = 0.01;
        this.x = 0;
        this.y = 0;
        this.x = spawn.x + camera.x;
        this.y = spawn.y + camera.y;
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
            this.x += Shape.randomX;
            this.y += Shape.randomY;
        }
        this.createImage();
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
            this.rotation = lerpAngle(this.rotation,targetRot,0.2);   
        }
    }
    render(dt){
        // context.filter = this.getFilter();
        //context.save();
        //context.translate(camera.width*.5,camera.height*.5);
        //context.rotate(this.rotation.degToRad());
        //context.fillStyle = hslToHex(this.hue,this.grayscale,this.brightness);
        this.bounce.count = ((this.bounce.count + (dt / (1000 * this.bounce.rate)))) % (Math.PI);
        console.log(this.bounce.count);
        context.drawImage(this.image,this.x,this.y,this.size*pps,this.size*pps*lerp(this.bounce.min,this.bounce.max,Math.sin(this.bounce.count)));
        //context.restore();
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
        shapes.splice(shapes.indexOf(this),1);
    }
    static createShapes(I=40){
        for(var i=0;i<I;i++)new Shape();
    }
    static shapes = []; 
    static get randomX(){
        return Math.random() * camera.width * .8 - camera.width * .4;
    }
    static get randomY(){
        return Math.random() * camera.height * .8 - camera.height * .4;
    }
}