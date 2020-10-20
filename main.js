var browserElements = {};
var mc = new Animal();

loadElements('canvas','#shape-image','#left-shape-button','#right-shape-button','#random-shape-button',
   '#shape-selector','#play-button','body','#energy-bar','#energy-text'
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
    browserElements['canvas'].addEventListener('mousedown',()=>mc.turbo=true);
    browserElements['canvas'].addEventListener('mouseup',()=>mc.turbo=false);
    window.addEventListener('keyup',e=>{
        let key =e.keyCode || e.charCode;
        if(key==13)restartGame();
        if(key==32)paused =! paused;
    })

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
    restartGame();
    lastUpdate = Date.now();
    gameLoop = setInterval(tick, 10);
}
function restartGame(){
    Interactable.clear();
    camera.scale = 0;
    Animal.animalCount = 0;
    Animal.spawnAnimals(1);
    Food.spawnFood(5);
    mc.insertIntoTree();
    interactables.push(mc);
    mc.size = 1;
    mc.x = spawn.x;
    mc.y = spawn.y;
    mc.eating = null;
    mc.bumped = null;
    mc.energy.value = 100;
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
    if(prob(1.2))new Food().insertIntoTree();
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