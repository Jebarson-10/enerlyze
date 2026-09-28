// India grid generation CO2, CEA v22 (FY 2025–26), Table S including renewables.
export const GRID_KG_CO2_PER_KWH = 0.675;
export const CEA_SOURCE = 'https://cea.nic.in/wp-content/uploads/baseline/2026/09/User_Guide__Version_22.0.pdf';
export const EPA_SOURCE = 'https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references';
// EPA: 0.393 kg CO2e/mile for average US gasoline passenger vehicle.
export const CAR_KG_PER_KM = 0.393 / 1.609344;
// EPA annual average uptake over first ten years of urban tree growth, not immediate offsets.
export const TREE_KG_PER_YEAR = 60;
export function carbonKg(kwh:number,factor=GRID_KG_CO2_PER_KWH){return Math.max(0,Number.isFinite(kwh)?kwh:0)*Math.max(0,Number.isFinite(factor)?factor:0);}
export function drivingKm(kg:number){return Math.max(0,kg)/CAR_KG_PER_KM;}
export function treeYears(annualKg:number){return Math.max(0,annualKg)/TREE_KG_PER_YEAR;}
export const carbonNumber=(n:number)=>n>0&&n<.01?'<0.01':n.toLocaleString('en-IN',{maximumFractionDigits:n>0&&n<1?2:1});
export function usageKwh(watts:number,hours:number,quantity:number,days:number){return Math.max(0,watts)*Math.max(0,hours)*Math.max(0,quantity)*Math.max(0,days)/1000;}
