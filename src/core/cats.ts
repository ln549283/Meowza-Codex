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
export const habitatMilestones=(completed:number)=>Math.max(0,Math.floor(completed/10));
export const habitatLevel=(slot:number)=>(slot+1)*10;
