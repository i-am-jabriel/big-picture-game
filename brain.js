class Brain{
    constructor(parent){
        this.parent = parent;
        this.targetRot = Random.range(0,360);
        this.mode = null;
        this.duration = 0;
    }

    onEnterFrame(dt){
        switch(this.mode){
            case 'flee':
                if(this.parent.distance(this.trg) > 500){
                    this.clearTarget();
                    break;
                }
                this.targetRot = this.parent.rotationTowards(this.trg) + 180;
            case 'chase':
                if(this.trg.size >= this.parent.size || this.trg.id === null || prob(this.duration+=dt/100))this.clearTarget();
                else this.targetRot = this.parent.rotationTowards(this.trg);
                break;
            default:
                if(prob(20))this.evaluateSurrondings();
                //if(this.mode)console.log(this.mode+'ing',this.trg);
                break;
        }
        this.parent.rotation = lerpAngle(this.parent.rotation, this.targetRot, 0.1).mod(360);
    }
    clearTarget(){
        this.mode = null;
        this.trg = null;
    }
    evaluateSurrondings(){
        var l = tree.search(this.AABB(350)).filter(x=>x!=this.parent);
        if(!l.length){
            if(prob(1))this.targetRot = Random.range(0,360);
            if(!camera.inView(this.parent)) this.targetRot = this.parent.rotationTowards(spawn);
            return;
        }
        var target = this.targetEvaluation(l);
        var sizes = l.map(x=>{return {parent:x,size:x.size}});
        var biggest = sizes.reduce((a,c)=>a.size>=c.size?a:c);
        if(this.parent.size < biggest.size && biggest.parent.constructor.name != 'Food'){
            this.mode = 'flee';
            this.trg = biggest.parent;
            return;
        }
        if(!target || target == this.parent){
            this.clearTarget();
            return;
        }
        this.trg = target;
        this.duration = 0;
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
        if(easiest.value == 0)return null;
        return easiest.parent;
    }
    //Returns a number based on how easy it would be to eat target
    evaluateObj(obj){
        if((obj.size > this.parent.size && obj.constructor.name != 'Food') || obj == this.parent)return 0;
        return (400-this.parent.distance(obj)) * (obj.eating ? 2 : 1);
    }   
}