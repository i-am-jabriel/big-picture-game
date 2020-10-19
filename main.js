var browserElements = {};
var mc = new Animal();

loadElements('canvas','#shape-image','#left-shape-button','#right-shape-button','#random-shape-button',
   '#shape-selector','#play-button','body'
);
var context = browserElements['canvas'].getContext('2d');
context.imageSmoothingEnabled = false;

function loadElements(){
    for(var i in arguments){
        var name = arguments[i];
        browserElements[name] = document.querySelector(name);
    }
}

loadImages();

function loadImages(){
    //var l = [...Array(Animal.spritesize).keys()];

    //l.shift();
    var animals = toArray(`bear.png     crocodile.png  giraffe.png  monkey.png   parrot.png   sloth.png
    buffalo.png  dog.png        goat.png     moose.png    penguin.png  snake.png
    chick.png    duck.png       gorilla.png  narwhal.png  pig.png      walrus.png
    chicken.png  elephant.png   hippo.png    owl.png      rabbit.png   whale.png
    cow.png      frog.png       horse.png    panda.png    rhino.png    zebra.png`);
    
    var foods = toArray(`apple.png  broccoli.png  carrot.png  eggplant.png  leek.png      paprika.png
    beet.png   cabbage.png   corn.png    grapes.png    mushroom.png  radish.png`);

    var loaded = animals.length + foods.length;
    var onLoad = x => !(--loaded) ? onGameLoaded() : 0;
    function createImageForObject(url){
        var img = new Image();
        img.src = url;
        img.onload = onLoad;
        return img;
    }

    for(var i in animals){
        Animal.sprites.push(createImageForObject(`img/animals/${animals[i]}`));
    }

    for(var i in foods){
        Food.sprites.push(createImageForObject(`img/food/${foods[i]}`));
    }
}

function toArray(s){
    return s.replace(/\s\s+/g, ' ').split(' ');
}

function onGameLoaded(){
    browserElements['#shape-image'].src = Animal.sprites[0].src;
    browserElements['#left-shape-button'].addEventListener('click',x=>updateShapeImageIndex(-1));
    browserElements['#right-shape-button'].addEventListener('click',x=>updateShapeImageIndex(1));
    browserElements['#random-shape-button'].addEventListener('click',()=>{
        mc.init();
        updateShapeImageIndex();
        updateShapeImageStyle();
    });
    browserElements['#play-button'].addEventListener('click',()=>{
        browserElements['#shape-selector'].style.display='none';
        mc.createImage();
        startGame();
    });
    browserElements['canvas'].addEventListener('click',()=>paused=!paused);
}
function updateShapeImageIndex(i=0){
    console.log('changing index by',i);
    mc.index=(mc.index+i).mod(Animal.sprites.length);
    console.log(mc.index);
    browserElements['#shape-image'].src=Animal.sprites[mc.index].src;
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
    mc.insertIntoTree();
    Animal.spawnAnimals(3);
    Food.spawnFood(5);
    lastUpdate = Date.now();
    gameLoop = setInterval(tick, 10);
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
    let i=interactables.length;
    while(i--)interactables[i].onEnterFrame(dt * 4);
    camera.tryToLevelUp();
    if(Animal.count < Animal.maxCount && prob(.1 + .5 * (1 - Animal.animalRatio)))new Animal().insertIntoTree();
    if(prob(.8))new Food().insertIntoTree();
}
var mouse = {
    x:0,
    y:0,
    distance:function(p){
        return Math.sqrt(Math.pow(this.x-p.x,2)+Math.pow(this.y-p.y,2));
    }
}
var paused=false;
browserElements['canvas'].addEventListener('mousemove',e=>{mouse.x=e.clientX-mc.size*.5;mouse.y=e.clientY-mc.size*.5});


/*
 
    Helper Functions

*/
function prob(n){
    return Math.random() * 100 <= n;
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
function applyOverTime(t,a,b){
    var count = 0
    var time = Date.now();
    var f = setInterval(()=>{
        var now = Date.now();
        var dt = now - time;
        count += dt;
        time = now;
        var val = Math.min(1,count/t);
        a(val,dt);
        if(val === 1){
            if(b)b();
            clearInterval(f);
        }
    },10);
    return f;
}
class Random{
    static range(min, max){
        return Math.random() * (max - min) + min;
    }
    static intRange(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}