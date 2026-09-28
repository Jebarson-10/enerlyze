import { products, type Product } from './products';
export type Usage={id:number;name:string;watts:number;hours:number;quantity:number};
export type Recommendation={appliance:Usage;product:Product;savedKwh:number;periodSavings:number;annualSavings:number;totalCost:number;paybackYears:number|null};

export function recommendUpgrades(items:Usage[],rate:number,days:number):Recommendation[]{
  if(!Number.isFinite(rate)||rate<0||!Number.isFinite(days)||days<=0)return [];
  return items.flatMap(appliance=>{
    if(appliance.hours<=0||appliance.quantity<=0||appliance.watts<=0)return [];
    const eligible=products.filter(p=>p.replaces===appliance.name&&p.watts!==undefined&&p.watts<appliance.watts);
    // Relevant affiliate catalog items come first, then the best illustrative payback.
    const ranked=eligible.map(product=>{
      const savedKwh=(appliance.watts-product.watts!)*appliance.hours*appliance.quantity*days/1000;
      const periodSavings=savedKwh*rate;
      const annualSavings=periodSavings/days*365;
      const totalCost=product.price*appliance.quantity;
      return {appliance,product,savedKwh,periodSavings,annualSavings,totalCost,paybackYears:annualSavings>0?totalCost/annualSavings:null};
    }).sort((a,b)=>Number(b.product.affiliate)-Number(a.product.affiliate)||(a.paybackYears??Infinity)-(b.paybackYears??Infinity)||b.savedKwh-a.savedKwh);
    return ranked.length?[ranked[0]]:[];
  }).sort((a,b)=>b.annualSavings-a.annualSavings);
}

export function solarScenario(units:number,days:number,rate:number,kw:number,cost:number,sunHours:number,selfPercent:number){
 const generation=kw*sunHours*365*.8;
 const used=Math.min(generation*selfPercent/100,Math.max(0,units)/Math.max(1,days)*365);
 const annualSavings=used*Math.max(0,rate);
 return {generation,used,annualSavings,paybackYears:annualSavings>0?cost/annualSavings:null};
}
