var particleBank = {};

class Particle extends Interactable{
    constructor(type,x,y){
        super();
        this.type = type;
        this.x = x || 0;
        this.y = y || 0;
        this.dieOnComplete = true;
        this.frameCount = new Range(0,this.pb.max);
        this.frameRate = new Range(0,300);
        this.loops=0;
        this.frameRate.onValue.push(()=>{
            if(this.frameRate.vMax == 1){
                this.frameRate.reset();
                if(this.frameCount.value++==this.frameCount.max){
                    if(this.dieOnComplete && this.loops--<1) this.destroy();
                    else this.frameCount.value = 0;
                }
            }
        });
        switch(this.type){
            case 'smoke':
                this.loops=2;
                break;
        }
    }
    static registerParticle(type, images, max){
        particleBank[type]={
            images,
            max,
        };
    }
    onEnterFrame(dt){
        this.frameRate.value+=dt;
        this.image = this.pb.images[this.frameCount.value];
        Interactable.prototype.onEnterFrame.call(this,dt);
        switch(this.type){
            case 'smoke':
                this.size *= .995 - .02 * this.frameCount.ratio -0.02 * this.frameRate.ratio;
                break;
        }

    }
    get pb(){ return particleBank[this.type];}
}