var food = [];
class Food extends Interactable{
    constructor(index = null){
        super(...arguments);
        this.index = index || Random.intRange(0,Food.sprites.length-1);
        this.image = Food.sprites[this.index];
        this.x += this.randomX;
        this.y += this.randomY;
        this.size = Random.range(.6,1.4);
    }
    static sprites = [];
    static spawnFood(i=40){
        var l  = [];
        while(i-->0)l.push(new Food());
        tree.load(l);
    }
    get canMove(){
        return false;
    }
}