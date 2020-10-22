var browserElements = {};
var mc = new Animal();

loadElements('canvas','#shape-image','#left-shape-button','#right-shape-button','#random-shape-button',
   '#shape-selector','#play-button','body','#energy-bar','#energy-text','#game-over','#score','#hud'
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
    var loaded = 0;
    var onLoad = x => !(--loaded) ? onGameLoaded() : 0;
    function createImageForObject(url){
        // if(typeof url == 'function')return;
        var img = new Image();
        img.src = url;
        img.onload = onLoad;
        loaded++;
        return img;
    }
    var animals = toArray(`bear.png     crocodile.png  giraffe.png  monkey.png   parrot.png   sloth.png
    buffalo.png  dog.png        goat.png     moose.png    penguin.png  snake.png
    chick.png    duck.png       gorilla.png  narwhal.png  pig.png      walrus.png
    chicken.png  elephant.png   hippo.png    owl.png      rabbit.png   whale.png
    cow.png      frog.png       horse.png    panda.png    rhino.png    zebra.png`).map(x=>createImageForObject('img/animals/'+x));
    
    var foods = toArray(`apple.png  broccoli.png  carrot.png  eggplant.png  leek.png      paprika.png
    beet.png   cabbage.png   corn.png    grapes.png    mushroom.png  radish.png`).map(x=>createImageForObject('img/food/'+x));

    var smoke = toArray(`smoke_01.png  smoke_03.png  smoke_05.png  smoke_07.png  smoke_09.png
    smoke_02.png  smoke_04.png  smoke_06.png  smoke_08.png`).map(x=>createImageForObject('img/particles/'+x));

    var clouds = toArray(`Cloud10.png  Cloud1b.png  Cloud3b.png  Cloud4white.png  Cloud8.png
    Cloud1a.png  Cloud2.png   Cloud4.png   Cloud5b.png      Cloud9.png`).map(x=>createImageForObject('img/background/cloud/'+x));

    Food.sprites = foods;
    Animal.sprites = animals;
    Cloud.sprites = clouds;
    Particle.registerParticle('smoke',smoke,8);
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
    window.addEventListener('click',()=>{
        if(!mc.alive){
            var {body, '#game-over':gameOver} = browserElements;
            var b = '', g = '';
            if(body.className === ''){
                b = 'gray';
                g = 'visible';
            }
            body.className = b;
            gameOver.className = g;
        }
        // tree.search(mouse.aabb).forEach(x=>x.onClick());
    });
    window.addEventListener('mousedown',()=>mc.turbo=true);
    window.addEventListener('mouseup',()=>mc.turbo=false);
    window.addEventListener('keyup',e=>{
        let key =e.keyCode || e.charCode;
        if(key==13)restartGame();
        if(key==32)paused =! paused;
    });
    window.addEventListener('mousemove',e=>{
        mouse.x=e.clientX-mc.size*.5;
        mouse.y=e.clientY-mc.size*.5
    });

}
function updateShapeImageIndex(i=0){
    mc.index=(mc.index+i).mod(Animal.sprites.length);
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
    paused=true;
    Interactable.clear();
    camera.scale = 0;
    Animal.animalCount = 0;
    Animal.spawnAnimals(10);
    Food.spawnFood(30);
    mc.insertIntoTree();
    interactables.push(mc);
    mc.size = 1;
    mc.x = spawn.x;
    mc.y = spawn.y;
    mc.eating = null;
    mc.bumped = null;
    mc.alive = true;
    mc.energy.value = 100;
    browserElements['body'].className = '';
    browserElements['#game-over'].className = '';
    browserElements['#hud'].className = '';
    paused = false;
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
    camera.onEnterFrame(dt);
    if(Animal.count < Animal.maxCount && prob(.05 + .20 * Math.pow(1 - Animal.animalRatio,3)))new Animal().insertIntoTree();
    if(prob(3))new Food().insertIntoTree();
    if(prob(3))new Cloud();
}
var mouse = {
    x:0,
    y:0,
    distance:function(p){
        return Math.sqrt(Math.pow(this.x-p.x,2)+Math.pow(this.y-p.y,2));
    },
    get aabb(){
        return {
            mixX:this.x + camera.x,
            maxX:this.x + 50 + camera.x,
            minY:this.y + camera.y,
            maxY:this.y + 50 + camera.y,
        };
    }
}
var paused=false;