export const collectionCats=[
 {id:'noisette',name:'Noisette',texture:'collection-noisette'},
 {id:'domino',name:'Domino',texture:'collection-domino'},
 {id:'astre',name:'Astre',texture:'collection-astre'},
 {id:'opale',name:'Opale',texture:'collection-opale'},
 {id:'orion',name:'Orion',texture:'collection-orion'},
 {id:'perle',name:'Perle',texture:'collection-perle'},
 {id:'luna',name:'Luna',texture:'collection-luna'},
 {id:'caramel',name:'Caramel',texture:'collection-caramel'},
 {id:'neige',name:'Neige',texture:'collection-neige'},
 {id:'coco',name:'Coco',texture:'collection-coco'},
 {id:'shadow',name:'Shadow',texture:'collection-shadow'},
 {id:'lili',name:'Lili',texture:'collection-lili'},
 {id:'miel',name:'Miel',texture:'collection-miel'},
 {id:'saphir',name:'Saphir',texture:'collection-saphir'},
 {id:'mousse',name:'Mousse',texture:'collection-mousse'},
 {id:'pivoine',name:'Pivoine',texture:'collection-pivoine'},
] as const;

export type CollectionCatId=(typeof collectionCats)[number]['id'];
export const catById=(id:string)=>collectionCats.find(cat=>cat.id===id);
export const habitatMilestones=(completedTrailLevels:number)=>Math.max(0,Math.floor(completedTrailLevels/10));
export const habitatLevel=(slot:number)=>(slot+1)*10;

export const habitatStyles=[
 {id:'hammock',name:'Hamac',texture:'tree-hammock',w:230,h:160,catY:-2},
 {id:'cubby',name:'Niche',texture:'tree-cubby',w:180,h:180,catY:0},
 {id:'basket',name:'Panier',texture:'tree-basket',w:225,h:162,catY:-20},
 {id:'platform',name:'Plateforme',texture:'tree-support-cream',w:245,h:125,catY:-28},
 {id:'flower-cushion',name:'Coussin fleuri',texture:'tree-flower-cushion',w:190,h:150,catY:-22},
 {id:'leaf-platform',name:'Plateforme feuille',texture:'tree-leaf-platform',w:230,h:165,catY:-28},
 {id:'moon-hammock',name:'Hamac lune',texture:'tree-moon-hammock',w:220,h:155,catY:-2},
 {id:'house',name:'Maisonnette',texture:'tree-house',w:205,h:185,catY:0},
 {id:'round-cushion',name:'Coussin rond',texture:'tree-round-cushion',w:220,h:155,catY:-20},
 {id:'flower-cubby',name:'Niche fleurie',texture:'tree-flower-cubby',w:180,h:180,catY:0},
 {id:'moon-cubby',name:'Niche lune',texture:'tree-moon-cubby',w:180,h:180,catY:0},
 {id:'flower-hammock',name:'Hamac fleuri',texture:'tree-flower-hammock',w:220,h:155,catY:-2},
] as const;

export const habitatStyleForLevel=(level:number)=>{
 const slot=Math.max(0,Math.floor(level/10)-1);
 return habitatStyles[slot%habitatStyles.length]!;
};
