var spawn={}
class Camera{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.onResize();
        /*window.addEventListener('resize',x=>this.onResize());*/
    }
    inView(obj, margin = 20){
        if(
            obj.x >= this.x - margin &&
            obj.x <= this.x + this.width + margin &&
            obj.y >= this.y - margin &&
            obj.y <= this.y + this.height + margin
        ) {
           return true;
        }
    
        return false;
    }
    onResize(){
        let c=document.querySelector('canvas');
        c.width = this.width = document.body.clientWidth;
        c.height = this.height = window.outerHeight;
        spawn.x=this.width*.48;
        spawn.y=this.height*.48;
    }
}