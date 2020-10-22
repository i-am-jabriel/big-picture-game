class Cloud extends Interactable{
    constructor(x,y){
        super();
        this.x = x || this.randomX_;
        this.y = y || this.randomY_;
        this.rotation = Random.range(0, 360);
        this.speed = Random.range(0,0.4) * Math.pow(Math.random(),2);
        this.size = Random.range(1,5) * Math.pow(Random.range(0.5,2.5),1.5);
        setTimeout(()=>this.destroy(),Random.range(5000,10000));
        this.image = Cloud.sprites.pick();

        this.bounce = {
            rate: Random.range(0.3,0.9),
            count:0,
            range:new Range(Random.range(0.8,0.9),Random.range(1.05,1.1))
        };
    }
    static sprites = [];
    canMove = true;
    onEnterFrame(dt){
        Interactable.prototype.onEnterFrame.call(this,dt);
        if(prob(.1)){
            this.rotation = lerpAngle(this.rotation + Random.range(0,360) * Math.pow(Math.random(),4),this.rotationTowards(mc),0.3);
        }
        if(prob(.1)){
            this.speed *= Random.range(0.8,1.2);
        }
        if(prob(1)){
            this.bounce.rate *= Random.range(0.95,1.05);
            this.bounce.range.max *= Random.range(0.95,1.05);
            this.bounce.range.min *= Random.range(0.95,1.05);
        }
    }
}