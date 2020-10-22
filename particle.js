var particleBank = {};

class Particle extends Interactable{
    constructor(type,x,y,parent,size){
        super();
        this.type = type;
        if(x && !y){
            parent = x;
            x = 0;
        }
        this.parent = parent;
        if(parent){
            this.x = parent.x;
            this.y = parent.y;
        }
        var first = false;
        this.x = x || this.x;
        this.y = y || this.y;
        this.size = size || 1;
        this.destroyOnComplete = true;
        this.frameCount = new Range(0,this.pb.max-1);
        this.frameRate = new Range(0,300);
        this.loops=0;
        this.frameRate.onValue.push(()=>{
            if(this.frameRate.vMax == 1){
                this.frameRate.reset();
                if(this.frameCount.value++==this.frameCount.max){
                    if(this.destroyOnComplete && this.loops--<1) this.destroy();
                    else this.frameCount.value = 0;
                }
            }
        });
        switch(this.type){
            case 'smoke':
                this.loops=2;
                this.size = .3+Math.pow(this.parent.size,.75);
                break;
            case 'circle':
                this.loops=1;
                this.frameRate.max=250;
                this.size=this.parent.size*.5;
                first = true;
                break;
            case 'spark':
                this.destroyOnComplete = false;
                first = true;
                break;
        }
        if(first){
            interactables.splice(interactables.indexOf(this),1);
            interactables.unshift(this);
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
        if(!this.image)console.warn('no image:',this.type,this.frameCount.value,this.pb.images.length)
        Interactable.prototype.onEnterFrame.call(this,dt);
        if(!this.onScreen)this.destroy();
        switch(this.type){
            case 'smoke':
                this.size *= .995 - .02 * this.frameCount.ratio -0.02 * this.frameRate.ratio;
                break;
            case 'circle':
                this.x=this.parent.x;
                this.y=this.parent.y;
                this.size *= 1.035;
                break;
            case 'spark':
                this.size=this.parent.size;
                if(!camera.levelingUp || !this.parent.alive)this.destroy();
                break;
        }

    }
    get pb(){ return particleBank[this.type];}
}