var camera = new Camera();
Number.prototype.degToRad = function() {
    return this * (Math.PI / 180);
  };
  
Number.prototype.radToDeg =  function() {
    return this / (Math.PI / 180);
  };
var minDistance = 30;
var maxSpeed = 0.06;
var turboEnergyCost = .01;
var ambientEnergyGain = .005;
class Animal extends Interactable{
    constructor(index = 0){
        Animal.count++;
        super(...arguments);
        
        if(!mc)mc=this;
        
        this.init(...arguments);
        this.speed = maxSpeed;
        this.alive = true;
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
            this.energy.onValue.push(()=>{
                var width = Math.round(this.energy.value)+'%';
                browserElements['#energy-text'].innerText = browserElements['#energy-bar'].style.width = width;
            });
            this.turbo = false;
        }
        else{
            this.size = (Random.range(0.01,1.8)*Math.max(mc.size,.6)).clamp(.1,1.5 + Math.pow(mc.size+1,0.5));
            if(camera.levelingUp) this.size *= 2;
            this.x += this.randomX_;
            this.y += this.randomY_;
            this.rotation = Random.range(0,360);
            this.speed = 0.05;
            this.brain = new Brain(this);
        }
    }
    onEnterFrame(dt){
        var speedMod = 1;
        var inView = camera.inView(this);
        if(mc === this){
            if(mouse.distance(this)>=minDistance){
                var targetRot = Math.atan2(this.y + camera.y - mouse.y, this.x + camera.x - mouse.x).radToDeg();
                this.rotation = lerpAngle(this.rotation,targetRot,0.2).mod(360);           
            }else speedMod = 0;
            
        } else this.brain.onEnterFrame(dt);
        
        if(this.turbo && this.canMove && (this.energy.value -= (dt * turboEnergyCost)) > 0.01){
            this.speed = maxSpeed * 2 * speedMod;
        }else{
            this.speed = maxSpeed * speedMod;
            this.energy.value += dt * ambientEnergyGain;
        }
        if(prob(speedMod * (this.turbo ? 2.5 : .5) * this.size) && inView)
            new Particle('smoke',this.x,this.y,this,); 
        Interactable.prototype.onEnterFrame.call(this,dt);
        if(inView && mc.alive){
            var color = "rgba(255,255,0,0.3)";
            if(!this.mc){
                if(mc.canEat(this))color = "rgba(0,255,0,0.3)";
                else if(this.canEat(mc)) color = "rgba(255,0,0,0.3)";
            }
            context.beginPath();
            context.strokeStyle=color;
            context.arc(this.x + camera.x, this.y + camera.y, this.height * .75, 0, Math.PI * 2);
            context.stroke();
            context.strokeStyle='rgba(0,0,0,0.8)';
            context.strokeText((this.size+camera.scale).toFixed(1),this.x+camera.x-5,this.y+camera.y);

        }
    }
    init(index){
        this.index = index || Math.floor(Math.random() * (Animal.sprites.length));
        this.createImage();
    }
    get canMove(){
        return !this.eating && !camera.levelingUp && !paused && !this.bumped;
    }
    static destroyAll(a){
        Interactable.destroyAll(a);
    }
    static sprites = [];
    onDestroy(){
        Animal.count--;
        if(this.brain)this.brain = null;
        Interactable.prototype.onDestroy.call(this);
        this.alive = false;
        if(mc===this){
            //console.log(this.mc);
            if(!paused){
                console.log(Animal.count);
                this.alive = true;
                setTimeout(()=>interactables.indexOf(mc)==-1?mc.alive=false:0,2000)
            }
            browserElements['body'].className = 'gray';
            browserElements['#game-over'].className='visible';
            browserElements['#hud'].className='hidden';
            browserElements['#score'].innerText = 'Score: '+Math.round(1.1 * (camera.scale+this.size));
            this.size = 1.5;
        }
    }
    canEat(animal){
        //this.size - 2.25 > animal.size ||
        return  this.size/animal.size > 2.25;
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
                    eatDurationMod = .65;
                    growthMod = .65;
                    break;
                case 'Animal':
                    eater = this.size >= collider.size ? this : collider;
                    food  = this.size >= collider.size ? collider : this;
                    growthMod = 1.35;
                    eatDurationMod = 1.8;
                    break;
            }
            if(food.constructor.name == 'Animal' && !eater.canEat(food)){
                eater.bounceAwayFrom(food);
                food.bounceAwayFrom(eater);
                continue;
            }
            if(eater == food)continue;
            eaten.push(food);
            var eatingDuration = 500 * eatDurationMod;
            var gains = Math.min(2,growthMod * (Math.random() *.3 +.3) * food.size) / eatingDuration * 1.8;
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
        new Particle('circle',this);
        var theta = this.rotationTowards(a).degToRad();
        var r =  a.size / this.size;
        var f = applyOverTime(300,(x,dt) =>{
            this.x += Math.cos(theta) * dt * (1-x) * .8;
            this.y += Math.sin(theta) * dt * (1-x) * .8;
            this.size *= .999 -(.005 * Math.pow(r,1.8) * (1-x));
            this.size = Math.max(this.size,.1);
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
    static maxCount = 50;
    static get animalRatio(){ return Animal.count/Animal.maxCount;}
    
}