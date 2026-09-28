const assert=require('node:assert/strict');
const fs=require('node:fs');const Module=require('node:module');const path=require('node:path');const ts=require('typescript');
function load(file,dependency){const filename=path.resolve(file);const mod=new Module(filename,module);mod.filename=filename;mod.paths=Module._nodeModulePaths(path.dirname(filename));if(dependency)mod.require=name=>name==='./products'?dependency:module.require(name);mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);return mod.exports}
const catalog=load('lib/products.ts');const {recommendUpgrades,solarScenario}=load('lib/recommendations.ts',catalog);
const fan={id:1,name:'Ceiling fan',watts:75,hours:10,quantity:2};
const result=recommendUpgrades([fan],8,30)[0];
assert.equal(result.product.id,'breeze-28');assert.equal(result.totalCost,6998);assert.equal(result.savedKwh,28.2);assert.equal(result.periodSavings,225.6);assert.ok(Math.abs(result.annualSavings-2744.8)<.001);assert.ok(Math.abs(result.paybackYears-6998/2744.8)<.0001);
assert.equal(recommendUpgrades([fan],0,30)[0].paybackYears,null);assert.equal(recommendUpgrades([fan],0,30)[0].savedKwh,28.2);assert.equal(recommendUpgrades([{...fan,hours:0}],8,30).length,0);assert.equal(recommendUpgrades([{...fan,watts:20}],8,30).length,0);assert.equal(recommendUpgrades([{...fan,name:'Refrigerator'}],8,30).length,0);
catalog.products.push({id:'nonaffiliate',name:'Other',category:'Fans',price:1,watts:1,replaces:'Ceiling fan',affiliate:false,sample:true,spec:''});assert.equal(recommendUpgrades([fan],8,30)[0].product.id,'breeze-28');catalog.products.pop();
const solar=solarScenario(10,30,8,3,150000,4,80);assert.ok(Math.abs(solar.annualSavings-10/30*365*8)<.0001);assert.equal(solarScenario(0,30,8,3,150000,4,80).paybackYears,null);
const carbon=load('lib/carbon.ts');
assert.ok(Math.abs(carbon.carbonKg(350)-236.25)<1e-9);
assert.ok(Math.abs(carbon.carbonKg(result.savedKwh)-19.035)<1e-9);
assert.ok(Math.abs(carbon.carbonKg(result.savedKwh/30*365)-231.5925)<1e-9);
assert.equal(carbon.carbonKg(350,0),0);assert.equal(carbon.carbonKg(-50),0);assert.equal(carbon.carbonKg(NaN),0);
assert.equal(carbon.treeYears(600),10);assert.ok(Math.abs(carbon.drivingKm(.393)-1.609344)<1e-10);
assert.ok(Math.abs(carbon.carbonKg(solar.used)-10/30*365*.675)<1e-9);
console.log('Passed carbon factors, car/tree conversions, savings independent of tariff, and  savings, quantity cost, affiliate priority, irrelevant-product filtering, zero-use, and solar-load-cap checks.');
