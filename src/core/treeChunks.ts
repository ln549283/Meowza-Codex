export interface StaticTreePatternSlot{
 x:number;
 kind:'base'|'right'|'left'|'wide-left'|'wide-right'|'niche'|'hammock'|'top';
 decor?:'plant'|'yarn'|'hanging-plant'|'hammock';
}

const PATTERN:StaticTreePatternSlot[]=[
 {x:360,kind:'base'},
 {x:730,kind:'right'},
 {x:330,kind:'left',decor:'plant'},
 {x:760,kind:'wide-right',decor:'plant'},
 {x:430,kind:'wide-left'},
 {x:285,kind:'wide-left',decor:'hanging-plant'},
 {x:785,kind:'right',decor:'yarn'},
 {x:390,kind:'niche',decor:'plant'},
 {x:785,kind:'hammock',decor:'hammock'},
 {x:340,kind:'wide-left',decor:'hanging-plant'},
 {x:735,kind:'top'},
];

export function staticTreeSlot(level:number){
 const index=(Math.max(1,level)-1)%PATTERN.length;
 return {...PATTERN[index]!,index};
}

export const TREE_PATTERN_LENGTH=11;
