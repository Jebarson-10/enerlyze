import {Cloud,TreePine} from 'lucide-react';
import type {Product} from '@/lib/products';
import {carbonKg,carbonNumber,GRID_KG_CO2_PER_KWH,treeYears} from '@/lib/carbon';
export default function ProductCarbon({product}:{product:Product}){
 const hours=product.category==='Fans'?10:6;const baseline=product.category==='Fans'?75:product.category==='Cooling'?1500:9;
 const annual=product.watts===undefined?null:carbonKg(product.watts*hours*365/1000);
 const saved=product.watts===undefined?null:carbonKg(Math.max(0,baseline-product.watts)*hours*365/1000);
 return <div className="product-carbon"><Cloud size={18} aria-hidden="true"/><div><strong>Carbon profile</strong>{annual!==null?<><p>{carbonNumber(annual)} kg CO₂/year in use</p><small>1 device · {hours} h/day · {GRID_KG_CO2_PER_KWH} kg CO₂/kWh</small><p className="product-carbon-saving">{carbonNumber(saved!)} kg CO₂/year less than a {baseline} W comparison</p><small><TreePine size={12} aria-hidden="true"/> Comparable to annual uptake of {carbonNumber(treeYears(saved!))} growing urban trees.</small></>:<><p>No direct fuel CO₂ in operation</p><small>{product.category==='Wind'?'Avoided grid CO₂ needs measured site wind and generation. Rated capacity alone is insufficient.':`${carbonNumber(carbonKg(product.capacityKw!*4*365*.8*.8))} kg CO₂/year grid reduction scenario: 4 sun h/day, 20% losses, 80% self-use. Actual reduction is capped by your electricity demand.`}</small></>}<small className="embodied-note">Manufacturing footprint: supplier lifecycle data pending. Product specifications are illustrative; operating estimates are not certified product footprints.</small></div></div>;
}
