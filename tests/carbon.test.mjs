import test from 'node:test';
import assert from 'node:assert/strict';
import {carbonKg,usageKwh,drivingKm,treeYears,GRID_KG_CO2_PER_KWH} from '../lib/carbon.ts';

test('electricity-related CO2 uses an editable factor without double counting appliance breakdown',()=>{
  const bill=100;
  const fan=usageKwh(80,10,1,30);
  assert.equal(fan,24);
  assert.equal(carbonKg(bill),67.5);
  assert.equal(carbonKg(bill,0.5),50);
  assert.equal(GRID_KG_CO2_PER_KWH,0.675);
  assert.notEqual(carbonKg(bill),carbonKg(bill+fan));
});
test('communication equivalences are finite and based on annual uptake',()=>{
  assert.ok(drivingKm(67.5)>200);
  assert.equal(treeYears(60),1);
  assert.equal(carbonKg(-1),0);
});
