var food = [];
class Food extends Interactable{
    static sprites = [];
    static foodShrinkRate = .9997;
    constructor(index = null){
        super(...arguments);
        this.index = index || Random.intRange(0,Food.sprites.length-1);
        this.image = Food.sprites[this.index];
        this.x += this.randomX_;
        this.y += this.randomY_;
        this.size = Random.range(.65,1.8);
    }
    static spawnFood(i=40){
        var l  = [];
        while(i-->0)l.push(new Food());
        tree.load(l);
    }
    get canMove(){
        return false;
    }
    onEnterFrame(dt){
        Interactable.prototype.onEnterFrame.call(this,dt);
        if((this.size *= Food.foodShrinkRate)<.1)this.destroy();
    }
}