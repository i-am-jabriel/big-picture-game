var camera = new Camera();
Number.prototype.degToRad = function() {
    return this * (Math.PI / 180);
  };
  
Number.prototype.radToDeg =  function() {
    return this / (Math.PI / 180);
  };
var pps =  40; //pixelpersize
var minDistance = 15;
var maxSpeed = 0.05;
var bounceSize = 2;
var turboEnergyCost = .01;
var ambientEnergyGain = .001;
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
            // min:.85,
            // max:1.15
            range:new Range(.85,1.15)
        };
        this.bounce.originalRate = this.bounce.rate;
        this.bounce.originalRange = this.bounce.range.clone();
        this.energy = new Range(0,100,100);
        if(mc == this){
            this.size = 1;
            this.speed = 0.05;
            this.energy.onValue.push(()=>{
                var width = Math.round(this.energy.value)+'%';
                browserElements['#energy-text'].innerText = browserElements['#energy-bar'].style.width = width;
            });
            this.turbo = false;
        }
        else{
            this.size = Math.min(mc.size * Random.range(.3,1.3),4);
            if(camera.levelingUp) this.size *= 2;
            this.x += this.randomX;
            this.y += this.randomY;
            this.rotation = Random.range(0,360);
            this.speed = 0.05;
            this.brain = new Brain(this);
        }
    }
    onEnterFrame(dt){
        if(mc ===  this){
            if(mouse.distance(this)>=minDistance){
                this.speed = maxSpeed;
                var targetRot = Math.atan2(this.y - mouse.y, this.x - mouse.x).radToDeg();
                this.rotation = lerpAngle(this.rotation,targetRot,0.2).mod(360);            
            }else this.speed = 0;
        } else this.brain.onEnterFrame(dt);
        
        if(this.turbo && this.canMove && (this.energy.value -= (dt * turboEnergyCost)) > 0.01){
            this.speed = maxSpeed * 2;
        }else{
            this.speed = maxSpeed;
            this.energy.value += dt * ambientEnergyGain;
        }
        Interactable.prototype.onEnterFrame.call(this,dt);
    }
    init(index){
        this.index = index || Math.floor(Math.random() * (Animal.sprites.length));
        this.createImage();
    }
    get canMove(){
        return !this.eating && !camera.levelingUp && !paused && !this.bumped;
    }
    static destroyAll(a){
        Animal.count -= a.length;
        Interactable.destroyAll(a);
    }
    static sprites = [];
    onDestroy(){
        Animal.count--;
        if(this.brain)this.brain = null;
        Interactable.prototype.onDestroy.call(this);
    }
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
    }*/
    handleCollisions(colliders){
        if(this.eating)return;
        var i  = colliders.length;
        var eaten = [];
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
                    growthMod = 1.3;
                    eatDurationMod = 1.8;
                    break;
            }
            if(eater.size - bounceSize < food.size && food.constructor.name == 'Animal'){
                eater.bounceAwayFrom(food);
                food.bounceAwayFrom(eater);
                continue;
            }
            if(food.mc || eater == food)continue;
            eaten.push(food);
            // console.log(eater,food);
            var eatingDuration = 500 * eatDurationMod;
            var gains = Math.min(2,growthMod * (Math.random() *.3 +.3) * food.size) / eatingDuration;
            eater.bounce.rate = eater.bounce.originalRate * .2;
            eater.bounce.range.max *= 1.1;
            var f = applyOverTime(eatingDuration, (a,dt)=>eater.size += dt * gains,()=>{
                if(eater.eating === f){
                    eater.eating = null;
                    eater.bounce.rate = eater.bounce.originalRate;
                    eater.bounce.range.max =  eater.bounce.originalRange.max;
                }
            });
            eater.eating = f;
        }
        Interactable.destroyAll(eaten);
    }
    bounceAwayFrom(a){
        if(this.bumped)return;
        var theta = this.rotationTowards(a).degToRad();
        var r =  a.size / this.size;
        var f = applyOverTime(300,(x,dt) =>{
            this.x += Math.cos(theta) * dt * (1-x) * .8;
            this.y += Math.sin(theta) * dt * (1-x) * .8;
            this.size *= .999 -(.01 * Math.pow(r,1.5) * (1-x));
            this.size = Math.max(this.  size,.1);
        },()=>{
            if(this.bumped == f)this.bumped = null;
        });
        this.bumped = f;
    }
    createImage(){
        this.image = Animal.sprites[this.index];
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