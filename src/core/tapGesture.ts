/** A release activates only the control where that same pointer began. */
export class TapGesture {
 private pointer:number|null=null;
 constructor(private readonly tolerance:number){}
 start(pointer:number){if(this.pointer===null)this.pointer=pointer;}
 cancel(){this.pointer=null;}
 release(pointer:number,distance:number){
  if(this.pointer!==pointer)return false;
  this.cancel();
  return Number.isFinite(distance)&&distance<=this.tolerance;
 }
}
