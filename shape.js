class Shape{
    constructor(index = null, hue = null,brightness = null, grayscale = null){
        this.index = index || 1;
        this.hue = hue || Math.round(Math.random()*360);
        this.brightness = brightness || Math.round(Math.random()*10)/10;
        this.grayscale = grayscale || Math.round(Math.random()*10)/10;
        this.size = 1;
        Shape.shapes.push(this);
    }
    destroy(){
        shapes.splice(shapes.indexOf(this),1);
    }
    onEnterFrame(dt){
        
    }
    static shapes = []; 
}