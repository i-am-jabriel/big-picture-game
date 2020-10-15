var browserElements = {};
var sprites = [];
var spriteSize = 51;
var mc = new Shape(0,360,0.5,0);

loadElements('canvas','#shape-image','#left-shape-button','#right-shape-button','#random-shape-button',
   '#shape-selector','#play-button','body'
);
var context = browserElements['canvas'].getContext('2d');
context.imageSmoothingEnabled = false;
loadImages();

function loadElements(){
    for(var i in arguments){
        var name = arguments[i];
        browserElements[name] = document.querySelector(name);
    }
}

function loadImages(){
    //var l = [...Array(spriteSize).keys()];
    //l.shift();
    var l = `bear.png     crocodile.png  giraffe.png  monkey.png   parrot.png   sloth.png
    buffalo.png  dog.png        goat.png     moose.png    penguin.png  snake.png
    chick.png    duck.png       gorilla.png  narwhal.png  pig.png      walrus.png
    chicken.png  elephant.png   hippo.png    owl.png      rabbit.png   whale.png
    cow.png      frog.png       horse.png    panda.png    rhino.png    zebra.png`.replace(/\s\s+/g, ' ').split(' ');
    var loaded=0;
    for(var index in l){
        var i = l[index];
        var newImg = new Image;
        //newImg.src = 'img/flat-foliage/sprite_00'+ (i < 10 ? '0'+i : i)+'.png';
        newImg.src = `img/animals/${i}`;
        newImg.onload = x => loaded == l.length-1 ? imagesLoaded() : loaded++;
        sprites.push(newImg);
    }
}


function imagesLoaded(){
    spriteSize = sprites.length;
    browserElements['#shape-image'].src = sprites[0].src;
    browserElements['#left-shape-button'].addEventListener('click',x=>updateShapeImageIndex(-1));
    browserElements['#right-shape-button'].addEventListener('click',x=>updateShapeImageIndex(1));
    browserElements['#random-shape-button'].addEventListener('click',()=>{
        mc.init();
        updateShapeImageIndex();
        updateShapeImageStyle();
    });
    browserElements['#play-button'].addEventListener('click',()=>{
        browserElements['#shape-selector'].style.display='none';
        startGame();
    });
    browserElements['canvas'].addEventListener('click',()=>paused=!paused);
}
function updateShapeImageIndex(i=0){
    console.log('changing index by',i);
    mc.index=(mc.index+i).mod(spriteSize);
    console.log(mc.index);
    browserElements['#shape-image'].src=sprites[mc.index].src;
    mc.createImage();
}
function updateShapeImageStyle(){
    //browserElements['#shape-image'].style.filter=mc.getFilter();
    mc.createImage();
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

var lastUpdate;
var gameLoop;
function startGame(){
    Shape.createShapes(50);
    lastUpdate = Date.now();
    gameLoop = setInterval(tick, 0);
}
function tick() {
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;

    onEnterFrame(dt);
}
function onEnterFrame(dt){
    if(paused)return
    context.clearRect(0, 0, browserElements['canvas'].width, browserElements['canvas'].height);
    // Shape.shapes.forEach(shape=>shape.onEnterFrame(dt));
    let i=Shape.shapes.length;
    while(i--)Shape.shapes[i].onEnterFrame(dt * 4);
}

function lerp(a, b, t) {
    return a*(1-t)+b*t;
}
function lerpAngle(a,b,t){
    let shortest_angle = ((b-a) + 180).mod(360) - 180;
    return a + (shortest_angle * t) % 360;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }  
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function hslToHex(h,s,l){return rgbToHex(...hslToRgb(h,s,l))}
var mouse = {
    x:0,
    y:0,
    distance:function(p){
        return Math.sqrt(Math.pow(this.x-p.x,2)+Math.pow(this.y-p.y,2));
    }
}
var paused=false;
browserElements['canvas'].addEventListener('mousemove',e=>{mouse.x=e.clientX-20;mouse.y=e.clientY-20});