export type ProductCategory='Fans'|'Cooling'|'Lighting'|'Solar'|'Wind';
export type Product={id:string;name:string;category:ProductCategory;description:string;price:number;watts?:number;replaces?:string;capacityKw?:number;affiliate:boolean;sample:boolean;buyUrl?:string;spec:string;};

// Replace these explicit examples with approved partner specifications and URLs.
// Affiliate priority describes catalog eligibility; samples are not real partnerships.
export const products:Product[]=[
 {id:'breeze-28',name:'Breeze 28 BLDC fan',category:'Fans',description:'A low-power ceiling fan concept for everyday cooling.',price:3499,watts:28,replaces:'Ceiling fan',affiliate:true,sample:true,spec:'28 W / 1200 mm / sample specification'},
 {id:'breeze-35',name:'Breeze Plus BLDC fan',category:'Fans',description:'An efficient fan concept with remote speed control.',price:4299,watts:35,replaces:'Ceiling fan',affiliate:true,sample:true,spec:'35 W / 1400 mm / sample specification'},
 {id:'cool-850',name:'CoolSense inverter AC',category:'Cooling',description:'An illustrative inverter cooling upgrade. Compare capacity and actual rated consumption before choosing.',price:42900,watts:850,replaces:'Air conditioner',affiliate:true,sample:true,spec:'1.5 ton / 850 W assumed average / sample specification'},
 {id:'light-7',name:'Luma 7 LED',category:'Lighting',description:'A lower-wattage lighting concept. Match brightness and fittings before replacing.',price:299,watts:7,replaces:'LED light',affiliate:true,sample:true,spec:'7 W / assumed comparable brightness / sample specification'},
 {id:'solar-3',name:'Roofline 3 kW solar kit',category:'Solar',description:'A rooftop system concept for reducing purchased electricity.',price:150000,capacityKw:3,affiliate:true,sample:true,spec:'3 kW / illustrative installed cost'},
 {id:'wind-1',name:'AirLoop micro wind turbine',category:'Wind',description:'A small wind system concept. Suitability depends on measured wind, siting, noise limits, and local approvals.',price:95000,capacityKw:1,affiliate:true,sample:true,spec:'1 kW rated / site assessment required'},
];
export const money=(value:number)=>'₹'+Math.round(value).toLocaleString('en-IN');
