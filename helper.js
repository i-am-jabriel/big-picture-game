

/*
 
    Helper Functions

*/
Number.prototype.clamp = function(a, b){
    let big = b, small = a;
    if(a > b){
        big = a;
        small = b;
    }
    return Math.min(big,Math.max(this,small));
}
Number.prototype.between = function(a,b){
    return this > a && this < b;
}
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
        if(paused){
            time = now;
            return;
        }
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

class Range{
    constructor(min=0,max=1,value){
        this.min = min;
        this.max = max;
        this.onValue = [];
        this._value = value || min;
    }
    range(){
        return Random.range(this.min,this.max);
    }
    
    reset(){
        this._value = this.min;
    }
    clone(){
        return Object.assign({},this);
    }
    get vMax(){
        return this._value /this.max;
    }
    get ratio(){
        return this.min/this.max;
    }
    get value(){
        return this._value;
    }
    set value(value){
        this._value = value.clamp(this.min,this.max);
        var i = this.onValue.length;
        while(i--) this.onValue[i]();
    }
}