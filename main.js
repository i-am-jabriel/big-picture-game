var browserElements = {};
var sprites = [];
var spriteSize = 51;
var mc = new Shape(1,360,0.5,0);

loadElements('canvas','#shape-image','#shape-hue-slider','#shape-brightness-slider','#left-shape-button','#right-shape-button','#random-shape-button',
    '#shape-grayscale-slider','#shape-selector','#play-button'
);
loadImages();

function loadElements(){
    for(var i in arguments){
        var name = arguments[i];
        browserElements[name] = document.querySelector(name);
    }
}

function loadImages(){
    var l = [...Array(spriteSize).keys()];
    l.shift();
    for(var index in l){
        var i = l[index];
        var newImg = new Image;
        newImg.src = 'img/flat-foliage/sprite_00'+ (i < 10 ? '0'+i : i)+'.png';
        newImg.onload = x => --spriteSize <= 1 ? imagesLoaded() : true;
        sprites.push(newImg);
    }
}


function imagesLoaded(){
    spriteSize = sprites.length;
    browserElements['#shape-image'].src = sprites[0].src;

    browserElements['#shape-hue-slider'].addEventListener('input',function(){
        mc.hue=this.value;
        updateShapeImageStyle();
    });
    browserElements['#shape-brightness-slider'].addEventListener('input',function(){
        mc.brightness=this.value/100;
        updateShapeImageStyle();
    });
    browserElements['#shape-grayscale-slider'].addEventListener('input',function(){
        mc.grayscale=this.value/100;
        updateShapeImageStyle();
    });
    browserElements['#left-shape-button'].addEventListener('click',x=>updateShapeImageIndex(-1));
    browserElements['#right-shape-button'].addEventListener('click',x=>updateShapeImageIndex(1));
    browserElements['#random-shape-button'].addEventListener('click',()=>{
        mc = new Shape(1 + Math.round(Math.random() * sprites.length - 1));
        updateShapeImageIndex();
        updateShapeImageStyle();
        browserElements['#shape-hue-slider'].value = mc.hue;
        browserElements['#shape-brightness-slider'].value = mc.brightness*100;
        browserElements['#shape-grayscale-slider'].value = mc.grayscale*100;
    });
    browserElements['#play-button'].addEventListener('click',()=>{
        browserElements['#shape-selector'].style.display='none';
        startGame();
    });

}
function updateShapeImageIndex(i=0){
    mc.index=(mc.index+i).mod(spriteSize);
    browserElements['#shape-image'].src=sprites[mc.index].src;
}
function updateShapeImageStyle(){
    browserElements['#shape-image'].style.filter=`brightness(${mc.brightness}) sepia(1) saturate(10000%) hue-rotate(${mc.hue}deg) grayscale(${mc.grayscale})`;
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

var lastUpdate;
var gameLoop;
function startGame(){
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
    console.log(dt);
}