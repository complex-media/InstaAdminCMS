CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x-(w/2)+r, y-(h/2));
  this.arcTo(x+(w/2), y-(h/2),   x+(w/2), y+(h/2), r);
  this.arcTo(x+(w/2), y+(h/2), x-(w/2),   y+(h/2), r);
  this.arcTo(x-(w/2),   y+(h/2), x-(w/2),   y-(h/2),   r);
  this.arcTo(x-(w/2),   y-(h/2),   x+(w/2), y-(h/2),   r);
  this.closePath();
  return this;
}
export default class BuilderWrapper {
    constructor(ctx){
        this.selectedNode = null;
        this.lowerNode = null;
        this.startX = null;
        this.startY = null;
        this.currentX = null;
        this.currentX = null;
        this.flightTime = null;
        this.ctx = ctx;
        this._isValidFunction = null;
    }

    pickup(node,x,y){
        this.startX = x;
        this.startY = y;
        this.selectedNode = node;
        this.flightTime = 0;
    }

    enterTarget(node){
        this.lowerNode = node;
    }
    leaveTarget(node){
        this.lowerNode = null;
    }
    setIsValidFunction(fn){
        this._isValidFunction = fn;
    }
    isValid(selectedNode,lowerNode){
        if(this._isValidFunction) {
            return this._isValidFunction(selectedNode,lowerNode)
        } else {
            return true;
        }
        
    }
    drop(node,cb){
        if (this.isValid(this.selectedNode, this.lowerNode) && this.flightTime > 17) {
            cb(this.selectedNode,this.lowerNode);
            this.selectedNode = null;
            this.lowerNode = null;
            this.startX = null;
            this.startY = null;
            this.currentX = null;
            this.currentY = null;
        }
        this.flightTime = null;
    }
    update(x,y){
        this.currentX = x;
        this.currentY = y;
        this.flightTime++;
    }
    draw(offsetX,offsetY){
        if(this.selectedNode!=null) {
            this.ctx.strokeStyle = "#000000";
            this.ctx.fillStyle = "#FFFF00";
            this.ctx.beginPath();
            this.ctx.setLineDash([3,4]);
            this.ctx.moveTo(this.startX,this.startY);
            this.ctx.lineTo(this.currentX,this.currentY);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.setLineDash([1000]);
            this.ctx.fill();
            if(this.lowerNode ==null){
                this.ctx.beginPath();
                this.ctx.arc(this.currentX,this.currentY,15,0,2*Math.PI);
                this.ctx.stroke();
            } else if(this.lowerNode.data.isTop || this.isValid(this.selectedNode, this.lowerNode)){
                //draw green positive
                console.log('good');
                this.ctx.beginPath();
                this.ctx.arc(this.currentX,this.currentY,15,0,2*Math.PI);
                this.ctx.fillStyle = "rgba(102,255,102, 1)";
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#D3D3D3";
                this.ctx.lineWidth = 0;
                this.ctx.moveTo(this.startX-11,this.startY-3);
                this.ctx.rect(this.currentX-11,this.currentY-3,22,5);
                this.ctx.fillStyle = "rgba(255,255,255, 1)";
                this.ctx.fill();
                this.ctx.stroke()
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#D3D3D3";
                this.ctx.lineWidth = 0;
                this.ctx.moveTo(this.startX-3,this.startY-11);
                this.ctx.rect(this.currentX-3,this.currentY-11,5,22);
                this.ctx.fillStyle = "rgba(255,255,255, 1)";
                this.ctx.fill();
                this.ctx.stroke();

            } else {
                //draw Red invalid
                console.log('bad');
                this.ctx.beginPath();
                this.ctx.arc(this.currentX,this.currentY,15,0,2*Math.PI);
                this.ctx.fillStyle = "rgba(255,102,102, 1)";
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#D3D3D3";
                this.ctx.lineWidth = 0;
                this.ctx.moveTo(this.startX-11,this.startY-3);
                this.ctx.rect(this.currentX-11,this.currentY-3,22,5);
                this.ctx.fillStyle = "rgba(255,255,255, 1)";
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }
}