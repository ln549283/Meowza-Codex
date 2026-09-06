export type Slot='background'|'cushion'|'wood';
export const cosmetics=[
 {id:'cream',slot:'background',name:'Matin vanille',color:0xf8eedf},
 {id:'mint',slot:'background',name:'Jardin de menthe',color:0xe1eee5},
 {id:'night',slot:'background',name:'Soir lavande',color:0xe4dff2},
 {id:'peach',slot:'cushion',name:'Coussin abricot',color:0xf0a079},
 {id:'rose',slot:'cushion',name:'Coussin framboise',color:0xe681a0},
 {id:'teal',slot:'cushion',name:'Coussin lagon',color:0x56b5b1},
 {id:'honey',slot:'wood',name:'Bois miel',color:0xd4a16b},
 {id:'walnut',slot:'wood',name:'Bois noisette',color:0xac7b61},
 {id:'birch',slot:'wood',name:'Bois bouleau',color:0xe2c79e},
] as const;
export const starterCosmetics=['cream','peach','honey'];
export function unlockAt(completed:number,owned:string[],seed:number){if(completed===0||completed%10)return null;const pool=cosmetics.filter(c=>!owned.includes(c.id));return pool.length?pool[(seed>>>0)%pool.length]!.id:null;}
