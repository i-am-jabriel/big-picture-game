var camera = new Camera();
Number.prototype.degToRad = function() {
    return this * (Math.PI / 180);
  };
  
Number.prototype.radToDeg =  function() {
    return this / (Math.PI / 180);
  };
var pps =  40; //pixelpersize
var minDistance = 15;
var maxSpeed = 0.1;
class Animal extends Interactable{
    constructor(index = null){
        Animal.count++;
        super(...arguments);
        
        if(!mc)mc=this;
        
        this.init(...arguments);
        this.speed = 0.01;
        this.bounce = {
            rate: 1.7,
            count:0,
            min:.85,
            max:1.15
        }
        this.bounce.originalRate = this.bounce.rate;
        if(mc == this){
            this.size = 1;
            this.speed = 0.1;
        }
        else{
            this.size = mc.size * (Math.random()*.4+.4);
            if(camera.levelingUp) this.size *= 2;
            this.x += this.randomX;
            this.y += this.randomY;
            this.rotation = Random.range(0,360);
            this.speed = 0.01;
        }
    }
    onEnterFrame(dt){
        Interactable.prototype.onEnterFrame.call(this,dt);
        if(mc ===  this){
            if(mouse.distance(this)>=minDistance){
                this.speed = maxSpeed;
                var targetRot = Math.atan2(this.y - mouse.y, this.x - mouse.x).radToDeg();
                this.rotation = lerpAngle(this.rotation,targetRot,0.2).mod(360);            
            }else this.speed = 0;
        }
    }
    init(index){
        this.index = index || Math.floor(Math.random() * (Animal.sprites.length));
        this.createImage();
    }
    get canMove(){
        return !this.eating && !camera.levelingUp && !paused;
    }
    static destroyAll(a){
        Animal.count -= a.length;
        Interactable.destroyAll(a);
    }
    static sprites = [];
    onDestroy(){
        Animal.count--;
        Interactable.prototype.onDestroy.call(this);
    }
    
    
        /*if(camera.inView(this))this.render(dt);
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
        }*/
    // }
    // render(dt){
        // context.filter = this.getFilter();
        //context.save();
        //context.translate(camera.width*.5,camera.height*.5);
        //context.rotate(this.rotation.degToRad());
        //context.fillStyle = hslToHex(this.hue,this.grayscale,this.brightness);
        //this.bounce.count = ((this.bounce.count + (dt / (1000 * this.bounce.rate)))) % (Math.PI);
        // context.drawImage(this.image,this.x,this.y,this.size*pps,this.size*pps*lerp(this.bounce.min,this.bounce.max,Math.sin(this.bounce.count)));
        //context.restore();
    // }
    /*checkCollision(shape){
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
        var eatingDuration = 500;
        var gains = (Math.random() *.5 +.5) / eatingDuration;
        eater.colliders.push(eaten);
        eater.bounce.rate = eater.bounce.originalRate * .25;
        var f = applyOverTime(eatingDuration, (a,dt)=>eater.size += dt * gains,()=>{
            if(eater.eating == f){
                eater.eating = null;
                eater.bounce.rate = eater.bounce.originalRate;
            }
        });
        eater.eating = f;
        return true;
    }*/
    handleCollisions(colliders){
        var i  = colliders.length;
        var eaten = [];
        if(mc)
        while(i--){
            var collider = colliders[i];
            var eater, food, growthMod = 1, eatDurationMod = 1;
            switch(collider.constructor.name){
                case 'Food':
                    food = collider;
                    eater = this;
                    eatDurationMod = .8;
                    growthMod = .6;
                    break;
                case 'Animal':
                    eater = this.size >= collider.size ? this : collider;
                    food  = this.size >= collider.size ? collider : this;
                    growthMod = .5;
                    eatDurationMod = 2.5;
                    break;
            }
            if(food.mc || eater == food)continue;
            console.log(eater,food);
            var eatingDuration = 500 * eatDurationMod;
            var gains = growthMod * (Math.random() *.3 +.3) * food.size / eatingDuration;
            eater.bounce.rate = eater.bounce.originalRate * .25;
            var f = applyOverTime(eatingDuration, (a,dt)=>eater.size += dt * gains,()=>{
                if(eater.eating == f){
                    eater.eating = null;
                    eater.bounce.rate = eater.bounce.originalRate;
                }
            });
            eater.eating = f;
            eaten.push(food);
        }
        Interactable.destroyAll(eaten);
    }
    createImage(){
        //this.image = new document.createElement();
        this.image = Animal.sprites[this.index];
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
    static spawnAnimals(I=40){
        var l = [];
        for(var i=0;i<I;i++)l.push(new Animal());
        tree.load(l);
    }
    static count = 0;
    static maxCount = 30;
    static get animalRatio(){ return Animal.count/Animal.maxCount;}
    
}