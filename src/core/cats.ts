export const collectionCats=[
 {id:'noisette',name:'Noisette',texture:'collection-noisette'},
 {id:'domino',name:'Domino',texture:'collection-domino'},
 {id:'astre',name:'Astre',texture:'collection-astre'},
 {id:'opale',name:'Opale',texture:'collection-opale'},
 {id:'orion',name:'Orion',texture:'collection-orion'},
 {id:'perle',name:'Perle',texture:'collection-perle'},
] as const;

export type CollectionCatId=(typeof collectionCats)[number]['id'];
export const catById=(id:string)=>collectionCats.find(cat=>cat.id===id);
export const habitatMilestones=(completedTrailLevels:number)=>Math.max(0,Math.floor(completedTrailLevels/10));
export const habitatLevel=(slot:number)=>(slot+1)*10;

export const habitatStyles=[
 {id:'hammock',name:'Hamac',texture:'tree-hammock',w:230,h:160,catY:-2},
 {id:'cubby',name:'Niche',texture:'tree-cubby',w:180,h:180,catY:0},
 {id:'platform',name:'Plateforme',texture:'tree-support-cream',w:245,h:125,catY:-28},
 {id:'flower-cushion',name:'Coussin',texture:'tree-flower-cushion',w:190,h:150,catY:-22},
 {id:'moon-hammock',name:'Hamac lune',texture:'tree-moon-hammock',w:220,h:155,catY:-2},
 {id:'flower-cubby',name:'Niche fleurie',texture:'tree-flower-cubby',w:180,h:180,catY:0},
 {id:'moon-cubby',name:'Niche lune',texture:'tree-moon-cubby',w:180,h:180,catY:0},
 {id:'flower-hammock',name:'Hamac fleuri',texture:'tree-flower-hammock',w:220,h:155,catY:-2},
] as const;

export const habitatStyleForLevel=(level:number)=>{
 const slot=Math.max(0,Math.floor(level/10)-1);
 return habitatStyles[slot%habitatStyles.length]!;
};
