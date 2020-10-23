class Cloud extends Interactable{
    constructor(x,y){
        super();
        this.x = x || this.randomX_;
        this.y = y || this.randomY_;
        this.rotation = Random.range(0, 360);
        this.speed = Random.range(0,0.4) * Math.pow(Math.random(),3);
        this.size = Random.range(1,5) * Math.pow(Random.range(0.5,2.5),1.5);
        /*setTimeout(()=>this.destroy(),Random.range(15000,30000));*/
        this.image = Cloud.sprites.pick();

        this.bounce = {
            rate: Random.range(0.9,2.4),
            count:0,
            range:new Range(Random.range(0.8,0.9),Random.range(1.05,1.1))
        };
    }
    static shrinkRate = .9995;
    static sprites = [];
    canMove = true;
    onEnterFrame(dt){
        Interactable.prototype.onEnterFrame.call(this,dt);
        if(prob(1)){
            this.bounce.rate *= Random.range(0.98,1.05);
            this.bounce.range.max *= Random.range(0.95,1.01);
            this.bounce.range.min *= Random.range(0.95,1.01);
            this.size *= Random.range(0.98,1.02);
            this.speed *= Random.range(0.98,1.02);
            this.rotation = lerpAngle(this.rotation + Random.range(0,90) * Math.pow(Math.random(),4),this.rotationTowards(mc),0.05);
        }
        if((this.size *= Cloud.shrinkRate)<.1)this.destroy();

    }
}