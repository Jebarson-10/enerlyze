import {z} from 'zod';
import {recommendUpgrades} from '@/lib/recommendations';

const schema=z.object({items:z.array(z.object({id:z.number().finite(),name:z.enum(['Ceiling fan','Air conditioner','Refrigerator','Television','LED light','Computer','Iron','Washing machine','Water heater']),watts:z.number().min(0).max(100000),hours:z.number().min(0).max(24),quantity:z.number().int().min(1).max(100)})).max(40),rate:z.number().min(0).max(10000),days:z.number().int().min(1).max(366)});
const headers={'Cache-Control':'no-store'};
export async function GET(){return Response.json({enabled:Boolean(process.env.OPENAI_API_KEY&&process.env.ENERLYZE_AI_MODEL)}, {headers});}
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid origin'}, {status:403,headers});
 if(Number(request.headers.get('content-length')||0)>20000)return Response.json({error:'Input too large'}, {status:413,headers});
 let input:z.infer<typeof schema>;try{input=schema.parse(await request.json())}catch{return Response.json({error:'Please check appliance inputs'}, {status:400,headers})}
 const suggestions=recommendUpgrades(input.items,input.rate,input.days);
 const fallback={mode:'catalog',text:'Recommendations use catalog matching and transparent savings calculations. AI explanations are not connected yet.'};
 if(!process.env.OPENAI_API_KEY||!process.env.ENERLYZE_AI_MODEL)return Response.json(fallback,{headers});
 try{
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(10000),body:JSON.stringify({model:process.env.ENERLYZE_AI_MODEL,store:false,max_output_tokens:250,instructions:'You explain household energy-saving comparisons. Use only the provided catalog matches and calculated results. All products and prices are samples. Do not invent products, prices, certifications, partners, warranties or guaranteed savings. Do not change calculations. Explain the strongest relevant comparison and one practical usage improvement in fewer than 90 words. Mention that appliances must match capacity and suitability. Do not assume wind suitability. If there are no matches explain why more usage details are needed.',input:JSON.stringify({days:input.days,rate:input.rate,appliances:input.items.map(({name,watts,hours,quantity})=>({name,watts,hours,quantity})),suggestions:suggestions.map(s=>({appliance:s.appliance.name,product:s.product.name,sample:s.product.sample,periodSavings:s.periodSavings,annualSavings:s.annualSavings,cost:s.totalCost,paybackYears:s.paybackYears}))})})});
  if(!response.ok)return Response.json({...fallback,text:'AI explanations are temporarily unavailable. Your calculated comparisons remain available.'},{headers});
  const data=await response.json() as {output?:{content?:{type:string;text?:string}[]}[]};
  const text=(data.output||[]).flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text||'').join('\n').trim();
  return Response.json(text?{mode:'ai',text:text.slice(0,2500)}:fallback,{headers});
 }catch{return Response.json({...fallback,text:'AI explanations are temporarily unavailable. Your calculated comparisons remain available.'},{headers})}
}
