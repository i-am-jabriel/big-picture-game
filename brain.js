class Brain{
    constructor(parent){
        this.parent = parent;
        this.targetRot = Random.range(0,360);
        this.mode = null;
        this.duration = 0;
        this.turboRange = Random.range(160,240);
        this.fleeRange = Random.range(400, 700);
        this.chaseRange = Random.range(400,600) * 1.1;

        this.fearfulFactor = Random.range(1000,5000) * 100;
        this.aggroFactor = Random.range(1000,5000) * 100;
        this.turboRange = Random.range(300,600);

    }

    onEnterFrame(dt){
        this.parent.turbo = prob(5 + 50 * Math.pow(this.parent.energy.ratio,3));
        if(prob(20))this.evaluateSurrondings();
        switch(this.mode){
            case 'flee':
                if(this.parent.distance(this.trg) > this.fleeRange + this.trg.height || prob(this.duration+=(dt/this.fearfulFactor))){
                    this.clearTarget();
                    break;
                }
                this.parent.turbo = tree.search(this.AABB(this.turboRange + this.size)).length > 1;
                this.targetRot = this.parent.rotationTowards(this.trg) + 180;
            case 'chase':
                if(this.trg.size >= this.parent.size || this.trg.id === null || prob(this.duration+=(dt/this.aggroFactor)))this.clearTarget();
                else {
                    this.targetRot = this.parent.rotationTowards(this.trg);
                    this.parent.turbo = this.parent.distance(this.trg) < 150 + this.size;
                }
                break;
        }
        this.parent.rotation = lerpAngle(this.parent.rotation, this.targetRot, .1).mod(360);
    }
    clearTarget(){
        this.mode = null;
        this.duration = 0;
        this.trg = null;
        this.turbo = false;
        if(prob(1))this.targetRot = Random.range(0,360);
    }
    evaluateSurrondings(){
        var l = tree.search(this.AABB(this.chaseRange)).filter(x=>x!=this.parent);
        if(!l.length){
            if(prob(1))this.targetRot = this.parent.rotation * Random.range(0,90) * Math.pow(Math.random(),4);
            if(!this.parent.onScreen) this.targetRot = this.parent.rotationTowards(mc);
            return;
        }
        var target = this.targetEvaluation(l);
        var sizes = l.map(x=>{return {parent:x,size:x.size}});
        var biggest = sizes.reduce((a,c)=>a.size>=c.size?a:c);
        if(this.parent.size < biggest.size && biggest.parent.constructor.name != 'Food' && prob(95)){
            this.mode = 'flee';
            this.trg = biggest.parent;
            return;
        }
        if(!target || target == this.parent){
            this.clearTarget();
            return;
        }
        this.trg = target;
        this.mode = 'chase';
    }
    AABB(width, height){
        if(!height)height = width;
        width*=.5;
        height*=.5;
        return {
            minX: this.parent.x - width,
            maxX: this.parent.x + width,
            minY: this.parent.y - height,
            maxY: this.parent.y + height,
        };
    }
    //Returns the easiest target to eat
    targetEvaluation(arr){
        var l = arr.map(x=>{return {parent:x,value:this.evaluateObj(x)}});
        var easiest = l.reduce((a,c)=>a.value>=c.value?a:c);
        return easiest.value ? easiest.parent : null;
        if(easiest.value == 0)return null;
        return easiest.parent;
    }
    //Returns a number based on how easy it would be to eat target
    evaluateObj(obj){
        if((obj.size > this.parent.size && obj.constructor.name != 'Food') || obj == this.parent)return 0;
        return (this.chaseRange*1.1-this.parent.distance(obj)) * (obj.eating ? 2 : 1);
    }
    get size(){
        return this.parent.size*pps;
    }
}